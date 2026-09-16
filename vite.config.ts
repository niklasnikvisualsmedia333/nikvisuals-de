import { rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const canonical = 'https://www.nikvisuals.de';
const routes = [
  { path: '/', lang: 'de' }, { path: '/en/', lang: 'en' },
  { path: '/links/', lang: 'de' }, { path: '/en/links/', lang: 'en' },
  { path: '/videos/', lang: 'de' }, { path: '/en/videos/', lang: 'en' },
  { path: '/impressum/', lang: 'de' }, { path: '/datenschutz/', lang: 'de' },
] as const;
const paired = (path: string) => !['/impressum/', '/datenschutz/'].includes(path);

function productionMetadata(enabled: boolean): Plugin {
  return {
    name: 'nikvisuals-site-mode',
    transformIndexHtml(html, ctx) {
      const source = ctx.path.replace(/index\.html$/, '').replace(/\/+/g, '/');
      const route = routes.find((item) => item.path === source) ?? routes[0];
      const robots = enabled ? 'index,follow' : 'noindex,nofollow,noarchive';
      const dePath = route.path.startsWith('/en/') ? route.path.replace('/en', '') : route.path;
      const enPath = route.path.startsWith('/en/') ? route.path : `/en${route.path}`;
      const alternates = paired(route.path)
        ? `<link rel="alternate" hreflang="de" href="${canonical}${dePath}" /><link rel="alternate" hreflang="en" href="${canonical}${enPath}" /><link rel="alternate" hreflang="x-default" href="${canonical}${dePath}" />`
        : '';
      const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
        { '@type': 'Person', name: 'Niklas Brüne', url: `${canonical}/`, jobTitle: 'Founder, NikVisuals', sameAs: ['https://www.linkedin.com/in/niklas-br%C3%BCne-b61877243/', 'https://www.instagram.com/nikvisualsmedia/', 'https://www.youtube.com/@nikvisualsmedia/'] },
        { '@type': 'WebSite', name: 'NikVisuals', url: `${canonical}/` },
      ] });
      const seo = enabled ? `<link rel="canonical" href="${canonical}${route.path}" />${alternates}<script type="application/ld+json">${schema}</script>` : '';
      return html
        .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')
        .replace('</head>', `${seo}</head>`);
    },
    async closeBundle() {
      const robots = enabled
        ? `User-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: ${canonical}/sitemap.xml\n`
        : 'User-agent: *\nDisallow: /\n';
      await writeFile('dist/robots.txt', robots);
      if (!enabled) {
        await rm('dist/sitemap.xml', { force: true });
        await rm('dist/llms.txt', { force: true });
        return;
      }
      const urls = routes.map((route) => `  <url><loc>${canonical}${route.path}</loc></url>`).join('\n');
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
    plugins: [react(), tailwindcss(), !isSsrBuild && productionMetadata(env.SITE_MODE === 'production')],
    build: { rollupOptions: isSsrBuild ? {} : { input: {
      de: resolve('index.html'), en: resolve('en/index.html'), links: resolve('links/index.html'), enLinks: resolve('en/links/index.html'), videos: resolve('videos/index.html'), enVideos: resolve('en/videos/index.html'), impressum: resolve('impressum/index.html'), datenschutz: resolve('datenschutz/index.html'),
    } } },
  };
});
