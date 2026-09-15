import{renderToString}from'react-dom/server';import{Home}from'./pages/Home';import{Links}from'./pages/Links';import{Videos}from'./pages/Videos';import type{Language}from'./content/site';
export function render(lang:Language,page:'home'|'links'|'videos'='home'){return renderToString(page==='links'?<Links lang={lang}/>:page==='videos'?<Videos lang={lang}/>:<Home lang={lang}/>)}
