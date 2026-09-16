import {createRoot,hydrateRoot} from 'react-dom/client';
import {Home} from './pages/Home'; import {MediaConsentProvider} from './components/MediaConsent'; import './styles/global.css';
const root=document.getElementById('root')!,lang=document.documentElement.lang==='en'?'en':'de',page=document.documentElement.dataset.page;
const mount=(pageApp:React.ReactNode)=>{const app=<MediaConsentProvider lang={lang}>{pageApp}</MediaConsentProvider>;if(root.querySelector('main'))hydrateRoot(root,app);else createRoot(root).render(app);};
if(page==='links')void import('./pages/Links').then(({Links})=>mount(<Links lang={lang}/>));
else if(page==='videos')void import('./pages/Videos').then(({Videos})=>mount(<Videos lang={lang}/>));
else if(page==='impressum'||page==='datenschutz')void import('./pages/Legal').then(({Legal})=>mount(<Legal page={page} lang={lang}/>));
else mount(<Home lang={lang}/>);
