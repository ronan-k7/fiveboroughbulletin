import Link from "next/link";
import siteConfig from "@/data/siteConfig.json";
import FooterGlow from "./FooterGlow";
import FooterPattern from "./FooterPattern";
import FooterSocialIcons from "./FooterSocialIcons";

/**
 * Site footer, redesigned to match the header's deep-navy + electric-cyan
 * "circuit glow" language instead of sitting underneath it as a plain
 * white block. Reuses the header's exact visual vocabulary:
 *  - the same navy gradient surface as LatestNewsBar
 *  - FooterGlow / FooterPattern, dark-panel counterparts of
 *    HeaderGlow / HeaderPattern
 *  - the "Latest" badge treatment, reused here for the Sections label
 *  - the flag-pennant tagline mark from Logo, recolored for dark bg
 *  - FooterSocialIcons, styled like the header's search/account buttons
 * A 3px cyan gradient seam on top ties it visually to the header's cyan
 * accents (active nav underline, search button ring) rather than the
 * plain hairline the rest of the page uses between sections.
 */
export default function Footer() {
  const { footer } = siteConfig;

  return (
    <footer className="mt-auto">
      <div className="h-[3px] w-full bg-gradient-to-r from-header-cyan-dark via-header-cyan to-header-cyan-bright" />

      <div className="relative overflow-hidden bg-gradient-to-b from-header-navy via-header-navy to-header-navy-deep">
        <FooterGlow />
        <FooterPattern />

        <div className="relative mx-auto max-w-[1440px] px-6 py-12 md:py-14">
          {/* Logo */}
          <div className="flex justify-center">
            <Link
              href="/"
              aria-label={siteConfig.siteName}
              className="inline-flex flex-col items-center leading-none select-none"
            >
              <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide text-header-cyan-bright sm:text-[9px] md:text-[11px]">
                {siteConfig.tagline}
                <svg
                  width="12"
                  height="9"
                  viewBox="0 0 14 10"
                  fill="none"
                  className="-mb-0.5 shrink-0 md:h-2.5 md:w-3.5"
                  aria-hidden="true"
                >
                  <path d="M0 9L14 1V9H0Z" fill="var(--color-header-cyan-bright)" />
                </svg>
              </span>
              <span className="mt-0.5 font-serif text-3xl font-black tracking-tight text-white md:text-4xl">
                {siteConfig.siteName}
              </span>
            </Link>
          </div>

          <div className="mx-auto mt-7 h-px w-full max-w-3xl bg-white/10" />

          {/* Section links */}
          {footer.sections?.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-center">
              <span className="rounded-md bg-gradient-to-br from-header-cyan-bright to-header-cyan-dark px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-[0_0_14px_rgba(34,211,238,0.45)]">
                {footer.sectionsLabel}
              </span>
              {footer.sections.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-semibold uppercase tracking-wide text-white/80 transition-colors hover:text-header-cyan-bright"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Highlight tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-header-cyan-bright">
              {footer.highlightLabel}
            </span>
            {footer.highlightTags.map((tag) => (
              <Link
                key={tag.href}
                href={tag.href}
                className="font-serif text-sm italic text-white/60 transition-colors hover:text-header-cyan-bright"
              >
                {tag.label}
              </Link>
            ))}
          </div>

          {/* Legal links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
            {footer.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/50 transition-colors hover:text-header-cyan-bright"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bottom row */}
          <div className="mt-9 flex flex-col-reverse items-center gap-4 border-t border-white/10 pt-6 md:flex-row md:justify-between">
            <p className="text-xs text-white/45">{footer.copyright}</p>
            <FooterSocialIcons links={footer.socialLinks} />
          </div>
        </div>
      </div>
    </footer>
  );
}
