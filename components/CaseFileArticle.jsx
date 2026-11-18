import { Fragment } from "react";
import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import ArticleCard from "./ArticleCard";
import RichText from "./RichText";
import { ICONS } from "./SocialIcons";
import { absoluteUrl, articleImageAlt, articlePath } from "@/lib/seo";
import { formatLongDate } from "@/lib/format";

/**
 * "Case file" explainer page for document-driven stories. Used automatically
 * for any article whose JSON has  "layout": "casefile"  (the standard,
 * "centered" and "profile" pages are untouched).
 *
 * Anatomy, top to bottom:
 *   1. Hero     - dark navy, left-aligned. Breadcrumb, kicker, headline,
 *                 standfirst and byline on the left; a "Case file" docket card
 *                 (`caseFile` in the JSON) on the right.
 *   2. Lead     - wide lead photo with caption (`imagePosition` keeps faces in frame).
 *   3. Body     - one reading column. First paragraph is a lead with a teal rule.
 *                 Inline links are the source citations. Blocks sit between paragraphs.
 *   4. Footer   - share links, sources, topics, author card and a "Keep reading" grid.
 *
 * Body blocks (in the article's `content` array, next to the paragraph strings):
 *   { type: "people", label?, items: [{ name, role, image?, imagePosition? }] }
 *        -> small round photo chips for the people the surrounding text names
 *   { type: "compare", eyebrow?, left: { title, items[] }, right: { title, items[] } }
 *        -> two-card "A vs. B" comparison
 *   { type: "checklist", eyebrow?, title?, items[] }
 *        -> "what X did not do" list (items accept [link](url) markup)
 *   { type: "doctrail", eyebrow?, title?, items: [{ label, text?, href? }] }
 *        -> numbered "read the documents in this order" trail
 *   { type: "pullquote", text, cite?, href? }
 *   { type: "basis", text }  -> small "Reporting basis" footnote (accepts [link](url) markup)
 *
 * Everything is server-rendered HTML (no client JS). Headline + standfirst
 * carry `data-speakable` for the JSON-LD.
 */
