# Sixteen Oaks website project instructions

## Scope and isolation

- This repository belongs to the Sixteen Oaks Workflow Solutions website.
- Follow the user's standard: one customer has its own repository, hosting site, domain configuration, and forms/configuration boundary.
- Keep Aethralion and customer application code, credentials, settings, forms, and operational data in their own projects.
- Portfolio screenshots and descriptions explicitly selected for the website are marketing content. Do not import a customer's source tree or deployment configuration.
- Preserve the existing public/orbitdesk/ update files and their URLs during marketing-site work. The user must specifically request changes to that update feed.

## Approved design

- Preserve the approved deep teal #061e24 and copper #D1793B brand, supplied logo proportions, page layout, and restrained motion unless a requested change calls for a revision.
- Keep working system and footer reduced-motion controls, native keyboard access, responsive navigation, and complete HTML for no-JavaScript visitors.
- Use existing page components and shared styles. Keep the four public page routes stable.
- Preserve confirmed copy and contact details. Do not invent testimonials, client outcomes, metrics, or completed projects.
- Keep visible copy in plain language for small-business owners.
- The approved contact experience uses email and phone links. Do not present a success state for a message that has not actually been sent.

## Development and review

- Use Node 24, npm, and the committed package-lock.json. Preserve existing dependency versions unless the task requires changing them.
- Work on a feature branch and prepare a pull request for review. Follow the user's current authorization for merging or publishing.
- Run npm run build before handing off a change; it includes type checks, both build stages, static page generation, and validation.
- Treat GitHub as the source of truth. Do not copy the ChatGPT Sites project identity or credentials into this repository.
- Do not add secrets or customer operational data to committed files.
- Keep documentation aligned with changes to routes, build steps, deployment, or product behavior.
