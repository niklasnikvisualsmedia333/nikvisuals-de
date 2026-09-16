import { useState } from 'react';
import { content, type Language } from '../content/site';

type CopyEmailButtonProps = { lang: Language; className?: string };

export function CopyEmailButton({ lang, className = 'copy-email' }: CopyEmailButtonProps) {
  const c = content[lang];
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText('info@nikvisuals.de');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = 'info@nikvisuals.de';
      document.body.append(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return <button className={className} type="button" onClick={copy}>{copied ? c.copied : c.copy}<span className="sr-only" aria-live="polite">{copied ? c.copied : ''}</span></button>;
}
