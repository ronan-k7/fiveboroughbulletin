import Link from "next/link";
import siteConfig from "@/data/siteConfig.json";
import SocialIcons from "./SocialIcons";

export default function Footer() {
  const { footer } = siteConfig;

  return (
    <footer className="mt-auto border-t border-hairline-dark bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-8 md:py-10">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center gap-1" aria-label={siteConfig.siteName}>
            <span className="font-serif text-3xl font-black text-ink">{siteConfig.siteName}</span>
          </Link>
        </div>

        {/* Highlight tags */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
          <span className="text-sm font-bold text-ink">{footer.highlightLabel}</span>
          {footer.highlightTags.map((tag) => (
            <Link
              key={tag.href}
              href={tag.href}
              className="font-serif text-sm italic text-ink-soft hover:text-brand-teal transition-colors"
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
              className="text-sm text-link hover:text-brand-teal transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col-reverse items-center gap-4 border-t border-hairline pt-5 md:flex-row md:justify-between">
          <p className="text-xs text-ink-soft">{footer.copyright}</p>
          <SocialIcons links={footer.socialLinks} />
        </div>
      </div>
    </footer>
  );
}
