import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import ArticleCard from "./ArticleCard";
import RichText from "./RichText";
import { ICONS } from "./SocialIcons";
import { absoluteUrl, articleImageAlt, articlePath } from "@/lib/seo";
import { bodyPlainText } from "@/lib/richText";
import { formatLongDate, readingMinutes } from "@/lib/format";

/**
 * Centre-aligned feature layout for an article page. Used automatically for
 * any article whose JSON has  "layout": "centered"  (the standard two-column
 * layout with the right rail is used for everything else).
 *
 * Anatomy, top to bottom:
 *   1. Dark hero  - breadcrumb + category chip, big centred headline (the
 *                   text before a ":" becomes a cyan kicker), standfirst,
 *                   byline row.
 *   2. Lead photo - overlaps the hero's lower edge; 4:3 on phones, 16:9 from
 *                   `sm` up. `imagePosition` in the JSON keeps faces in frame.
 *   3. Body       - one centred reading column (max-w-[58.25rem], ~885px of text): drop cap, inline
 *                   links, pull quote and stat-card blocks.
 *   4. Footer     - share links, sources, author box
 *                   and a "Keep reading" grid that links on to other stories.
 *
 * A  { "type": "timeline", title, eyebrow, items: [{ date, text }] }  block in
 * the article content renders a centred timeline (alternating sides from `sm` up).
 *
 * Everything is server-rendered HTML (no client JS), so it is fast and fully
 * crawlable. Headline + standfirst carry `data-speakable` for the JSON-LD.
 */
