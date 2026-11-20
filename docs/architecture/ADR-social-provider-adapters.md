# ADR — Provider-neutral social publishing
Status: Proposed, 2026-11-19
## Context
Original campaign workflows depend on Blotato. Canopy Forge requires independent publishing records, vendor substitution and commercial clarity.
## Decision
Own drafts, approvals, calendar, scheduled posts and attempt state in Supabase. Provider adapters accept validated publish requests with tenant-bound account and idempotency keys. All channels support manual export fallback.
## Evaluation
Buffer is a potential pilot, not approved until its current commercial API rights, permissions and onboarding work for this use. Direct Meta is a later candidate, subject to account permissions, app review, scopes and terms.
## Security
OAuth connections limited by tenant, scoped tokens stored outside readable business tables, signed webhooks, redaction, retries, throttling and revocation.
## Capability limits
Publishing access does not imply comments/inbox/history access; use per-provider capability flags.
## Verification
No production social account use until consent and integration tests are approved. No mandatory Blotato or n8n usage.
