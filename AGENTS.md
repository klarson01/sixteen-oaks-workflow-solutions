# Sixteen Oaks website project instructions

## Scope and isolation

- This repository belongs to the Sixteen Oaks Workflow Solutions website.
- Follow the user's standard: one customer has its own repository, hosting site, domain configuration, and forms/configuration boundary.
- Keep Aethralion and customer application code, credentials, settings, forms, and operational data in their own projects.
- Portfolio screenshots and descriptions explicitly selected for the website are marketing content. Do not import a customer's source tree or deployment configuration.
- Preserve the existing public/orbitdesk/ update files and their URLs during marketing-site work. The user must specifically request changes to that update feed.

## Approved design

- Kevin selected the Main Street homepage layout on September 14, 2026 as the direction going forward: teal/copper, arched oak hero, four-service strip, Main Street photo/cream panel, and countryside closing banner. Preserve it unless he requests a change.
- Homepage copy and photos are managed through the existing admin Homepage tab. Preserve saved content and use defaults only for workspaces that do not yet have homepage settings.

- Preserve the approved deep teal #061e24 and copper #D1793B brand, supplied logo proportions, page layout, and restrained motion unless a requested change calls for a revision.
- Keep working system and footer reduced-motion controls, native keyboard access, responsive navigation, and complete HTML for no-JavaScript visitors.
- Use existing page components and shared styles. Keep the four public page routes stable.
- Preserve confirmed copy and contact details. Do not invent testimonials, client outcomes, metrics, or completed projects.
- Keep visible copy in plain language for small-business owners.
- The contact experience includes an inquiry form plus email and phone links. Show success only after the inquiry is saved. Email delivery is separate and must never be implied when unconfigured or failed.
- Admin identities are server-authorized independently from editable public contact and notification email addresses. Never expose SMTP credentials in client responses.

## Development and review

- Use Node 24, npm, and the committed package-lock.json. Preserve existing dependency versions unless the task requires changing them.
- Work on a feature branch and prepare a pull request for review. Follow the user's current authorization for merging or publishing.
- Run npm run build before handing off a change; it includes type checks, both build stages, static page generation, and validation.
- Treat GitHub as the source of truth. Do not copy the ChatGPT Sites project identity or credentials into this repository.
- Do not add secrets or customer operational data to committed files.
- Keep documentation aligned with changes to routes, build steps, deployment, or product behavior.
