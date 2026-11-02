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
 *  - the light (white + cyan) version of the logo, for the dark bg
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

        <div className="relative mx-auto max-w-[1440px] px-6 pb-0 pt-12 md:pt-14">
          {/* Logo */}
          <div className="flex justify-center">
            <Link
              href="/"
              aria-label={siteConfig.siteName}
              className="inline-flex items-center justify-center select-none"
            >
              <img
                src="/images/logo-light.webp"
                alt={siteConfig.siteName}
                width={1100}
                height={278}
                loading="lazy"
                decoding="async"
                className="block h-12 w-auto max-w-full md:h-16"
              />
            </Link>
          </div>

          <div className="mx-auto mt-7 h-px w-full max-w-3xl bg-white/10" />

          {/* Section links */}
          {footer.sections?.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-center">
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
          <div className="mt-9 flex flex-col-reverse items-center gap-4 border-t border-white/10 pb-4 pt-6 md:flex-row md:justify-between">
            <p className="text-xs text-white/45">{footer.copyright}</p>
            <FooterSocialIcons links={footer.socialLinks} />
          </div>
        </div>
      </div>
    </footer>
  );
}
