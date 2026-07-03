# SentinelAI Enterprise Architecture Blueprint

## 1. Executive Summary
SentinelAI is a production-grade Enterprise Machine Identity Risk Intelligence Platform designed to compete at the highest tier of the CIEM/CSPM market alongside Wiz, Prisma Cloud, Orca Security, and Lacework. This engineering blueprint defines the transition from a monolithic module-oriented application into a highly scalable, pipeline-driven enterprise architecture. By establishing a unified telemetry pipeline, an Enterprise Event Bus, a comprehensive Knowledge Graph, specialized Projection Builders, and a centralized Intelligence Layer, SentinelAI delivers actionable, behavior-driven insights across all machine identities. Every subsystem is strictly isolated by workspace, and mock data is entirely eliminated in favor of deterministic, backend-driven telemetry processing.

## 2. Product Vision
To provide enterprise security teams with unparalleled, actionable intelligence into the machine identity lifecycle, transforming opaque cloud service accounts, APIs, and IAM roles into trackable, risk-quantified assets. SentinelAI acts as the definitive control plane for cloud security, eliminating blind spots through behavior-driven analytics, advanced graph traversal, and AI-assisted investigation, ultimately empowering SOC and IAM teams to achieve least-privilege operations seamlessly.

## 3. Enterprise Architecture Overview (Pipeline-Driven Design)
The entire SentinelAI platform operates as a unified, event-driven pipeline. Modules do not call each other directly; instead, they consume outputs from preceding stages via an Enterprise Event Bus.

**The Master Pipeline:**
`Telemetry` -> `Normalization` -> `Discovery Engines` -> `Knowledge Graph` -> `Risk Engine` -> `Projection Builder` -> `Event Bus` -> `Notifications` -> `Audit` -> `Reports` -> `Dashboard` -> `AI Copilot` -> `Users`

This strict unidirectional data flow ensures high decoupling, massive scalability, and guarantees that the UI, Reports, and AI Copilot all derive their intelligence from the exact same Ground Truth (the Projection Layer).

## 4. Enterprise Event Bus Architecture
At the heart of SentinelAI is the Enterprise Event Bus, orchestrating every subsystem asynchronously.
- **Publishers:** Telemetry ingestors, Discovery Engines, Risk Engine, UI Controllers.
- **Subscribers:** Projection Builders, Notification Engine, Audit Engine, Report Scheduler.
- **Event Catalog:** `CloudTrailUploaded`, `ConnectorSynced`, `IdentityDiscovered`, `ResourceDiscovered`, `PolicyDiscovered`, `RelationshipCreated`, `GraphUpdated`, `RiskCalculated`, `AttackPathGenerated`, `ProjectionUpdated`, `NotificationCreated`, `AuditEventCreated`, `ReportGenerated`, `AIInvestigationCompleted`, `SettingsUpdated`, `RBACUpdated`, `WorkspaceCreated`.
- **Infrastructure:** Currently built on FastAPI BackgroundTasks with Redis (Celery) queueing, designed with abstractions to seamlessly migrate to Kafka, RabbitMQ, or AWS EventBridge as scale demands. Features include exponential backoff retries, dead-letter queues (DLQ), and idempotent subscriber logic to handle at-least-once delivery.

## 5. Projection Builder Architecture
To ensure extreme UI performance and decoupling, raw transactional tables and graph nodes are never queried directly by the frontend.
- **Responsibilities:** The Projection Builder listens to `GraphUpdated` and `RiskCalculated` events to incrementally materialize read-optimized models.
- **Core Projections:**
  - `Dashboard Projection`: Pre-calculated KPI aggregates and top risk identities.
  - `Identity/Risk/Attack Path Projections`: Flattened JSON structures optimized for the Identity Center and Investigations UI.
  - `Audit/Report/Compliance Projections`: Historical and aggregated views designed specifically for fast rendering and exporting.

## 6. Expanded Graph Domain Model
The Knowledge Graph (Neo4j) models the real-world cloud infrastructure dynamically based on observed telemetry.
- **Nodes:** `Organization`, `Workspace`, `Cloud Account`, `IAM User`, `IAM Role`, `Assumed Role`, `Instance Profile`, `IAM Policy`, `Permission`, `Access Key`, `S3 Bucket`, `EC2 Instance`, `Lambda`, `ECS`, `EKS`, `Secrets Manager`, `KMS Key`, `CloudTrail Event`, `CloudWatch Log`, `RDS`, `VPC`, `Subnet`, `Route Table`, `Security Group`, `Load Balancer`, `Elastic IP`, `Public IP`, `Private IP`, `Internet Gateway`, `NAT Gateway`, `Availability Zone`, `Region`.
- **Relationships:** `CAN_ASSUME`, `HAS_PERMISSION`, `ATTACHED_POLICY`, `MEMBER_OF`, `USES`, `ACCESSED`, `HOSTED_ON`, `CONNECTED_TO`, `IN_REGION`, `DEPLOYED_IN`, `TRUSTS`, `OWNS`, `EXPOSES`, `CALLS`, `GENERATED`, `DISCOVERED_FROM`, `OBSERVED_AT`.
- **Lifecycle Metadata:** Every node includes `first_seen`, `last_seen`, `source`, `confidence`, `version`, `active`, and `deleted` flags to track ephemeral cloud infrastructure accurately.