export default function CenteredArticle({ article, keepReading = [] }) {
  const { categoryInfo, authorInfo } = article;
  const url = absoluteUrl(articlePath(article));
  const plain = bodyPlainText(article.content);
  const minutes = readingMinutes(plain);

  // "The $50 Million Question: Alina Habba's Deal ..." -> kicker + headline.
  const colon = article.title.indexOf(": ");
  const hasLead = colon > 0 && colon <= 48;
  const lead = hasLead ? article.title.slice(0, colon) : null;
  const headline = hasLead ? article.title.slice(colon + 2) : article.title;

  const lastParaIndex = findLastParagraphIndex(article.content || []);
  const firstParaIndex = (article.content || []).findIndex((b) => typeof b === "string");

  return (
    <article className="flex-1 bg-white">
      {/* ------------------------------------------------------------ hero */}
      <section
        className="relative isolate overflow-hidden bg-header-navy text-white"
        style={{
          backgroundImage:
            "radial-gradient(60rem 28rem at 50% -8%, rgba(14,165,233,0.30), transparent 62%), radial-gradient(34rem 22rem at 105% 70%, rgba(34,211,238,0.14), transparent 60%), radial-gradient(30rem 20rem at -5% 55%, rgba(14,116,144,0.22), transparent 60%)",
        }}
      >
        <div className="mx-auto max-w-4xl px-5 pb-9 pt-7 text-center sm:px-6 sm:pb-12 sm:pt-12">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            {categoryInfo && (
              <Link
                href={`/${categoryInfo.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-header-cyan-bright/50 bg-header-cyan-bright/10 px-3 py-1 text-header-cyan-bright transition-colors hover:bg-header-cyan-bright hover:text-header-navy"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                {categoryInfo.label}
              </Link>
            )}
          </nav>

          <h1
            data-speakable
            className="mt-6 text-balance font-serif text-[1.75rem] font-black leading-[1.14] tracking-[-0.01em] sm:mt-8 sm:text-[2.6rem] md:text-[3.1rem]"
          >
            {lead && (
              <>
                <span className="mb-3 block font-sans text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-header-cyan-bright sm:mb-4 sm:text-[0.8rem]">
                  {lead}
                </span>
                <span className="sr-only">: </span>
              </>
            )}
            {headline}
          </h1>

          {article.excerpt && (
            <p
              data-speakable
              className="mx-auto mt-5 max-w-2xl text-balance font-serif text-[1.02rem] italic leading-relaxed text-white/80 sm:mt-6 sm:text-xl"
            >
              {article.excerpt}
            </p>
          )}

          {/* byline */}
          <div className="mt-7 flex flex-col items-center gap-3 sm:mt-8">
            <Link
              href={`/authors/${authorInfo.slug}`}
              rel="author"
              className="group inline-flex items-center gap-3"
            >
              <ImagePlaceholder
                className="h-10 w-10 shrink-0 border-white/30!"
                rounded="rounded-full"
                label=""
                alt=""
                src={authorInfo.image}
              />
              <span className="text-left leading-tight">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">By</span>
                <span className="block text-sm font-bold text-white group-hover:underline">{authorInfo.name}</span>
              </span>
            </Link>
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] text-white/65 sm:gap-x-3 sm:text-[13px]">
              {article.dateline && <span className="font-bold uppercase tracking-[0.1em] text-white/85 sm:tracking-[0.14em]">{article.dateline}</span>}
              {article.dateline && <span aria-hidden="true">&middot;</span>}
              <time dateTime={article.date}>{formatLongDate(article.date)}</time>
              {article.time && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>{article.time}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* lead photo: straddles the hero's lower edge (lower half sits on white) */}
        <div className="relative sm:px-6 before:absolute before:inset-x-0 before:bottom-0 before:h-1/2 before:bg-white before:content-['']">
          <figure className="relative mx-auto max-w-5xl">
            <ImagePlaceholder
              className="aspect-[4/3] w-full shadow-[0_24px_60px_-20px_rgba(2,6,15,0.75)] sm:aspect-[16/9]"
              rounded="sm:rounded-xl"
              src={article.image}
              position={article.imagePosition}
              alt={articleImageAlt(article)}
              width={1672}
              height={941}
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
            />
          </figure>
        </div>
      </section>

      {article.imageCaption && (
        <p className="mx-auto mt-3 max-w-5xl px-5 text-center text-xs text-ink-soft sm:px-6">{article.imageCaption}</p>
      )}

      {/* ------------------------------------------------------------ body */}
      <div className="mx-auto w-full max-w-[58.25rem] px-5 pb-4 pt-9 sm:px-6 sm:pt-12">
        {(article.content || []).map((block, idx) => {
          if (typeof block === "string") {
            const isFirst = idx === firstParaIndex;
            return (
              <p
                key={idx}
                className={`font-serif text-[1.075rem] leading-[1.85] text-ink sm:text-[1.2rem] ${idx === 0 ? "" : "mt-6"} ${
                  isFirst
                    ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-black first-letter:text-brand-teal first-letter:text-[3.9rem] first-letter:leading-[0.8] sm:first-letter:text-[4.7rem]"
                    : ""
                }`}
              >
                <RichText text={block} />
                {idx === lastParaIndex && (
                  <span className="ml-2 inline-block h-2 w-2 bg-brand-teal align-middle" aria-hidden="true" />
                )}
              </p>
            );
          }
          if (block?.type === "pullquote") return <PullQuote key={idx} block={block} />;
          if (block?.type === "stats") return <StatCard key={idx} block={block} />;
          if (block?.type === "timeline") return <TimelineBlock key={idx} block={block} />;
          return null;
        })}
      </div>

      {/* ---------------------------------------------------------- footer */}
      <div className="mx-auto w-full max-w-[58.25rem] px-5 pb-12 sm:px-6">
        <ShareRow title={article.seoTitle || article.title} url={url} />

        {article.sources?.length > 0 && (
          <aside aria-labelledby="sources-heading" className="mt-10 rounded-xl border border-hairline bg-neutral-50 p-5 sm:p-6">
            <h2 id="sources-heading" className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-teal">
              Sources &amp; further reading
            </h2>
            <ul className="mt-4 divide-y divide-hairline">
              {article.sources.map((s) => (
                <li key={s.url} className="py-3 first:pt-0 last:pb-0">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">{s.publisher}</span>
                    <span className="mt-0.5 block font-serif text-[15.5px] font-semibold leading-snug text-ink underline decoration-brand-teal/0 decoration-2 underline-offset-4 transition group-hover:text-brand-teal group-hover:decoration-brand-teal">
                      {s.label}
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5 inline-block" aria-hidden="true">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {article.topics?.length > 0 && (
          <aside aria-labelledby="topics-heading" className="mt-6 rounded-xl border border-hairline bg-neutral-50 p-5 sm:p-6">
            <h2 id="topics-heading" className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-teal">
              Topics
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center rounded-full border border-brand-teal/30 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-teal sm:text-xs"
                >
                  {topic}
                </span>
              ))}
            </div>
          </aside>
        )}

        <AuthorBox author={authorInfo} />
      </div>

      {/* --------------------------------------------------- keep reading */}
      {keepReading.length > 0 && (
        <section aria-labelledby="keep-reading" className="border-t-2 border-ink bg-neutral-50">
          <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-6 sm:py-12">
            <h2 id="keep-reading" className="flex items-center justify-center gap-2 font-sans text-sm font-extrabold uppercase tracking-[0.18em] text-ink">
              <span className="inline-block h-4 w-1.5 -skew-x-12 bg-brand-teal" aria-hidden="true" />
              Keep reading
            </h2>
            <div className="mt-7 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {keepReading.map((a) => (
                <ArticleCard key={`${a.category}-${a.slug}`} article={a} variant="grid" imageAspect="aspect-[4/3]" />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function findLastParagraphIndex(content) {
  for (let i = content.length - 1; i >= 0; i--) if (typeof content[i] === "string") return i;
  return -1;
}

/* ---------------------------------------------------------------- blocks */

function PullQuote({ block }) {
  return (
    <figure className="my-10 text-center sm:my-14">
      <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor" className="mx-auto text-brand-teal" aria-hidden="true">
        <path d="M9.4 5C5.8 6.2 3.5 9.1 3.5 13.1V19h6.7v-6.4H7c.1-2 1.2-3.6 3.2-4.4L9.4 5zm10 0c-3.6 1.2-5.9 4.1-5.9 8.1V19h6.7v-6.4H17c.1-2 1.2-3.6 3.2-4.4L19.4 5z" />
      </svg>
      <blockquote cite={block.href} className="mt-3 text-balance font-serif text-[1.6rem] font-black italic leading-[1.25] text-ink sm:text-[2.2rem]">
        {block.text}
      </blockquote>
      <span className="mx-auto mt-5 block h-0.5 w-12 bg-brand-teal" aria-hidden="true" />
      {(block.cite || block.href) && (
        <figcaption className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-ink-soft">
          {block.cite}
          {block.href && (
            <>
              {block.cite && <span aria-hidden="true"> &middot; </span>}
              <a
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-teal underline decoration-brand-teal/40 decoration-2 underline-offset-4 hover:text-brand-teal-dark"
              >
                Transcript
              </a>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function TimelineBlock({ block }) {
  const items = block.items || [];
  if (items.length === 0) return null;
  const last = items.length - 1;
  return (
    <section
      aria-label={block.title || "Timeline"}
      className="mx-auto my-8 max-w-[36rem] overflow-hidden rounded-xl bg-header-navy text-white shadow-[0_14px_30px_-16px_rgba(2,6,15,0.6)] ring-1 ring-black/10 sm:my-10"
      style={{
        backgroundImage:
          "radial-gradient(20rem 10rem at 0% 0%, rgba(14,165,233,0.26), transparent 65%), radial-gradient(18rem 10rem at 100% 100%, rgba(34,211,238,0.12), transparent 65%)",
      }}
    >
      <div className="border-b border-white/10 px-4 py-2.5 text-center">
        <h2 className="flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-header-cyan-bright">
          <span className="h-1.5 w-1.5 rounded-full bg-header-cyan-bright" aria-hidden="true" />
          {block.title || "Timeline"}
        </h2>
        {block.eyebrow && <p className="mt-0.5 text-[11px] text-white/55">{block.eyebrow}</p>}
      </div>

      <ol className="relative px-4 py-5 sm:px-6 sm:py-6">
        <span
          className="absolute bottom-7 left-[1.6rem] top-7 w-px bg-white/20 sm:left-1/2 sm:-translate-x-1/2"
          aria-hidden="true"
        />
        {items.map((it, i) => {
          const right = i % 2 === 1;
          return (
            <li
              key={`${it.date}-${i}`}
              className={`relative pl-8 sm:w-1/2 sm:pl-0 ${i === last ? "" : "pb-5"} ${
                right ? "sm:ml-[50%] sm:pl-6 sm:text-left" : "sm:pr-6 sm:text-right"
              }`}
            >
              <span
                className={`absolute left-0 top-[0.3rem] h-2.5 w-2.5 rounded-full ring-4 ring-header-navy sm:top-[0.3rem] ${
                  right ? "sm:-left-[5px]" : "sm:left-auto sm:-right-[5px]"
                } ${i === last ? "bg-white" : "bg-header-cyan-bright"}`}
                aria-hidden="true"
              />
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-header-cyan-bright">{it.date}</p>
              <p className="mt-1 text-[13px] leading-snug text-white/80">{it.text}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function StatCard({ block }) {
  const items = block.items || [];
  return (
    <aside
      aria-label={block.eyebrow || "Key figures"}
      className="my-10 overflow-hidden rounded-2xl bg-header-navy text-white shadow-[0_18px_40px_-18px_rgba(2,6,15,0.65)] ring-1 ring-black/10 sm:my-12"
      style={{
        backgroundImage:
          "radial-gradient(26rem 14rem at 0% 0%, rgba(14,165,233,0.30), transparent 65%), radial-gradient(22rem 14rem at 100% 100%, rgba(34,211,238,0.14), transparent 65%)",
      }}
    >
      <div className="flex items-center justify-center gap-2 border-b border-white/10 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-header-cyan-bright">
        <span className="h-1.5 w-1.5 rounded-full bg-header-cyan-bright" aria-hidden="true" />
        {block.eyebrow || "By the numbers"}
      </div>

      {items.length > 0 && (
        <dl className={`grid divide-x divide-white/10 ${items.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {items.map((it) => (
            <div key={it.label} className="flex flex-col items-center px-3 py-6 text-center sm:px-6 sm:py-8">
              <dt className="order-2 mx-auto mt-2 max-w-[14rem] text-[11px] font-bold uppercase leading-snug tracking-[0.14em] text-white/70 sm:text-xs">
                {it.label}
              </dt>
              <dd className="order-1 font-serif text-[2.6rem] font-black leading-none text-header-cyan-bright sm:text-[4rem]">
                {it.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {block.text && (
        <p className="border-t border-white/10 px-5 py-5 text-[15px] leading-relaxed text-white/85 sm:px-8 sm:py-6 sm:text-base">
          <RichText
            text={block.text}
            linkClassName="font-semibold text-header-cyan-bright underline underline-offset-4"
          />
        </p>
      )}
    </aside>
  );
}

/* --------------------------------------------------------- footer pieces */

function ShareRow({ title, url }) {
  const t = encodeURIComponent(title);
  const u = encodeURIComponent(url);
  const links = [
    { label: "Share on X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, icon: ICONS.x },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: ICONS.facebook },
    {
      label: "Share by email",
      href: `mailto:?subject=${t}&body=${u}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3.5 7l8.5 6 8.5-6" />
        </svg>
      ),
    },
  ];
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink-soft">Share this story</h2>
      <ul className="flex items-center gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={l.label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:border-brand-teal hover:bg-brand-teal hover:text-white"
            >
              <span className="block h-5 w-5">{l.icon}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AuthorBox({ author }) {
  if (!author) return null;
  return (
    <section aria-label="About the author" className="mt-10 flex flex-col items-center border-t border-hairline pt-8 text-center">
      <ImagePlaceholder className="h-16 w-16" rounded="rounded-full" label="" alt="" src={author.image} />
      <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink-soft">Written by</p>
      <Link href={`/authors/${author.slug}`} rel="author" className="mt-1 font-serif text-lg font-bold text-ink hover:text-brand-teal">
        {author.name}
      </Link>
      {author.bio && <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{author.bio}</p>}
    </section>
  );
}
