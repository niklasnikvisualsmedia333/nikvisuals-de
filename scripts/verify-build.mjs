import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { legacyRedirects } from './legacy-routes.mjs';

const read = (path) => readFile(path, 'utf8');
const production = process.env.SITE_MODE === 'production';
const staging = process.env.SITE_MODE === 'staging';
const [videos, internshipVideos, videoPage, home, site, links, consent, reviews, css, legal, siteFooter, copyEmail, packageJson, legacyGenerator] = await Promise.all([
  read('src/content/videos.ts'), read('src/content/internshipVideos.ts'), read('src/pages/Videos.tsx'), read('src/pages/Home.tsx'), read('src/content/site.ts'), read('src/pages/Links.tsx'), read('src/components/MediaConsent.tsx'), read('src/content/reviews.ts'), read('src/styles/global.css'), read('src/pages/Legal.tsx'), read('src/components/SiteFooter.tsx'), read('src/components/CopyEmailButton.tsx'), read('package.json'), read('scripts/generate-legacy-pages.mjs'),
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
const internshipIds = ['YBKWRVq8sGM', 'jGzVRJDaDu4', '01bz0IA-YV0', 'sg-ftfKm4wM', 'w0y8nuyZkHw', 'aNgkK6kAB4M', '5MXS-PU7vEg', 'slaLdlLGJfQ'];
const internshipRecords = [...internshipVideos.matchAll(/id: '([^']+)'/g)].map((match) => match[1]);
assert.deepEqual(internshipRecords, internshipIds, 'internship videos must preserve the supplied priority order');
assert.equal(new Set(internshipRecords).size, 8, 'internship video IDs must be unique');
for (const id of internshipIds) {
  assert(!videos.includes(id), `internship video ${id} must not enter the portfolio archive`);
  await access(`public/images/internships/${id}.webp`);
  await access(`dist/images/internships/${id}.webp`);
}
assert(home.includes('id="praktikum"') && home.includes('Internships at NikVisuals.'), 'DE/EN internship section must exist');
assert(home.includes('Lebenslauf per E-Mail') && home.includes('work samples, projects or a portfolio'), 'internship section must include the CV and portfolio guidance');
assert(!home.includes('Initiativ bewerben') && !home.includes('Apply proactively'), 'internship section must not retain the old application button');
assert(home.includes('<CopyEmailButton lang={lang} />') && copyEmail.includes("navigator.clipboard.writeText('info@nikvisuals.de')"), 'internship email must use the reusable copy control');
assert(home.includes('aria-controls="internship-video-gallery"') && home.includes('open && <div id="internship-video-gallery"'), 'internship gallery must remain collapsed until requested');
assert(siteFooter.includes('useMediaConsent') && siteFooter.includes("home + '#praktikum'") && siteFooter.includes('impressum/') && siteFooter.includes('datenschutz/'), 'shared footer must provide settings and correct legal/internship links');
assert(home.includes('<SiteFooter lang={lang} isHome />') && videoPage.includes('<SiteFooter lang={lang} />') && links.includes('<SiteFooter lang={lang} />') && legal.includes('<SiteFooter lang={lang} />'), 'every public page must use the shared footer');
assert(/<button[\s\S]*data-thumbnail-play/.test(videoPage), 'thumbnail play overlay must be an accessible button');
assert.equal((videoPage.match(/data-thumbnail-play/g) || []).length, 1, 'VideoCard must render one thumbnail overlay control');

assert(/<a href=\{base\}>DE<\/a>[\s\S]*?<span>\/<\/span>[\s\S]*?<a href=\{base \+ "en\/"\}>EN<\/a>/.test(home), 'language switch must remain DE / EN');
assert(css.includes('.languages>span{display:inline-flex;align-items:center;justify-content:center;height:42px'), 'language slash must use flex centering');
assert(home.includes('data-ambient-media') && home.includes('en/videos/'), 'homepage media panel and video archive link must exist');
assert(home.includes('fetchPriority="high"') && /className="hero-image"[\s\S]*?width="1440"[\s\S]*?height="960"/.test(home), 'hero must reserve space and receive high fetch priority');
assert(home.includes('media="(max-width: 560px)"') && home.includes('niklas-speaking-desk-office-960.webp') && !home.includes('niklas-working-desk-office-480.webp'), 'mobile hero must use the desktop speaking-desk motif without adding a second hero asset');
assert(site.includes('wo ich konkret unterstützen kann') && site.includes('where I can support you'), 'contact introduction must describe the non-binding first conversation in both languages');
assert(home.includes('Video & Medienproduktion') && home.includes('Corporate Videos, Imagefilme, Produktvideos und Eventvideos'), 'German media panel copy must use the current video-production wording');
assert(!home.includes('../content/videos') && home.includes('../content/smsVideos'), 'homepage must not import the full video archive');
assert(site.includes("headline:'Business Development, Growth & Marketing'") && site.includes("headlineEnd:'für B2B-Unternehmen.'") && site.includes("headlineEnd:'for B2B companies.'"), 'homepage hero must lead with business development, growth and marketing');
assert(site.includes('KI im Arbeitsalltag & digitale Tools') && site.includes('AI in day-to-day work & digital tools') && site.includes('Marketing, Content & Medienproduktion') && site.includes('Marketing, Content & Media Production'), 'focus areas must use the current practical AI and media positioning');
assert(home.includes('Passt zum Beispiel, wenn') && home.includes('For example, if'), 'focus situations must use constructive framing');
for (const phrase of ['komplexer Abstimmung', 'complex coordination', 'ohne Erfahrung mit Videoproduktion', 'without video-production experience', 'bindet qualifizierte Arbeitszeit', 'takes up skilled time', 'zu stark auf Annahmen', 'too heavily on assumptions', 'noch kein klares System', 'no clear system', 'founder-led', 'Medienproduktion bleibt Teil', 'für ambitionierte', 'for ambitious']) assert(![home, site, reviews].join('\n').includes(phrase), `stale positioning copy must not return: ${phrase}`);
assert(reviews.includes('die klare Abstimmung während der Videoproduktion') && reviews.includes('clear coordination throughout the video production'), 'Steffen Kellermann paraphrase must remain client-positive and source-faithful');
assert(home.includes('preload="none"') && home.includes('{ rootMargin: "0px" }'), 'ambient media must remain delayed and use no eager video preload');
assert(!/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(css), 'local font delivery must not add Google Fonts');
for (const asset of ['niklas-working-desk-office-480.webp', 'niklas-working-desk-office-768.webp', 'niklas-speaking-desk-office-960.webp', 'niklas-speaking-desk-office-1440.webp', 'sms-group-event-480.webp', 'sms-group-event-800.webp', 'lapstore-480.webp', 'lapstore-800.webp', 'tmp-tech-talk-480.webp', 'tmp-tech-talk-800.webp', 'niklas-current-profile-480.webp', 'niklas-current-profile-800.webp', 'ihk-workshop-2026-presenting-card-480.webp', 'ihk-workshop-2026-presenting-card-800.webp']) {
  await access(`public/images/${asset}`);
  await access(`dist/images/${asset}`);
}
const btsComponent = home.match(/function BehindTheScenes[\s\S]*?function AmbientMedia/)?.[0] || '';
for (const asset of ['production-bts-konekt-event-rig.webp', 'production-bts-konekt-event-wide.webp', 'production-bts-vorlaender-team.webp', 'production-bts-konekt-camera-operator.webp', 'production-bts-salon-gimbal.webp', 'production-bts-lemonaid-tabletop.webp']) {
  assert(btsComponent.includes(asset), `behind-the-scenes must reference ${asset}`);
  await access(`public/images/${asset}`);
}
assert(!btsComponent.includes('niklas-speaking-desk-office.webp') && !btsComponent.includes('niklas-bschool-workshop-facilitation.webp'), 'behind-the-scenes must use only production BTS imagery');
assert(!btsComponent.includes('const slides = [...items, items[0]]') && btsComponent.includes('[0, 1, 2].map'), 'BTS must use clone sets without a visible duplicate first slide');
assert(btsComponent.includes('className="bts-controls"') && btsComponent.includes('Vorheriges Behind-the-scenes-Bild') && btsComponent.includes('Nächstes Behind-the-scenes-Bild') && btsComponent.includes('Previous behind-the-scenes image') && btsComponent.includes('Next behind-the-scenes image'), 'BTS must expose accessible previous and next controls in both languages');
assert(btsComponent.includes('moveSlide(-1)') && btsComponent.includes('moveSlide(1)') && btsComponent.includes('target.offsetLeft'), 'BTS controls must navigate one slide using measured geometry');
assert(!/lapstore-logo-web\.png/.test(site + home), 'broken LapStore PNG path must not return');
assert(!/University of Tulsa|B-School|histori/i.test(home + site), 'removed copy must not return');
assert(home.includes('project.organization !== "LapStore"'), 'LapStore project badge must be excluded');
assert(home.includes('WorkshopCase') && home.includes('Einblicke ansehen'), 'workshops need the expandable gallery');
const workshopComponent = home.match(/function WorkshopCase[\s\S]*?function BehindTheScenes/)?.[0] || '';
assert(/src=\{base \+ "images\/ihk-workshop-2026-presenting-card\.webp"/.test(workshopComponent), 'the IHK landscape derivative must be the workshop thumbnail');
assert.equal((workshopComponent.match(/ihk-workshop-2026-presenting-card\.webp/g) || []).length, 1, 'the workshop thumbnail must not be duplicated in the gallery');
await access('public/images/ihk-workshop-2026-presenting-card.webp');
assert(home.includes('ihk-workshop-2026-presenting-portrait.webp'), 'workshop gallery must reference the IHK portrait');
await access('public/images/ihk-workshop-2026-presenting-portrait.webp');
for (const id of ['BDR6sHFXoiI', 'ObgIseEQ0ME', 'oE9I8w93pvc', 'wFaeFX5gxeA', '-9XjGPp35Ds']) assert(reviews.includes(`testimonialVideoId: '${id}'`), `review testimonial video missing: ${id}`);
assert(home.includes('Video-Feedback ansehen') && home.includes('!clone'), 'canonical review cards need video actions without clone controls');

const logos = ['lapstore-logo-tight.webp', 'sms-group-logo.png', 'hilchenbach-logo.png', 'ihk-siegen-logo.png', 'startpunkt57-logo.svg', 'entrepreneurship-center-logo.png', 'siegerland-center-logo.svg', 'reifen-thomas-logo.png', 'vorlaender-logo.svg'];
for (const logo of logos) { assert(home.includes(logo), `missing logo reference: ${logo}`); await access(`public/images/${logo}`); await access(`dist/images/${logo}`); }
assert(!home.includes('entrepreneurship-center-logo.svg'), 'generic university asset must not represent Entrepreneurship Center');
for (const href of ['lapstore.de', 'sms-group.com', 'hilchenbach.de', 'ihk-siegen.de', 'startpunkt57.de', 'uni-siegen.de/ec', 'siegerlandcenter.de', 'reifenthomas.de', 'baeder-heizung.com']) assert(home.includes(href), `missing collaboration href: ${href}`);
assert(!/grayscale\(|filter:\s*invert\(/.test(css), 'brand logos must not use grayscale or invert filters');
assert(home.includes('className="logo-controls"') && home.includes('Vorheriges Kundenlogo') && home.includes('Nächstes Kundenlogo') && home.includes('Previous client logo') && home.includes('Next client logo'), 'logo carousel must expose accessible previous and next controls in both languages');
assert(home.includes('moveBy(-1)') && home.includes('moveBy(1)') && home.includes('item.offsetLeft'), 'logo controls must navigate one logo using measured geometry');
assert(css.includes('.video-jumps{display:flex;flex-wrap:wrap') && css.includes('.video-jumps a{display:inline-flex;align-items:center;min-height:32px'), 'video category navigation must use wrapped flex spacing');
assert(!home.includes('scale: 1.95'), 'LapStore must use the tightly cropped asset at a normal scale');

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
assert(home.includes('{ rootMargin: "250px 0px" }') && home.includes('const activate = () =>'), 'proof carousels must defer geometry work until near the viewport');
assert(/logo: "lapstore-logo-tight\.webp",\s*width: 660,\s*height: 228/.test(home), 'collaboration logos must reserve their intrinsic dimensions');
assert(home.includes('width={x.width}') && home.includes('height={x.height}'), 'collaboration images must expose intrinsic dimensions');
assert(home.includes('width="640"') && home.includes('height="360"'), 'expanded SMS thumbnails must reserve their aspect ratio');

assert(consent.includes('youtube-nocookie.com/embed/') && consent.includes('setActive(null)'), 'YouTube must stay consent-gated and revocable');
assert(legal.includes('GitHub Pages') && legal.includes('nikvisuals-theme') && legal.includes('nikvisuals-media-consent-v1'), 'privacy must document hosting and local settings');
assert(legal.includes('www.youtube-nocookie.com') && legal.includes('Gmail-Verbindung'), 'privacy must document YouTube and current contact mail handling');
assert(!/TMG|RStV/.test(legal), 'imprint must use current terminology');
assert(!/wix\.com.*impressum/i.test(home + links), 'footer must not link to old Wix legal pages');
assert(siteFooter.includes("'impressum/'") && siteFooter.includes("'datenschutz/'"), 'shared footer must use internal legal links');
assert(!siteFooter.includes('Vorschau · Nicht zur Indexierung') && !siteFooter.includes('Preview · Not for indexing'), 'footer must not expose stale preview labels');
assert(legal.includes('Die Website wird über GitHub Pages bereitgestellt.') && !legal.includes('Die aktuelle Vorschau wird über GitHub Pages bereitgestellt.'), 'privacy notice must use current hosting wording');
assert(packageJson.includes('build:staging') && packageJson.includes('build:production'), 'staging and production indexing build commands must exist');
assert.equal(legacyRedirects.length, 25, 'all documented legacy Wix paths must have an explicit redirect target');
assert(legacyGenerator.includes('location.replace') && legacyGenerator.includes('window.location.search'), 'legacy redirects must preserve query strings through a replace redirect');
for (const phrase of ['Schreib kurz', 'deinem E-Mail-Programm', 'findest du', 'Schick mir deinen Lebenslauf', 'wenn du externe Medien erlaubst', 'Bitte fülle alle Pflichtfelder']) {
  assert(![home, site, consent].join('\n').includes(phrase), `informal German regression: ${phrase}`);
}
assert([home, site].join('\n').includes('Schreiben Sie kurz') && home.includes('Schicken Sie mir Ihren Lebenslauf'), 'German contact and internship copy must use the formal form');
assert(consent.includes('wenn Sie externe Medien erlauben'), 'German consent copy must use the formal form');
assert(home.includes('https://n8n.srv1037647.hstgr.cloud/webhook/nikvisuals-website-contact') && home.includes('formVersion: "nikvisuals-contact-v1"'), 'contact form must use the approved n8n webhook contract');
assert(home.includes('AbortController') && home.includes('response.json()') && home.includes('.ok !== true'), 'contact form must time out and require an explicit JSON success response');
assert(home.includes('name="privacyAccepted"') && home.includes('name="website"') && home.includes('aria-hidden="true"'), 'contact form must require privacy consent and include an inaccessible honeypot');
assert(!home.includes('window.location.href = `mailto:'), 'contact form must not submit with mailto');
assert(legal.includes('selbst gehostete n8n-Instanz') && legal.includes('Google Sheets') && legal.includes('Gmail-Verbindung'), 'privacy notice must describe the contact-form processing flow');
assert(!legal.includes('Das Kontaktformular übermittelt keine Daten'), 'privacy notice must not describe the removed mailto-only form');

for (const [lang, path] of [['de', 'dist/index.html'], ['en', 'dist/en/index.html']]) {
  const html = await read(path);
  assert(html.includes(`lang="${lang}"`) && html.includes('mailto:info@nikvisuals.de') && html.includes('data-ambient-media'), `${path}: homepage output incomplete`);
  assert.equal((html.match(/data-selected-project/g) || []).length, 4, `${path}: exactly four selected projects`);
  assert(!html.includes('<iframe'), `${path}: no initial iframe`);
  assert(html.includes('id="praktikum"') && html.includes('mailto:info@nikvisuals.de'), `${path}: internship section missing`);
  assert(html.includes('Lebenslauf per E-Mail') || html.includes('Send me your CV by email'), `${path}: internship email guidance missing`);
  assert(!html.includes('Initiativ bewerben') && !html.includes('Apply proactively'), `${path}: old internship button must not return`);
  assert(html.includes('footer-top') && html.includes('impressum/') && html.includes('datenschutz/'), `${path}: shared legal footer missing`);
  for (const id of internshipIds) assert(!html.includes(id), `${path}: collapsed internship gallery must not prerender video cards`);
}
const notFound = await read('dist/404.html');
assert(notFound.includes('noindex,nofollow,noarchive') && notFound.includes('Diese Seite gibt es nicht mehr.') && notFound.includes('Zur Startseite') && notFound.includes('Impressum') && notFound.includes('Datenschutz') && !notFound.includes('<iframe'), 'custom 404 must be safe, branded and include legal navigation');
assert(notFound.includes("relativePath.startsWith('en/')"), 'custom 404 must provide an English variant');
for (const path of ['dist/impressum/index.html', 'dist/datenschutz/index.html']) {
  const html = await read(path);
  assert(html.includes('NikVisuals') && html.includes('footer-top') && html.includes('impressum/') && html.includes('datenschutz/') && !html.includes('<iframe'), `${path}: legal route/footer missing or unsafe`);
}
const internshipFooterHref = (lang) => production || staging
  ? (lang === 'de' ? '/#praktikum' : '/en/#praktikum')
  : (lang === 'de' ? '/nikvisuals-de/#praktikum' : '/nikvisuals-de/en/#praktikum');
for (const [lang, path] of [['de', 'dist/links/index.html'], ['en', 'dist/en/links/index.html']]) {
  const html = await read(path);
  assert(html.includes(`lang="${lang}"`) && html.includes('hub-social-label') && html.includes('footer-top') && !html.includes('<iframe'), `${path}: link hub/footer incomplete`);
  assert(html.includes(`href="${internshipFooterHref(lang)}"`), `${path}: internship footer link must target the language home`);
}
for (const [lang, path] of [['de', 'dist/videos/index.html'], ['en', 'dist/en/videos/index.html']]) {
  const html = await read(path);
  assert(html.includes(`lang="${lang}"`) && html.includes('footer-top') && !html.includes('<iframe'), `${path}: video archive/footer unsafe`);
  assert(html.includes(`href="${internshipFooterHref(lang)}"`), `${path}: video footer internship link must target the language home`);
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) || []).length, 34, `${path}: missing video records`);
  assert.equal((html.match(/data-thumbnail-play/g) || []).length, 34, `${path}: missing playable overlays`);
  assert(!/i\.ytimg\.com|img\.youtube\.com/.test(html), `${path}: remote thumbnail request`);
}
for (const asset of ['media-loop-desktop.mp4', 'media-loop-mobile.mp4', 'media-loop-desktop-poster.webp', 'media-loop-mobile-poster.webp']) await access(`dist/images/${asset}`);
for (const asset of ['ihk-workshop-2026-presenting-card.webp', 'ihk-workshop-2026-presenting-screen.webp', 'ihk-workshop-2026-presenting-portrait.webp', 'ihk-workshop-2026-participant-support.webp', 'niklas-bschool-workshop-facilitation.webp', 'niklas-speaking-entrepreneurship-talk-screenshot.webp', 'production-bts-konekt-event-rig.webp', 'production-bts-konekt-event-wide.webp', 'production-bts-vorlaender-team.webp', 'production-bts-konekt-camera-operator.webp', 'production-bts-salon-gimbal.webp', 'production-bts-lemonaid-tabletop.webp']) await access(`dist/images/${asset}`);
const robots = await read('dist/robots.txt');
if (production) {
  assert(packageJson.includes('SITE_MODE=production VITE_BASE_PATH=/'), 'production build must explicitly use the root base path');
  for (const crawler of ['OAI-SearchBot', 'GPTBot', 'Googlebot', 'Google-Extended', 'PerplexityBot', 'User-agent: *']) assert(robots.includes(crawler) && robots.includes('Allow: /'), `production robots must allow ${crawler}`);
  assert(robots.includes('Sitemap: https://www.nikvisuals.de/sitemap.xml'), 'production robots must reference the canonical sitemap');
  const indexable = [
    ['dist/index.html', 'https://www.nikvisuals.de/', 'de_DE', 'https://www.nikvisuals.de/en/'],
    ['dist/en/index.html', 'https://www.nikvisuals.de/en/', 'en_US', 'https://www.nikvisuals.de/'],
    ['dist/videos/index.html', 'https://www.nikvisuals.de/videos/', 'de_DE', 'https://www.nikvisuals.de/en/videos/'],
    ['dist/en/videos/index.html', 'https://www.nikvisuals.de/en/videos/', 'en_US', 'https://www.nikvisuals.de/videos/'],
  ];
  for (const [path, url, locale, alternate] of indexable) {
    const html = await read(path);
    assert(html.includes('index,follow') && html.includes(`<link rel="canonical" href="${url}" />`), `${path}: production canonical/indexing missing`);
    assert(html.includes(`hreflang="${locale === 'de_DE' ? 'de' : 'en'}"`) && html.includes(`href="${alternate}"`) && html.includes('hreflang="x-default"'), `${path}: hreflang pair missing`);
    for (const required of ['og:title', 'og:description', 'og:type', 'og:url', 'og:site_name', 'og:locale', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) assert(html.includes(required), `${path}: social metadata missing ${required}`);
    assert(html.includes('https://www.nikvisuals.de/images/nikvisuals-social-preview.jpg') && !html.includes('/nikvisuals-de/'), `${path}: production base path must be root`);
  }
  for (const path of ['dist/links/index.html', 'dist/en/links/index.html', 'dist/impressum/index.html', 'dist/datenschutz/index.html']) {
    const html = await read(path);
    assert(html.includes('noindex,follow') && !html.includes('hreflang='), `${path}: utility route must be noindex without hreflang`);
    assert(!html.includes('/nikvisuals-de/'), `${path}: production base path must be root`);
  }
  const sitemap = await read('dist/sitemap.xml');
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]), ['https://www.nikvisuals.de/', 'https://www.nikvisuals.de/en/', 'https://www.nikvisuals.de/videos/', 'https://www.nikvisuals.de/en/videos/'], 'production sitemap must include exactly the four indexable URLs');
  const llms = await read('dist/llms.txt');
  assert(llms.includes('# NikVisuals') && llms.includes('## Main pages') && llms.includes('[Website](https://www.nikvisuals.de/)') && llms.includes('[Contact](https://www.nikvisuals.de/#kontakt)') && llms.includes('Email: info@nikvisuals.de'), 'production llms.txt must use concise linked Markdown sections');
  const deVideos = await read('dist/videos/index.html'), enVideos = await read('dist/en/videos/index.html');
  assert(deVideos.includes('Videoproduktion für Unternehmen | NikVisuals') && enVideos.includes('Video Production for Companies | NikVisuals'), 'production video pages must use the refined route-specific document titles');
  assert((await read('dist/index.html')).includes('<title>Business Development, Growth & Marketing | NikVisuals</title>') && (await read('dist/en/index.html')).includes('<title>Business Development, Growth & Marketing | NikVisuals</title>'), 'production home metadata must use the refined positioning');
  assert(llms.includes('business development, growth, go-to-market and marketing') && llms.includes('professional media production'), 'production llms summary must use the current positioning');
  const schema = (await read('dist/index.html')).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert(schema, 'production homepage needs structured data');
  const graph = JSON.parse(schema)['@graph'];
  assert.equal(graph.length, 2, 'structured data must contain one concise Person/WebSite graph');
  assert(graph.some((item) => item['@type'] === 'Person') && graph.some((item) => item['@type'] === 'WebSite'), 'structured data types must remain factual');
  await access('dist/images/nikvisuals-social-preview.jpg');
} else {
  assert(robots.includes('Disallow: /'), 'preview robots protection must remain');
  for (const path of ['dist/index.html', 'dist/en/index.html', 'dist/videos/index.html', 'dist/en/videos/index.html', 'dist/links/index.html', 'dist/en/links/index.html', 'dist/impressum/index.html', 'dist/datenschutz/index.html']) {
    const html = await read(path);
    assert(html.includes('noindex,nofollow,noarchive') && !html.includes('<link rel="canonical"'), `${path}: preview must remain noindex without a production canonical`);
  }
  await assert.rejects(access('dist/sitemap.xml'), 'preview must not generate sitemap');
  await assert.rejects(access('dist/llms.txt'), 'preview must not generate llms.txt');
  if (staging) {
    assert(packageJson.includes('SITE_MODE=staging VITE_BASE_PATH=/'), 'staging build must explicitly use the root base path');
    for (const path of ['dist/index.html', 'dist/en/index.html', 'dist/videos/index.html', 'dist/en/videos/index.html', 'dist/links/index.html', 'dist/en/links/index.html', 'dist/impressum/index.html', 'dist/datenschutz/index.html']) {
      const html = await read(path);
      assert(!html.includes('/nikvisuals-de/'), `${path}: staging base path must be root`);
    }
  } else {
    const home = await read('dist/index.html');
    assert(home.includes('/nikvisuals-de/assets/'), 'preview base path must remain /nikvisuals-de/');
  }
}
if (production || staging) {
  for (const { from, to } of legacyRedirects) {
    const html = await read(`dist${from}/index.html`);
    assert(html.includes('noindex,follow') && html.includes(`https://www.nikvisuals.de${to}`) && html.includes('location.replace'), `${from}: legacy redirect page is incomplete`);
  }
  if (production) {
    const sitemap = await read('dist/sitemap.xml');
    for (const { from } of legacyRedirects) assert(!sitemap.includes(from), `${from}: legacy redirect must not enter sitemap`);
  }
} else {
  for (const { from } of legacyRedirects) await assert.rejects(access(`dist${from}/index.html`), `${from}: preview must not generate production legacy redirects`);
}
await assert.rejects(access('dist/CNAME'), 'preview must not contain CNAME');
console.log(`Verified ${production ? 'production' : staging ? 'staging' : 'preview'} build: legal pages, privacy, metadata, 34 videos, nine logos, reviews and consent safety.`);
