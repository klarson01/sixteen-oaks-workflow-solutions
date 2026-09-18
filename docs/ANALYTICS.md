# Sixteen Oaks visitor and lead analytics

The private **Analytics** section in `/admin/` reports website activity without adding an advertising tracker or third-party analytics account.

## What is measured

- anonymous daily sessions;
- public page views and popular pages;
- the referring website for the first visit in a daily session, reduced to a source label such as Direct, Google, Bing, Facebook, or LinkedIn;
- contact-form starts, email-link clicks, and phone-link clicks; and
- completed website inquiries, counted from successfully saved Inbox records.

The dashboard offers 7-, 30-, and 90-day reporting periods. Inquiry conversion is completed website inquiries divided by anonymous sessions for the selected period.

## Privacy design

The public site uses no analytics cookies and sends data only to its own `/api/analytics` endpoint. It does not store IP addresses, full referring URLs, user-agent strings, names, email addresses, device profiles, or cross-site identifiers. Browsers with Do Not Track or Global Privacy Control enabled do not send analytics events.

The browser creates a random session value in `sessionStorage`. The server immediately converts it to a one-way, workspace-specific hash that changes with the business date. Only that shortened daily hash is stored, so it cannot be used to follow a visitor across days. Referral data is reduced to a hostname or a recognized source label before storage.

Daily aggregates are retained for 400 days. A scheduled production function removes older daily records. Deploy-preview analytics use the separate preview Blob store and never appear in live reporting.

## Operating notes

1. Sign in at `https://sixteenoaksllc.com/admin/` and open **Analytics**.
2. Choose the last 7, 30, or 90 days.
3. Use **Refresh** for the latest saved aggregates.
4. Compare sessions, page views, inquiries, conversion, lead actions, popular pages, and traffic sources.

Analytics begins when the feature is deployed; it does not reconstruct earlier traffic. Search Console remains the authoritative source for Google indexing and search-query data.

Analytics aggregates are operational reporting data and are not included in the website backup ZIP. The backup continues to protect website content, images, email settings, and customer inquiries. Code is recovered from GitHub, while recent analytics can begin collecting again after a replacement deployment.

## Verification

`npm test` confirms same-origin enforcement, bot exclusion, daily session de-duplication, page-view totals, source classification, contact actions, inquiry conversion, preview isolation, and the absence of personal identifiers in the admin response. `npm run build` type-checks and validates both public and admin bundles.
