# Sixteen Oaks — ChatGPT / Claude Collaboration Protocol
Status: Proposal (active after review/merge) | Established: 2026-11-05

## Purpose
Enable different AI coding assistants to work on the same business portfolio without relying on private conversation history or duplicating implementations.

## Source of truth and precedence
- **GitHub repository code/config is authoritative for implemented behavior**; verify deployments separately.
- **Company-wide architecture standards**: this repo's `docs/architecture/ECOSYSTEM-BLUEPRINT.md`, `INFRASTRUCTURE-INVENTORY.md`, `DEVELOPMENT-RULES.md`.
- **Product-local rules**: the active repository's `AGENTS.md` (general assistants) and `CLAUDE.md` (Claude), which both point to shared standards.
- **Operational state**: open issues, pull requests, CI results and dated `docs/session-handoffs/` in product repositories.
- Security/compliance and explicit user instructions take precedence over convenience. Conflicts must be recorded, surfaced, and resolved; do not silently disregard product-local requirements.

## Standard start-of-session ritual
1. Check current branch, remote, pending PRs and deployment target.
2. Read product-local `AGENTS.md` and/or `CLAUDE.md`, then shared blueprint and development rules.
3. Read the latest relevant handoff and issue/PR; verify claims against code and live resource state where possible.
4. Announce the exact system, environment and allowed change scope. Avoid production writes without explicit approval.
5. Before implementing, classify feature as product-owned, reusable library/contract, external adapter, or new shared service.

## Standard end-of-session ritual
1. Commit code and update docs in the product repository branch.
2. Create/update `docs/session-handoffs/YYYY-MM-DD-<topic>.md` using the template.
3. Reference issue and PR URLs; state what was and wasn't deployed.
4. Capture tests run, failed checks, open questions, and environment-specific instructions.
5. Update the central infrastructure inventory and ADRs when ownership/topology/contracts change (via separate PR).
6. Add a concise PR comment **Handoff to next assistant**, covering entry point and next action.
7. Never store secrets, OAuth tokens, customer private data, or internal credentials in Markdown.

## Communication mechanism
- **GitHub Issues:** planned work, decisions awaiting approval, blocked items. One issue per coherent task.
- **Pull Requests:** proposed code/docs changes and review; never treat open PR as deployed.
- **Session handoffs:** detailed context, exact branch/commit and verification steps.
- **ADRs:** durable decisions affecting multiple products, data ownership, deployment or billing.
- **Human approvals:** only user-authorized merges/deployments or sensitive production changes.

## Concurrency and conflict handling
- Only one agent should actively own a change to the same file or schema migration at a time.
- Record ownership and branch/PR in an issue before extended work.
- If another assistant changes the same area, inspect and reconcile diffs rather than overwriting.
- A previous assistant's summary is evidence to check, not proof of deployment.

## Reuse governance
- Share interfaces, libraries and adapters; do not assume that sharing means combining tenant/customer databases.
- For reusable capability proposals: identify consumer products, security constraints, versioning, cost accounting, tests and rollback.
- Preserve Aethralion office/RLS rules and production-branch safeguards.
- Preserve Ironwood isolation and custom-client boundaries. Treat any apparent conflict with proposed integrations as a required ADR and explicit approval.

## Handoff template
See [HANDOFF-TEMPLATE.md](HANDOFF-TEMPLATE.md).
