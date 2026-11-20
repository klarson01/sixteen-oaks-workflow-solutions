# Sixteen Oaks Automation Architecture & IP Standard
Version 1.0 — 2026-11-19. Status: development baseline; commercial release requires licensing and legal review.

## Governing rules
1. Independently implement ideas and functional requirements. Do not copy proprietary workflow JSON, embedded code, prompts, UI, images, or documentation without express applicable permission.
2. Cosmetic renaming or restructuring is not independent authorship.
3. Write Sixteen Oaks-owned specifications and tests before implementation; use official vendor API documentation and first-party requirements.
4. Track provenance, licenses, approvals, security decisions and development history. Preserve notices for all authorized third-party components.
5. Assess copyrights, contracts, trademarks and relevant patents separately; obtain counsel review for unresolved commercial IP questions.
6. All client accounts, data, logs, secrets and roles must be isolated; implement database-enforced tenant boundaries and negative isolation tests.
7. Sixteen Oaks owns campaigns, approvals, schedules, content and execution status. External publishing vendors are replaceable adapters.

## Third-party research boundary
The SoloBuild workflow archive was examined as reference material for feature discovery. Its JSON and setup text are not approved for incorporation into Sixteen Oaks software. No separate LICENSE file was identified in the reviewed archive; that fact neither establishes nor negates usage rights. Maintain restricted copies outside product repositories, and record any subsequent permission assessment.

## Ownership
- **Canopy Forge:** campaign management, editorial calendar, content creation, channel profiles, posting approvals, status monitoring, engagement review and Heidi AI recommendations.
- **Ironwood:** CRM contacts, lead intake, routing and customer interactions.
- **Shared Sixteen Oaks services:** authorized event intake, incident management, notifications, queue jobs, run history and tenant/role policy.
- **Aethralion / Real Estate Intelligence:** specialized domain workflows integrating with shared services via documented interfaces.
No cross-tenant data sharing or separate Canopy Forge CRM.

## Independent initial modules
- **Operations Health Center:** event intake, severity grouping, incident history, alert rules and acknowledgment.
- **Campaign Readiness Monitor:** configurable campaigns, horizon and minimum upcoming coverage.
- **Campaign Coordination:** schedule/approval collision detection, daily channel policy and manual override audit.
- **Content Intelligence:** original authorship/brand and repetition checks with reviewer override.
- **AI Engagement Desk:** contextual comment review and AI suggested replies subject to approval and official permissions.

## No required Blotato dependency
Canopy Forge UI → campaign/draft → approval → internal schedule → durable publish queue → provider adapter → external network/provider → persisted attempt and status.
Canonical object families: tenant, brand, campaign, social_account, content_asset, draft, approval, scheduled_post, publish_attempt, provider_connection, incident and comment.
Provider interface: connect/disconnect, validate, publish with idempotency, getStatus, refreshCredentials; optional supported functions for comments/history and reply. Expose verified per-provider capabilities and do not assume commenting or inbox functions from a publishing API.
Manual publish/export is required fallback. Buffer pilot and direct Meta connection require current API, commercial-license, onboarding, security and permissions review before implementation.

## Execution licensing
Do not embed n8n as a multi-tenant commercial workflow engine absent explicit appropriate rights. Prefer owned scheduling/orchestration using Supabase/Postgres and server-side workers where technically adequate. n8n internal use subject to its applicable terms.

## Security & quality gates
RLS plus server authorization; negative tenant isolation tests; least-privilege account scopes; encrypted secret boundary; separate dev/prod; audit logs and status transitions; durable retries, rate limits and idempotency; human approval before publishing or public responses; prompt-injection treatment for outside content; deletion and retention policies; monitoring of the notifier itself; accessibility and backups.

## AI collaborator requirements
AGENTS.md and CLAUDE.md must link to this standard. Before changes, check the ecosystem blueprint and product ownership, write independent acceptance criteria and ADRs, update the provenance/license records, and work on branches with review before merging. Never claim deployment without verified evidence.

## Roadmap
Phase 0: governance, provenance, architecture ADRs and tests.
Phase 1: tenant-scoped events and Operations Health Center.
Phase 2: Canopy Forge content calendar, approvals, readiness and coordination with manual publishing.
Phase 3: one verified publishing provider pilot.
Phase 4: content intelligence/engagement with appropriate platform permissions.
Phase 5: commercial compliance/security/legal readiness.

## Release blockers
Confirm execution licensing, publishing terms, available comment/engagement permissions, customer consent, and commercial legal/IP review.
This is internal engineering guidance, not legal advice.
