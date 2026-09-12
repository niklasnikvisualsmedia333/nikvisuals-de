import { createRoot, hydrateRoot } from 'react-dom/client';
import { Home } from './pages/Home';
import './styles/global.css';
const root = document.getElementById('root')!;
const app = <Home lang={document.documentElement.lang === 'en' ? 'en' : 'de'} />;
if (root.querySelector('main')) hydrateRoot(root, app); else createRoot(root).render(app);
