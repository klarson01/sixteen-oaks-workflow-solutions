# Midnight Brass visual preview

This review branch is based on the admin and AI Opportunity Finder branch. It presents the existing public pages in the proposed Midnight Brass identity. It is not approved for production.

- Grounds: `#070806`, `#10130f`, and `#1d2320`.
- Brass: `#b78a43`, highlight `#e8c384`, shadow `#7d5a25`.
- Gradient: 118 degrees, `#7d5a25 → #e8c384 → #b78a43 → #f3dcae → #9a6f30 → #dcb774`.
- Type: warm white `#f0e9dc`, secondary brass `#9c8a6e`, Cormorant Garamond headings.
- The original supplied horizontal and stacked PNGs are preserved. CSS frames their artwork without altering proportions or modifying the source files.
- Public content, routes, motion, forms, and portfolio behavior are retained. Admin code and saved content are unchanged. Deploy previews currently share the existing preview content store, so use the original preview admin for content editing.

Run `npm run build` before review. Compare this draft with PR #2; merge only after the visual direction is approved.

PR #3 targets `main` to activate the repository's existing CI and Netlify preview workflow. It includes PR #2 and must remain a draft until that work and this visual direction are approved. The public theme can be reviewed independently from the nine-file branding commit.