## 7. Discovery Engines
Specialized engines process normalized telemetry and emit graph updates:
- **Identity Discovery Engine:** Extracts AssumedRoles, Users, and Service Accounts.
- **Resource Discovery Engine:** Catalogs target assets (e.g., S3 buckets, EC2s).
- **Policy/Permission Discovery Engine:** Parses observed APIs to reverse-engineer effective permissions.
- **Relationship Discovery Engine:** Links Identities to Resources via usage (e.g., `ACCESSED`).
- **Behavior/Topology/Configuration Discovery Engines:** Map the broader operational context.
*Outputs:* Graph node/edge mutations -> Event Bus `GraphUpdated`.

## 8. Expanded Risk Engine
A composite scoring architecture combining specialized risk vectors to produce a final, actionable Enterprise Risk Score.
- **Sub-Engines:** `Identity Risk` (high privilege), `Behavior Risk` (anomaly detection), `Exposure Risk` (public IP/NAT exposure), `Credential Risk` (stale keys), `Configuration Risk` (misconfigurations), `Attack Path Risk` (blast radius).
- **Process:** Listens to `GraphUpdated`, runs heuristic and ML-based scoring models, and emits `RiskCalculated` events.

## 9. Attack Path Engine
Goes beyond static relationships to calculate actual attack vectors.
- **Responsibilities:** Calculates `Shortest path`, `Critical path`, `Privilege escalation path`, `Lateral movement path`, and `Identity compromise path`.
- **Outputs:** Quantifies Blast Radius and Path Ranking based on business impact, pushing outputs to the Projection Layer for Executive Summaries and UI visualizers.

## 10. Recommendation Engine
Translates Risk and Attack Paths into actionable remediation steps.
- **Outputs:** Human-readable risk explanations, exact remediation steps (e.g., IAM policy JSON), priority levels, estimated operational impact, business justification, and automation candidates for future IaC pull-request generation.

## 11. Compliance Engine
Maps dynamically discovered graph findings and risks to enterprise compliance frameworks.
- **Supported Frameworks:** NIST, CIS, SOC2, ISO27001, PCI DSS, HIPAA.
- **Workflow:** Automatically tags identities and resources with compliance violations, updating the `Compliance Projection` for seamless Report generation.

## 12. AI Copilot Architecture
An intelligence layer orchestrated via a robust Retrieval-Augmented Generation (RAG) pipeline to ensure tenant isolation and hallucination minimization.
- **Pipeline:** `User Question` -> `Planner` -> `Retriever` -> `Graph Query Generator` -> `SQL Query Generator` -> `Projection Retrieval` -> `Risk Context Builder` -> `Prompt Composer` -> `LLM` -> `Verification Layer` -> `Grounded Response` -> `Audit Event` -> `Conversation Memory`.
- **Use Cases:** Generate executive reports, summarize investigations, explain attack paths, and generate compliance summaries.

## 13. Cloud Integration Architecture
Designed to ingest from both Manual CloudTrail JSON Uploads and Live Event-Driven Integrations seamlessly.
- **Supported Sources:** AWS Organizations, CloudTrail, IAM, Config, GuardDuty, Inspector, Security Hub; future extensibility for Azure (Activity Logs, Entra ID, Defender) and GCP (Audit Logs).
- **Normalization:** All data routes through a unified Normalizer, ensuring downstream Discovery Engines remain cloud-agnostic.

## 14. Report Generation Architecture
Reports are never generated from direct transactional queries; they consume cross-domain intelligence.
- **Pipeline:** `Generate Report` -> `Authorization` -> `Data Collector (Projections, Graph, Risk, Analytics, Audit, Compliance)` -> `Chart Builder` -> `Template Engine` -> `Export Engine (PDF/Excel/CSV/JSON)` -> `Storage (S3)` -> `Download APIs` -> `Audit & Notification`.
- **Templates:** Executive Report, Security Posture, Risk Assessment, Identity Inventory, Attack Path, Compliance, Audit, Cloud Asset, IAM, Investigation Summary.
- **Scheduler:** Robust cron-based scheduling supporting Daily, Weekly, Monthly, Quarterly, and manual execution, with future Delivery Engine support for Email, Slack, Teams, and Webhooks.

