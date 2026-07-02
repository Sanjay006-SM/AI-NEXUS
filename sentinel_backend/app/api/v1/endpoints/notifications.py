from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from app.api.dependencies import get_db, get_current_workspace
from app.models.notification import Notification
from app.models.tenant import Workspace

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def get_notifications(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace)
):
    notifs = db.query(Notification).filter(
        Notification.workspace_id == workspace.id
    ).order_by(Notification.created_at.desc()).limit(10).all()
    
    response = []
    
    for n in notifs:
        response.append({
            "id": str(n.id),
            "type": n.type,
            "title": n.title,
            "desc": n.description,
            "time": n.created_at.isoformat() if n.created_at else "just now",
            "read": n.is_read
        })
        
    return response
