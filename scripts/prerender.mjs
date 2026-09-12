import { readFile, writeFile, rm } from 'node:fs/promises';
import { render } from '../.prerender/entry-server.js';
for (const [lang, path] of [['de', 'dist/index.html'], ['en', 'dist/en/index.html']]) {
 const html = await readFile(path, 'utf8');
 if (!html.includes('<!--app-html-->')) throw new Error('Missing prerender marker');
 await writeFile(path, html.replace('<!--app-html-->', render(lang)));
}
await rm('.prerender', { recursive: true });
