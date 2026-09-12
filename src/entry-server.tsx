import { renderToString } from 'react-dom/server';
import { Home } from './pages/Home';
import type { Language } from './content/site';
export function render(lang: Language) { return renderToString(<Home lang={lang} />); }
