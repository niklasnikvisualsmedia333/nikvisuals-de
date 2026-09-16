import { access, readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const read = (path) => readFile(path, 'utf8');
const [videoSource, videoPageSource, homeSource, siteSource, linksSource, consentSource, reviewsSource, cssSource] = await Promise.all([
  read('src/content/videos.ts'), read('src/pages/Videos.tsx'), read('src/pages/Home.tsx'), read('src/content/site.ts'),
  read('src/pages/Links.tsx'), read('src/components/MediaConsent.tsx'), read('src/content/reviews.ts'), read('src/styles/global.css'),
]);

const videoIds = [...videoSource.matchAll(/^make\('([^']+)'/gm)].map((match) => match[1]);
const sections = [...videoSource.matchAll(/items:pick\(\[([^\]]+)\]\)/g)].map((match) => [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
assert.equal(videoIds.length, 34, 'video archive must contain 34 records');
assert.equal(new Set(videoIds).size, 34, 'video IDs must be unique');
assert.equal(sections.length, 7, 'video archive must contain seven sections');
assert(sections.every((section) => section.length >= 2), 'every video section needs at least two entries');
assert.deepEqual([...sections.flat()].sort(), [...videoIds].sort(), 'every video must appear once');
assert.equal((await readdir('public/images/videos')).filter((name) => name.endsWith('.webp')).length, 34, 'all local video thumbnails must exist');
assert.equal((await readdir('dist/images/videos')).filter((name) => name.endsWith('.webp')).length, 34, 'all thumbnails must be deployed');
assert.equal((videoPageSource.match(/data-thumbnail-play/g) || []).length, 1, 'VideoCard must render one thumbnail overlay play control');

assert(/<a href=\{base\}>DE<\/a><span>\/<\/span><a href=\{base\+'en\/'\}>EN<\/a>/.test(homeSource), 'language switch must remain DE / EN');
assert(cssSource.includes('.languages>span{display:inline-flex;align-items:center;justify-content:center;height:42px'), 'language slash must use centered flex layout');
assert(homeSource.includes('data-ambient-media'), 'ambient media section must exist');
assert(homeSource.includes("'videos/'"), 'homepage must link to video archive');
assert(!/lapstore-logo-web\.png/.test(siteSource + homeSource), 'broken LapStore PNG path must not return');
assert(!/University of Tulsa|B-School|histori/i.test(homeSource + siteSource), 'removed copy must not return');

const logos = ['lapstore-logo-web.webp', 'sms-group-logo.png', 'hilchenbach-logo.png', 'ihk-siegen-logo.png', 'startpunkt57-logo.svg', 'entrepreneurship-center-logo.png', 'siegerland-center-logo.svg', 'reifen-thomas-logo.png', 'vorlaender-logo.svg'];
assert(logos.length >= 9, 'at least nine canonical collaborations are required');
for (const logo of logos) { assert(homeSource.includes(logo), `missing logo reference: ${logo}`); await access(`public/images/${logo}`); await access(`dist/images/${logo}`); }
assert(!homeSource.includes('entrepreneurship-center-logo.svg'), 'generic university asset must not represent the Entrepreneurship Center');
const hrefs = ['lapstore.de', 'sms-group.com', 'hilchenbach.de', 'ihk-siegen.de', 'startpunkt57.de', 'uni-siegen.de/ec', 'siegerlandcenter.de', 'reifenthomas.de', 'baeder-heizung.com'];
for (const href of hrefs) assert(homeSource.includes(href), `missing collaboration href: ${href}`);
assert(!/grayscale\(|filter:\s*invert\(/.test(cssSource), 'brand logos must not use grayscale or invert filters');
assert(!homeSource.includes('collab-controls'), 'logo carousel must not have permanent arrow controls');

assert(linksSource.includes('hub-social-label'), 'link hub needs inline social labels');
for (const name of ['linkedin', 'instagram', 'youtube', 'facebook']) assert(siteSource.includes(`platform:'${name}'`), `missing social platform: ${name}`);
assert(cssSource.includes('.hub-social-label{display:inline-flex;align-items:center'), 'social icon and label must remain on one line');

const featuredIds = [...reviewsSource.matchAll(/id: '([^']+)'/g)].map((match) => match[1]);
assert(featuredIds.length > 8, 'homepage requires more than eight source-backed reviews');
assert.equal(featuredIds.length, new Set(featuredIds).size, 'featured reviewer records must be unique');
const exactQuoteFlags = [...reviewsSource.matchAll(/exactQuote: (true|false)/g)].map((match) => match[1]);
assert.equal(exactQuoteFlags.length, featuredIds.length, 'every review must explicitly declare exactQuote');
assert(exactQuoteFlags.includes('true') && exactQuoteFlags.includes('false'), 'review data must distinguish exact quotations from paraphrases');
assert(homeSource.includes("review.exactQuote&&lang==='de'"), 'only verified German wording may render as a quotation');
assert(homeSource.includes('review-more') && homeSource.includes('Mehr lesen'), 'long reviews need inline expansion');
assert(/5,0 \/ 5/.test(siteSource) && /49 Google-Bewertungen/.test(siteSource), 'Google aggregate proof must remain 5.0 / 49');
assert(homeSource.includes('data-seamless-carousel="logos"') && homeSource.includes('data-seamless-carousel="reviews"'), 'both proof rows need seamless-carousel hooks');

assert(consentSource.includes('youtube-nocookie.com/embed/') && consentSource.includes('setActive(null)'), 'YouTube must stay consent-gated and revocable');
const base = process.env.VITE_BASE_PATH || '/nikvisuals-de/';
for (const [lang, path] of [['de', 'dist/index.html'], ['en', 'dist/en/index.html']]) {
  const html = await read(path);
  for (const text of [`lang="${lang}"`, 'noindex,nofollow', 'mailto:info@nikvisuals.de', 'data-ambient-media', `href="${base}${lang === 'en' ? 'en/' : ''}videos/"`]) assert(html.includes(text), `${path}: ${text}`);
  assert.equal((html.match(/data-selected-project/g) || []).length, 4, `${path}: exactly four selected projects`);
  assert(!html.includes('<iframe'), `${path}: no initial iframe`);
}
for (const [lang, path] of [['de', 'dist/links/index.html'], ['en', 'dist/en/links/index.html']]) {
  const html = await read(path);
  assert(html.includes(`lang="${lang}"`) && html.includes('noindex,nofollow') && html.includes('hub-social-label') && !html.includes('<iframe'));
  for (const name of ['LinkedIn', 'Instagram', 'YouTube', 'Facebook']) assert(html.includes(name));
}
for (const [lang, path] of [['de', 'dist/videos/index.html'], ['en', 'dist/en/videos/index.html']]) {
  const html = await read(path);
  assert(html.includes(`lang="${lang}"`) && html.includes('noindex,nofollow'));
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) || []).length, 34);
  assert.equal((html.match(/images\/videos\//g) || []).length, 34);
  assert.equal((html.match(/data-thumbnail-play/g) || []).length, 34);
  assert(!html.includes('<iframe') && !/i\.ytimg\.com|img\.youtube\.com/.test(html));
}
for (const asset of ['media-loop-desktop.mp4', 'media-loop-mobile.mp4', 'media-loop-desktop-poster.webp', 'media-loop-mobile-poster.webp']) await access(`dist/images/${asset}`);
assert((await read('dist/robots.txt')).includes('Disallow: /'), 'preview robots protection must remain');
await assert.rejects(access('dist/CNAME'), 'preview must not contain CNAME');

console.log('Verified: language switch, nine linked logos, continuous proof rows, 15 reviews, 34 videos in seven sections, consent safety and preview protection.');
