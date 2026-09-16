import { readFile, writeFile, rm } from 'node:fs/promises';
import { render } from '../.prerender/entry-server.js';
for (const [lang, page, path] of [['de', 'home', 'dist/index.html'], ['en', 'home', 'dist/en/index.html'], ['de', 'links', 'dist/links/index.html'], ['en', 'links', 'dist/en/links/index.html'], ['de', 'videos', 'dist/videos/index.html'], ['en', 'videos', 'dist/en/videos/index.html'], ['de', 'impressum', 'dist/impressum/index.html'], ['de', 'datenschutz', 'dist/datenschutz/index.html']]) {
 const html = await readFile(path, 'utf8');
 if (!html.includes('<!--app-html-->')) throw new Error('Missing prerender marker');
 await writeFile(path, html.replace('<!--app-html-->', render(lang, page)));
}
await rm('.prerender', { recursive: true });
