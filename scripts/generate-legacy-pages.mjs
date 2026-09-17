import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { activeRoutes, legacyRedirects } from './legacy-routes.mjs';

const mode = process.env.SITE_MODE ?? 'preview';
const base = process.env.VITE_BASE_PATH || '/nikvisuals-de/';
const canonicalOrigin = 'https://www.nikvisuals.de';

function localUrl(path) {
  return `${base}${path.replace(/^\//, '')}`;
}

function redirectDocument(destination, canonicalDestination) {
  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,follow">
    <link rel="canonical" href="${canonicalDestination}">
    <meta http-equiv="refresh" content="0; url=${destination}">
    <title>Seite umgezogen | NikVisuals</title>
    <script>location.replace(${JSON.stringify(destination)} + window.location.search);</script>
  </head>
  <body>
    <p>Diese Seite wurde verschoben. <a href="${destination}">Weiter zur aktuellen Seite</a></p>
  </body>
</html>`;
}

function notFoundDocument() {
  const home = localUrl('/');
  const videos = localUrl('/videos/');
  const impressum = localUrl('/impressum/');
  const datenschutz = localUrl('/datenschutz/');
  const font = localUrl('/fonts/manrope-variable.ttf');
  const baseJson = JSON.stringify(base);

  return `<!doctype html>
<html lang="de" data-theme="dark">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow,noarchive">
    <title>Seite nicht gefunden | NikVisuals</title>
    <style>
      @font-face { font-family: Manrope; src: url('${font}') format('truetype'); font-display: swap; }
      :root { color-scheme: dark; --page:#11151c; --panel:#18212d; --text:#f5f1e9; --muted:#b9c3d0; --line:rgba(245,241,233,.18); --accent:#77a9ff; }
      :root[data-theme="light"] { color-scheme: light; --page:#f6f2e9; --panel:#fffdf8; --text:#17202b; --muted:#526170; --line:rgba(23,32,43,.16); --accent:#245ec2; }
      * { box-sizing:border-box; } body { margin:0; min-height:100vh; background:var(--page); color:var(--text); font:500 16px/1.55 Manrope,system-ui,sans-serif; }
      main { width:min(100% - 40px, 760px); margin:0 auto; padding:clamp(32px,7vw,88px) 0 32px; }
      .top { display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--line); padding-bottom:18px; }
      .brand { color:inherit; text-decoration:none; font-size:1.1rem; font-weight:800; letter-spacing:-.04em; }
      .theme { min-width:44px; min-height:44px; border:1px solid var(--line); border-radius:999px; background:transparent; color:inherit; cursor:pointer; font:inherit; }
      .eyebrow { color:var(--accent); font-size:.75rem; font-weight:800; letter-spacing:.13em; margin:clamp(56px,12vw,112px) 0 12px; text-transform:uppercase; }
      h1 { max-width:12ch; margin:0; font-size:clamp(2.5rem,8vw,5.5rem); line-height:.96; letter-spacing:-.075em; }
      p { max-width:58ch; color:var(--muted); font-size:clamp(1rem,2vw,1.14rem); }
      .actions { display:flex; flex-wrap:wrap; gap:12px; margin:30px 0 72px; }
      .button { display:inline-flex; min-height:48px; align-items:center; justify-content:center; border:1px solid var(--line); border-radius:999px; padding:0 20px; color:inherit; font-weight:750; text-decoration:none; }
      .button.primary { background:var(--accent); border-color:var(--accent); color:#07162f; }
      footer { display:flex; flex-wrap:wrap; gap:12px 20px; border-top:1px solid var(--line); padding-top:18px; color:var(--muted); font-size:.9rem; }
      footer a { color:inherit; text-underline-offset:3px; } a:focus-visible,button:focus-visible { outline:3px solid var(--accent); outline-offset:3px; }
    </style>
  </head>
  <body>
    <main>
      <header class="top"><a class="brand" id="home-brand" href="${home}">NikVisuals</a><button class="theme" type="button" id="theme" aria-label="Hellen Modus aktivieren">◐</button></header>
      <p class="eyebrow">404</p>
      <h1 id="headline">Diese Seite gibt es nicht mehr.</h1>
      <p id="copy">Die Website wurde neu strukturiert. Über die Startseite finden Sie die aktuellen Inhalte und Projekte.</p>
      <div class="actions"><a class="button primary" id="home-link" href="${home}">Zur Startseite</a><a class="button" id="videos-link" href="${videos}">Videos ansehen</a></div>
      <footer><a id="impressum-link" href="${impressum}">Impressum</a><a id="datenschutz-link" href="${datenschutz}">Datenschutz</a></footer>
    </main>
    <script>
      (() => {
        const base = ${baseJson};
        const themeKey = 'nikvisuals-theme';
        const relativePath = location.pathname.startsWith(base) ? location.pathname.slice(base.length) : location.pathname.slice(1);
        const english = relativePath.startsWith('en/');
        const root = base;
        const setTheme = (theme) => {
          document.documentElement.dataset.theme = theme;
          document.getElementById('theme').setAttribute('aria-label', theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dark mode aktivieren');
        };
        setTheme(localStorage.getItem(themeKey) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
        document.getElementById('theme').addEventListener('click', () => {
          const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
          localStorage.setItem(themeKey, next); setTheme(next);
        });
        if (!english) return;
        document.documentElement.lang = 'en';
        document.title = 'Page not found | NikVisuals';
        document.getElementById('headline').textContent = 'This page is no longer available.';
        document.getElementById('copy').textContent = 'The website has been reorganised. You can find the current work and information from the homepage.';
        document.getElementById('home-link').textContent = 'Back to homepage';
        document.getElementById('videos-link').textContent = 'View videos';
        document.getElementById('impressum-link').textContent = 'Imprint';
        document.getElementById('datenschutz-link').textContent = 'Privacy';
        document.getElementById('home-brand').href = root + 'en/';
        document.getElementById('home-link').href = root + 'en/';
        document.getElementById('videos-link').href = root + 'en/videos/';
      })();
    </script>
  </body>
</html>`;
}

await writeFile(resolve('dist', '404.html'), notFoundDocument());

if (mode === 'staging' || mode === 'production') {
  for (const { from, to } of legacyRedirects) {
    if (activeRoutes.has(from) || activeRoutes.has(`${from}/`)) {
      throw new Error(`Refusing to overwrite an active route: ${from}`);
    }
    const destination = localUrl(to);
    const canonicalDestination = `${canonicalOrigin}${to}`;
    const directory = resolve('dist', from.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, 'index.html'), redirectDocument(destination, canonicalDestination));
  }
}
