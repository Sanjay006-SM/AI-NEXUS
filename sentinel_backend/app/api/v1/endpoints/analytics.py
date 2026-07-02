from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List
from datetime import datetime, timedelta

from app.api.dependencies import get_db, get_current_workspace
from app.models.machine_identity import MachineIdentity
from app.models.risk_finding import RiskFinding
from app.models.tenant import Workspace

router = APIRouter()

@router.get("/dashboard", response_model=Dict[str, Any])
def get_analytics_dashboard(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace)
):
    # Calculate Risk Over Time (last 24 hours bucketed by 4 hours for simplicity)
    now = datetime.utcnow()
    start_time = now - timedelta(hours=24)
    
    # We will fetch findings from last 24h and group them manually to ensure formatting
    findings = db.query(RiskFinding).filter(
        RiskFinding.workspace_id == workspace.id,
        RiskFinding.created_at >= start_time
    ).all()
    
    # Initialize buckets (00:00, 04:00, 08:00, 12:00, 16:00, 20:00)
    buckets = {
        "00:00": {"time": "00:00", "critical": 0, "high": 0, "medium": 0},
        "04:00": {"time": "04:00", "critical": 0, "high": 0, "medium": 0},
        "08:00": {"time": "08:00", "critical": 0, "high": 0, "medium": 0},
        "12:00": {"time": "12:00", "critical": 0, "high": 0, "medium": 0},
        "16:00": {"time": "16:00", "critical": 0, "high": 0, "medium": 0},
        "20:00": {"time": "20:00", "critical": 0, "high": 0, "medium": 0},
    }
    
    for f in findings:
        if f.created_at:
            hour = f.created_at.hour
            # map to nearest 4 hour bucket
            bucket_hour = (hour // 4) * 4
            bucket_str = f"{bucket_hour:02d}:00"
            
            sev = f.severity.lower()
            if sev in ["critical", "high", "medium"]:
                buckets[bucket_str][sev] += 1
            
    risk_over_time = list(buckets.values())
    
    # Calculate Identities by Provider/Type
    identity_counts = db.query(MachineIdentity.identity_type, func.count(MachineIdentity.id))\
        .filter(MachineIdentity.workspace_id == workspace.id)\
        .group_by(MachineIdentity.identity_type).all()
        
    provider_data = []
    colors = {"AssumedRole": "#f97316", "IAMUser": "#0ea5e9", "AWSService": "#22c55e", "Unknown": "#8b5cf6"}
    
    for id_type, count in identity_counts:
        mapped_type = id_type if id_type else "Unknown"
        provider_data.append({
            "name": mapped_type,
            "value": count,
            "color": colors.get(mapped_type, "#8b5cf6")
        })
        
    return {
        "riskOverTimeData": risk_over_time,
        "providerData": provider_data
    }
