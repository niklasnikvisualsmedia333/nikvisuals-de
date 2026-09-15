# NikVisuals

A concise German/English preview of the next NikVisuals website, by Niklas Brüne. Current areas of work are explicitly separated from previous client projects.

- Repository: https://github.com/niklasnikvisualsmedia333/nikvisuals-de
- German preview: https://niklasnikvisualsmedia333.github.io/nikvisuals-de/
- English preview: https://niklasnikvisualsmedia333.github.io/nikvisuals-de/en/
- German link hub: https://niklasnikvisualsmedia333.github.io/nikvisuals-de/links/
- English link hub: https://niklasnikvisualsmedia333.github.io/nikvisuals-de/en/links/

## Local development

Prerequisites: Node 22.12+ (Node 22 recommended; `.nvmrc` provided) and npm.

```sh
npm ci
npm run dev
```

Open the printed URL, including `/nikvisuals-de/`.

```sh
npm run build
npm run preview
```

Build checks TypeScript, builds client and temporary server bundles, prerenders all six language/page entries into static HTML, removes the temporary server output and verifies preview safety and local asset paths. `dist/index.html`, `dist/en/index.html`, `dist/links/index.html`, `dist/en/links/index.html`, `dist/videos/index.html` and `dist/en/videos/index.html` are independently loadable; no history fallback is needed. React hydrates the prerendered page for the mobile menu and local form validation. Most page functionality works without JavaScript.

## Editing

- `src/content/site.ts`: German/English content, projects and verified social links.
- `src/content/videos.ts`: audited YouTube titles, categories, factual summaries and local thumbnail mapping.
- `src/pages/Home.tsx`: shared page composition.
- `src/pages/Links.tsx`: shared mobile-first link hub.
- `src/styles/global.css`: responsive design and tokens; Tailwind 4 is integrated through Vite.
- `public/images`: small local prototype image set.
- `index.html`, `en/index.html`: language-specific metadata.
- `AGENTS.md`: permanent content, implementation and safety boundaries.

No backend, analytics, external font request, embedded videos or secrets. Manrope is served from `public/fonts`. The contact form validates locally and prepares a `mailto:` only after the visitor chooses to continue; it does not store or transmit form data itself. Delivery happens in the visitor's email app. TODO: add an explicitly approved endpoint and privacy review before enabling direct delivery. The preview includes a short hosting/privacy notice; the legal notice links to the existing NikVisuals website.

## Deployment

GitHub Pages is configured with GitHub Actions as its source. Pushing `main` runs `.github/workflows/deploy.yml`: Node 22, `npm ci`, build/verification, Pages artifact upload and deployment. Only `dist` is published. The `github-pages` environment exposes the deployment URL. To retry, run the Deploy preview workflow from Actions.

## Base path and a later production launch

The default base is `/nikvisuals-de/`. A later root-path build can use:

```sh
VITE_BASE_PATH=/ npm run build
```

Change the workflow's `VITE_BASE_PATH` at the same time. This does NOT change noindex or connect a domain. A production launch is a separate, explicitly authorized task: review legal/privacy content and study/exchange wording; then configure production metadata (canonical, hreflang, Open Graph URL, sitemap, robots), hosting and root/www redirects. Do not add a CNAME or change DNS, Wix or Microsoft 365 during preview work.

GitHub Pages serves this robots.txt at the project path; crawlers normally consult the host-root robots.txt. The meta robots directive embedded in **both rendered pages** is the operative noindex safeguard for the project preview. Noindex is not access control; this preview is public.

## Verification

`npm run build` runs `scripts/verify-build.mjs`. It checks all static routes, one H1 on each homepage, the required static routes and video library, noindex, email CTA, working language/asset paths, preview robots and no CNAME. Follow this with a browser check of mobile/desktop layout and interactions after meaningful UI changes. See `docs/STATUS.md` for the verified prototype state.
