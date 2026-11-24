# Business Acquisition Intelligence product separation

Date: 2026-11-24. Authorization: Kevin agreed to a dedicated product front door, retaining shared infrastructure.

Corporate branch: feat/business-acquisition-product. Adds a complete prerendered product landing page, catalog card, acquisition contact topic, navigation/SEO/sitemap integration and property-only suite counts. Existing acquisition links and saved-record types remain compatible.

Validation: npm run build and npm test passed. Build validates all public routes, local assets, anchors, canonical/social metadata and active navigation. Search tests cover acquisition routing and catalog discovery.

Workspace canonical source: Sites appgprj_6ae8a99b9c648191a606a253f468a0c1. Production release owner-direct-account-creation-v1, deploy 6afcc8e346f0c03492fe55f0, verified through the live release marker and hosting dashboard. Live admin update is absent from canonical source. Presentation release must use the downloaded live deploy as its baseline and replace only portal index, portal.js, acquisition index and shared/acquisition-account.js. Do not redeploy the older admin assets or gateway from canonical source.

No separate billing, entitlement, account/database migration or DNS change. Current shared trial and usage controls remain unchanged. Rollback: revert corporate PR and republish prior workspace deploy.
