import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import { formatLongDate } from "@/lib/format";

/**
 * Homepage "Politics & Puerto Rico" section.
 *
 * Deliberately unlike the other homepage blocks: a full-width deep-navy
 * "ledger" panel split into two desks (Washington | San Juan). Each desk has
 * one lead story (photo, headline, excerpt, date) followed by numbered
 * compact rows with thumbnails. Everything is dark-on-navy so it reads as a
 * separate feature band between the white Business and Finance sections.
 *
 * Props are plain arrays of articles already resolved with `withRelations`
 * (newest first). The page decides which stories go in; this component only
 * lays them out. It renders nothing if both desks are empty.
 *
 * Responsive: below `lg` the two desks stack (Politics first), and each
 * desk's numbered rows keep their thumbnail on the right so headlines never
 * get squeezed.
 */
export default function PoliticsPuertoRicoSection({ politics = [], puertoRico = [] }) {
  if (politics.length === 0 && puertoRico.length === 0) return null;

  return (
    <section
      aria-labelledby="politics-pr-heading"
      className="relative mt-10 overflow-hidden bg-header-navy text-white"
    >
      {/* Accent rule + soft glow, echoing the header's navy/cyan palette. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-header-cyan-dark via-header-cyan-bright to-header-cyan" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-header-cyan/10 blur-3xl" />

      <div className="relative px-4 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-9">
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-white/15 pb-4">
          <h2 id="politics-pr-heading" className="font-serif text-2xl font-black leading-tight sm:text-[2rem]">
            Politics &amp; Puerto Rico
          </h2>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-0">
          <Desk
            eyebrow="Washington"
            title="Politics"
            href="/politics"
            items={politics}
            className="lg:pr-8"
          />
          <Desk
            eyebrow="San Juan"
            title="Puerto Rico"
            href="/puerto-rico"
            items={puertoRico}
            className="lg:border-l lg:border-white/15 lg:pl-8"
          />
        </div>
      </div>
    </section>
  );
}

function Desk({ eyebrow, title, href, items, className = "" }) {
  const [lead, ...rest] = items;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.16em] text-white">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-header-cyan-bright" />
          {title}
          <span className="font-semibold normal-case tracking-normal text-white/45">/ {eyebrow}</span>
        </h3>
        <Link
          href={href}
          className="shrink-0 text-xs font-bold uppercase tracking-wide text-header-cyan-bright transition-colors hover:text-white"
        >
          All {title} &rarr;
        </Link>
      </div>

      {lead ? (
        <>
          <Lead article={lead} />
          {rest.length > 0 && (
            <ol className="mt-6 divide-y divide-white/15 border-t border-white/15">
              {rest.map((a, i) => (
                <Row key={`${a.category}-${a.slug}`} article={a} number={i + 2} />
              ))}
            </ol>
          )}
        </>
      ) : (
        <p className="mt-6 text-sm text-white/55">New stories are on the way.</p>
      )}
    </div>
  );
}

function Lead({ article }) {
  const href = `/${article.category}/${article.slug}`;
  const when = formatLongDate(article.date);

  return (
    <article className="group mt-5">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block overflow-hidden [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.03]"
      >
        <ImagePlaceholder
          className="aspect-[16/10] w-full"
          src={article.image}
          position={article.imagePosition}
          alt=""
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
        <span className="absolute left-0 top-0 bg-header-cyan-bright px-3 py-1.5 font-serif text-lg font-black leading-none text-header-navy">
          01
        </span>
      </Link>
      <h4 className="mt-4 font-serif text-[1.35rem] font-black leading-[1.2] sm:text-[1.6rem]">
        <Link href={href} className="decoration-header-cyan-bright decoration-[3px] underline-offset-4 hover:underline">
          {article.title}
        </Link>
      </h4>
      {article.excerpt && (
        <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-white/70">{article.excerpt}</p>
      )}
      <p className="mt-3 text-[13px] text-white/55">
        <time dateTime={article.date} className="font-semibold text-white/80">
          {when}
        </time>
      </p>
    </article>
  );
}

function Row({ article, number }) {
  const href = `/${article.category}/${article.slug}`;

  return (
    <li className="flex items-start gap-4 py-4">
      <span aria-hidden="true" className="w-8 shrink-0 pt-0.5 font-serif text-2xl font-black leading-none text-header-cyan-bright/80">
        {String(number).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="font-serif text-[1.05rem] font-bold leading-snug sm:text-lg">
          <Link href={href} className="transition-colors hover:text-header-cyan-bright">
            {article.title}
          </Link>
        </h4>
        <p className="mt-1.5 text-[13px] text-white/55">
          <time dateTime={article.date}>{formatLongDate(article.date)}</time>
        </p>
      </div>
      <Link href={href} tabIndex={-1} aria-hidden="true" className="shrink-0">
        <ImagePlaceholder
          className="h-20 w-24 sm:h-[88px] sm:w-28"
          src={article.image}
          position={article.imagePosition}
          alt=""
          sizes="112px"
        />
      </Link>
    </li>
  );
}
