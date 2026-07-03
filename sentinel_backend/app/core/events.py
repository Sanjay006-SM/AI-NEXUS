import logging
from typing import Dict, Any, Callable, List
from fastapi import BackgroundTasks
import json

logger = logging.getLogger(__name__)

class EnterpriseEventBus:
    _subscribers: Dict[str, List[Callable]] = {}

    @classmethod
    def subscribe(cls, event_name: str, handler: Callable):
        if event_name not in cls._subscribers:
            cls._subscribers[event_name] = []
        cls._subscribers[event_name].append(handler)
        logger.info(f"Subscribed to {event_name}: {handler.__name__}")

    @classmethod
    def publish(cls, event_name: str, payload: Dict[str, Any], background_tasks: BackgroundTasks = None):
        """
        Publishes an event to all registered subscribers.
        If background_tasks is provided, subscribers run asynchronously.
        Otherwise, they run synchronously (useful for tests or immediate consistency).
        """
        logger.info(f"Publishing event: {event_name}")
        handlers = cls._subscribers.get(event_name, [])
        for handler in handlers:
            if background_tasks:
                background_tasks.add_task(handler, payload)
            else:
                try:
                    handler(payload)
                except Exception as e:
                    logger.error(f"Error in event handler {handler.__name__} for {event_name}: {str(e)}", exc_info=True)

# Common Event Names
class Events:
    WORKSPACE_CREATED = "WorkspaceCreated"
    USER_LOGGED_IN = "UserLoggedIn"
    REPORT_GENERATED = "ReportGenerated"
    REPORT_SCHEDULED = "ReportScheduled"
    IDENTITY_DISCOVERED = "IdentityDiscovered"
    GRAPH_UPDATED = "GraphUpdated"
    RISK_CALCULATED = "RiskCalculated"
    INVESTIGATION_COMPLETED = "InvestigationCompleted"
    SETTINGS_UPDATED = "SettingsUpdated"
