from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from app.api.dependencies import get_db, get_current_workspace
from app.models.tenant import CloudAccount, Workspace
from pydantic import BaseModel

router = APIRouter()

class AddCloudAccountRequest(BaseModel):
    provider: str
    name: str

@router.get("", response_model=List[Dict[str, Any]])
def list_integrations(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace)
):
    accounts = db.query(CloudAccount).filter(CloudAccount.workspace_id == workspace.id).all()
    results = []
    for acc in accounts:
        results.append({
            "id": str(acc.id),
            "provider": acc.provider,
            "name": acc.name,
            "status": acc.status,
            "created_at": acc.created_at.isoformat() if acc.created_at else None
        })
    return results

@router.post("")
def add_integration(
    request: AddCloudAccountRequest,
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace)
):
    account = CloudAccount(
        workspace_id=workspace.id,
        provider=request.provider,
        name=request.name,
        status="Connected"
    )
    db.add(account)
    db.commit()
    return {"message": "Integration added successfully", "id": str(account.id)}
