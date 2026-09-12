import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.VITE_BASE_PATH || '/nikvisuals-de/';
for (const [lang, path] of [['de', 'dist/index.html'], ['en', 'dist/en/index.html']]) {
 const html = await readFile(path, 'utf8');
 assert(html.includes(`lang="${lang}"`));
 assert(html.includes('noindex,nofollow'));
 assert(!html.includes('rel="canonical"'));
 assert.equal((html.match(/class="case case-/g) || []).length, 4);
 assert.equal((html.match(/<h1 /g) || []).length, 1);
 assert(html.includes('mailto:info@nikvisuals.de'));
 assert(html.includes(`href="${base}en/"`));
 for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const url = match[1];
  if (!url.startsWith('/')) continue;
  assert(url.startsWith(base), `Incorrect base: ${url}`);
  const relative = url.slice(base.length);
  await access(`dist/${relative}${url.endsWith('/') ? 'index.html' : ''}`);
 }
}
assert((await readFile('dist/robots.txt', 'utf8')).includes('Disallow: /'));
await assert.rejects(access('dist/CNAME'));
console.log('Verified: DE/EN static HTML, four cases, noindex, local assets and Pages paths, no CNAME.');
