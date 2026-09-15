import type { SocialPlatform } from '../content/site';

type SocialIconProps = { platform: SocialPlatform };

export function SocialIcon({ platform }: SocialIconProps) {
  return (
    <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
      {platform === 'linkedin' && <path fill="currentColor" d="M5.2 8.3H1.8V22h3.4V8.3ZM3.5 2A2 2 0 1 0 3.5 6a2 2 0 0 0 0-4ZM8.9 8.3H12v1.9h.1c.4-.8 1.5-2.2 3.8-2.2 4 0 4.7 2.6 4.7 6V22h-3.4v-7.1c0-1.7 0-3.8-2.3-3.8s-2.6 1.8-2.6 3.7V22H8.9V8.3Z" />}
      {platform === 'instagram' && <><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="2" /><circle cx="17.35" cy="6.65" r="1.15" fill="currentColor" /></>}
      {platform === 'youtube' && <path fill="currentColor" d="M23.3 7.1a3 3 0 0 0-2.1-2.1C19.3 4.5 12 4.5 12 4.5s-7.3 0-9.2.5A3 3 0 0 0 .7 7.1 31 31 0 0 0 .2 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.1c1.9.5 9.2.5 9.2.5s7.3 0 9.2-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM9.7 15.7V8.3l6.2 3.7-6.2 3.7Z" />}
      {platform === 'facebook' && <path fill="currentColor" d="M13.8 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.6 1.7-1.6H17V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.5H8.2V14h2.6v8h3Z" />}
    </svg>
  );
}
