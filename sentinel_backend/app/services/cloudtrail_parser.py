from typing import List, Dict, Any
from app.schemas.cloudtrail import CloudTrailEvent, CloudTrailLogFile
from pydantic import ValidationError
from datetime import datetime

class CloudTrailParser:
    @staticmethod
    def normalize_json(json_data: Any) -> Dict[str, Any]:
        """
        Normalizes various CloudTrail log structures into the standard {"Records": [...]} wrapper.
        """
        # 1. Array of events
        if isinstance(json_data, list):
            return {"Records": json_data}

        if not isinstance(json_data, dict):
            raise ValueError("Unsupported CloudTrail format. Expected JSON object or list.")

        # Case-insensitive check for wrapper keys like Records, records, Events, events
        keys_lower = {k.lower(): k for k in json_data.keys()}
        
        for wrapper in ["records", "events"]:
            if wrapper in keys_lower:
                original_key = keys_lower[wrapper]
                records_list = json_data[original_key]
                if not isinstance(records_list, list):
                    raise ValueError(f"Unsupported CloudTrail format. Expected a list under key '{original_key}'.")
                return {"Records": records_list}

        # 2. Single Event History JSON
        # Detect if it contains typical CloudTrail keys directly at the root
        if "eventID" in json_data or "eventTime" in json_data or "eventName" in json_data:
            return {"Records": [json_data]}

        raise ValueError("Unsupported CloudTrail format. Expected CloudTrail event or Records array.")

    @staticmethod
    def parse_log_file(json_data: Dict[str, Any]) -> List[CloudTrailEvent]:
        """Parses a complete normalized CloudTrail log file JSON into Pydantic models."""
        normalized = CloudTrailParser.normalize_json(json_data)
        
        records = normalized.get("Records", [])
        if not records:
            raise ValueError("Unsupported CloudTrail format. Expected CloudTrail event or Records array.")

        validated_events = []
        for idx, record in enumerate(records):
            if not isinstance(record, dict):
                raise ValueError(f"Unsupported CloudTrail format. Record at index {idx} is not a valid JSON object.")
            if "eventID" not in record or not record["eventID"]:
                raise ValueError("Unsupported CloudTrail format. Missing eventID.")
            if "eventTime" not in record or not record["eventTime"]:
                raise ValueError("Unsupported CloudTrail format. Missing eventTime.")
            
            # Verify timestamp format
            try:
                # Pydantic or datetime parse check
                if isinstance(record["eventTime"], str):
                    # Check ISO format
                    datetime.fromisoformat(record["eventTime"].replace('Z', '+00:00'))
            except Exception:
                raise ValueError("Unsupported CloudTrail format. Invalid timestamp.")

            try:
                event_model = CloudTrailEvent(**record)
                validated_events.append(event_model)
            except ValidationError as e:
                # Map standard validation errors to user-friendly messages
                raise ValueError(f"Unsupported CloudTrail format. Validation failed: {str(e)}")

        return validated_events

    @staticmethod
    def extract_access_log_data(event: CloudTrailEvent) -> Dict[str, Any]:
        """Extracts the specific fields required for the AccessLog model."""
        # Extract resource ARN safely
        resource_arn = None
        if event.resources and len(event.resources) > 0:
            resource_arn = event.resources[0].ARN
        elif hasattr(event, "requestParameters") and event.requestParameters:
            params = event.requestParameters
            if isinstance(params, dict):
                # Try to extract common ARN fields for IAM and other resources
                resource_arn = params.get("policyArn") or params.get("roleArn") or params.get("resourceArn")
                if not resource_arn and params.get("roleName"):
                    # Mock an ARN if only roleName is provided
                    account = event.recipientAccountId or "unknown"
                    resource_arn = f"arn:aws:iam::{account}:role/{params.get('roleName')}"
            
        return {
            "event_id": event.eventID,
            "event_time": event.eventTime,
            "event_name": event.eventName,
            "event_source": event.eventSource,
            "aws_region": event.awsRegion,
            "source_ip": event.sourceIPAddress,
            "identity_arn": event.userIdentity.arn or "unknown",
            "resource_arn": resource_arn,
            "account_id": event.recipientAccountId,
            "raw_event_json": event.model_dump(mode='json')
        }
