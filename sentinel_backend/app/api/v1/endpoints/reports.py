from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from app.api.dependencies import get_db, get_current_workspace, get_current_active_user
from app.services.report_engine import ReportEngineService
from app.models.tenant import Workspace, User

router = APIRouter()

class ReportGenerateRequest(BaseModel):
    name: str
    report_type: str
    filters: Dict[str, Any]

@router.get("/statistics")
def get_report_statistics(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    service = ReportEngineService(db)
    stats = service.get_report_statistics(str(workspace.id))
    return stats

@router.get("/")
def get_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    service = ReportEngineService(db)
    reports = service.get_reports(str(workspace.id), skip=skip, limit=limit)
    return {
        "data": [
            {
                "id": str(r.id),
                "name": r.name,
                "type": r.type,
                "status": r.status,
                "file_url": r.file_url,
                "created_at": r.created_at.isoformat() if r.created_at else None
            }
            for r in reports
        ]
    }

@router.post("/generate")
def generate_report(
    req: ReportGenerateRequest,
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    service = ReportEngineService(db)
    report = service.generate_report(
        workspace_id=str(workspace.id),
        organization_id=str(workspace.organization_id),
        name=req.name,
        report_type=req.report_type,
        filters=req.filters
    )
    return {
        "id": str(report.id),
        "name": report.name,
        "status": report.status,
        "file_url": report.file_url
    }
