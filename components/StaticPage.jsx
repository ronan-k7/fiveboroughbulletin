import Link from "next/link";
import JsonLd from "./JsonLd";
import {
  LAST_UPDATED,
  LAST_UPDATED_DISPLAY,
  getStaticPage,
  getStaticPages,
  getStaticPageJsonLd,
} from "@/lib/staticPages";

/**
 * Building blocks for the site-information pages (About, Our Team, Source
 * Methodology, Right of Reply, Contact, Privacy, Terms, Legal).
 *
 * Looks like the rest of the site: the same deep-navy / cyan "glow" hero as
 * the centred article layout, Bitter headlines, Inter body text, hairline
 * rules and the teal brand colour for links. All server-rendered, no client JS.
 */

export function StaticPageShell({ slug, children }) {
  return (
    <div className="flex-1 bg-white">
      <JsonLd data={getStaticPageJsonLd(slug)} />
      {children}
    </div>
  );
}

/** Dark hero: breadcrumb, cyan eyebrow, big serif headline and standfirst. */
export function PageIntro({ slug, eyebrow, title, children }) {
  const page = getStaticPage(slug);
  return (
    <section
      className="relative isolate overflow-hidden bg-header-navy text-white"
      style={{
        backgroundImage:
          "radial-gradient(60rem 28rem at 50% -8%, rgba(14,165,233,0.30), transparent 62%), radial-gradient(34rem 22rem at 105% 70%, rgba(34,211,238,0.14), transparent 60%), radial-gradient(30rem 20rem at -5% 55%, rgba(14,116,144,0.22), transparent 60%)",
      }}
    >
      <div className="mx-auto max-w-[980px] px-5 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60"
        >
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white/85">{page?.label || title}</span>
        </nav>

        <p className="mt-8 font-sans text-[0.75rem] font-extrabold uppercase tracking-[0.22em] text-header-cyan-bright sm:text-[0.8rem]">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-balance font-serif text-[2rem] font-black leading-[1.12] tracking-[-0.01em] sm:text-5xl md:text-[3.25rem]">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl font-serif text-[1.05rem] leading-relaxed text-white/80 sm:mt-6 sm:text-xl sm:leading-9">
          {children}
        </p>
      </div>
    </section>
  );
}

/** Wrapper for everything under the hero. */
export function PageBody({ children }) {
  return <div className="mx-auto w-full max-w-[980px] px-5 pb-14 pt-2 sm:px-6 sm:pb-20">{children}</div>;
}

/** Two-column ruled section: label + heading on the left, body on the right. */
export function PageSection({ id, number, label, title, first = false, children }) {
  const rule = first ? "border-t-2 border-ink pt-7" : "border-t border-hairline pt-8";
  return (
    <section id={id} className={`mt-12 grid scroll-mt-24 gap-6 md:grid-cols-[0.72fr_1.28fr] md:gap-8 ${rule}`}>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-teal">
          {number} · {label}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-black leading-tight text-ink sm:text-3xl">{title}</h2>
      </div>
      <div className="space-y-4 text-base leading-7 text-ink-soft">{children}</div>
    </section>
  );
}

export function PageList({ children }) {
  return (
    <ul className="list-disc space-y-3 rounded-xl border border-hairline bg-neutral-50 py-5 pl-10 pr-5 marker:text-brand-teal">
      {children}
    </ul>
  );
}

/** Card used for grids (contact channels, coverage areas, ...). */
export function InfoCard({ title, children }) {
  return (
    <article className="flex flex-col rounded-xl border border-hairline bg-neutral-50 p-5">
      <h2 className="font-sans text-base font-extrabold text-ink">{title}</h2>
      {children}
    </article>
  );
}

/** Inline text link in the site's teal. */
export function TextLink({ href, children }) {
  const className =
    "font-bold text-brand-teal underline decoration-brand-teal/30 underline-offset-4 transition-colors hover:decoration-brand-teal";
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function PageFooter({ current }) {
  const group = getStaticPage(current)?.group;
  const siblings = getStaticPages().filter((p) => p.slug !== current && p.group === group);
  // Pages that explain how the site works also point to Contact.
  const extras = group === "about" ? [{ label: "Contact", href: "/contact" }] : [];
  const pillClass =
    "rounded-full border border-hairline px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand-teal hover:text-brand-teal";

  return (
    <div className="mt-12 border-t border-hairline pt-6">
      <p className="text-sm text-ink-soft">
        Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED_DISPLAY}</time>
      </p>
      <nav aria-label="Related pages" className="mt-4 flex flex-wrap gap-2">
        {siblings.map((p) => (
          <Link key={p.slug} href={p.path} className={pillClass}>
            {p.label}
          </Link>
        ))}
        {extras.map((item) => (
          <Link key={item.href} href={item.href} className={pillClass}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
