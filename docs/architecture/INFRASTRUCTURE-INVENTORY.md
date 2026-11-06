# Sixteen Oaks Infrastructure Inventory
Snapshot: 2026-11-05 | **Discovery snapshot, not exhaustive operational verification.**
Source: read-only inspection of connected GitHub, Netlify and Supabase resources. Supersede with dated scans; never silently replace verified facts with historical assumptions.

## GitHub (10 repositories accessible under klarson01)
| Repository | Apparent purpose | Decision / verification |
|---|---|---|
| aethralion-app | Aethralion and Orbit app code | KEEP; specialized real estate modules |
| Aethralion | Empty/placeholder repository | VERIFY before archive |
| sixteen-oaks-workflow-solutions | Corporate website and Real Estate Intelligence marketing | KEEP corporate-only; this repository hosts governance docs |
| sixteen-oaks-lead-platform | Earlier lead-platform code | VERIFY canonical Ironwood source |
| lead-platform | Ironwood application and intake API | VERIFY live deployment linkage |
| ironwood-lead-management-template | Reusable Ironwood template | KEEP distinct from operational installs |
| rays-mobile-repair-site | Ray's customer site | KEEP client isolated |
| larson-home-team-site | Larson Home Team site | KEEP client isolated |
| orbitdesk-personal-desktop | Tauri desktop application | KEEP independent |
| claude-skills | AI skill definitions/work | REVIEW assets for licensed, versioned reuse |

## Netlify (7 accessible projects)
| Project | URL | Platform | Action |
|---|---|---|---|
| sixteenoaks | https://sixteenoaksllc.com | Sixteen Oaks site | KEEP |
| sixteen-oaks-seller-dev | https://sixteen-oaks-seller-dev.netlify.app | Real Estate Intelligence DEV | KEEP, determine Git origin and production plan |
| snazzy-sprinkles-c22714 | https://aethralion.com | Aethralion | KEEP, clarify project naming |
| sixteen-oaks-lead-platform-dev | https://ironwood.sixteenoaksllc.com | Ironwood | Clarify live/DEV conventions |
| ironwood-archive-pilot | https://ironwood-archive-pilot.netlify.app | Ironwood Archive | KEEP isolated pilot |
| larson-home-team | https://thelarsonhometeam.com | Client site | KEEP isolated |
| rays-mobile-repair-preview | https://www.raysmobilerepair.com | Client site | KEEP isolated, clarify name |
Seven returned published-ready deploy state; that does **not** prove app or integration health. The two available Netlify connections returned the same seven projects.

## Supabase (5 unique accessible projects)
| Name | Project ref | Platform |
|---|---|---|
| aethralion-platform | jgofpijbpwlvvbmujhid | Aethralion PROD |
| aethralion-dev | cdomxmdflahwhmcmruvo | Aethralion DEV + Real Estate Intelligence DEV |
| aethralion-exploration | nshkwtauaruptxqlgvtj | Aethralion exploratory |
| Lead Platform Development | glxbhragvebwxaqlpeea | Ironwood development |
| Ironwood Archive Pilot | vjawlpbqxidkwvcnuvoo | Ironwood Gmail/Archive pilot |

Aethralion DEV: **130 public base tables, 267 public RLS policies**; PROD: **128 tables, 263 policies**. These are counts, not a migration-diff explanation. All discovered public tables reported RLS enabled in the table listing; check complete policies and function authorization separately.

### Observed domain/table families
- **Aethralion platform core**: offices, profiles, permission_definitions, role_permission_map, office_modules, security_audit_log.
- **LeadOrbit**: leadorbit_leads, lead_source_connections, lead_intake_events, lead_routing_settings, lead_assignment_history, contacts.
- **HelmOrbit**: transactions, transaction_sides, transaction_milestones, helm_* templates/documents/audits, commission_* calculations and tiers.
- **PropOrbit**: prop_properties, prop_units, prop_leases, prop_tenants, prop_* maintenance/charges/payments/rent-roll.
- **BuildOrbit**: builder_projects, builder_lots, builder_inventory, builder_budget_items, builder_draws, builder_permits and stages.
- **AIE / analysis**: aie_deals, aie_inputs, aie_scores, aie_snapshots, aie_reports.
- **Document extraction**: document_uploads, document_extractions, document_field_mappings, extractor_registry, document_type_registry, office_form_preferences, acceptance_detections.
- **Real Estate Intelligence** (in Aethralion DEV): sixteen_oaks_analyzer_profiles, sixteen_oaks_analyses, sixteen_oaks_analyzer_access, sixteen_oaks_skill_jobs, sixteen_oaks_skill_usage, sixteen_oaks_admin_permissions, sixteen_oaks_admin_audit, sixteen_oaks_invitations, sixteen_oaks_admin_email_actions.
- **Ironwood DEV**: organizations, memberships, leads, intake events/audit, assignments, notifications, imports, tags, campaigns.
- **Ironwood Archive pilot**: archive_deals, archive_messages, archive_gmail_connections, archive_gmail_candidates, archive_gmail_scans, archive_gmail_sync, archive_gmail_oauth_states.

Nine active `sixteen-oaks-*` Edge Functions were discovered in Aethralion DEV: gateway, recr, inspection, appraisal, offer, cma, seller-strategy, buyer-counteroffer, admin. They report `verify_jwt=false`; review each function's **actual internal authorization**, origin controls, rate limits, secrets and usage accounting. Do not characterize the flag alone as a vulnerability. No Edge Functions were returned for other four projects by that listing; other server functions may still exist.

## Reuse decision register
| Capability | Present source(s) | Classification | Next action |
|---|---|---|---|
| Document extraction | Aethralion HelmOrbit | EXTRACT generic pipeline; KEEP WI forms/real-estate rules | Define schemas, redaction, prompt/model versioning and tenant boundary |
| PDF/reporting | HelmOrbit, Intelligence, websites | EXTRACT templates/rendering | Keep product-specific narrative and legal disclosures |
| AI gateway/usage | Intelligence Edge Functions | EXTRACT after security audit | Central entitlement/cost contract; server-side keys |
| Auth/permissions | Aethralion, Ironwood, Intelligence | SHARE contracts, not automatically auth databases | Map roles, identity linkage, authorization and migrations |
| Lead routing / ingestion | Ironwood, LeadOrbit | SHARE algorithms/adapters; KEEP domain records | Version idempotency/assignment APIs |
| Gmail Archive | Ironwood pilot | SHARE OAuth/event adapter; KEEP archive messages/deals | Review Google scopes, token storage and retention |
| Property comps | Not independently verified as integrated | NEW vendor-neutral service | Validate provider license/accuracy and audit trails |
| CRM domain | Ironwood / LeadOrbit | KEEP separate | No default cross-product contact sync |
| Client sites | Ray's, Larson Home Team | KEEP separate deployments | Version reusable page/form/design templates |
| Subscriptions | Product-specific | SHARE entitlement interface | Separate trial duration vs paid AI usage |

## Open questions before moving code
1. Which Ironwood repository/branch supplies the live Netlify project?
2. What is the source and release route for Real Estate Intelligence's Netlify DEV site?
3. Which Aethralion tables/functions/read paths are shared with standalone Intelligence?
4. Exact migrations and policy changes between Aethralion DEV, PROD and exploration?
5. Which Netlify Functions, cron tasks, OAuth integrations and production secrets are used?
6. Which dependencies are permitted for API output storage, white labeling and commercial resale?
7. Where will a future architecture control plane be hosted and which products actually need it?

**No production resources should be merged, deleted, moved or renamed as an automatic consequence of this inventory.**
