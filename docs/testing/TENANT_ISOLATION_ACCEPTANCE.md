# Tenant isolation acceptance criteria — automation services
These are required tests; not evidence they have passed.

1. User of tenant A cannot read/list/edit incidents, campaigns, social accounts, draft approvals, published posts or credentials of tenant B via API or database RLS.
2. Untrusted client-supplied tenant IDs cannot override verified server-side tenant membership.
3. Workers and webhook handlers derive tenant context from authenticated connection/event, not an arbitrary payload.
4. Agent, approver, admin roles enforce separate draft/approve/publish permissions with audit trail.
5. Scheduling retries and deduplication cannot cross tenants with colliding external IDs.
6. Provider credentials are encrypted and inaccessible from ordinary app queries, logs and browser bundles.
7. Queued jobs can't publish after account revocation, cancelled approval, or customer offboarding.
8. Every failed execution produces a redacted, tenant-scoped incident; alerting failures are separately observable.
9. Background jobs are constrained by tenant and service authorization; not public/anonymous execution.
10. Each test should include a negative cross-tenant fixture and a positive authorized-control case.
