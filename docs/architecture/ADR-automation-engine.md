# ADR — Owned automation execution and incident intake
Status: Proposed, 2026-11-19
## Context
Customer-facing workflow execution must not rely on unverified rights to embed n8n. Multiple Sixteen Oaks products need one auditable incident/alert mechanism.
## Decision
Build tenant-scoped durable job/event intake backed by Supabase/Postgres; schedule server-side workers where needed. Start with Operations Health Center, independent of any social publisher. Keep retry and notification adapters replaceable.
## Requirements
Authenticated ingestion, server-derived tenant identity, event_id/source deduplication, severity/acknowledgement state, validated schemas, rate limits, confidential payload redaction, dead-letter handling, independently monitored alert transport.
## Non-decisions
No engine/vendor license confirmed; no deployment or new database authorization implied by this ADR.
## Verification
Prove RLS isolation, retries, dedupe, authorization, and failure recovery before production.
