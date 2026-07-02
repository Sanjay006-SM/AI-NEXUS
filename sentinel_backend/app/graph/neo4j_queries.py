MERGE_IDENTITY = """
MERGE (i:Identity {arn: $arn, workspace_id: $workspace_id})
SET i.account_id = $account_id,
    i.type = $identity_type
"""

MERGE_RESOURCE = """
MERGE (r:Resource {arn: $arn, workspace_id: $workspace_id})
"""

MERGE_IP = """
MERGE (ip:IPAddress {ip: $ip, workspace_id: $workspace_id})
"""

LINK_IDENTITY_RESOURCE = """
MATCH (i:Identity {arn: $identity_arn, workspace_id: $workspace_id})
MATCH (r:Resource {arn: $resource_arn, workspace_id: $workspace_id})
MERGE (i)-[rel:ACCESSED_RESOURCE]->(r)
ON CREATE SET rel.first_accessed = $event_time, rel.count = 1
ON MATCH SET rel.last_accessed = $event_time, rel.count = rel.count + 1
"""

LINK_IDENTITY_IP = """
MATCH (i:Identity {arn: $identity_arn, workspace_id: $workspace_id})
MATCH (ip:IPAddress {ip: $source_ip, workspace_id: $workspace_id})
MERGE (i)-[rel:ORIGINATED_FROM]->(ip)
ON CREATE SET rel.first_seen = $event_time, rel.count = 1
ON MATCH SET rel.last_seen = $event_time, rel.count = rel.count + 1
"""

LINK_ASSUME_ROLE = """
MATCH (i:Identity {arn: $source_arn, workspace_id: $workspace_id})
MATCH (target {arn: $target_arn, workspace_id: $workspace_id})
SET target:Identity
MERGE (i)-[rel:ASSUMED_ROLE]->(target)
ON CREATE SET rel.first_assumed = $event_time, rel.count = 1
ON MATCH SET rel.last_assumed = $event_time, rel.count = rel.count + 1
"""

GET_ATTACK_PATH = """
MATCH path = (start:Identity {arn: $arn, workspace_id: $workspace_id})-[*1..3]->(target)
RETURN path
"""
