import { type FormEvent, useState } from 'react';
import { content, links, type Language } from '../content/site';
import { Arrow } from '../components/Arrow';

const ids = ['leistungen', 'arbeiten', 'ueber-mich', 'kontakt'];

function ContactForm({ lang }: { lang: Language }) {
 const c = content[lang];
 const [submitted, setSubmitted] = useState(false);
 const [hasErrors, setHasErrors] = useState(false);
 const submit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!event.currentTarget.checkValidity()) { setHasErrors(true); event.currentTarget.reportValidity(); return; }
  setHasErrors(false);
  setSubmitted(true);
 };
 return <form className="contact-form" noValidate onSubmit={submit} onInput={() => setSubmitted(false)}>
  {hasErrors && <p className="form-error" role="alert">{c.form.error}</p>}
  <div className="form-grid">
   <label>{c.form.name}<span aria-hidden="true">*</span><input name="name" autoComplete="name" required maxLength={80} aria-invalid={hasErrors || undefined} /></label>
   <label>{c.form.email}<span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" required maxLength={120} aria-invalid={hasErrors || undefined} /></label>
   <label>{c.form.company}<input name="company" autoComplete="organization" maxLength={100} /></label>
   <label className="form-message">{c.form.message}<span aria-hidden="true">*</span><textarea name="message" required maxLength={1200} rows={5} aria-invalid={hasErrors || undefined} /></label>
  </div>
  <label className="consent"><input type="checkbox" required aria-invalid={hasErrors || undefined} /><span>{c.form.consentBefore} <a href="#datenschutz">{c.form.privacy}</a>{c.form.consentAfter}<span aria-hidden="true">*</span></span></label>
  <div className="form-action"><button className="button button-accent" type="submit">{c.form.submit}<Arrow diagonal /></button><span className="form-note">{c.form.note}</span></div>
  {submitted && <p className="form-preview" role="status">{c.form.preview} <a href={links.email}>info@nikvisuals.de</a>.</p>}
 </form>;
}

