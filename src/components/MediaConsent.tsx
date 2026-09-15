import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import type { Language } from '../content/site';

type Pending = { id: string; title: string; trigger?: HTMLElement };
type MediaContextValue = { openSettings: () => void; playVideo: (video: Pending) => void };
const MediaContext = createContext<MediaContextValue | null>(null);
const storageKey = 'nikvisuals-media-consent-v1';

export function MediaConsentProvider({ children, lang }: { children: ReactNode; lang: Language }) {
  const [ready, setReady] = useState(false), [allowed, setAllowed] = useState(false), [settings, setSettings] = useState(false), [pending, setPending] = useState<Pending | null>(null), [active, setActive] = useState<Pending | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null), de = lang === 'de';
  useEffect(() => { const stored = localStorage.getItem(storageKey); setAllowed(stored === 'allowed'); setSettings(stored === null); setReady(true); }, []);
  useEffect(() => { if (!active) return; closeButton.current?.focus(); const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setActive(null); active.trigger?.focus(); } }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [active]);
  const choose = (next: boolean) => { localStorage.setItem(storageKey, next ? 'allowed' : 'necessary'); setAllowed(next); setSettings(false); if (next && pending) { setActive(pending); setPending(null); } if (!next) { setActive(null); setPending(null); } };
  const openSettings = () => { setActive(null); setSettings(true); };
  const value = { openSettings, playVideo: (video: Pending) => { if (allowed) setActive(video); else { setPending(video); setSettings(true); } } };
  const closePlayer = () => { const trigger = active?.trigger; setActive(null); trigger?.focus(); };
  if (!ready) return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
  return <MediaContext.Provider value={value}>{children}{settings && <aside className="media-consent" aria-label={de ? 'Externe Medien' : 'External media'}><div><strong>{de ? 'Externe Medien' : 'External media'}</strong><p>{de ? 'YouTube-Videos werden erst geladen, wenn du externe Medien erlaubst. Ohne Zustimmung bleibt die Website vollständig nutzbar.' : 'YouTube videos load only when you allow external media. The website remains fully usable without permission.'}</p></div><div className="media-consent-actions"><button type="button" className="button button-quiet" onClick={() => choose(false)}>{de ? 'Nur notwendige' : 'Necessary only'}</button><button type="button" className="button button-accent" onClick={() => choose(true)}>{de ? 'YouTube erlauben' : 'Allow YouTube'}</button></div></aside>}{active && <div className="media-dialog-backdrop" role="presentation" onMouseDown={closePlayer}><section className="media-dialog" role="dialog" aria-modal="true" aria-label={active.title} onMouseDown={event => event.stopPropagation()}><div className="media-dialog-head"><strong>{active.title}</strong><div><button type="button" className="dialog-settings" onClick={openSettings}>{de ? 'Medien-Einstellungen' : 'Media settings'}</button><button ref={closeButton} type="button" aria-label={de ? 'Video schließen' : 'Close video'} onClick={closePlayer}>×</button></div></div><div className="media-player"><iframe title={active.title} src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div></section></div>}</MediaContext.Provider>;
}

export function useMediaConsent() { const context = useContext(MediaContext); if (!context) throw new Error('MediaConsentProvider is required'); return context; }
