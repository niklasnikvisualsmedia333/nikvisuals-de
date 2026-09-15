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
 assert(html.includes('class="contact-form"'));
 assert(html.includes('Was Kunden sagen') || html.includes('What clients say'));
 assert(html.includes('★★★★★'));
 assert(!html.includes('<article class="testimonial"><span'));
 assert(html.includes('ihk-workshop-presenting.webp'));
 assert(html.includes('niklas-current-profile.webp'));
assert(html.includes('whiteboard-presentation.webp'));
 assert(html.includes('tmp-tech-talk.webp'));
 assert(html.includes('id="bewertungen"'));
 assert(html.includes(`href="${base}${lang === 'en' ? 'en/' : ''}links/"`));
 assert(!html.includes('class="collaboration"'));
 assert(html.includes('Vorschau') || html.includes('Preview'));
 assert(!html.includes('Formspree') && !html.includes('n8n'));
 assert(html.includes(`href="${base}en/"`));
 for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const url = match[1];
  if (!url.startsWith('/')) continue;
  assert(url.startsWith(base), `Incorrect base: ${url}`);
  const relative = url.slice(base.length);
  await access(`dist/${relative}${url.endsWith('/') ? 'index.html' : ''}`);
 }
}
for (const [lang, path] of [['de', 'dist/links/index.html'], ['en', 'dist/en/links/index.html']]) {
 const html = await readFile(path, 'utf8');
 assert(html.includes(`lang="${lang}"`));
 assert(html.includes('noindex,nofollow'));
 assert(html.includes('class="link-hub"'));
 assert(html.includes('niklas-current-profile.webp'));
 assert(!html.includes('niklas-production-hero.webp'));
 assert(!html.includes('Ein Link. Alle Wege.'));
 assert(html.includes('Kontakt') || html.includes('Contact'));
 assert(!html.includes('<iframe'));
}
assert((await readFile('dist/robots.txt', 'utf8')).includes('Disallow: /'));
await access('dist/images/production-rig-winter.webp');
await assert.rejects(access('dist/CNAME'));
console.log('Verified: four prerendered DE/EN pages, four cases, noindex, local assets and Pages paths, no CNAME.');
