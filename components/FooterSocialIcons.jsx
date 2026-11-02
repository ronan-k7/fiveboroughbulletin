import { ICONS } from "./SocialIcons";

/**
 * Social icon buttons for the dark footer panel. Same glyph set as
 * SocialIcons (bordered light-bg version used in the mobile drawer), but
 * restyled as soft circular buttons with a cyan hover ring/glow — the
 * same icon-button language as the header's search and account buttons —
 * so the footer's social row reads as part of the same design system
 * instead of a plain bordered-icon list on a dark background.
 */
export default function FooterSocialIcons({ links, className = "", iconClassName = "h-4 w-4" }) {
  return (
    <ul className={`flex items-center gap-2.5 ${className}`}>
      {links.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/80 ring-1 ring-white/10 transition-all hover:bg-header-cyan/15 hover:text-header-cyan-bright hover:ring-header-cyan/50 hover:shadow-[0_0_16px_-2px_rgba(34,211,238,0.55)]"
          >
            <span className={iconClassName}>{ICONS[social.icon]}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
