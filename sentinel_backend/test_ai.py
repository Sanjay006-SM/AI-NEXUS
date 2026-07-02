from app.db.session import SessionLocal
from app.graph.session import neo4j_manager
from app.services.ai.investigation_service import InvestigationService
import uuid

db = SessionLocal()
neo4j_manager.connect()
session = neo4j_manager.get_session()

service = InvestigationService(db, session)
try:
    # Use a dummy workspace id
    workspace_id = str(uuid.uuid4())
    res = service.investigate("1", workspace_id)
    print("Result:", res)
except Exception as e:
    import traceback
    traceback.print_exc()

session.close()
neo4j_manager.close()
db.close()
