import { rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const canonical = 'https://www.nikvisuals.de';
const routes = [
  { path: '/', lang: 'de', indexable: true, title: 'NikVisuals — AI, Growth & Marketing | Niklas Brüne', description: 'NikVisuals von Niklas Brüne: AI, Growth und Marketing für ambitionierte B2B-Unternehmen. Research, Workflows, Go-to-Market und Content.' },
  { path: '/en/', lang: 'en', indexable: true, title: 'NikVisuals — AI, Growth & Marketing | Niklas Brüne', description: 'NikVisuals by Niklas Brüne: AI, growth and marketing for ambitious B2B companies. Research, workflows, go-to-market and content.' },
  { path: '/links/', lang: 'de', indexable: false }, { path: '/en/links/', lang: 'en', indexable: false },
  { path: '/videos/', lang: 'de', indexable: true, title: 'NikVisuals — Videoarbeiten, Projekte & Testimonials', description: 'Ausgewählte Videoarbeiten von NikVisuals: Kundenprojekte, Produktionen, Testimonials und eigene Formate.' },
  { path: '/en/videos/', lang: 'en', indexable: true, title: 'NikVisuals — Video Work, Projects & Testimonials', description: 'Selected video work by NikVisuals: client projects, productions, testimonials and original formats.' },
  { path: '/impressum/', lang: 'de', indexable: false }, { path: '/datenschutz/', lang: 'de', indexable: false },
] as const;

const routeFor = (path: string) => routes.find((route) => route.path === path) ?? routes[0];
const socialTags = (route: typeof routes[number], production: boolean) => {
  if (!route.indexable || !route.title || !route.description) return '';
  const locale = route.lang === 'de' ? 'de_DE' : 'en_US';
  const alternate = route.lang === 'de' ? 'en_US' : 'de_DE';
  const image = `${canonical}/images/nikvisuals-social-preview.jpg`;
  const url = production ? `<meta property="og:url" content="${canonical}${route.path}" />` : '';
  return `<meta property="og:title" content="${route.title}" /><meta property="og:description" content="${route.description}" /><meta property="og:type" content="website" />${url}<meta property="og:site_name" content="NikVisuals" /><meta property="og:locale" content="${locale}" /><meta property="og:locale:alternate" content="${alternate}" /><meta property="og:image" content="${image}" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content="NikVisuals — Niklas Brüne" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${route.title}" /><meta name="twitter:description" content="${route.description}" /><meta name="twitter:image" content="${image}" /><meta name="twitter:image:alt" content="NikVisuals — Niklas Brüne" />`;
};

function siteMode(production: boolean): Plugin {
  return {
    name: 'nikvisuals-site-mode',
    transformIndexHtml(html, ctx) {
      const path = ctx.path.replace(/index\.html$/, '').replace(/\/+/g, '/');
      const route = routeFor(path);
      const robots = production && route.indexable ? 'index,follow' : production ? 'noindex,follow' : 'noindex,nofollow,noarchive';
      const dePath = route.path.startsWith('/en/') ? route.path.replace('/en', '') : route.path;
      const enPath = route.path.startsWith('/en/') ? route.path : `/en${route.path}`;
      const alternates = production && route.indexable
        ? `<link rel="alternate" hreflang="de" href="${canonical}${dePath}" /><link rel="alternate" hreflang="en" href="${canonical}${enPath}" /><link rel="alternate" hreflang="x-default" href="${canonical}${dePath}" />`
        : '';
      const schema = production && route.path === '/'
        ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [
          { '@type': 'Person', name: 'Niklas Brüne', url: `${canonical}/`, jobTitle: 'Founder, NikVisuals', sameAs: ['https://www.linkedin.com/in/niklas-br%C3%BCne-b61877243/', 'https://www.instagram.com/nikvisualsmedia/', 'https://www.youtube.com/@nikvisualsmedia/'] },
          { '@type': 'WebSite', name: 'NikVisuals', url: `${canonical}/` },
        ] })}</script>`
        : '';
      const canonicalTag = production ? `<link rel="canonical" href="${canonical}${route.path}" />` : '';
      const metadata = `${canonicalTag}${alternates}${socialTags(route, production)}${schema}`;
      return html
        .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
        .replace(/<link rel="canonical"[^>]*>\s*/g, '')
        .replace(/<link rel="alternate"[^>]*>\s*/g, '')
        .replace(/<meta property="og:[^"]+" content="[^"]*"\s*\/>\s*/g, '')
        .replace(/<meta name="twitter:[^"]+" content="[^"]*"\s*\/>\s*/g, '')
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '')
        .replace('</head>', `${metadata}</head>`);
    },
    async closeBundle() {
      const robots = production
        ? `User-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: ${canonical}/sitemap.xml\n`
        : 'User-agent: *\nDisallow: /\n';
      await writeFile('dist/robots.txt', robots);
      if (!production) {
        await rm('dist/sitemap.xml', { force: true });
        await rm('dist/llms.txt', { force: true });
        return;
      }
      const urls = routes.filter((route) => route.indexable).map((route) => `  <url><loc>${canonical}${route.path}</loc></url>`).join('\n');
      await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
      await writeFile('dist/llms.txt', `# NikVisuals\n\nNikVisuals by Niklas Brüne: AI & Prozesse, Growth, GTM & Business Development, and Marketing & Content for B2B companies.\n\n- Website: ${canonical}/\n- English: ${canonical}/en/\n- Selected projects: ${canonical}/#arbeiten\n- Video archive: ${canonical}/videos/\n- Contact: mailto:info@nikvisuals.de\n`);
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/nikvisuals-de/';
  if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('VITE_BASE_PATH must start and end with /');
  return {
    base,
    plugins: [react(), tailwindcss(), !isSsrBuild && siteMode(env.SITE_MODE === 'production')],
    build: { rollupOptions: isSsrBuild ? {} : { input: {
      de: resolve('index.html'), en: resolve('en/index.html'), links: resolve('links/index.html'), enLinks: resolve('en/links/index.html'), videos: resolve('videos/index.html'), enVideos: resolve('en/videos/index.html'), impressum: resolve('impressum/index.html'), datenschutz: resolve('datenschutz/index.html'),
    } } },
  };
});
