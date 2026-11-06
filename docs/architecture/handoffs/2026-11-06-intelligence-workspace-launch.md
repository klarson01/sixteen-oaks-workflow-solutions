# Session Handoff — Real Estate Intelligence branded workspace
Date: 2026-11-06
Assistant: ChatGPT
Owner product: Intelligence; corporate website owns marketing only
Issue: https://github.com/klarson01/sixteen-oaks-workflow-solutions/issues/19
PR: https://github.com/klarson01/sixteen-oaks-workflow-solutions/pull/20
Branch: feat/intelligence-workspace-launch
Source commit before this handoff: 37fcba6bd29282aaab899922d707617d88383f0d
Environment: corporate production rollout; existing Intelligence pilot on Aethralion DEV
Deployment status: branded workspace HTTPS verified; corporate marketing publication ready

## Objective
Launch the existing workspace at https://intelligence.sixteenoaksllc.com/ and connect the corporate marketing page to its complete six-analyzer and seven-workflow suite. Kevin authorized the launch and chose this hostname. Preserve independent deployment, accounts, private work, and usage.

## Verified starting state
Existing workspace Netlify site 0c473315-058d-43b7-8fb0-f462628e065f, name sixteen-oaks-seller-dev. Previous published release owner-ai-allowance-v1, deploy 6aede8064b16c07aea15bbe5. Canonical source is Sites Git project appgprj_6ae8a99b9c648191a606a253f468a0c1, not this corporate repository. Backend remains cdomxmdflahwhmcmruvo (Aethralion DEV).

## Changes made
Corporate RealEstate.tsx now lists every analyzer/workflow, uses the branded hostname, and describes the shared initial three-attempt allowance. routes.ts metadata and infrastructure inventory updated. No homepage redesign or admin content changes.

Workspace source commit 1a7d1768e7ec170ea4c799328ca1a3cc6fa4c055 adds exact canonical/legacy origin support, callback compatibility and canonical report links. Private Sites preview succeeded. Public release intelligence-domain-launch-v1 deployed to existing Netlify site as 6aedf49b179a5304d6b99d23. Gateway v7 and seven workflow endpoints updated. Once HTTPS was verified, admin endpoint v3 was deployed with canonical invitation/reset return links; no email was sent.

Supabase exact canonical redirects added for root and seller/buyer/multifamily/rental/commercial/acquisition; all previous redirects and Aethralion Site URL retained. Netlify domain assigned to existing workspace site. DreamHost dashboard confirms active nameservers ns1/ns2/ns3.dreamhost.com. Added only intelligence CNAME -> sixteen-oaks-seller-dev.netlify.app; record submitted successfully. Parent DNS/mail unchanged. DNS propagation completed and Netlify reports HTTPS enabled with a Let's Encrypt certificate. The canonical workspace loads successfully over HTTPS and protected Seller access redirects signed-out visitors to its login portal.

## Tests and verification
75 suite tests passed, including both exact approved origins, rejected lookalikes, verified authorization and gateway session controls. Production workspace build succeeded. Corporate required Website checks passed on a65c9d201f55d3cf0a692b9548173ebb1762550d (npm ci, npm test, npm run build); rerun after this documentation update. Netlify preview https://deploy-preview-20--sixteenoaks.netlify.app/real-estate-intelligence/ reviewed with all six analyzer and seven workflow destinations.

## Shared-service / ecosystem effect
No shared runtime, HelmOrbit dependency, new auth system, billing or database project. Existing account isolation, usage ledgers and global/concurrent AI controls retained. Legacy workspace hostname remains enabled during transition. Infrastructure inventory explicitly distinguishes this pilot from a backend production migration.

## Decisions and open issues
DNS/TLS blocker resolved. The branded sign-in page and signed-out protected-route redirect are verified. An authenticated owner session on the new hostname has not been manually tested; no password was requested during link correction. No real invitations, password-reset messages or paid AI requests were sent. Actual usage balances and access dates were not adjusted by this launch.

## Next assistant: exact next steps
Confirm latest corporate CI/preview, mark PR20 ready and merge under existing launch authorization; verify production marketing Sign In and trial/tool links point to the canonical workspace root rather than the development hostname or owner admin route. Kevin can sign in with his existing account; owner administration remains permission-gated and separate. Do not modify balances or send real emails while verifying. Do not merge stale draft PR17.

## Secrets and privacy
No secrets, OAuth tokens or private document payloads included. Public build includes only the publishable Supabase key. Privileged credentials remain server-side.
