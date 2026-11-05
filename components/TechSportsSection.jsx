import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import { formatLongDate } from "@/lib/format";

/**
 * Homepage "Technology & Sports" section.
 *
 * Layout is intentionally different from every other homepage block:
 *   - sits on a soft slate-tinted band (the others are white or dark navy)
 *   - LEFT (7/12): Technology, one big photo card with the headline laid over
 *     the image, then two text-only "briefing" cards with a teal top rule
 *   - RIGHT (5/12): Sports, a stack of three white "scorecards" with an amber
 *     left edge and a small thumbnail on the right
 *
 * Props are arrays of articles already resolved with `withRelations`, newest
 * first. The page decides which stories go in; this component only lays them
 * out. Renders nothing when both lists are empty. Below `lg` the two columns
 * stack (Technology first).
 */
export default function TechSportsSection({ technology = [], sports = [] }) {
  if (technology.length === 0 && sports.length === 0) return null;

  return (
    <section
      aria-labelledby="tech-sports-heading"
      className="mt-10 bg-slate-100 px-4 py-8 sm:px-8 sm:py-10"
    >
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 id="tech-sports-heading" className="font-serif text-2xl font-black leading-tight text-ink sm:text-[2rem]">
          Technology <span className="text-amber-600">&amp;</span> Sports
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/technology"
            className="rounded-full bg-brand-teal px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-teal-dark"
          >
            More Technology &rarr;
          </Link>
          <Link
            href="/sports"
            className="rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-amber-400"
          >
            More Sports &rarr;
          </Link>
        </div>
      </header>

      <div className="mt-7 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <TechColumn items={technology} />
        <SportsColumn items={sports} />
      </div>
    </section>
  );
}

function hrefOf(article) {
  return `/${article.category}/${article.slug}`;
}

/* ------------------------------ Technology ------------------------------ */

function TechColumn({ items }) {
  const [lead, ...rest] = items;

  return (
    <div className="lg:col-span-7">
      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-teal">
        <span aria-hidden="true" className="h-0.5 w-6 bg-brand-teal" />
        Technology
      </p>

      {lead ? (
        <Link
          href={hrefOf(lead)}
          className="group relative mt-3 block overflow-hidden bg-ink [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.03]"
        >
          <ImagePlaceholder
            className="aspect-[4/3] w-full sm:aspect-[16/10]"
            src={lead.image}
            position={lead.imagePosition}
            alt=""
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
          />
          <span className="absolute inset-x-0 bottom-0 block p-4 sm:p-6">
            <span className="block font-serif text-[1.35rem] font-black leading-[1.2] text-white decoration-header-cyan-bright decoration-[3px] underline-offset-4 group-hover:underline sm:text-[1.9rem]">
              {lead.title}
            </span>
            <span className="mt-2 block text-[13px] font-semibold text-white/80">{formatLongDate(lead.date)}</span>
          </span>
        </Link>
      ) : (
        <p className="mt-4 text-sm text-ink-soft">New stories are on the way.</p>
      )}

      {rest.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rest.map((a) => (
            <article key={`${a.category}-${a.slug}`} className="border-t-4 border-brand-teal bg-white p-4 shadow-sm">
              <time dateTime={a.date} className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
                {formatLongDate(a.date)}
              </time>
              <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-ink">
                <Link href={hrefOf(a)} className="decoration-2 underline-offset-2 hover:underline">
                  {a.title}
                </Link>
              </h3>
              {a.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{a.excerpt}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Sports -------------------------------- */

function SportsColumn({ items }) {
  return (
    <div className="lg:col-span-5">
      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-700">
        <span aria-hidden="true" className="h-0.5 w-6 bg-amber-500" />
        Sports
      </p>

      {items.length > 0 ? (
        <ol className="mt-3 space-y-4">
          {items.map((a) => (
            <li key={`${a.category}-${a.slug}`}>
              <article className="group flex items-stretch gap-4 border-l-4 border-amber-500 bg-white p-4 shadow-sm">
                <div className="min-w-0 flex-1">
                  <time dateTime={a.date} className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    {formatLongDate(a.date)}
                  </time>
                  <h3 className="mt-1.5 font-serif text-[1.05rem] font-bold leading-snug text-ink sm:text-lg">
                    <Link href={hrefOf(a)} className="decoration-2 underline-offset-2 hover:underline">
                      {a.title}
                    </Link>
                  </h3>
                </div>
                <Link href={hrefOf(a)} tabIndex={-1} aria-hidden="true" className="shrink-0 self-center">
                  <ImagePlaceholder
                    className="h-20 w-24 sm:h-[88px] sm:w-28"
                    src={a.image}
                    position={a.imagePosition}
                    alt=""
                    sizes="112px"
                  />
                </Link>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-sm text-ink-soft">New stories are on the way.</p>
      )}
    </div>
  );
}
