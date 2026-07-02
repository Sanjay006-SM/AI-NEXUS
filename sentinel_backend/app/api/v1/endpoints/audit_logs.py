from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import uuid

from app.api.dependencies import get_db, get_current_workspace, get_current_active_user
from app.services.audit_service import AuditService
from app.models.tenant import Workspace, User

router = APIRouter()

@router.get("/statistics")
def get_audit_statistics(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve audit log KPI statistics for the dashboard
    """
    service = AuditService(db)
    stats = service.get_statistics(str(workspace.id))
    return stats

@router.get("/")
def get_audit_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve audit logs with pagination
    """
    service = AuditService(db)
    logs = service.get_logs(str(workspace.id), skip=skip, limit=limit)
    return {
        "data": [
            {
                "id": str(log.id),
                "actor": log.actor,
                "action": log.action,
                "category": log.category,
                "severity": log.severity,
                "target_resource": log.target_resource,
                "created_at": log.created_at.isoformat() if log.created_at else None,
                "status": "Success" if "fail" not in log.action.lower() and log.severity != 'Critical' else "Failed"
            }
            for log in logs
        ]
    }
