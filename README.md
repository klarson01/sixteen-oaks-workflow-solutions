# Sixteen Oaks Workflow Solutions

The Sixteen Oaks business website: custom websites, practical AI, and connected workflows for small businesses.

## Start here

Use Node.js 24 and npm. The committed lockfile gives local development, GitHub checks, and Netlify the same dependency versions.

```sh
npm ci
npm run dev
```

To build and check the finished site:

```sh
npm run build
npm run preview
```

## Pages

| URL        | Page                              |
| ---------- | --------------------------------- |
| /          | Home and featured project         |
| /services/ | Services                          |
| /work/     | Published project gallery        |
| /work/:slug/ | Individual project case study |
| /admin/ | Private project, contact, and inquiry administration |
| /approach/ | Approach, background, and contact |

React components generate complete HTML both at build time and through a Netlify Function. Published content is read from Netlify Blobs on each request, so admin edits appear without a rebuild. Vite bundles the shared CSS, browser motion code, and private admin application.

The browser enhances ordinary links with page transitions, scroll entrances, and a mobile menu. Content, navigation, email, and phone links remain available without JavaScript. System reduced motion and the footer setting both stop animation.

## Where to make changes

| Change                                               | Location                               |
| ---------------------------------------------------- | -------------------------------------- |
| Page content                                         | src/app/pages/                         |
| Header, footer, logo, contact                        | src/app/components/                    |
| Navigation labels and page metadata                  | src/app/routes.ts                      |
| Colors, spacing, responsive rules, and motion timing | src/styles/site.css                    |
| Navigation and motion behavior                       | src/app/lib/motion.js                  |
| Website images and fonts                             | public/assets/                         |
| Build and deployment                                 | scripts/, vite.config.ts, netlify.toml |

The older styles in src/styles/ are retained for reference but are not imported by the new site.

## Working process

1. Create a short feature branch from main.
2. Make the change and run npm run build.
3. Open a pull request and review its Netlify preview.
4. Merge the reviewed change when approved for the live site.

[Development guide](docs/DEVELOPMENT.md) explains the build, checks, and deployment workflow.
[Project instructions](AGENTS.md) record the brand and project boundaries.

## Existing public files

public/orbitdesk/ contains existing OrbitDesk update manifests and release notes. Keep those files and URLs intact during website work. The build copies them unchanged, and validation checks that output.

The older /logo-icon.png URL is also retained through the asset preparation step.

## Contact behavior

Every contact section includes an inquiry form plus email and telephone links. Inquiries save to the private admin Inbox before optional email delivery. Public contact details, the notification recipient, and the SMTP connection are editable in /admin/. The private Analytics tab reports cookie-free visits, traffic sources, popular pages, contact actions, and inquiry conversion. See [Admin setup](docs/ADMIN-SETUP.md) for one-time activation and daily use, [Visitor and lead analytics](docs/ANALYTICS.md) for measurement and privacy details, and [Backup and recovery](docs/BACKUP-RECOVERY.md) for the versioned admin-data archive and restore procedure.

## Assets and origin

The design was approved in the [Sixteen Oaks private preview](https://sixteen-oaks.klarson103.chatgpt.site). It includes the supplied logo and Ray’s Mobile Repair case study.

Ray’s screenshot was captured from its public website on September 11, 2026. The oak landscape is an illustrative generated image. Font licenses are in public/assets/licenses/.

This repository is the source for future website development. Do not maintain a second independently edited website copy.

## Ironwood intake

Website inquiries can also be forwarded to an isolated Ironwood connection
without changing the existing inquiry storage or email notifications:

- `IRONWOOD_INTAKE_URL` — the full Ironwood `/api/lead-intake` endpoint
- `IRONWOOD_INTAKE_KEY` — the private API key for the `Sixteen Oaks` connection

Both values are function-only runtime configuration and must never be exposed
through Vite/client environment variables.
