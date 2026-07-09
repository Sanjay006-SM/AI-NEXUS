from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_active_user
from app.core.config import settings
from app.core.security import hash_password, verify_password, create_access_token
from app.models.tenant import Organization, User, Workspace
from app.schemas.auth import UserRegister, UserLogin, Token, AuthMeResponse, GoogleLoginRequest
import secrets
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.events.bus import event_bus
from app.core.events.contracts import AuditEvent
from app.core.events.event_types import ActorClassification, EventCategory, EventSeverity, EventStatus, ResourceClassification

router = APIRouter()

def provision_new_account(db: Session, email: str, full_name: str, password_hash: str, organization_name: str, workspace_name: str, provider: str = "LOCAL", google_id: str = None, profile_picture: str = None) -> User:
    # Check if organization slug exists
    base_slug = organization_name.lower().replace(" ", "-")
    slug = base_slug
    counter = 1
    while db.query(Organization).filter(Organization.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
        
    # Create Organization
    org = Organization(
        name=organization_name,
        slug=slug
    )
    db.add(org)
    
    try:
        db.flush() # To ensure we can catch unique constraint errors if needed
        # Create Default Workspace
        workspace = Workspace(
            name=workspace_name,
            environment="Production",
            organization_id=org.id
        )
        db.add(workspace)
        
        # Create User
        user = User(
            email=email,
            full_name=full_name,
            password_hash=password_hash,
            google_id=google_id,
            provider=provider,
            profile_picture=profile_picture,
            organization_id=org.id,
            role="admin",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Transaction failed during account creation")

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Check if organization slug exists (legacy behavior preservation)
    slug = user_in.organization_name.lower().replace(" ", "-")
    org = db.query(Organization).filter(Organization.slug == slug).first()
    if org:
        raise HTTPException(
            status_code=400,
            detail="An organization with this name already exists.",
        )
    
    user = provision_new_account(
        db=db,
        email=user_in.email,
        full_name=user_in.full_name,
        password_hash=hash_password(user_in.password),
        organization_name=user_in.organization_name,
        workspace_name=user_in.workspace_name,
        provider="LOCAL"
    )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), secret_key=settings.SECRET_KEY, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user and user.provider == "GOOGLE":
        raise HTTPException(
            status_code=400,
            detail="This account uses Google Sign-In. Please continue with Google or set a password first."
        )

    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), secret_key=settings.SECRET_KEY, expires_delta=access_token_expires
    )
    
    workspace = db.query(Workspace).filter(Workspace.organization_id == user.organization_id).first()
    if workspace:
        event_bus.publish(AuditEvent(
            workspace_id=str(workspace.id),
            organization_id=str(user.organization_id),
            actor=user.email,
            actor_type=ActorClassification.HUMAN_USER,
            module="Authentication",
            action="LOGIN_SUCCESS",
            category=EventCategory.AUTHENTICATION,
            severity=EventSeverity.INFO,
            status=EventStatus.SUCCESS,
            resource_type=ResourceClassification.SYSTEM
        ))
        
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google", response_model=Token)
def google_auth(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(
            request.credential, 
            google_requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")
        
    if not idinfo.get("email_verified"):
        raise HTTPException(status_code=400, detail="Google email is not verified")

    email = idinfo["email"]
    google_id = idinfo["sub"]
    name = idinfo.get("name", "Google User")
    picture = idinfo.get("picture")

    user = db.query(User).filter(User.google_id == google_id).first()

    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            if user.google_id and user.google_id != google_id:
                raise HTTPException(status_code=400, detail="Email is already linked to a different Google account")
            
            user.google_id = google_id
            user.provider = "GOOGLE"
            user.profile_picture = picture
            db.commit()
            
            event_bus.publish(AuditEvent(
                workspace_id="SYSTEM",
                organization_id=str(user.organization_id),
                actor=user.email,
                actor_type=ActorClassification.HUMAN_USER,
                module="Authentication",
                action="ACCOUNT_LINKED",
                category=EventCategory.AUTHENTICATION,
                severity=EventSeverity.INFO,
                status=EventStatus.SUCCESS,
                resource_type=ResourceClassification.SYSTEM
            ))
        else:
            random_pw = secrets.token_urlsafe(32)
            hashed_pw = hash_password(random_pw)
            
            user = provision_new_account(
                db=db,
                email=email,
                full_name=name,
                password_hash=hashed_pw,
                organization_name=f"{name}'s Organization",
                workspace_name="Default Workspace",
                provider="GOOGLE",
                google_id=google_id,
                profile_picture=picture
            )
            
            event_bus.publish(AuditEvent(
                workspace_id="SYSTEM",
                organization_id=str(user.organization_id),
                actor=user.email,
                actor_type=ActorClassification.HUMAN_USER,
                module="Authentication",
                action="ACCOUNT_CREATED",
                category=EventCategory.AUTHENTICATION,
                severity=EventSeverity.INFO,
                status=EventStatus.SUCCESS,
                resource_type=ResourceClassification.SYSTEM
            ))

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), secret_key=settings.SECRET_KEY, expires_delta=access_token_expires
    )
    
    workspace = db.query(Workspace).filter(Workspace.organization_id == user.organization_id).first()
    if workspace:
        event_bus.publish(AuditEvent(
            workspace_id=str(workspace.id),
            organization_id=str(user.organization_id),
            actor=user.email,
            actor_type=ActorClassification.HUMAN_USER,
            module="Authentication",
            action="LOGIN_SUCCESS",
            category=EventCategory.AUTHENTICATION,
            severity=EventSeverity.INFO,
            status=EventStatus.SUCCESS,
            resource_type=ResourceClassification.SYSTEM
        ))
        
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=AuthMeResponse)
def read_user_me(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Fetch organization and workspace
    org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    workspace = db.query(Workspace).filter(Workspace.organization_id == current_user.organization_id).first()
    
    return {
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role,
            "organization_id": str(current_user.organization_id)
        },
        "organization": {
            "id": str(org.id),
            "name": org.name,
            "slug": org.slug
        } if org else {},
        "workspace": {
            "id": str(workspace.id),
            "name": workspace.name,
            "environment": workspace.environment
        } if workspace else {}
    }
