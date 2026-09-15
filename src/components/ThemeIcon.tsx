export function ThemeIcon({ light }: { light: boolean }) {
  return light
    ? <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    : <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M20 15.3A8.5 8.5 0 0 1 8.7 4 8.5 8.5 0 1 0 20 15.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}
