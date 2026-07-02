from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from neo4j import Session as GraphSession
from typing import Dict, Any, List
from pydantic import BaseModel

from app.api.dependencies import get_db, get_neo4j_session, get_current_workspace
from app.services.ai.investigation_service import InvestigationService
from app.models.tenant import User, Workspace

router = APIRouter()

class InvestigateRequest(BaseModel):
    identity_id: str

class InvestigateResponse(BaseModel):
    executive_summary: str
    risk_assessment: str
    attack_path_analysis: str
    findings: List[str]
    recommendations: List[str]


@router.post("/investigate", response_model=InvestigateResponse)
def investigate_identity(
    request: InvestigateRequest,
    db: Session = Depends(get_db),
    graph: GraphSession = Depends(get_neo4j_session),
    workspace: Workspace = Depends(get_current_workspace)
):
    try:
        service = InvestigationService(db, graph)
        report = service.investigate(request.identity_id, str(workspace.id))
        
        if "error" in report:
            raise HTTPException(status_code=404, detail=report["error"])
            
        return report
    except ValueError as ve:
        raise HTTPException(status_code=500, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
