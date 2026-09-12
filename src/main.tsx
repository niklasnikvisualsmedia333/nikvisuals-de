import { createRoot, hydrateRoot } from 'react-dom/client';
import { Home } from './pages/Home';
import { Links } from './pages/Links';
import './styles/global.css';
const root = document.getElementById('root')!;
const lang = document.documentElement.lang === 'en' ? 'en' : 'de';
const app = document.documentElement.dataset.page === 'links' ? <Links lang={lang} /> : <Home lang={lang} />;
if (root.querySelector('main')) hydrateRoot(root, app); else createRoot(root).render(app);
