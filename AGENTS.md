# NikVisuals implementation guardrails

## Product
Build a concise, premium, founder-led digital business card for NikVisuals by Niklas Brüne. Visitors should understand it in about three minutes and consume it in under five. Keep content sparse; remove rather than add sections. German is primary. Preserve the neutral editorial direction, generous spacing and restrained interactions.

## Stack and delivery
React 19, TypeScript, Vite 7, Tailwind CSS 4, npm, Node 22 (22.12+). Use the lockfile, `npm ci`, `npm run dev`, `npm run build`, `npm run preview`. Build includes type checking, static prerendering and deployment checks. No extra testing frameworks for straightforward UI.

Repository: niklasnikvisualsmedia333/nikvisuals-de. Default branch: main. This standalone prototype uses a small number of meaningful commits; don't introduce PR/branch ceremony unless requested. GitHub Actions publishes `dist` to Pages. Never deploy `.prerender` or source files as an artifact.

Default base: `/nikvisuals-de/`; `VITE_BASE_PATH` changes it. All local URLs must use `import.meta.env.BASE_URL` or `%BASE_URL%`. `/` and `/en/` are language routes relative to that base. They have separate HTML entries, rendered through the same Home component. Both languages must direct-load without SPA fallback and remain readable without JavaScript. Show language links only when both work. Metadata lives in the two HTML entries; keep it consistent with content.

## Content and honesty
Important editable copy lives in `src/content/site.ts`. Exactly three current areas: AI & Prozesse; Growth, GTM & Business Development; Marketing & Content. These are selected-project capabilities, not packages or pricing. Automation means existing tools, integrations and no-code/low-code workflows, not custom software engineering. Do not position the brand as a software agency, large consultancy or anonymous team. Avoid artificial “Wir”; use first person for About.

Current offer and historical evidence MUST remain separate. No client-logo strip beneath AI/Growth claims. Keep the qualifying introduction to previous work. Exactly four main cases:
- LapStore: long-running product content; later competitor research, B2B strategy and Business Development.
- SMS group: repeated corporate, industrial and event media production; complexity and sometimes short timelines. No AI, growth consulting or software implication.
- Stadt Hilchenbach: drone/content work for tourism and city marketing, social/distribution, organic reach and regional media attention. No invented numbers.
- IHK Siegen: practical social media, content and smartphone-video workshops.

Never invent clients, services delivered, results, metrics, quotes, awards, credentials or partnerships. Don't repurpose client names as proof of newer AI services. Study background and practical experience explain the wider perspective: self-employed client work since 2021, M.Sc. studies Entrepreneurship & SME Management at Universität Siegen, business exchange at University of Tulsa, academic AI/digital-marketing work. Do not imply a completed degree without confirmation. Review time-sensitive exchange wording before future publication.

## Confidentiality
Only general AI use cases, process analysis, knowledge work, existing-tool prototypes and human oversight may be described. Never identify or investigate the confidential AI/process engagement. No organization/project names, logos, screenshots, internal data, exact workflows, metrics or identifiable details in the site OR public repository.

## Scope and safety
This is a public PREVIEW, always `noindex,nofollow` (currently also noarchive). Preserve preview robots.txt. No production canonical, production sitemap, production CNAME or custom domain. DNS, Wix, Microsoft 365 and email configuration are outside authorization. Do not change them. A future production launch requires explicit authorization before changing these constraints.

Contact is `mailto:info@nikvisuals.de`. No fake form/backend/success flow. No CMS, database, analytics, cookies, authentication, frontend secrets, heavy animation libraries or third-party font requests. Never commit credentials or `.env` files. No unrelated repository changes.

## Assets, accessibility and verification
Use suitable public NikVisuals-owned assets with local optimized copies; record every source and intended use in `docs/ASSET_SOURCES.md`. Don't scrape the whole Wix site, download many alternatives, use random stock, fabricate logos or associate unrelated imagery with a client. Neutral typographic artwork is permitted when appropriate real assets aren't readily available. Video posters link to verified video URLs; do not load video embeds by default.

Use system/self-hosted fonts, semantic landmarks/headings, meaningful alt text, reserved image dimensions, lazy loading below the fold, visible focus, keyboard-operable menus, adequate contrast, touch targets and reduced-motion support. Check around 390px and 1440px, direct EN loading, image loading, anchor/menu behavior and console errors. The build checks noindex, four cases, language output and base-path asset resolution. Review all final copy for overclaims. Keep git clean after committing and pushing authorized work.

## Documentation
README: how to run/build/deploy and change the base later. PROJECT_BRIEF: durable product summary. STATUS: only implemented, temporary/placeholders, genuine blockers, next highest-value steps. ASSET_SOURCES: provenance. Keep these useful, concise and current; no work diary.
