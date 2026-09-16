# Status

## Implemented

- Responsive German and English homepages, link hubs and static `/videos/` and `/en/videos/` archives.
- Default solo Hero with manual `?hero=1`, `?hero=2` and `?hero=3` previews, plus image focal-point rules for the IHK workshop case.
- Three expandable current-focus rows with pre-rendered details, a concise study/practice bridge and timeline.
- One unified four-card project grid (SMS group, IHK Siegen, LapStore and Tech Meets Problems), followed by a single ambient Media & Production panel; the collaboration logos remain a manually scrollable proof strip.
- All 34 supplied YouTube destinations audited for reachability and public metadata, including the verified Tech Meets Problems event recap. Each has a local WebP thumbnail, source title, shorter portfolio title, category and factual DE/EN summary in `src/content/videos.ts`.
- The video archive is grouped into seven anchor-linked sections with B2B & Corporate first. A local consent choice is required before an in-site YouTube player is created; direct YouTube links remain available without it.
- A compact homepage internship panel sits between About and Contact. Its eight career videos are mounted only after the visitor expands it; they are separate from the 34-video archive. At go-live, map legacy Wix `/karriere` to `/#praktikum` in the redirect plan (no redirect exists yet).
- The review strip uses eight supported summaries only and reserves space for its cards on mobile. Collaboration and review strips use native scrolling, visible controls and reduced-motion support.
- Dark-by-default theme with saved light choice, local email-preparing form and preview safety.
- Native `/impressum/` and `/datenschutz/` routes, plus a production-only root-path build that generates route-specific robots, canonical/hreflang, Open Graph/Twitter metadata, structured data, sitemap and `llms.txt`. The normal Pages build remains noindex.

## Temporary/placeholders

- The form is intentionally local; direct email is the active contact route.

## Genuine blockers

None for this preview.

## Next highest-value steps

1. Reverify the Google rating and review count before production launch.
2. Recheck external YouTube titles and availability periodically.
3. Choose production hosting and complete domain migration only with explicit launch authorization.
