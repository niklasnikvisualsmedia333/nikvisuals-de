# NikVisuals

A concise German/English preview of the next NikVisuals website, by Niklas Brüne. Current areas of work are explicitly separated from previous client projects.

- Repository: https://github.com/niklasnikvisualsmedia333/nikvisuals-de
- German preview: https://niklasnikvisualsmedia333.github.io/nikvisuals-de/
- English preview: https://niklasnikvisualsmedia333.github.io/nikvisuals-de/en/

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

Build checks TypeScript, builds client and temporary server bundles, prerenders both languages into static HTML, removes the temporary server output and verifies preview safety and local asset paths. `dist/index.html` and `dist/en/index.html` are independently loadable; no history fallback is needed. React hydrates the prerendered page for the mobile menu. Most page functionality works without JavaScript.

## Editing

- `src/content/site.ts`: German/English content, projects, verified social/video links.
- `src/pages/Home.tsx`: shared page composition.
- `src/styles/global.css`: responsive design and tokens; Tailwind 4 is integrated through Vite.
- `public/images`: small local prototype image set.
- `index.html`, `en/index.html`: language-specific metadata.
- `AGENTS.md`: permanent content, implementation and safety boundaries.

No backend, analytics, external fonts, embedded videos or secrets. The contact form is a local validation-only preview: it prevents submission, does not send/store data, and points visitors to email. TODO: add an explicitly approved endpoint and privacy review before enabling delivery. The preview includes a short hosting/privacy notice; the legal notice links to the existing NikVisuals website.

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

`npm run build` runs `scripts/verify-build.mjs`. It checks both static routes, one H1 per page, exactly four cases, noindex, email CTA, working language/asset paths, preview robots and no CNAME. Follow this with a browser check of mobile/desktop layout and interactions after meaningful UI changes. See `docs/STATUS.md` for the verified prototype state.
