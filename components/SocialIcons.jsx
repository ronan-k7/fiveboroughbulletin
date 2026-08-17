const ICONS = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.6h2.6l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.28c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.4-3.9 4V10.4H8v3h2.36V21h3.14z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.5L4.6 21H1.4l7.5-8.6L1 3h6.5l4.5 6L17.5 3zm-1.1 16h1.8L7.7 5H5.8l10.6 14z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.7 2h2.6c.16 1.2.72 2.24 1.6 3.02.88.77 1.98 1.2 3.1 1.24v2.66c-1.55-.03-3-.5-4.24-1.33v6.6c0 3.29-2.68 5.81-5.96 5.81-3.28 0-5.96-2.52-5.96-5.81 0-3.15 2.42-5.63 5.5-5.79v2.7a3.1 3.1 0 0 0-1.14-.22c-1.7 0-3.08 1.38-3.08 3.31 0 1.72 1.38 3.31 3.08 3.31 1.7 0 3.24-1.4 3.24-3.31V2z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.7a2.9 2.9 0 0 0-2-2C17.9 5.2 12 5.2 12 5.2s-5.9 0-7.6.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.3 2.9 2.9 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.3zM10 15.2V8.8L15.5 12 10 15.2z" />
    </svg>
  ),
  flipboard: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 3h18v6h-9v3h6v3h-6v6H9v-9H3V3z" />
    </svg>
  ),
};

export default function SocialIcons({ links, className = "", iconClassName = "w-4 h-4" }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {links.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-7 w-7 items-center justify-center rounded border border-ink text-ink hover:bg-ink hover:text-white transition-colors"
          >
            <span className={iconClassName}>{ICONS[social.icon]}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
