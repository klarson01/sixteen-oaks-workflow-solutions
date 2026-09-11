# Development and review workflow

## One source of truth

Use this GitHub repository for the Sixteen Oaks website. main is the reviewed version intended for the production deployment. A feature branch holds proposed changes.

The approved design was first developed in a separate private Sites preview. This migration imports that design into the existing repository; it does not automatically synchronize the two systems.

## Local setup

Install Node 24 (also recorded in .nvmrc). Clone this repository, switch to the desired branch, and run:

```sh
npm ci
npm run dev
```

Vite prints the local development address. Edit the page files or shared components and refresh the page as needed. The development server renders the same React templates used in the production build.

## Build

```sh
npm run build
```

The build performs these steps:

1. Type-check the React pages and Vite configuration.
2. Preserve the legacy logo URL.
3. Build the browser CSS and motion code with Vite.
4. Build the React page renderer into the ignored .build/ directory.
5. Generate complete HTML for the four routes and a 404 page.
6. Validate internal links, anchors, image alternatives, metadata, navigation, stylesheet assets, reduced-motion hooks, and copied OrbitDesk update files.

Only dist/ is published. .build/, node_modules/, and local environment files are not deployment content.

```sh
npm run preview
```

Use this command to inspect the built static site locally.

## Make a change

```sh
git switch main
git pull --ff-only
git switch -c feat/short-description
```

Make one coherent change, run the build, and open a pull request. Include the reason for the change, resulting behavior, validation, and any limitation requiring review.

## Netlify

Reuse the dedicated Sixteen Oaks Netlify project and this repository connection.

| Setting           | Value                                    |
| ----------------- | ---------------------------------------- |
| Production branch | main                                     |
| Build command     | npm run build                            |
| Publish directory | dist                                     |
| Node version      | 24                                       |
| Deploy Previews   | Enabled for pull requests targeting main |

netlify.toml declares the build and runtime settings. Repository linking and Deploy Preview access settings are managed in Netlify. A configuration file alone does not confirm the account connection.

Netlify serves the generated route HTML directly. There is no catch-all rewrite to the homepage. Unknown URLs use the generated 404 page.

## Before merging

- GitHub build checks pass.
- The Netlify preview matches the reviewed change.
- Check the affected page on desktop and a narrow phone, including navigation.
- For motion changes, also check reduced motion and keyboard navigation.
- Confirm the user's authorization for the production change.

The initial migration preserves the existing public/orbitdesk/ feed and release notes. Future changes to that feed need their own explicit scope.

## Migration behavior

The previous site used a single large React component and a client-rendered homepage. The refreshed site uses shared React templates and static output. The browser receives lightweight motion code, rather than a React runtime for an otherwise static page.

The previous contact form only changed its local display to a success message. The approved site uses the user's confirmed email and phone links; it makes no claim to send a form.

Old styles remain unimported for reference. Existing dependencies remain pinned at their original versions; the migration adds TypeScript declaration packages and a lockfile.
