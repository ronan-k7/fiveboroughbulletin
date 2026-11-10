import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import ArticleCard from "./ArticleCard";
import RichText from "./RichText";
import { ICONS } from "./SocialIcons";
import { getArticleBySlug } from "@/lib/content";
import { absoluteUrl, articleImageAlt, articlePath } from "@/lib/seo";
import { formatLongDate } from "@/lib/format";

/**
 * Long-form "profile" article page. Used automatically for any article whose
 * JSON has  "layout": "profile"  (the standard two-column page and the
 * "centered" feature page are untouched).
 *
 * Anatomy, top to bottom:
 *   1. Hero   - dark navy split layout. Left: breadcrumb, kicker, headline,
 *               standfirst (`subtitle`, falls back to `excerpt`) and byline.
 *               Right: the lead photo in a framed card (portrait crop on
 *               desktop, 4:3 on phones, 16:9 on tablets). `imagePosition`
 *               in the JSON keeps the face in frame on every crop.
 *   2. Meta   - slim bar with category, publish date and share links.
 *   3. Body   - one narrow reading column. The first paragraph is a larger
 *               lead, very short paragraphs become "beat" lines, the last
 *               paragraph is set as a closing line. Wide blocks break out of
 *               the column: pullquote, stats, timeline, related.
 *   4. Footer - share links, sources (if any), author card and a
 *               "Keep reading" grid.
 *
 * No reading time is shown anywhere on this layout.
 *
 * Body blocks (in the article's `content` array, next to the paragraph strings):
 *   { type: "pullquote", text, cite, href? }
 *   { type: "stats", eyebrow, items: [{ value, label }], text? }
 *   { type: "timeline", title, eyebrow, items: [{ date, text }] }
 *   { type: "related", label, category, slug }      -> card for another story
 *
 * Everything is server-rendered HTML (no client JS). Headline + standfirst
 * carry `data-speakable` for the JSON-LD.
 */
const BEAT_MAX_CHARS = 46;

