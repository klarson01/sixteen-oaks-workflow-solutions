# Sixteen Oaks admin setup

The admin is at `/admin/` on the same Netlify site. GitHub remains the source for application code. Project content, images, contact settings, and inquiries are stored in this site's private Netlify Blobs stores.

## One-time activation

1. In the existing **sixteenoaks** Netlify project, open **Project configuration → Identity** and enable Identity. Set registration to **Invite only**, with automatic confirmation off.
2. Invite **kevin.larson@sixteenoaksllc.com**. This is the initial server-authorized administrator. Accept the invitation and set a password. The invite or recovery link may land on the homepage; it redirects to the admin while preserving the token. During preview review, use the same preview origin for the admin login. If an invite lands on production before this change is merged, open the preview `/admin/` page, expand **Invitation opened the regular website?**, and paste the full invitation link there. Continue to the password setup form. The same helper accepts recovery links. Expired or previously consumed invitations need a fresh invitation or recovery email.
3. To change the admin allowlist, set `SIXTEEN_OAKS_ADMIN_EMAILS` in Netlify environment variables (Functions scope). It accepts comma-separated verified account emails. This is independent of the public contact email and notification recipient. An explicitly empty allowlist denies everyone.
4. Before connecting SMTP, add `SIXTEEN_OAKS_SECRET_KEY` to the site's environment variables, **Functions** scope if your plan supports specific scopes, or **All scopes** when specific scopes are locked behind an upgrade. Select **Same value for all deploy contexts** and **Contains secret values**. Its value must be a random 32-byte key encoded as base64. Generate it locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`. Keep the value private; never commit it. Confirm the variable is listed in Netlify, then redeploy the preview you are using (PR #4 during review) after setting it. Refresh the admin and confirm the setup banner is gone before saving credentials. Keep this key stable: changing it makes saved SMTP passwords unreadable, requiring password re-entry.
5. Open **Contact & email** in the admin. Set public email, phone, and notification recipient, then **Save website changes**. Enter your email provider's SMTP hostname, username, authorized sender address, and password/app password. Use port 587 (STARTTLS) or 465 (TLS), enable delivery, and **Save email connection**. Click **Send test email** and verify receipt.

Netlify variable names are case-sensitive. The existing `Sixteen_Oaks_Secret_Key` spelling is also supported when `SIXTEEN_OAKS_SECRET_KEY` is absent. Readiness checks, credential saving, and delivery all use the same key lookup. The uppercase name takes precedence if both exist. Keep using the existing value; adding a different key after saving email credentials would make those passwords unreadable.

Inquiries save to the Inbox even before SMTP is connected. The UI shows email delivery as unconfigured or failed when appropriate. No test emails are sent automatically during deployment or tests.

## Add work examples

1. Open **Our work → Add project**.
2. Enter a name and a unique lowercase project address. The address becomes fixed after the first save to preserve links.
3. Fill out the introduction, summary, business and project types; upload a cover image and write its accessibility description. Add the optional live website URL, case study sections, service list, and up to six gallery images.
4. Save as **Draft** while editing. Drafts do not appear in the public list or at their project URL.
5. Choose **Published** and save to display the project. Set the order number to arrange examples. Choose one published project for the homepage, or None.

Up to 100 projects are supported. Images must be JPG, PNG, or WebP under 2 MB. Removing a project hides its page after saving. Uploaded images have unguessable public URLs; do not upload confidential material. Unreferenced images remain stored, allowing recovery; automatic media cleanup is not included.

## Contact settings and inbox

- **Public email** updates the email links displayed on every public page.
- **Notification email** is where new inquiry alerts are sent when delivery is enabled.
- **SMTP sender/account** is the authorized sending mailbox; it may differ from the recipient.
- **Inbox** stores incoming messages and their notification status. Mark entries New, Read, or Archived, and use their email link to reply.
- Website content and SMTP settings have separate save buttons. Unsaved changes prompt before leaving. Save conflicts prevent an older session from overwriting a newer saved version; reload before continuing.

## Preview and production

Production uses `sixteen-oaks-live`, which persists across production deployments. Deploy previews share a stable review store, `sixteen-oaks-preview-6aa56e2f692ceb00088cc1fc`, and display a clear preview banner. This preserves the workspace where project entry began; the identifier is not a credential. Preview edits, uploaded images, email connection, and test inquiries do not affect production. A new preview deployment preserves saved projects, images, settings, and inquiries. Other branch deployments remain isolated by deploy ID. The September 16, 2026 launch copies the reviewed preview content, referenced uploaded images, and encrypted mail connection once into an empty production workspace. It copies media bytes into the live store so the same relative image addresses resolve there. Draft projects stay private. Test inquiries, request counters, and form-signing keys are excluded. Production and preview remain separate after this initial transfer; future preview edits do not change the live website.

The existing Ray's example is the seed content for a workspace that has not been edited. Once saved, admin content is authoritative; changing the seed file does not overwrite saved content.

## Implementation and verification

