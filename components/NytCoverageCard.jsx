import Image from "next/image";
import { NYT_COVERAGE as c } from "@/lib/nytCoverage";

/**
 * "As reported by The New York Times" card for the centre-aligned article
 * layouts (CenteredArticle + ProfileArticle). The whole card is one link that
 * opens the NYT story in a new tab. Server-rendered, no client JS.
 *
 * Content lives in lib/nytCoverage.js; the screenshot is
 * /public/images/nytimes-alina-habba-mildon-loses-50-million-contract.webp
 */
export default function NytCoverageCard({ variant = "full" }) {
  if (variant === "compact") return <CompactCard />;
  return (
    <aside aria-label="Also reported by The New York Times" className="my-10 sm:my-14">
      <a
        href={c.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative grid overflow-hidden rounded-2xl bg-header-navy text-white shadow-[0_22px_50px_-22px_rgba(2,6,15,0.7)] ring-1 ring-black/10 transition hover:shadow-[0_26px_56px_-20px_rgba(14,165,233,0.45)] sm:grid-cols-[0.82fr_1.18fr]"
        style={{
          backgroundImage:
            "radial-gradient(28rem 14rem at 0% 0%, rgba(14,165,233,0.30), transparent 65%), radial-gradient(22rem 12rem at 100% 100%, rgba(34,211,238,0.14), transparent 65%)",
        }}
      >
        {/* screenshot */}
        <div className="relative p-4 sm:p-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/20 sm:aspect-[4/5]">
            <Image
              src={`/images/${c.image}`}
              alt={c.imageAlt}
              fill
              sizes="(min-width: 640px) 340px, 100vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/35 to-transparent"
            />
          </div>
        </div>

        {/* text */}
        <div className="flex flex-col justify-center px-5 pb-6 pt-1 sm:py-7 sm:pl-2 sm:pr-8">
          <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-header-cyan-bright">
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            Now in The New York Times
          </p>

          <h2 className="mt-3 text-balance font-serif text-[1.3rem] font-black leading-[1.2] sm:text-[1.55rem]">
            {c.headline}
          </h2>

          <figure className="mt-4">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" className="text-header-cyan-bright" aria-hidden="true">
              <path d="M9.4 5C5.8 6.2 3.5 9.1 3.5 13.1V19h6.7v-6.4H7c.1-2 1.2-3.6 3.2-4.4L9.4 5zm10 0c-3.6 1.2-5.9 4.1-5.9 8.1V19h6.7v-6.4H17c.1-2 1.2-3.6 3.2-4.4L19.4 5z" />
            </svg>
            <blockquote className="mt-1 text-pretty font-serif text-[1.02rem] italic leading-relaxed text-white/90 sm:text-[1.1rem]">
              {c.quote}
            </blockquote>
            <figcaption className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">
              The New York Times &middot; {c.byline} &middot; {c.date}
            </figcaption>
          </figure>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            {c.facts.map((f) => (
              <div key={f.value} className="flex flex-col rounded-lg border border-white/15 bg-white/5 px-3 py-2.5">
                <dt className="order-2 mt-1 text-[10.5px] font-bold uppercase leading-snug tracking-[0.1em] text-white/65">{f.label}</dt>
                <dd className="order-1 font-serif text-[1.5rem] font-black leading-none text-header-cyan-bright">{f.value}</dd>
              </div>
            ))}
          </dl>

          <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-header-cyan-bright">
            Read the full article on nytimes.com
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
            <span className="sr-only">(opens in a new tab)</span>
          </span>
        </div>
      </a>
    </aside>
  );
}

/** Compact strip: screenshot on top on phones (keeps its text readable), small thumbnail on the left from sm. */
function CompactCard() {
  return (
    <aside aria-label="Also reported by The New York Times" className="mt-10 sm:mt-12">
      <a
        href={c.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col overflow-hidden rounded-xl bg-header-navy text-white shadow-[0_14px_34px_-18px_rgba(2,6,15,0.7)] ring-1 ring-black/10 transition hover:shadow-[0_18px_40px_-16px_rgba(14,165,233,0.45)] sm:flex-row"
        style={{
          backgroundImage:
            "radial-gradient(20rem 10rem at 0% 0%, rgba(14,165,233,0.26), transparent 65%), radial-gradient(18rem 10rem at 100% 100%, rgba(34,211,238,0.12), transparent 65%)",
        }}
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-white sm:aspect-auto sm:w-36">
          <Image
            src={`/images/${c.image}`}
            alt={c.imageAlt}
            fill
            sizes="(min-width: 640px) 144px, 100vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>

        <div className="min-w-0 flex-1 px-4 py-4 sm:px-5">
          <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-header-cyan-bright">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
            Now in The New York Times
          </p>
          <h2 className="mt-2 text-balance font-serif text-[1.05rem] font-black leading-snug sm:text-[1.2rem]">{c.headline}</h2>
          <blockquote className="mt-2 border-l-2 border-header-cyan-bright pl-3 font-serif text-[13px] italic leading-relaxed text-white/80 sm:text-sm">
            “{c.quote}”
          </blockquote>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
            {c.byline} &middot; {c.date}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-header-cyan-bright">
            Read on nytimes.com
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
            <span className="sr-only">(opens in a new tab)</span>
          </span>
        </div>
      </a>
    </aside>
  );
}
