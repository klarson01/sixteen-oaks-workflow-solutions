# Ecosystem Development Rules
Applies as cross-product review guidance for Sixteen Oaks work. Product/customer-specific AGENTS.md and legal/security constraints remain in force; use the stricter applicable requirement.

## Required pre-build checklist
1. **Name the customer and product**: Sixteen Oaks corporate, Aethralion module, Ironwood, Canopy Forge, Intelligence, OrbitDesk, or isolated client.
2. **Choose responsibility**: domain-specific feature, reusable library, provider adapter, or authenticated shared service. Check [Inventory](INFRASTRUCTURE-INVENTORY.md) for an existing implementation first.
3. **Identify source of truth**: owner repo, deployment, database, schema, object storage, secrets and external provider; record unknowns instead of guessing.
4. **Decide reuse with evidence**: prefer shared interfaces/contracts; do not prematurely merge code, databases, auth identities or customer records.
5. **Security first**: user/session, tenant/office authorization, least privilege, RLS and explicit GRANT, secrets, API exposure, auditing, retention and rate/cost limiting.
6. **Data contract**: input/output schemas, idempotency, versioning, failure/retry, consent and licensing.
7. **Environment and deployment**: feature branch, review, DEV/test, migration order, production approval, rollback and monitoring.
8. **Cost and support**: AI consumption per customer/feature, provider fees, quotas, alerts, customer support and ongoing maintenance.
9. **Update documentation**: product README/AGENTS, owner inventory entry, any ADR, operational runbook.
10. **Verify existing consumers** before shipping a shared change; include integration and tenant-isolation tests.

## Hard rules
- Sixteen Oaks is **cross-industry**; Aethralion is **real-estate-specific**.
- Real Estate Intelligence has **standalone and Aethralion-integrated** use cases. Keep independent licensing/usage accounting.
- Ironwood and LeadOrbit are **different products**. Reuse generic connectors/routing logic only after documenting domain-specific differences.
- A client website or bespoke app retains its **own repo, deployment/hosting, domain/forms/config and credentials**.
- Share infrastructure only through explicit versioned contracts; no silent cross-product DB reads or implicit cross-tenant user grants.
- Preserve real estate compliance, jurisdiction rules, broker signoffs, audit locks and commission calculations in domain-owned modules.
- Sensitive algorithms, API keys and provider secrets run **server-side**.
- AI outputs and valuation figures require provenance, limitations, human review where consequential, and source licensing.
- Trial duration, subscription access, API calls and AI tokens are **separate entitlements/usage counters**.
- No automatic production changes, database extraction or DNS renames from an architecture recommendation.
- Existing repositories' AGENTS.md and README instructions are not replaced by this document.

## ADR trigger
Write an Architecture Decision Record whenever introducing a cross-product service, coupling products, moving production data/auth, changing tenancy, adding a new third-party data source, or changing billing semantics.
Template: context; decision; alternatives; product/data owners; privacy/security; costs; test/rollout; rollback; date and approval.

## Suggested PR checklist
- [ ] Domain/product owner and reuse decision documented
- [ ] Data origin, API permissions and tenant isolation checked
- [ ] Function authentication/authorization and rate limiting checked
- [ ] Deployment environment and required GRANT/RLS reviewed
- [ ] Production/customer data untouched until approved
- [ ] Other consumers tested and monitoring/rollback ready
- [ ] Inventory and applicable runbooks updated
