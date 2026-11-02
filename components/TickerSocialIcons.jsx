import Link from "next/link";

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
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.93 6 2.5 6S0 4.88 0 3.5 1.05 1 2.48 1s2.5 1.12 2.5 2.5zM.24 8.5h4.48V23H.24V8.5zM8.44 8.5h4.3v1.98h.06c.6-1.1 2.06-2.26 4.24-2.26 4.53 0 5.37 2.87 5.37 6.6V23h-4.48v-6.7c0-1.6-.03-3.66-2.3-3.66-2.31 0-2.66 1.75-2.66 3.55V23H8.44V8.5z" />
    </svg>
  ),
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Flat, unboxed white glyphs (Facebook / X / LinkedIn + search) shown in
 * the dark ticker bar — visually distinct from the bordered SocialIcons
 * used in the footer.
 */
export default function TickerSocialIcons({ links, className = "" }) {
  return (
    <ul className={`flex items-center gap-4 lg:gap-5 ${className}`}>
      {links.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-5 w-5 items-center justify-center text-white/90 transition-colors hover:text-header-cyan-bright"
          >
            {ICONS[social.icon]}
          </a>
        </li>
      ))}
      <li>
        <Link
          href="/search"
          aria-label="Search"
          className="flex h-5 w-5 items-center justify-center text-white/90 transition-colors hover:text-header-cyan-bright"
        >
          <SearchIcon />
        </Link>
      </li>
    </ul>
  );
}