export function Home({ lang }: { lang: Language }) {
 const c = content[lang];
 const [open, setOpen] = useState(false);
 const base = import.meta.env.BASE_URL;
 return <>
  <a href="#main" className="skip-link">{c.skip}</a>
  <header className="header" onKeyDown={e => { if (e.key === 'Escape' && open) setOpen(false); }}>
   <div className="wrap header-inner">
    <a href={base + (lang === 'en' ? 'en/' : '')} className="brand" aria-label="NikVisuals — Home">nikvisuals<span className="brand-mark" aria-hidden="true">.</span></a>
    <nav className="desktop-nav" aria-label={lang === 'de' ? 'Hauptnavigation' : 'Main navigation'}>{c.nav.slice(0, 3).map((n, i) => <a href={'#' + ids[i]} key={n}>{n}</a>)}</nav>
    <div className="header-end"><nav className="languages" aria-label={c.language}><a href={base} hrefLang="de" lang="de" aria-current={lang === 'de' ? 'page' : undefined}>DE</a><span>/</span><a href={base + 'en/'} hrefLang="en" lang="en" aria-current={lang === 'en' ? 'page' : undefined}>EN</a></nav><a className="header-contact" href="#kontakt">{c.nav[3]}<Arrow diagonal /></a><button className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? c.close : c.menu}<span aria-hidden="true">{open ? '−' : '+'}</span></button></div>
    <nav id="mobile-nav" className="mobile-nav" hidden={!open} aria-label={lang === 'de' ? 'Mobile Navigation' : 'Mobile navigation'}>{c.nav.map((n, i) => <a href={'#' + ids[i]} key={n} onClick={() => setOpen(false)}>{n}<Arrow /></a>)}</nav>
   </div>
  </header>
  <main id="main">
   <section className="hero" aria-labelledby="hero-title"><div className="wrap hero-layout">
    <div className="hero-copy"><p className="eyebrow hero-eyebrow"><span className="spark" aria-hidden="true">✦</span>{c.eyebrow}</p><h1 id="hero-title"><span>{c.headline}</span><span className="hero-secondary">{c.headlineEnd}</span></h1><p className="hero-intro">{c.intro}</p><div className="hero-actions"><a href="#kontakt" className="button button-accent">{c.cta}<Arrow diagonal /></a><a href="#arbeiten" className="text-link">{c.workCta}<Arrow /></a></div></div>
    <div className="hero-media" aria-label={c.heroMediaLabel}><div className="hero-image hero-image-main"><img src={base + 'images/hilchenbach.jpg'} width="1280" height="720" alt={c.heroMediaAlt} /></div><div className="hero-image hero-image-side"><img src={base + 'images/lapstore.jpg'} width="1280" height="720" alt="" /></div><div className="hero-stamp"><span>nikvisuals</span><span>AI · Growth · Marketing</span><b>01</b></div></div>
   </div><div className="hero-marquee" aria-hidden="true"><span>Research / Strategie / Workflows / Content-Systeme / Umsetzung / </span><span>Research / Strategie / Workflows / Content-Systeme / Umsetzung / </span></div></section>
   <section id="leistungen" className="focus section" aria-labelledby="services-title"><div className="wrap"><div className="section-top"><p className="eyebrow">{c.serviceLabel}</p><h2 id="services-title">{c.serviceTitle}</h2></div><div className="focus-list">{c.services.map((s, i) => <article className="focus-row" key={s.name}><span className="focus-index">0{i + 1}</span><h3>{s.name}</h3><p>{s.text}</p><ul>{s.tags.map(t => <li key={t}>{t}</li>)}</ul><span className="focus-arrow"><Arrow diagonal /></span></article>)}</div></div></section>
   <section className="bridge-section"><div className="wrap bridge-grid"><div><p className="eyebrow">{c.bridgeLabel}</p><h2>{c.bridgeTitle}</h2></div><p className="bridge-copy">{c.bridge}</p><div className="markers">{c.markers.map(m => <div key={m.title}><strong>{m.title}</strong><span>{m.text}</span></div>)}</div></div></section>
   <section id="arbeiten" className="work section" aria-labelledby="work-title"><div className="wrap"><div className="work-heading"><div><p className="eyebrow">{c.workLabel}</p><h2 id="work-title">{c.workTitle}</h2></div><p>{c.workIntro}</p></div><div className="case-layout">{c.cases.map((p, i) => <article className={'case case-' + p.type + ' case-' + (i + 1)} key={p.name}>{p.image ? <a className="case-visual photo" href={p.video} target="_blank" rel="noreferrer" aria-label={`${p.name}: ${c.video}`}><img src={base + 'images/' + p.image} alt={p.alt} width="1280" height="720" loading="lazy" decoding="async"/><span className="play"><svg aria-hidden="true" width="15" height="18" viewBox="0 0 15 18"><path d="m1 1 13 8-13 8z" fill="currentColor" /></svg></span><span className="film-caption">{c.video}<Arrow diagonal /></span></a> : <div className={'case-visual art ' + p.type} aria-label={`${p.name}: ${c.artwork}`}><span className="art-caption">{p.category}</span><span className="art-title">{c.artTitles[p.type === 'industrial' ? 0 : 1]}</span><span className="art-footer">{c.artwork}<span aria-hidden="true">0{i + 1}</span></span></div>}<div className="case-meta"><h3>{p.name}</h3><span>{p.category}</span></div><p className="case-description">{p.text}</p></article>)}</div></div>
    <aside className="collaboration" aria-label={c.collaborationTitle}><div className="wrap collaboration-inner"><p><strong>{c.collaborationTitle}</strong><span>{c.collaborationSubtitle}</span></p><div className="collaboration-names">{c.collaborators.map(name => <span key={name}>{name}</span>)}</div></div></aside>
   </section>
   <section id="ueber-mich" className="about section" aria-labelledby="about-title"><div className="wrap about-grid"><figure className="about-media"><img src={base + 'images/behind-the-scenes.jpg'} width="1200" height="675" alt={c.aboutAlt} loading="lazy" decoding="async"/><figcaption>{c.aboutCaption}</figcaption></figure><div className="about-copy"><p className="eyebrow">{c.aboutLabel}</p><h2 id="about-title">{c.aboutTitle}</h2><p>{c.about}</p><p className="about-signal">{c.aboutSignal}</p></div></div></section>
   <section id="kontakt" className="contact section" aria-labelledby="contact-title"><div className="wrap contact-grid"><div className="contact-intro"><p className="eyebrow">{c.contactLabel}</p><h2 id="contact-title">{c.contactTitle}<span>.</span></h2><p>{c.contactText}</p><a className="email" href={links.email}>info@nikvisuals.de<Arrow diagonal /></a></div><ContactForm lang={lang} /></div></section>
  </main>
  <footer id="datenschutz" className="footer"><div className="wrap"><div className="footer-top"><a className="brand" href={base + (lang === 'en' ? 'en/' : '')}>nikvisuals<span className="brand-mark" aria-hidden="true">.</span></a><span>{c.footer}</span><div className="socials">{links.socials.map(l => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}<Arrow diagonal /></a>)}</div></div><div className="footer-bottom"><span>{c.preview}</span><a href="https://www.nikvisuals.de/impressum" target="_blank" rel="noreferrer">{c.legal}<Arrow diagonal /></a></div><details className="privacy"><summary>{c.privacy}</summary><p>{c.privacyText} <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">{c.githubPrivacy}<Arrow diagonal /></a></p></details></div></footer>
 </>;
}
