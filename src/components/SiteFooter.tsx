import { links, type Language } from '../content/site';
import { SocialIcon } from './SocialIcon';
import { useMediaConsent } from './MediaConsent';

type SiteFooterProps = { lang: Language; isHome?: boolean };

export function SiteFooter({ lang, isHome = false }: SiteFooterProps) {
  const base = import.meta.env.BASE_URL;
  const home = base + (lang === 'en' ? 'en/' : '');
  const archive = base + (lang === 'en' ? 'en/videos/' : 'videos/');
  const internship = isHome ? '#praktikum' : home + '#praktikum';
  const { openSettings } = useMediaConsent();
  return <footer className="footer"><div className="wrap"><div className="footer-top"><a className="brand" href={home}>nikvisuals<span className="brand-mark">.</span></a><div className="socials">{links.socials.filter((item) => item.platform !== 'facebook').map((item) => <a className="social-link" href={item.href} target="_blank" rel="noreferrer" key={item.label}><span><SocialIcon platform={item.platform} />{item.label}</span></a>)}</div></div><div className="footer-bottom"><a href={archive}>{lang === 'de' ? 'Videos' : 'Video work'}</a><a href={internship}>{lang === 'de' ? 'Praktikum' : 'Internships'}</a><a href={base + 'impressum/'}>{lang === 'de' ? 'Impressum' : 'Imprint'}</a><a href={base + 'datenschutz/'}>{lang === 'de' ? 'Datenschutz' : 'Privacy'}</a><button className="media-settings" type="button" onClick={openSettings}>{lang === 'de' ? 'Medien-Einstellungen' : 'Media settings'}</button></div></div></footer>;
}
