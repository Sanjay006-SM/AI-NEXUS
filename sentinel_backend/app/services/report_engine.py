import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.report import Report, ScheduledReport

class ReportEngineService:
    def __init__(self, db: Session):
        self.db = db

    def generate_report(self, workspace_id: str, organization_id: str, name: str, report_type: str, filters: Dict[str, Any]) -> Report:
        report = Report(
            workspace_id=uuid.UUID(workspace_id),
            organization_id=uuid.UUID(organization_id),
            name=name,
            type=report_type,
            status="GENERATING",
            metadata_json={"filters": filters}
        )
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        
        # In a real enterprise system, we would fire an event to a worker queue here.
        # For MVP, we simulate async processing by updating it immediately.
        report.status = "COMPLETED"
        report.file_url = f"https://storage.sentinelai.com/reports/{report.id}.pdf"
        self.db.commit()
        
        return report

    def get_reports(self, workspace_id: str, skip: int = 0, limit: int = 100) -> List[Report]:
        return self.db.query(Report).filter(
            Report.workspace_id == uuid.UUID(workspace_id)
        ).order_by(desc(Report.created_at)).offset(skip).limit(limit).all()

    def get_report_statistics(self, workspace_id: str) -> Dict[str, Any]:
        reports = self.db.query(Report).filter(Report.workspace_id == uuid.UUID(workspace_id)).all()
        scheduled = self.db.query(ScheduledReport).filter(ScheduledReport.workspace_id == uuid.UUID(workspace_id)).all()
        
        total = len(reports)
        failed = sum(1 for r in reports if r.status == "FAILED")
        
        return {
            "total_reports": total,
            "reports_generated": total - failed,
            "scheduled_reports": len(scheduled),
            "failed_reports": failed
        }