- `src/content/`: data model, seed, and server validation.
- `src/admin/`: private React UI using `@netlify/identity`.
- `netlify/functions/admin.ts`: authenticated content, mail, upload, and inbox API.
- `site.ts`: complete server-rendered public HTML with current content.
- `inquiries.ts`: rate-limited, signed, idempotent submissions that save before sending.
- `media.ts`: uploaded public images; only administrators can upload.
- `.build/template.html`: generated Vite HTML shell included in the site function.

`npm test` checks access controls, origin checks, draft visibility, persistence and conflicting saves, input validation, credential encryption/redaction, form-token validation, duplicate submissions, and preview isolation using an in-memory storage fixture. `npm run build` checks types, public pages, assets, navigation, and unchanged OrbitDesk files. These tests do not prove the real Identity account or SMTP provider works: verify login and send a delivery test after activation.

`npm run dev` previews public templates and the admin shell. Use a Netlify deployment for Identity, Blobs, and end-to-end form testing. `npm run preview` serves static build output; its forms do not have runtime signing tokens.

## AI Opportunity Finder

The homepage includes the AI Opportunity Finder at `/#ai-opportunity`. Visitors choose a business type and describe a recurring task. A Netlify Function uses `gpt-4.1-mini` through Netlify AI Gateway to generate a short suggestion and three steps. The fixed example is explicitly labeled and makes no model request.

On eligible Netlify credit-based plans, the gateway supplies `OPENAI_BASE_URL` and `OPENAI_API_KEY` automatically. See [Netlify AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/). If gateway credentials are unavailable, the UI reports that personalized suggestions are unavailable and offers the example/contact route. It never substitutes the example as a generated response. Do not put provider credentials in browser code or Vite variables.

The endpoint allows three requests per minute per IP, plus 100 model attempts per UTC day per workspace. It caps input/output lengths and model response time, validates responses, and fails closed when the usage counter cannot be reserved. Gateway requests consume the site's Netlify AI credits. Set `SIXTEEN_OAKS_AI_ENABLED=false` in Functions-scoped environment variables and redeploy to disable personalized generation. Preview usage is isolated from production.

Descriptions are sent to the AI provider through Netlify; the form tells visitors to omit confidential details. Sixteen Oaks does not save finder prompts/results as a separate history. Only usage counts are stored. Clicking “Explore this with Kevin” adds the idea to the contact message for review; only submitting that contact form saves an inquiry and triggers configured notifications.

Admin access does not require a Netlify role. A verified session and an email on the server allowlist are required. If the Identity SDK only supplies JWT claims without the confirmation date, the server checks the actual user-session cookie against the same site’s Identity `/user` endpoint before authorizing access. Invalid, expired, unconfirmed, or non-allowlisted accounts remain denied.

The admin has Save website changes controls above and below the editor, in the page flow so hosting preview toolbars cannot cover a fixed bottom save bar. Fill required image descriptions before saving published content.

## Approved Main Street homepage

Use `/admin/` on the selected Main Street preview (PR #4) for all edits going forward. The **Homepage** tab opens first and manages the opening copy and oak image, four service summaries, Main Street copy/photo/caption, and countryside closing banner. The teal/copper layout and link destinations remain consistent. **Save website changes**, then **View website** to review the saved result. No rebuild is needed for these content edits.

The footer includes a **Website admin** link. It opens the existing protected sign-in page; admin authorization has not changed. Use the same invited account. **Our work**, **Contact & email**, and **Inbox** remain in this admin. The selected published featured project appears between the Main Street section and closing banner; choose **None** to omit it.

Older workspaces use the approved homepage defaults until homepage content is saved; reading the workspace does not write or reset projects/settings. New homepage fields use the existing content record and conflict protection. When a client omits the homepage fields, this updated API preserves the saved homepage. Older comparison deployments still run older code, so use the PR #4 admin rather than editing through PR #2 or #3.


## Production launch transfer

`netlify/functions/_shared/launch.ts` initializes only the dedicated Sixteen Oaks site ID in the production deploy context. It freezes a private launch snapshot, verifies that the existing production encryption key can read the saved mail password, copies referenced media in bounded batches, and writes content only after those dependencies are ready. Conditional writes preserve an existing production workspace and allow an interrupted transfer to resume without resetting newer edits. No passwords or encryption keys are returned to clients or written to GitHub. The private `launch-2026-09-16/complete` record identifies a completed copy; the snapshot remains available for recovery.

The public renderer and authenticated admin wait for initialization. A missing image or encryption key prevents publishing partial content; correct the missing dependency and retry the request. This is a one-time launch, not a permanent fallback to preview data. Once the launch has been verified, the initializer may be retired in a later cleanup without deleting production content.

Business-domain configuration: DreamHost keeps DNS and mail forwarding. The apex uses an ALIAS to `apex-loadbalancer.netlify.com`; `www` uses a CNAME to `sixteenoaks.netlify.app`. Both names are attached to the existing Sixteen Oaks Netlify project. Manage the website at `/admin/` on the live domain after production deployment and HTTPS activation.
