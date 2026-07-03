from neo4j import Session
from app.graph import neo4j_queries as q

class GraphBuilder:
    def __init__(self, session: Session):
        self.session = session

    def sync_identity(self, arn: str, account_id: str, identity_type: str, workspace_id: str):
        self.session.run(q.MERGE_IDENTITY, arn=arn, account_id=account_id, identity_type=identity_type, workspace_id=workspace_id)

    def sync_resource(self, arn: str, workspace_id: str):
        if arn:
            self.session.run(q.MERGE_RESOURCE, arn=arn, workspace_id=workspace_id)

    def sync_ip(self, ip: str, workspace_id: str):
        if ip:
            self.session.run(q.MERGE_IP, ip=ip, workspace_id=workspace_id)

    def link_identity_resource(self, identity_arn: str, resource_arn: str, event_time: str, workspace_id: str):
        if identity_arn and resource_arn:
            self.session.run(q.LINK_IDENTITY_RESOURCE, identity_arn=identity_arn, resource_arn=resource_arn, event_time=event_time, workspace_id=workspace_id)

    def link_identity_ip(self, identity_arn: str, source_ip: str, event_time: str, workspace_id: str):
        if identity_arn and source_ip:
            self.session.run(q.LINK_IDENTITY_IP, identity_arn=identity_arn, source_ip=source_ip, event_time=event_time, workspace_id=workspace_id)

    def link_assume_role(self, source_arn: str, target_arn: str, event_time: str, workspace_id: str):
        if source_arn and target_arn:
            self.session.run(q.LINK_ASSUME_ROLE, source_arn=source_arn, target_arn=target_arn, event_time=event_time, workspace_id=workspace_id)
