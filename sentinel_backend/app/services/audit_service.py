import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.audit_log import AuditLog

class AuditService:
    def __init__(self, db: Session):
        self.db = db
        
    def create_log(self, workspace_id: str, organization_id: str, actor: str, action: str, category: str, severity: str, target_resource: Optional[str] = None, metadata_json: Optional[Dict[str, Any]] = None) -> AuditLog:
        log = AuditLog(
            workspace_id=uuid.UUID(workspace_id),
            organization_id=uuid.UUID(organization_id),
            actor=actor,
            action=action,
            category=category,
            severity=severity,
            target_resource=target_resource,
            metadata_json=metadata_json
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def get_logs(self, workspace_id: str, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        return self.db.query(AuditLog).filter(
            AuditLog.workspace_id == uuid.UUID(workspace_id)
        ).order_by(desc(AuditLog.created_at)).offset(skip).limit(limit).all()

    def get_statistics(self, workspace_id: str) -> Dict[str, Any]:
        # Optimized aggregate query in a real enterprise app, simulated for MVP
        logs = self.db.query(AuditLog).filter(AuditLog.workspace_id == uuid.UUID(workspace_id)).all()
        total = len(logs)
        failed = sum(1 for log in logs if 'fail' in log.action.lower() or log.severity == 'Critical')
        security = sum(1 for log in logs if log.category == 'Security')
        admin = sum(1 for log in logs if log.category == 'Administrative')
        
        # If empty, return some placeholder stats so UI looks good but doesn't crash
        if total == 0:
            return {
                "total_events": 0,
                "failed_actions": 0,
                "security_events": 0,
                "administrative_actions": 0
            }

        return {
            "total_events": total,
            "failed_actions": failed,
            "security_events": security,
            "administrative_actions": admin
        }
