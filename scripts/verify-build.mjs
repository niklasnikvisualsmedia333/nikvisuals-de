import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';

const read = (path) => readFile(path, 'utf8');
const production = process.env.SITE_MODE === 'production';
const [videos, videoPage, home, site, links, consent, reviews, css, legal, packageJson] = await Promise.all([
  read('src/content/videos.ts'), read('src/pages/Videos.tsx'), read('src/pages/Home.tsx'), read('src/content/site.ts'), read('src/pages/Links.tsx'), read('src/components/MediaConsent.tsx'), read('src/content/reviews.ts'), read('src/styles/global.css'), read('src/pages/Legal.tsx'), read('package.json'),
]);

const videoIds = [...videos.matchAll(/^make\('([^']+)'/gm)].map((match) => match[1]);
const sections = [...videos.matchAll(/items:pick\(\[([^\]]+)\]\)/g)].map((match) => [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
assert.equal(videoIds.length, 34, 'video archive must contain 34 records');
assert.equal(new Set(videoIds).size, 34, 'video IDs must be unique');
assert.equal(sections.length, 7, 'video archive must contain seven sections');
assert(sections.every((section) => section.length >= 2), 'every video section needs at least two entries');
assert.deepEqual([...sections.flat()].sort(), [...videoIds].sort(), 'every video must appear once');
assert.equal((await readdir('public/images/videos')).filter((name) => name.endsWith('.webp')).length, 34, 'all local video thumbnails must exist');
assert.equal((await readdir('dist/images/videos')).filter((name) => name.endsWith('.webp')).length, 34, 'all thumbnails must be deployed');
assert(/<button[\s\S]*data-thumbnail-play/.test(videoPage), 'thumbnail play overlay must be an accessible button');
assert.equal((videoPage.match(/data-thumbnail-play/g) || []).length, 1, 'VideoCard must render one thumbnail overlay control');

assert(/<a href=\{base\}>DE<\/a>[\s\S]*?<span>\/<\/span>[\s\S]*?<a href=\{base \+ "en\/"\}>EN<\/a>/.test(home), 'language switch must remain DE / EN');
assert(css.includes('.languages>span{display:inline-flex;align-items:center;justify-content:center;height:42px'), 'language slash must use flex centering');
assert(home.includes('data-ambient-media') && home.includes('href={archive}'), 'homepage media panel and video archive link must exist');
assert(home.includes('BehindTheScenes') && home.includes('production-rig-winter.webp') && home.includes('niklas-bschool-workshop-facilitation.webp'), 'behind-the-scenes gallery must exist');
assert(!/lapstore-logo-web\.png/.test(site + home), 'broken LapStore PNG path must not return');
assert(!/University of Tulsa|B-School|histori/i.test(home + site), 'removed copy must not return');
assert(home.includes('project.organization !== "LapStore"'), 'LapStore project badge must be excluded');
assert(home.includes('WorkshopCase') && home.includes('Einblicke ansehen'), 'workshops need the expandable gallery');
for (const id of ['BDR6sHFXoiI', 'ObgIseEQ0ME', 'oE9I8w93pvc', 'wFaeFX5gxeA', '-9XjGPp35Ds']) assert(reviews.includes(`testimonialVideoId: '${id}'`), `review testimonial video missing: ${id}`);
assert(home.includes('Video-Feedback ansehen') && home.includes('!clone'), 'canonical review cards need video actions without clone controls');

const logos = ['lapstore-logo-web.webp', 'sms-group-logo.png', 'hilchenbach-logo.png', 'ihk-siegen-logo.png', 'startpunkt57-logo.svg', 'entrepreneurship-center-logo.png', 'siegerland-center-logo.svg', 'reifen-thomas-logo.png', 'vorlaender-logo.svg'];
for (const logo of logos) { assert(home.includes(logo), `missing logo reference: ${logo}`); await access(`public/images/${logo}`); await access(`dist/images/${logo}`); }
assert(!home.includes('entrepreneurship-center-logo.svg'), 'generic university asset must not represent Entrepreneurship Center');
for (const href of ['lapstore.de', 'sms-group.com', 'hilchenbach.de', 'ihk-siegen.de', 'startpunkt57.de', 'uni-siegen.de/ec', 'siegerlandcenter.de', 'reifenthomas.de', 'baeder-heizung.com']) assert(home.includes(href), `missing collaboration href: ${href}`);
assert(!/grayscale\(|filter:\s*invert\(/.test(css), 'brand logos must not use grayscale or invert filters');
assert(!home.includes('collab-controls'), 'logo carousel must not have permanent arrow controls');

assert(links.includes('hub-social-label'), 'link hub needs inline social labels');
for (const name of ['linkedin', 'instagram', 'youtube', 'facebook']) assert(site.includes(`platform:'${name}'`), `missing social platform: ${name}`);
assert(css.includes('.hub-social-label{display:inline-flex;align-items:center'), 'social icon and label must stay on one line');

const records = [...reviews.matchAll(/\{\s*id: '([^']+)'[\s\S]*?featured: (true|false),\s*\}/g)];
const featured = records.filter((record) => record[2] === 'true').map((record) => record[1]);
assert(featured.length > 8 && new Set(featured).size === featured.length, 'homepage needs more than eight unique featured reviews');
assert(records.every((record) => /exactQuote: (true|false)/.test(record[0])), 'every review must declare exactQuote');
assert(/id: 'joern-muellers'[\s\S]*roleOrCompany: 'SMS group'/.test(reviews), 'Jörn Müllers must identify SMS group');
assert(/id: 'thorsten-becker'[\s\S]*featured: false/.test(reviews), 'Thorsten Becker must not be featured');
assert(/id: 'smd-1206'[\s\S]*featured: false/.test(reviews), 'SMD 1206 must not be featured');
for (const id of ['wFaeFX5gxeA', 'ObgIseEQ0ME', 'oE9I8w93pvc']) assert(reviews.includes(id), `corrected testimonial URL missing: ${id}`);
assert(home.includes('review.exactQuote && lang === "de"') && home.includes('review-more'), 'reviews need exact quote handling and inline expansion');
assert(/5,0 \/ 5/.test(site) && /49 Google-Bewertungen/.test(site), 'Google aggregate must remain 5.0 / 49');
assert(home.includes('data-seamless-carousel="logos"') && home.includes('data-seamless-carousel="reviews"'), 'both proof rows need carousel hooks');

assert(consent.includes('youtube-nocookie.com/embed/') && consent.includes('setActive(null)'), 'YouTube must stay consent-gated and revocable');
assert(legal.includes('GitHub Pages') && legal.includes('nikvisuals-theme') && legal.includes('nikvisuals-media-consent-v1'), 'privacy must document hosting and local settings');
assert(legal.includes('www.youtube-nocookie.com') && legal.includes('Microsoft 365 / Outlook'), 'privacy must document YouTube and mail handling');
assert(!/TMG|RStV/.test(legal), 'imprint must use current terminology');
assert(!/wix\.com.*impressum/i.test(home + links), 'footer must not link to old Wix legal pages');
assert(home.includes('"impressum/"') && home.includes('"datenschutz/"'), 'homepage footer must use internal legal links');
assert(packageJson.includes('build:production'), 'production indexing build command must exist');

for (const [lang, path] of [['de', 'dist/index.html'], ['en', 'dist/en/index.html']]) {
  const html = await read(path);
  assert(html.includes(`lang="${lang}"`) && html.includes('mailto:info@nikvisuals.de') && html.includes('data-ambient-media'), `${path}: homepage output incomplete`);
  assert.equal((html.match(/data-selected-project/g) || []).length, 4, `${path}: exactly four selected projects`);
  assert(!html.includes('<iframe'), `${path}: no initial iframe`);
}
for (const path of ['dist/impressum/index.html', 'dist/datenschutz/index.html']) {
  const html = await read(path);
  assert(html.includes('NikVisuals') && !html.includes('<iframe'), `${path}: legal route missing or unsafe`);
}
for (const [lang, path] of [['de', 'dist/links/index.html'], ['en', 'dist/en/links/index.html']]) {
  const html = await read(path);
  assert(html.includes(`lang="${lang}"`) && html.includes('hub-social-label') && !html.includes('<iframe'), `${path}: link hub incomplete`);
}
for (const [lang, path] of [['de', 'dist/videos/index.html'], ['en', 'dist/en/videos/index.html']]) {
  const html = await read(path);
  assert(html.includes(`lang="${lang}"`) && !html.includes('<iframe'), `${path}: video archive unsafe`);
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) || []).length, 34, `${path}: missing video records`);
  assert.equal((html.match(/data-thumbnail-play/g) || []).length, 34, `${path}: missing playable overlays`);
  assert(!/i\.ytimg\.com|img\.youtube\.com/.test(html), `${path}: remote thumbnail request`);
}
for (const asset of ['media-loop-desktop.mp4', 'media-loop-mobile.mp4', 'media-loop-desktop-poster.webp', 'media-loop-mobile-poster.webp']) await access(`dist/images/${asset}`);
for (const asset of ['ihk-workshop-2026-presenting-wide.webp', 'ihk-workshop-2026-presenting-screen.webp', 'ihk-workshop-2026-participant-support.webp', 'niklas-bschool-workshop-facilitation.webp', 'niklas-speaking-entrepreneurship-talk-screenshot.webp']) await access(`dist/images/${asset}`);
const robots = await read('dist/robots.txt');
if (production) {
  assert(robots.includes('User-agent: OAI-SearchBot') && robots.includes('Allow: /') && robots.includes('Sitemap:'), 'production robots must allow public crawling');
  const homeHtml = await read('dist/index.html');
  assert(homeHtml.includes('index,follow') && homeHtml.includes('https://www.nikvisuals.de/') && homeHtml.includes('hreflang="en"'), 'production metadata must be crawlable');
  assert((await read('dist/sitemap.xml')).includes('https://www.nikvisuals.de/videos/'), 'production sitemap must exist');
  assert((await read('dist/llms.txt')).includes('NikVisuals'), 'production llms.txt must exist');
} else {
  assert(robots.includes('Disallow: /'), 'preview robots protection must remain');
  const homeHtml = await read('dist/index.html');
  assert(homeHtml.includes('noindex,nofollow'), 'preview must remain noindex');
  await assert.rejects(access('dist/sitemap.xml'), 'preview must not generate sitemap');
  await assert.rejects(access('dist/llms.txt'), 'preview must not generate llms.txt');
}
await assert.rejects(access('dist/CNAME'), 'preview must not contain CNAME');
console.log(`Verified ${production ? 'production' : 'preview'} build: legal pages, privacy, metadata, 34 videos, nine logos, reviews and consent safety.`);
