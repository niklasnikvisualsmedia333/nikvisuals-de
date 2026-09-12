import { renderToString } from 'react-dom/server';
import { Home } from './pages/Home';
import { Links } from './pages/Links';
import type { Language } from './content/site';
export function render(lang: Language, page: 'home' | 'links' = 'home') { return renderToString(page === 'links' ? <Links lang={lang} /> : <Home lang={lang} />); }
