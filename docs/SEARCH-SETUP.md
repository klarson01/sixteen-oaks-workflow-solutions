# Search setup for Sixteen Oaks

The preferred public origin is `https://sixteenoaksllc.com`. Search metadata is generated from the same saved content as the page. Public email and phone edits update the business schema automatically.

## Implemented on the website

- Each existing public page and published project has one absolute canonical URL and matching `og:url`. Smooth page navigation updates these tags and the JSON-LD together.
- Facebook, LinkedIn, text-message previews, and X cards use the 1200 × 630 branded image at `/assets/sixteen-oaks-social-share.jpg`. Open Graph and X titles and descriptions follow the current page metadata, including published project pages.
- Organization, WebSite, WebPage/AboutPage/CollectionPage, and breadcrumb JSON-LD describe the actual business and visible pages. The city/state are public; no street address, business hours, ratings, social profile, or legal registration status is invented. Organization markup does not claim a verified Google Business Profile or promise rich results.
- `/sitemap.xml` reads current saved production content, includes published projects, and omits drafts, admin, API routes, and preview URLs. It updates without rebuilding. No guessed modification dates are supplied. A storage failure returns 503 instead of a misleading partial sitemap.
- `/robots.txt` advertises the sitemap. Public uploaded images remain crawlable. The admin sign-in remains crawlable so its existing noindex directive can be discovered; server authorization protects private data.
- Preview/branch public HTML sends noindex in both metadata and HTTP headers. Preview robots disallows crawling and preview sitemaps contain no URLs. These are indexing controls, not access controls.
- Public marketing pages on the old Netlify hostname redirect to the business domain. Admin, Identity, API, and OrbitDesk routes retain their existing behavior. Unknown pages and private project URLs remain 404/noindex.

## Account activation

Website metadata does not verify ownership or submit a site to a search account. These steps must be completed in Kevin's accounts:

1. In [Google Search Console](https://search.google.com/search-console), select an existing Sixteen Oaks property or add the Domain property `sixteenoaksllc.com`.
2. If Google requests verification, copy its exact TXT verification record to this domain's DreamHost DNS. Preserve existing website and email records. A DNS verification token is public proof-of-ownership data; never substitute an app password or API key.
3. After verification, submit `https://sixteenoaksllc.com/sitemap.xml` and inspect the homepage and a published case study. Record the result; publication and sitemap acceptance do not guarantee indexing or rankings.
4. In [Bing Webmaster Tools](https://www.bing.com/webmasters/), select/add this site and verify it using Bing's supported method, or import its verified Google Search Console property if Kevin chooses that connection. Submit the same sitemap and inspect indexing.
5. Check for an existing Sixteen Oaks Google Business Profile before creating one. Confirm in-person customer contact, service area, hours, category, and whether customers visit the address. Use a service-area profile with a hidden address if it accurately describes the business. An online-only business is not eligible. Verification may require Kevin's participation.

No account ownership or directory listing should be reported as verified until the provider confirms it. Keep Sixteen Oaks isolated from Ray's, the Larson Home Team, and Aethralion.

## Verification

Run `npm test` and `npm run build`. After deployment, check the sitemap against the current published project list, parse JSON-LD, confirm canonical URLs during navigation, check production versus preview indexing directives, and verify the admin and OrbitDesk URLs still respond normally.

References: [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [Organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization), [ownership verification](https://support.google.com/webmasters/answer/9008080), [Business Profile eligibility](https://support.google.com/business/answer/13762416).