export default function ProfileArticle({ article, keepReading = [] }) {
  const { categoryInfo, authorInfo } = article;
  const url = absoluteUrl(articlePath(article));
  const standfirst = article.subtitle || article.excerpt;
  const content = article.content || [];
  const firstIdx = content.findIndex((b) => typeof b === "string");
  const lastIdx = findLastParagraphIndex(content);

  return (
    <article className="flex-1 bg-white">
      {/* ------------------------------------------------------------ hero */}
      <section
        className="relative isolate overflow-hidden bg-header-navy text-white"
        style={{
          backgroundImage:
            "radial-gradient(52rem 30rem at 0% 0%, rgba(14,165,233,0.26), transparent 62%), radial-gradient(40rem 26rem at 100% 100%, rgba(34,211,238,0.14), transparent 62%), radial-gradient(28rem 18rem at 55% 115%, rgba(14,116,144,0.30), transparent 65%)",
        }}
      >
        {/* faint editorial grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "linear-gradient(to bottom, #000, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000, transparent 85%)",
          }}
        />

        <div className="mx-auto grid max-w-[1180px] items-center gap-9 px-5 pb-10 pt-7 sm:px-6 sm:pb-14 sm:pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pb-16 lg:pt-14">
          {/* text */}
          <div className="min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60"
            >
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
              {article.subCategoryLabel && (
                <>
                  <span aria-hidden="true">/</span>
                  <span className="text-white/80">{article.subCategoryLabel}</span>
                </>
              )}
            </nav>

            <span className="mt-7 block h-1 w-14 rounded-full bg-gradient-to-r from-header-cyan-bright to-header-cyan sm:mt-9" aria-hidden="true" />

            <h1
              data-speakable
              className="mt-5 text-balance font-serif text-[2.35rem] font-black leading-[1.06] tracking-[-0.015em] sm:text-[3.2rem] lg:text-[3.6rem] xl:text-[4rem]"
            >
              {article.title}
            </h1>

            {standfirst && (
              <p
                data-speakable
                className="mt-5 max-w-xl text-pretty font-serif text-[1.05rem] italic leading-relaxed text-white/80 sm:mt-6 sm:text-[1.2rem]"
              >
                {standfirst}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-white/15 pt-5 sm:mt-9">
              <Link href={`/authors/${authorInfo.slug}`} rel="author" className="group inline-flex items-center gap-3">
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
              <span className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden="true" />
              <p className="text-left leading-tight">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Published</span>
                <time dateTime={article.date} className="block text-sm font-bold text-white">
                  {formatLongDate(article.date)}
                </time>
              </p>
              {article.dateline && (
                <p className="text-left leading-tight">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Dateline</span>
                  <span className="block text-sm font-bold text-white">{article.dateline}</span>
                </p>
              )}
            </div>
          </div>

          {/* lead photo */}
          <figure className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
            {/* offset outline frame, desktop only */}
            <span
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 hidden h-full w-full rounded-2xl border border-header-cyan-bright/35 lg:block"
            />
            <ImagePlaceholder
              className="aspect-[4/3] w-full shadow-[0_28px_70px_-24px_rgba(2,6,15,0.9)] ring-1 ring-white/10 sm:aspect-[16/10] lg:aspect-[4/5]"
              rounded="rounded-xl lg:rounded-2xl"
              src={article.image}
              position={article.imagePosition}
              alt={articleImageAlt(article)}
              width={1672}
              height={941}
              sizes="(min-width: 1180px) 520px, (min-width: 1024px) 44vw, 100vw"
              priority
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-header-navy/40 via-transparent to-transparent lg:rounded-2xl"
            />
            {categoryInfo && (
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-brand-teal px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white shadow-md sm:bottom-4 sm:left-4">
                <span className="h-1.5 w-1.5 rounded-full bg-header-cyan-bright" aria-hidden="true" />
                {categoryInfo.label}
              </span>
            )}
            {article.imageCaption && (
              <figcaption className="mt-3 text-xs leading-snug text-white/60">{article.imageCaption}</figcaption>
            )}
          </figure>
        </div>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-header-cyan-bright/60 to-transparent"
        />
      </section>

      {/* ------------------------------------------------------- meta bar */}
      <div className="border-b border-hairline bg-neutral-50">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-soft">
            {categoryInfo && <span className="text-brand-teal">{categoryInfo.label}</span>}
            {categoryInfo && <span aria-hidden="true" className="text-hairline-dark/30">&middot;</span>}
            <time dateTime={article.date}>{formatLongDate(article.date)}</time>
          </p>
          <ShareLinks title={article.seoTitle || article.title} url={url} compact />
        </div>
      </div>

      {/* ------------------------------------------------------------ body */}
      <div className="mx-auto w-full max-w-[58rem] px-5 pb-6 pt-9 sm:px-6 sm:pt-14">
        {content.map((block, idx) => {
          if (typeof block === "string") {
            const isLead = idx === firstIdx;
            const isClosing = idx === lastIdx;
            const isBeat = !isLead && !isClosing && block.length <= BEAT_MAX_CHARS;
            return (
              <Paragraph key={idx} text={block} lead={isLead} closing={isClosing} beat={isBeat} first={idx === 0} />
            );
          }
          if (block?.type === "pullquote") return <PullQuote key={idx} block={block} />;
          if (block?.type === "stats") return <StatsBlock key={idx} block={block} />;
          if (block?.type === "timeline") return <TimelineBlock key={idx} block={block} />;
          if (block?.type === "related") return <RelatedBlock key={idx} block={block} />;
          return null;
        })}
      </div>

      {/* ---------------------------------------------------------- footer */}
      <div className="mx-auto w-full max-w-[44rem] px-5 pb-12 sm:px-6">
        <div className="mt-6 flex flex-col items-center gap-3 border-t border-hairline pt-8">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink-soft">Share this story</h2>
          <ShareLinks title={article.seoTitle || article.title} url={url} />
        </div>

        {article.sources?.length > 0 && (
          <aside aria-labelledby="sources-heading" className="mt-10 rounded-xl border border-hairline bg-neutral-50 p-5 sm:p-6">
            <h2 id="sources-heading" className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-teal">
              Sources &amp; further reading
            </h2>
            <ul className="mt-4 divide-y divide-hairline">
              {article.sources.map((s) => (
                <li key={s.url} className="py-3 first:pt-0 last:pb-0">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="group block">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">{s.publisher}</span>
                    <span className="mt-0.5 block font-serif text-[15.5px] font-semibold leading-snug text-ink transition group-hover:text-brand-teal">
                      {s.label}
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

        <AuthorCard author={authorInfo} />
      </div>

      {/* --------------------------------------------------- keep reading */}
      {keepReading.length > 0 && (
        <section aria-labelledby="keep-reading" className="border-t-2 border-ink bg-neutral-50">
          <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-6 sm:py-12">
            <h2
              id="keep-reading"
              className="flex items-center justify-center gap-2 font-sans text-sm font-extrabold uppercase tracking-[0.18em] text-ink"
            >
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

/* ------------------------------------------------------------ paragraphs */

function Paragraph({ text, lead, closing, beat, first }) {
  const col = "mx-auto max-w-[44rem]";

  if (lead) {
    return (
      <p
        className={`${col} ${first ? "" : "mt-7"} text-pretty font-serif text-[1.22rem] font-medium leading-[1.7] text-ink sm:text-[1.45rem] sm:leading-[1.65]`}
      >
        <RichText text={text} />
      </p>
    );
  }

  if (beat) {
    return (
      <p className={`${col} mt-7 border-l-[3px] border-brand-teal pl-4 font-serif text-[1.2rem] font-bold leading-snug text-ink sm:mt-8 sm:pl-5 sm:text-[1.4rem]`}>
        <RichText text={text} />
      </p>
    );
  }

  if (closing) {
    return (
      <div className={`${col} mt-12 sm:mt-14`}>
        <span className="mb-6 block h-0.5 w-12 bg-brand-teal" aria-hidden="true" />
        <p className="text-pretty font-serif text-[1.25rem] font-bold italic leading-[1.55] text-ink sm:text-[1.5rem]">
          <RichText text={text} />
          <span className="ml-2 inline-block h-2.5 w-2.5 bg-brand-teal align-middle" aria-hidden="true" />
        </p>
      </div>
    );
  }

  return (
    <p className={`${col} mt-6 font-serif text-[1.075rem] leading-[1.85] text-ink sm:text-[1.2rem]`}>
      <RichText text={text} />
    </p>
  );
}

/* ---------------------------------------------------------------- blocks */

function BlockEyebrow({ children, tone = "light" }) {
  return (
    <p
      className={`flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] ${
        tone === "dark" ? "text-header-cyan-bright" : "text-brand-teal"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </p>
  );
}

function PullQuote({ block }) {
  return (
    <figure
      className="relative my-10 overflow-hidden rounded-2xl bg-header-navy px-6 py-9 text-white shadow-[0_22px_50px_-22px_rgba(2,6,15,0.7)] ring-1 ring-black/10 sm:my-14 sm:px-12 sm:py-12"
      style={{
        backgroundImage:
          "radial-gradient(28rem 14rem at 0% 0%, rgba(14,165,233,0.30), transparent 65%), radial-gradient(22rem 12rem at 100% 100%, rgba(34,211,238,0.14), transparent 65%)",
      }}
    >
      <svg viewBox="0 0 24 24" width="44" height="44" fill="currentColor" className="text-header-cyan-bright" aria-hidden="true">
        <path d="M9.4 5C5.8 6.2 3.5 9.1 3.5 13.1V19h6.7v-6.4H7c.1-2 1.2-3.6 3.2-4.4L9.4 5zm10 0c-3.6 1.2-5.9 4.1-5.9 8.1V19h6.7v-6.4H17c.1-2 1.2-3.6 3.2-4.4L19.4 5z" />
      </svg>
      <blockquote
        cite={block.href}
        className="mt-3 text-balance font-serif text-[1.85rem] font-black italic leading-[1.18] sm:text-[2.7rem]"
      >
        {block.text}
      </blockquote>
      {(block.cite || block.href) && (
        <figcaption className="mt-6 flex items-start gap-3 text-[12px] font-bold uppercase leading-snug tracking-[0.14em] text-white/70">
          <span className="mt-[0.45rem] h-0.5 w-8 shrink-0 bg-header-cyan-bright" aria-hidden="true" />
          <span>
            {block.cite}
            {block.href && (
              <>
                {block.cite && <span aria-hidden="true"> &middot; </span>}
                <a
                  href={block.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-header-cyan-bright underline decoration-header-cyan-bright/40 decoration-2 underline-offset-4 hover:decoration-header-cyan-bright"
                >
                  Transcript
                </a>
              </>
            )}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

function StatsBlock({ block }) {
  const items = block.items || [];
  if (items.length === 0) return null;
  return (
    <aside aria-label={block.eyebrow || "Key figures"} className="my-10 sm:my-14">
      <BlockEyebrow>{block.eyebrow || "By the numbers"}</BlockEyebrow>
      <dl className={`mt-4 grid grid-cols-1 gap-3 sm:gap-4 ${items.length >= 3 ? "sm:grid-cols-3" : items.length === 2 ? "sm:grid-cols-2" : ""}`}>
        {items.map((it) => (
          <div
            key={it.label}
            className="relative grid grid-cols-[7rem_1fr] items-center gap-3 overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-white to-cyan-50/60 py-4 pl-5 pr-4 shadow-sm sm:flex sm:flex-col sm:items-start sm:gap-2 sm:p-5"
          >
            <span className="absolute inset-x-0 top-0 hidden h-1 bg-gradient-to-r from-brand-teal to-header-cyan-bright sm:block" aria-hidden="true" />
            <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-teal to-header-cyan-bright sm:hidden" aria-hidden="true" />
            <dt className="order-2 text-[12px] font-bold uppercase leading-snug tracking-[0.1em] text-ink-soft">{it.label}</dt>
            <dd className="order-1 font-serif text-[1.85rem] font-black leading-none text-brand-teal sm:pt-1 sm:text-[2.6rem]">
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
      {block.text && (
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          <RichText text={block.text} />
        </p>
      )}
    </aside>
  );
}

function TimelineBlock({ block }) {
  const items = block.items || [];
  if (items.length === 0) return null;
  const last = items.length - 1;
  return (
    <section
      aria-label={block.title || "Timeline"}
      className="my-10 overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_14px_34px_-20px_rgba(2,6,15,0.35)] sm:my-14"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline bg-neutral-50 px-5 py-4 sm:px-7">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-teal">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-teal align-middle" aria-hidden="true" />
          {block.title || "Timeline"}
        </h2>
        {block.eyebrow && <p className="text-[12px] font-semibold text-ink-soft">{block.eyebrow}</p>}
      </header>
      <ol className="relative px-5 py-6 sm:px-7 sm:py-8">
        {items.map((it, i) => (
          <li key={`${it.date}-${i}`} className={`relative pl-9 sm:pl-10 ${i === last ? "" : "pb-6 sm:pb-7"}`}>
            {/* connector down to the next dot (none after the last one) */}
            {i !== last && (
              <span className="absolute -bottom-[0.2rem] left-[0.46rem] top-4 w-px bg-brand-teal/35" aria-hidden="true" />
            )}
            <span
              className={`absolute left-[0.1rem] top-[0.2rem] h-3 w-3 rounded-full ring-4 ring-white ${
                i === last ? "bg-header-cyan-bright outline-2 outline-offset-2 outline-brand-teal" : "bg-brand-teal"
              }`}
              aria-hidden="true"
            />
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-teal">{it.date}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink sm:text-base">{it.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function RelatedBlock({ block }) {
  const story = getArticleBySlug(block.category, block.slug);
  if (!story) return null;
  const href = `/${block.category}/${story.slug}`;
  return (
    <aside aria-label={block.label || "Related coverage"} className="my-10 sm:my-14">
      <Link
        href={href}
        className="group grid overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm transition hover:border-brand-teal/50 hover:shadow-md sm:grid-cols-[0.8fr_1.2fr]"
      >
        <ImagePlaceholder
          className="aspect-[16/9] w-full border-0! sm:aspect-auto sm:h-full sm:min-h-[11rem] [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.04]"
          src={story.image}
          position={story.imagePosition}
          alt=""
          sizes="(min-width: 640px) 340px, 100vw"
        />
        <span className="flex flex-col justify-center p-5 sm:p-6">
          <BlockEyebrow>{block.label || "Related coverage"}</BlockEyebrow>
          <span className="mt-2 block font-serif text-[1.15rem] font-bold leading-snug text-ink group-hover:text-brand-teal sm:text-[1.3rem]">
            {story.title}
          </span>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-brand-teal">
            Read the story
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </Link>
    </aside>
  );
}

/* --------------------------------------------------------- footer pieces */

function ShareLinks({ title, url, compact = false }) {
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
    <ul className="flex items-center gap-2.5">
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target={l.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={l.label}
            className={`flex items-center justify-center rounded-full border border-hairline bg-white text-ink transition-colors hover:border-brand-teal hover:bg-brand-teal hover:text-white ${
              compact ? "h-9 w-9" : "h-11 w-11"
            }`}
          >
            <span className={`block ${compact ? "h-4 w-4" : "h-5 w-5"}`}>{l.icon}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function AuthorCard({ author }) {
  if (!author) return null;
  return (
    <section
      aria-label="About the author"
      className="mt-10 flex items-start gap-4 rounded-2xl border border-hairline bg-neutral-50 p-5 sm:items-center sm:gap-5 sm:p-6"
    >
      <ImagePlaceholder className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" rounded="rounded-full" label="" alt="" src={author.image} />
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink-soft">Written by</p>
        <Link href={`/authors/${author.slug}`} rel="author" className="mt-0.5 block font-serif text-lg font-bold text-ink hover:text-brand-teal">
          {author.name}
        </Link>
        {author.bio && <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{author.bio}</p>}
      </div>
    </section>
  );
}