export default function CaseFileArticle({ article, keepReading = [] }) {
  const { categoryInfo, authorInfo } = article;
  const url = absoluteUrl(articlePath(article));
  const content = article.content || [];
  const firstIdx = content.findIndex((b) => typeof b === "string");
  const lastIdx = findLastParagraphIndex(content);
  const caseFile = article.caseFile;

  return (
    <article className="flex-1 bg-white">
      {/* ------------------------------------------------------------ hero */}
      <section
        className="relative isolate overflow-hidden bg-header-navy text-white"
        style={{
          backgroundImage:
            "radial-gradient(48rem 26rem at 0% 0%, rgba(14,165,233,0.28), transparent 62%), radial-gradient(36rem 24rem at 100% 100%, rgba(34,211,238,0.13), transparent 62%)",
        }}
      >
        {/* faint ruled-paper lines: a nod to a docket / case file */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, #fff 0, #fff 1px, transparent 1px, transparent 34px)",
            maskImage: "linear-gradient(to bottom, #000, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000, transparent 90%)",
          }}
        />

        <div className="mx-auto grid max-w-[1180px] items-start gap-9 px-5 pb-10 pt-7 sm:px-6 sm:pb-14 sm:pt-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14 lg:pb-16 lg:pt-14">
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
              className="mt-5 text-balance font-serif text-[2.1rem] font-black leading-[1.08] tracking-[-0.015em] sm:text-[2.8rem] lg:text-[3.2rem] xl:text-[3.5rem]"
            >
              {article.title}
            </h1>

            {article.excerpt && (
              <p
                data-speakable
                className="mt-5 max-w-2xl text-pretty font-serif text-[1.05rem] italic leading-relaxed text-white/80 sm:mt-6 sm:text-[1.2rem]"
              >
                {article.excerpt}
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

          {/* docket card */}
          {caseFile?.items?.length > 0 && (
            <aside
              aria-label={caseFile.title || "Case file"}
              className="rounded-xl border border-white/15 bg-white/[0.05] shadow-[0_24px_60px_-28px_rgba(2,6,15,0.9)] backdrop-blur-sm lg:mt-2"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-header-cyan-bright">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                </svg>
                {caseFile.title || "Case file"}
              </div>
              <dl className="divide-y divide-white/10">
                {caseFile.items.map((it) => (
                  <div key={it.label} className="px-5 py-3.5">
                    <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/55">{it.label}</dt>
                    <dd className="mt-1 font-serif text-[15.5px] font-semibold leading-snug text-white">{it.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------- lead photo */}
      <figure className="mx-auto mt-8 w-full max-w-[1180px] px-5 sm:mt-10 sm:px-6">
        <ImagePlaceholder
          className="aspect-[4/3] w-full sm:aspect-[16/9]"
          rounded="rounded-lg"
          src={article.image}
          position={article.imagePosition}
          alt={articleImageAlt(article)}
          width={1672}
          height={941}
          sizes="(min-width: 1180px) 1180px, 100vw"
          priority
        />
        {article.imageCaption && (
          <figcaption className="mt-3 border-l-2 border-brand-teal pl-3 text-xs leading-relaxed text-ink-soft">
            {article.imageCaption}
          </figcaption>
        )}
      </figure>

      {/* ------------------------------------------------------------ body */}
      <div className="mx-auto w-full max-w-[65rem] px-5 pb-4 pt-9 sm:px-6 sm:pt-12">
        {content.map((block, idx) => {
          if (typeof block === "string") {
            const isFirst = idx === firstIdx;
            return (
              <p
                key={idx}
                className={
                  isFirst
                    ? "border-l-4 border-brand-teal pl-4 font-serif text-[1.2rem] font-semibold leading-[1.65] text-ink sm:pl-5 sm:text-[1.4rem]"
                    : "mt-6 font-serif text-[1.075rem] leading-[1.85] text-ink sm:text-[1.15rem]"
                }
              >
                <RichText text={block} />
                {idx === lastIdx && <span className="ml-2 inline-block h-2 w-2 bg-brand-teal align-middle" aria-hidden="true" />}
              </p>
            );
          }
          switch (block?.type) {
            case "people":
              return <PeopleStrip key={idx} block={block} />;
            case "compare":
              return <CompareBlock key={idx} block={block} />;
            case "checklist":
              return <ChecklistBlock key={idx} block={block} />;
            case "doctrail":
              return <DocTrail key={idx} block={block} />;
            case "pullquote":
              return <PullQuote key={idx} block={block} />;
            case "basis":
              return <BasisNote key={idx} block={block} />;
            default:
              return <Fragment key={idx} />;
          }
        })}
      </div>

      {/* ---------------------------------------------------------- footer */}
      <div className="mx-auto w-full max-w-[65rem] px-5 pb-12 sm:px-6">
        <ShareRow title={article.seoTitle || article.title} url={url} />

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
                    <span className="mt-0.5 block font-serif text-[15.5px] font-semibold leading-snug text-ink underline decoration-brand-teal/0 decoration-2 underline-offset-4 transition group-hover:text-brand-teal group-hover:decoration-brand-teal">
                      {s.label}
                      <ArrowOut className="ml-1.5 inline-block" />
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

function ArrowOut({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

/* ---------------------------------------------------------------- blocks */

/**
 * Small round photo chips for the people named in the paragraph above.
 * Photos come from /public/images (`image` filename); until a file is
 * dropped in, the neutral placeholder shows.
 */
function PeopleStrip({ block }) {
  const items = block.items || [];
  if (items.length === 0) return null;
  return (
    <aside aria-label={block.label || "People in this story"} className="mt-7">
      {block.label && (
        <p className="mb-3 flex items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-ink-soft">
          <span className="h-px w-6 bg-brand-teal" aria-hidden="true" />
          {block.label}
        </p>
      )}
      <ul className="flex flex-wrap gap-x-4 gap-y-3">
        {items.map((p) => (
          <li
            key={p.name}
            className="inline-flex items-center gap-3 rounded-full border border-hairline bg-neutral-50 py-1.5 pl-1.5 pr-5"
          >
            <ImagePlaceholder
              className="h-12 w-12 shrink-0"
              rounded="rounded-full"
              label=""
              src={p.image}
              position={p.imagePosition}
              alt={p.alt || p.name}
              sizes="48px"
            />
            <span className="leading-tight">
              <span className="block font-serif text-[15px] font-bold text-ink">{p.name}</span>
              {p.role && (
                <span className="mt-0.5 block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-brand-teal">
                  {p.role}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function CompareBlock({ block }) {
  const { left, right } = block;
  if (!left || !right) return null;
  return (
    <section aria-label={block.eyebrow || "Comparison"} className="my-10 sm:my-12">
      {block.eyebrow && (
        <h2 className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-teal">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" aria-hidden="true" />
          {block.eyebrow}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-neutral-50 p-5">
          <h3 className="font-serif text-lg font-black text-ink">{left.title}</h3>
          <ul className="mt-3 space-y-2.5 text-[15px] leading-snug text-ink-soft">
            {(left.items || []).map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" aria-hidden="true" />
                <span><RichText text={t} /></span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-xl bg-header-navy p-5 text-white shadow-[0_14px_30px_-16px_rgba(2,6,15,0.6)] ring-1 ring-black/10"
          style={{ backgroundImage: "radial-gradient(18rem 10rem at 0% 0%, rgba(14,165,233,0.28), transparent 65%)" }}
        >
          <h3 className="font-serif text-lg font-black text-header-cyan-bright">{right.title}</h3>
          <ul className="mt-3 space-y-2.5 text-[15px] leading-snug text-white/85">
            {(right.items || []).map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-header-cyan-bright" aria-hidden="true" />
                <span>
                  <RichText text={t} linkClassName="font-semibold text-header-cyan-bright underline underline-offset-4" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ChecklistBlock({ block }) {
  const items = block.items || [];
  if (items.length === 0) return null;
  return (
    <section aria-label={block.title || block.eyebrow || "Checklist"} className="my-10 rounded-xl border border-hairline bg-neutral-50 p-5 sm:my-12 sm:p-6">
      {block.eyebrow && (
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-teal">{block.eyebrow}</p>
      )}
      {block.title && <h2 className="mt-1 font-serif text-xl font-black leading-snug text-ink sm:text-2xl">{block.title}</h2>}
      <ul className="mt-4 divide-y divide-hairline">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-white" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
            <span className="text-[15.5px] leading-snug text-ink">
              <RichText text={t} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DocTrail({ block }) {
  const items = block.items || [];
  if (items.length === 0) return null;
  return (
    <section
      aria-label={block.title || "Document trail"}
      className="my-10 overflow-hidden rounded-2xl bg-header-navy text-white shadow-[0_18px_40px_-18px_rgba(2,6,15,0.65)] ring-1 ring-black/10 sm:my-12"
      style={{
        backgroundImage:
          "radial-gradient(26rem 14rem at 0% 0%, rgba(14,165,233,0.30), transparent 65%), radial-gradient(22rem 14rem at 100% 100%, rgba(34,211,238,0.14), transparent 65%)",
      }}
    >
      <div className="border-b border-white/10 px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-header-cyan-bright">
          <span className="h-1.5 w-1.5 rounded-full bg-header-cyan-bright" aria-hidden="true" />
          {block.eyebrow || "The document trail"}
        </h2>
        {block.title && <p className="mt-1 font-serif text-lg font-bold leading-snug text-white">{block.title}</p>}
      </div>
      <ol className="px-5 py-5 sm:px-6 sm:py-6">
        {items.map((it, i) => {
          const body = (
            <>
              <span className="block font-serif text-[1.05rem] font-bold leading-snug text-white">
                {it.label}
                {it.href && <ArrowOut className="ml-1.5 inline-block text-header-cyan-bright" />}
              </span>
              {it.text && <span className="mt-1 block text-[13.5px] leading-snug text-white/70">{it.text}</span>}
            </>
          );
          return (
            <li key={it.label} className="relative flex gap-4 pb-6 last:pb-0">
              {i < items.length - 1 && (
                <span className="absolute bottom-0 left-[0.95rem] top-9 w-px bg-white/20" aria-hidden="true" />
              )}
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-header-cyan-bright font-sans text-sm font-extrabold text-header-navy ring-4 ring-header-navy">
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                {it.href ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer" className="group block transition-opacity hover:opacity-90">
                    {body}
                  </a>
                ) : (
                  body
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function PullQuote({ block }) {
  return (
    <figure className="my-10 text-center sm:my-14">
      <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor" className="mx-auto text-brand-teal" aria-hidden="true">
        <path d="M9.4 5C5.8 6.2 3.5 9.1 3.5 13.1V19h6.7v-6.4H7c.1-2 1.2-3.6 3.2-4.4L9.4 5zm10 0c-3.6 1.2-5.9 4.1-5.9 8.1V19h6.7v-6.4H17c.1-2 1.2-3.6 3.2-4.4L19.4 5z" />
      </svg>
      <blockquote cite={block.href} className="mt-3 text-balance font-serif text-[1.5rem] font-black italic leading-[1.28] text-ink sm:text-[2rem]">
        {block.text}
      </blockquote>
      <span className="mx-auto mt-5 block h-0.5 w-12 bg-brand-teal" aria-hidden="true" />
      {block.cite && (
        <figcaption className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-ink-soft">{block.cite}</figcaption>
      )}
    </figure>
  );
}

function BasisNote({ block }) {
  return (
    <p className="mt-10 border-t border-hairline pt-4 text-[13.5px] leading-relaxed text-ink-soft">
      <RichText text={block.text} />
    </p>
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
