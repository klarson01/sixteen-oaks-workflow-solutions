# Canopy Forge / Shared Services — Phase 1 independently authored specification
Status: Design only; no application deployment. Owner: Sixteen Oaks.
## Purpose
Offer one Operations Health Center for authorized applications and tenants, without copying third-party workflow logic or relying on a publishing vendor.
## Core entities
- event: internal id, tenant_id, source_application, source_event_id, timestamp, category, severity, safe summary, metadata reference, ingestion status.
- incident: tenant_id, normalized fingerprint, first_seen, last_seen, count, severity, status (open/acknowledged/resolved), assigned_to, audit history.
- notification_rule: tenant_id, approved recipients, severity threshold, enabled, routing policy.
- delivery_attempt: incident_id, channel, attempt count, last status and redacted error.
All keys and storage to be finalized after the owning runtime repository is chosen.
## Acceptance criteria
A1. Verified producer may ingest event for its authorized tenant only.
A2. Duplicate source event id has no duplicate effect; repeated fingerprint increments incident count within configurable window.
A3. Critical incidents trigger an approved notification; lower severity can be batched by user setting.
A4. Admin can acknowledge/resolve; each state change is audited.
A5. Alerts are visible in UI even when email delivery fails.
A6. Sensitive payloads are redacted; no plaintext provider tokens are stored.
A7. RLS and server authorization block cross-tenant access in automated tests.
A8. Queue job state and retry history are observable and cancelable.
A9. Schema and error-code versioning allow Ironwood/Canopy Forge/Aethralion producers.
A10. No automated outbound public social posts or comments in Phase 1.
## Delivery sequence
Implement isolated database migrations and tests on the eventual shared-service repository; then authenticated ingestion API, delivery worker, admin incident list and end-to-end tests. Gate release on tenant tests and backup/recovery.
