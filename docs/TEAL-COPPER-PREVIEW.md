# Teal/copper visual comparison

Preview PR #4 is based on the current PR #2 teal/copper branch. It targets main only to run the existing CI and Netlify deploy-preview workflow. Keep it draft until the underlying work and design direction are approved. Public production is not updated by this review.

The first pass applied six refinements to the existing hero. Kevin then supplied a preferred full-page mockup. The second pass adopts its composition: a compact hero with a tall arched oak image and decorative side note, four linked service summaries, a Main Street photo and cream copy panel, and a countryside closing banner. The working AI finder and inquiry form follow this presentation. Existing public routes, admin functionality, saved preview data, and OrbitDesk update URLs are preserved.

Services and About are clearer navigation labels for the existing services and approach routes. Our Work remains the destination for the existing portfolio. No placeholder Industries or Resources destinations or unverified social profiles were added.

Two illustrative website photographs were generated with the built-in image-generation tool and optimized as WebP assets. They are not presented as photographs documenting a specific Wisconsin location or customer:

- `public/assets/main-street-preview.webp`: square editorial photograph of a Midwestern Main Street sidewalk, historic red brick storefronts on the right, mature trees on the left, dark awnings, flower pots, warm late-afternoon light, no readable signs or logos.
- `public/assets/countryside-preview.webp`: panoramic southwestern-Wisconsin-inspired rolling fields and wooded hills at sunset, distant haze, amber sun near the right horizon, deep green foreground, no text or graphical overlays.

The existing supplied logo and oak photograph remain in use. The header logo's proportions are preserved. Layout is responsive, with two service columns and stacked photo/copy sections on narrow screens. Existing system and footer motion controls remain available.

Validation: npm run build includes TypeScript, client/server builds, complete HTML generation, assets/anchor validation, and OrbitDesk file preservation. GitHub also runs the existing npm test suite. Visual review is performed on the deployed preview.
