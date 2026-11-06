# Sixteen Oaks Technology Ecosystem Blueprint
Status: Proposed governing architecture | Version: 1.0 draft | Date: 2026-11-05

## North star
**Sixteen Oaks Workflow Solutions is the parent business and flagship brand across industries.** It provides custom websites, dashboards, automation, AI solutions, consulting, and subscription software. Do not represent Sixteen Oaks as a real-estate-only business.

## Product ownership
| Product | Owner of business workflow | Boundary |
|---|---|---|
| Aethralion | Real estate operations platform | LeadOrbit (real estate leads), HelmOrbit (transactions/compliance/commissions), PropOrbit (property operations), BuildOrbit (builder projects). Sentinel is the authorized platform assistant. |
| Real Estate Intelligence | Standalone six-analyzer and AI-skills product; also accessible through Aethralion | Its own users, trial, subscription, usage and saved analyses. Share calculation contracts; do not blend tenant data. |
| Ironwood | Cross-industry CRM, intake, routing, follow-up, deal pipeline and optional Archive | Independent from LeadOrbit. Generic routing/connectors may be reused by versioned integration contracts. |
| Canopy Forge | Planned cross-industry marketing, content, SEO/GEO and campaigns | Proposed marketing director Heidi. Integration with Ironwood through APIs, not shared CRM tables. |
| Custom client solutions | Individual business websites, integrations and automation | Preserve each client's repo, deployment, domain, forms/config and credential boundaries. |
| OrbitDesk | Local-first desktop AI workspace | Separate product; only reusable components with explicit review. |

## Shared capability candidates
1. Account identity and product-specific entitlements; no forced identity-database merger.
2. AI gateway: model routing, prompt versions, safety/authorization, cost and usage ledgers.
3. Document intake, extraction, provenance, correction and audit framework.
4. Reporting/PDF templates, branded output, exports and versioned calculation disclosures.
5. Notifications, scheduling and audited delivery.
6. Integration adapters: inbound events, idempotency, OAuth, webhooks, retries and monitoring.
7. Property data access and comparable-sales engine, vendor-neutral; subject to licensing and quality checks.
8. Design tokens and UI components; do not homogenize brand identity.
9. Observability, security audits and environment drift checks.

## Architecture separation
- Shared **code or API capability** does not imply shared **customer data**.
- Each product is authoritative for its domain records. Cross-product interactions use authenticated, versioned APIs and stable IDs, with tenant scope and audit trails.
- Keep proprietary algorithms and provider credentials server-side.
- Aethralion office_id/RLS, explicit Data API GRANTs, RBAC checks, and Security Advisor review are mandatory when relevant.
- The corporate marketing website is not the shared runtime for every product.
- Do not move tables, auth users, OAuth tokens, storage objects or production records without mapped dependencies, a migration plan and rollback.
- Treat AI decisions and property valuations as explainable decision support, not independently verified facts.

## Lifecycle for shared extraction
**Inventory → classify → contract → isolate tenant/security concerns → extract incrementally → dual-test existing consumers → release/version → monitor.**
Do not create a shared service merely because two modules have a similarly named table.

## Portfolio integration priorities
P1: Real Estate Intelligence ↔ HelmOrbit; Ironwood ↔ Canopy Forge.
P2: HelmOrbit ↔ PropOrbit, BuildOrbit ↔ HelmOrbit.
Keep LeadOrbit and Ironwood distinct and never cross-sync customer records by default.

## Governance
Significant architecture moves require an ADR with problem, alternatives, owner, data/privacy impact, costs, rollout, tests and rollback. Production changes require explicit authorization and validation. See [Development Rules](DEVELOPMENT-RULES.md) and [Infrastructure Inventory](INFRASTRUCTURE-INVENTORY.md).
