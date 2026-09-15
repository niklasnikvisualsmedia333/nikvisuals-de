import { access, readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const videoSource = await readFile('src/content/videos.ts', 'utf8');
const homeSource = await readFile('src/pages/Home.tsx', 'utf8');
const siteSource = await readFile('src/content/site.ts', 'utf8');
const videoIds = [...videoSource.matchAll(/^make\('([^']+)'/gm)].map(match => match[1]);
const sectionLists = [...videoSource.matchAll(/items:pick\(\[([^\]]+)\]\)/g)].map(match => [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1]));

assert.equal(videoIds.length, 34);
assert.equal(new Set(videoIds).size, 34);
assert.equal(sectionLists.length, 7);
assert(sectionLists.every(section => section.length >= 2));
assert.deepEqual([...sectionLists.flat()].sort(), [...videoIds].sort());
assert(!/kurzen Lieferzeiten|short delivery timelines/.test(siteSource + homeSource));
assert(!/youtube\.com\/@nikvisualsmedia['"],?\s*'project'/.test(siteSource));
for (const logo of ['lapstore-logo-web.webp', 'sms-group-logo.png', 'hilchenbach-logo.png', 'ihk-siegen-logo.png', 'startpunkt57-logo.svg', 'entrepreneurship-center-logo.svg']) assert(homeSource.includes(logo));

const base = process.env.VITE_BASE_PATH || '/nikvisuals-de/';
for (const [lang, path] of [['de', 'dist/index.html'], ['en', 'dist/en/index.html']]) {
  const html = await readFile(path, 'utf8');
  for (const text of [`lang="${lang}"`, 'noindex,nofollow', 'mailto:info@nikvisuals.de', 'class="contact-form"', 'ihk-workshop-presenting.webp', 'Tech Meets Problems', '★★★★★', 'class="timeline', `href="${base}${lang === 'en' ? 'en/' : ''}links/"`, 'data-selected-project']) assert(html.includes(text), text);
  assert(!html.includes('University of Tulsa') && !html.includes('B-School'));
  assert(!/histori/i.test(html));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/data-selected-project/g) || []).length, 4);
  assert(!html.includes('<iframe'));
}
for (const [lang, path] of [['de', 'dist/links/index.html'], ['en', 'dist/en/links/index.html']]) {
  const html = await readFile(path, 'utf8');
  assert(html.includes(`lang="${lang}"`) && html.includes('noindex,nofollow') && html.includes('class="link-hub"') && !html.includes('<iframe'));
}
for (const [lang, path] of [['de', 'dist/videos/index.html'], ['en', 'dist/en/videos/index.html']]) {
  const html = await readFile(path, 'utf8');
  assert(html.includes(`lang="${lang}"`) && html.includes('noindex,nofollow'));
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) || []).length, 34);
  assert.equal((html.match(/images\/videos\//g) || []).length, 34);
  assert(!html.includes('<iframe') && !/i\.ytimg\.com|img\.youtube\.com/.test(html));
}
assert.equal((await readdir('dist/images/videos')).filter(file => file.endsWith('.webp')).length, 34);
for (const asset of ['niklas-speaking-desk-office.webp', 'niklas-working-desk-office.webp', 'ihk-siegen-logo.png', 'startpunkt57-logo.svg', 'entrepreneurship-center-logo.svg']) await access(`dist/images/${asset}`);
assert((await readFile('dist/robots.txt', 'utf8')).includes('Disallow: /'));
await assert.rejects(access('dist/CNAME'));
console.log('Verified: DE/EN routes, 34 videos in 7 sections, four projects, local logos, preview safety and consent-safe prerendering.');
