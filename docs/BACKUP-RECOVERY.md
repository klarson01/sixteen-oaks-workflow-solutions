# Sixteen Oaks backup and recovery

GitHub is the source of truth for website code. The private **Backup & recovery** section in `/admin/` protects the mutable information stored in the Sixteen Oaks Netlify Blobs workspace.

## What the backup contains

The dated ZIP contains:

- `manifest.json`: format version, creation time, source environment, counts, image filenames, sizes, types, and SHA-256 integrity checks;
- `content.json`: homepage settings, contact settings, published projects, and drafts;
- `mail.json`: SMTP configuration and the password ciphertext, never the readable password;
- `inquiries.json`: saved inquiries, their statuses, and notification results; and
- `media/`: all admin-uploaded JPG, PNG, and WebP files, including currently unreferenced images.

The ZIP deliberately excludes the Netlify encryption key, administrator accounts, environment variables, Identity configuration, GitHub credentials, DreamHost access, DNS records, form-signing keys, rate-limit counters, AI usage counters, and deployment history.

Because inquiries contain personal information, keep backup ZIPs in a private, access-controlled location. Do not email them or place them in the public GitHub repository.

## Create a backup

1. Open `https://sixteenoaksllc.com/admin/` and sign in with an invited, allowlisted account.
2. Save or reload any unsaved website or email changes.
3. Open **Backup & recovery**.
4. Select **Download backup** and keep the dated ZIP in the approved private location.
5. Create a fresh backup after meaningful website changes and at least monthly while inquiries are being collected.

The browser downloads each image through an authenticated endpoint and builds the ZIP locally. The encryption key never leaves Netlify.

## Restore a backup

1. Open **Backup & recovery** in the workspace that should receive the data. Production and deploy previews remain separate.
2. Choose the dated Sixteen Oaks ZIP. Choosing it does not change saved data.
3. Review the source date and the before/after counts for projects, inquiries, and images.
4. Confirm whether the target is the live website or a preview workspace.
5. Type `RESTORE`, accept the final confirmation, and wait for completion.
6. Reload the public website and verify the homepage, Our Work pages, contact details, Inbox, images, and email connection. Send a test email from **Contact & email**.

The server validates the backup schema, website content, inquiries, image signatures, sizes, and SHA-256 checksums. It also verifies that the encrypted SMTP password opens with the site's current encryption key. Images are staged before content changes. If any saved website data changes after the preview, the restore stops and requires a new review.

A successful restore replaces the backed-up content, mail settings, inquiries, and uploaded media. Records absent from the backup are removed only after the validated replacement is ready. The operation does not change code, Identity accounts, environment variables, domains, or DNS.

## Encryption-key recovery

The case-sensitive production variable currently in use is `Sixteen_Oaks_Secret_Key`. Preserve its exact value separately in an approved password manager. Never add it to a ZIP, documentation, source control, support message, or screenshot.

The encrypted email password in a backup can only be restored while the same key is configured. If the key is lost, create a new 32-byte base64 key in Netlify, redeploy, and re-enter the Gmail app password in **Contact & email**. Website content, images, and inquiries remain independent of the SMTP password, but a backup containing ciphertext from the lost key must not be used until the email configuration is removed or recreated by the website administrator.

## Full-site disaster recovery order

1. Recover `klarson01/sixteen-oaks-workflow-solutions` from GitHub and deploy it to the dedicated Sixteen Oaks Netlify project.
2. Restore the Netlify environment variables from the approved password manager, especially `Sixteen_Oaks_Secret_Key` and the administrator allowlist.
3. Enable invite-only Identity and confirm the administrator account.
4. Verify the Netlify project on its temporary hostname before changing DNS.
5. Restore the latest ZIP through `/admin/` and complete the verification checklist above.
6. Confirm the business domain, HTTPS, DreamHost DNS, sitemap, admin sign-in, inquiry saving, and test-email delivery.

Do not point the business domain at a replacement deployment until its admin access, restored content, forms, and images have been verified.

## Automated verification

`npm test` exercises an isolated backup → harmless saved change → restore cycle. It confirms complete replacement, encrypted-password redaction and recovery, image integrity, explicit confirmation, removal of records absent from the backup, preview/production isolation, and refusal to restore after a concurrent change. `npm run build` type-checks and validates the complete public and admin bundles.
