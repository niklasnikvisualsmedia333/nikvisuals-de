import {createRoot,hydrateRoot} from 'react-dom/client';
import {Home} from './pages/Home'; import {Links} from './pages/Links'; import {Videos} from './pages/Videos'; import {Legal} from './pages/Legal'; import {MediaConsentProvider} from './components/MediaConsent'; import './styles/global.css';
const root=document.getElementById('root')!,lang=document.documentElement.lang==='en'?'en':'de',page=document.documentElement.dataset.page;
const pageApp=page==='links'?<Links lang={lang}/>:page==='videos'?<Videos lang={lang}/>:page==='impressum'||page==='datenschutz'?<Legal page={page} lang={lang}/>:<Home lang={lang}/>;
const app=<MediaConsentProvider lang={lang}>{pageApp}</MediaConsentProvider>;
if(root.querySelector('main'))hydrateRoot(root,app);else createRoot(root).render(app);