## 15. Audit Platform Architecture
An enterprise-grade event-sourcing ledger providing undisputed chronological records.
- **Pipeline:** `Any System/User Action` -> `Audit Event Builder` -> `Audit Event Queue` -> `Audit Service` -> `Database` -> `Notification/Compliance/Report Engines`.
- **Schema & Scale:** Highly structured categories, severity levels, timeline data, correlation IDs, and source event IDs. Includes strict retention policies, chronological partitioning, search optimization, and compliance archival strategies.

## 16. UI & Frontend Architecture
Built on Next.js 14 and React Query, the UI is entirely driven by Projection APIs.
- **General Principles:** Every page utilizes React Query hooks, centralized API clients, comprehensive loading skeletons, error boundaries, empty states, and optimistic updates.
- **Audit Logs UI:** Top KPI Cards, Timeline View, Activity Feed, Advanced Filters (Date, Severity, Category, Actor), Details Drawer with JSON Viewer, Export Button, and Real-time Updates.
- **Reports UI:** Executive KPI Cards, Template Gallery, Generate Report Wizard, Report Preview, Download History, Generation Progress Timeline, and Status Badges.

## 17. Database Architecture (PostgreSQL)
Optimized for massive scale, isolation, and projection storage.
- **Features:** Strict Workspace Isolation via Foreign Keys and Composite Unique Constraints, B-Tree and GIN indexes, Composite indexing for read models.
- **Tables:** `audit_logs`, `reports`, `scheduled_reports`, `report_history`, `notifications`, `projections`, `users`, `workspaces`, `organizations`.
- **Future:** Materialized views and time-series partitioning for historical telemetry.

## 18. Security & Multi-Tenancy
- **Strict Isolation:** `workspace_id` and `organization_id` strictly govern *every* SQL query, Cypher query, Report, Audit Event, Notification, Dashboard aggregate, and AI prompt context.
- **Security:** RBAC authorization (with future ABAC support), JWT authentication, API rate limiting, encryption at rest/transit, secrets management, and cryptographically verified Audit integrity.

## 19. Performance Architecture
Designed for horizontal scalability.
- **Scale Vectors:** Celery/Redis background workers for Graph sync and Report generation, Queue workers for the Event Bus, API Rate limiting, Keyset Pagination, Streaming responses for large exports, and incremental batch graph updates to prevent Neo4j locking.

## 20. Verification Strategy
A comprehensive testing pyramid ensuring enterprise reliability:
- **Testing Layers:** Unit Tests (logic validation), Integration Tests (pipeline verification), Graph Validation (Cypher correctness), Projection Validation, Report/Audit/Notification Validation.
- **Enterprise Tests:** Multi-tenant Isolation Tests (zero data leakage validation), Security Tests, Performance & Load Testing, Chaos Testing, and Disaster Recovery Validation.

## 21. Business Value
- **SOC Analyst:** Rapidly reconstructs attack timelines using the Audit Platform and investigates anomalies using the AI Copilot.
- **Cloud/IAM Engineer:** Uses Identity Projections and Recommendation Engines to enforce Least Privilege via automated IaC pull requests.
- **Compliance Officer:** Automates NIST/SOC2 mappings via the Compliance Engine and Scheduled Reports.
- **CISO:** Gains instant board-level visibility through Executive Reports quantifying enterprise risk reduction and cloud exposure.
- **Platform Administrator:** Audits platform access and securely scales tenant onboarding with guaranteed data isolation.

## 22. Implementation Phases & Roadmap
- **Phase 1: Event Bus & Projections Foundation:** Introduce Redis/Celery Event Bus, define Projection models, and implement the Telemetry Normalizer.
- **Phase 2: Discovery & Graph Expansion:** Deploy the expanded Graph Domain Model and specialized Discovery Engines.
- **Phase 3: Intelligence & Risk:** Build the Attack Path, Risk, Recommendation, and Compliance Engines.
- **Phase 4: Audit & Reports Re-architecture:** Implement the robust Audit Ledger and Report Generation Pipeline, completely removing legacy placeholders.
- **Phase 5: UI & Copilot Integration:** Evolve the Frontend UI to consume Projections, and integrate the sophisticated AI Copilot RAG pipeline.
- **Phase 6: Enterprise Hardening:** Execute the Verification Strategy, performance tuning, and scalability testing.
