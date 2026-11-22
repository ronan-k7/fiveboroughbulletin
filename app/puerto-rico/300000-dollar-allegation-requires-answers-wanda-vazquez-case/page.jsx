import Link from "next/link";
import { notFound } from "next/navigation";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import ArticleCard from "@/components/ArticleCard";
import RichText from "@/components/RichText";
import JsonLd from "@/components/JsonLd";
import { ICONS } from "@/components/SocialIcons";
import { getArticleBySlug, withRelations, getLatestArticles } from "@/lib/content";
import { absoluteUrl, articleImageAlt, articleMetadata, articlePath, breadcrumbNode, graph, newsArticleNode } from "@/lib/seo";
import { formatLongDate } from "@/lib/format";

/**
 * /puerto-rico/300000-dollar-allegation-requires-answers-wanda-vazquez-case
 *
 * "Analysis" layout: light editorial header, left-aligned headline and standfirst,
 * wide lead image, then the reading column with numbered citations like [1]
 * that jump to the "Sources cited" panel beside it (below the text on phones).
 *
 * THE STORY lives in data/categories/puerto-rico.json (text, image, SEO fields):
 *   - body paragraphs may contain markers such as [1] or [13] [5]
 *   - "references": [{ "n": 1, "label": "..." , "url": "https://..." (optional) }]
 *     -> the number is the citation marker used in the text; add "url" to make
 *        an entry a link.
 */
const SLUG = "300000-dollar-allegation-requires-answers-wanda-vazquez-case";

function loadArticle() {
  const raw = getArticleBySlug("puerto-rico", SLUG);
  return raw ? withRelations(raw, "puerto-rico") : null;
}

export function generateMetadata() {
  const article = loadArticle();
  if (!article) return { title: "Article not found", robots: { index: false, follow: false } };
  return articleMetadata(article, article.authorInfo);
}

/** Paragraph text with [n] markers turned into superscript links to the source list. */
function Cited({ text, known }) {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/);
    if (!m) return part ? <RichText key={i} text={part} /> : null;
    const n = m[1];
    if (!known.has(n)) return <span key={i}>{part}</span>;
    return (
      <sup key={i} className="ml-0.5 font-sans text-[0.65em] font-bold">
        <a
          href={`#source-${n}`}
          aria-label={`Source ${n}`}
          className="rounded px-0.5 text-brand-teal no-underline hover:bg-brand-teal hover:text-white"
        >
          [{n}]
        </a>
      </sup>
    );
  });
}

export default function Page() {
  const article = loadArticle();
  if (!article) notFound();

  const { categoryInfo, authorInfo } = article;
  const url = absoluteUrl(articlePath(article));
  const keepReading = getLatestArticles(3, { category: "puerto-rico", slug: SLUG });
  const references = article.references || [];
  const known = new Set(references.map((r) => String(r.n)));
  const paragraphs = article.content.filter((b) => typeof b === "string");

  return (
    <article className="flex-1 bg-white">
      <JsonLd
        data={graph(
          newsArticleNode(article, authorInfo),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: categoryInfo.label, path: `/${categoryInfo.slug}` },
            { name: article.title, path: articlePath(article) },
          ])
        )}
      />

      {/* header */}
      <header className="border-b border-hairline bg-neutral-50">
        <div className="mx-auto max-w-5xl px-5 pb-9 pt-7 sm:px-6 sm:pb-12 sm:pt-10">
          <nav aria-label="Breadcrumb" className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
            <Link href="/" className="hover:text-brand-teal">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <Link href={`/${categoryInfo.slug}`} className="hover:text-brand-teal">
              {categoryInfo.label}
            </Link>
          </nav>

          <p className="mt-6 flex items-center gap-3">
            <span className="rounded-sm bg-ink px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">
              {article.subCategoryLabel || "Analysis"}
            </span>
            <span className="h-px w-10 bg-brand-teal" aria-hidden="true" />
          </p>

          <h1
            data-speakable
            className="mt-5 max-w-4xl text-balance font-serif text-[1.9rem] font-black leading-[1.1] tracking-[-0.015em] text-ink sm:text-[2.8rem] md:text-[3.3rem]"
          >
            {article.title}
          </h1>

          <p
            data-speakable
            className="mt-6 max-w-3xl border-l-[5px] border-brand-teal pl-5 font-serif text-[1.15rem] font-bold leading-snug text-ink-soft sm:text-[1.4rem]"
          >
            {article.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-hairline pt-5">
            <Link href={`/authors/${authorInfo.slug}`} rel="author" className="group inline-flex items-center gap-3">
              <ImagePlaceholder className="h-10 w-10 shrink-0" rounded="rounded-full" label="" alt="" src={authorInfo.image} />
              <span className="leading-tight">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">By</span>
                <span className="block text-sm font-bold text-ink group-hover:text-brand-teal">{authorInfo.name}</span>
              </span>
            </Link>
            <p className="flex flex-wrap items-center gap-x-3 text-[13px] text-ink-soft">
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
      </header>

      {/* lead image */}
      <div className="mx-auto max-w-5xl px-0 sm:px-6">
        <figure className="sm:mt-8">
          <ImagePlaceholder
            className="aspect-[16/9] w-full shadow-[0_18px_40px_-24px_rgba(2,6,15,0.6)]"
            rounded="sm:rounded-xl"
            src={article.image}
            position={article.imagePosition}
            alt={articleImageAlt(article)}
            width={1672}
            height={941}
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
          />
          {article.imageCaption && (
            <figcaption className="mt-2 px-5 text-xs text-ink-soft sm:px-0">{article.imageCaption}</figcaption>
          )}
        </figure>
      </div>

      {/* body + sources */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-5 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <div className="min-w-0">
          {paragraphs.map((para, idx) => (
            <p
              key={idx}
              className={`font-serif text-ink ${
                idx === 0 ? "text-[1.25rem] leading-[1.75] sm:text-[1.35rem]" : "mt-6 text-[1.1rem] leading-[1.85] sm:text-[1.18rem]"
              }`}
            >
              <Cited text={para} known={known} />
              {idx === paragraphs.length - 1 && (
                <span className="ml-2 inline-block h-2 w-2 bg-brand-teal align-middle" aria-hidden="true" />
              )}
            </p>
          ))}
        </div>

        {references.length > 0 && (
          <aside aria-labelledby="sources-heading" className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_14px_30px_-22px_rgba(2,6,15,0.45)]">
              <div className="flex items-center gap-2 bg-header-navy px-5 py-3 text-white">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-header-cyan-bright">
                  <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z" />
                  <path d="M8 7h6M8 11h6" />
                </svg>
                <h2 id="sources-heading" className="text-[11px] font-extrabold uppercase tracking-[0.22em]">
                  Sources cited
                </h2>
              </div>
              <ol className="divide-y divide-hairline">
                {references.map((r) => (
                  <li key={r.n} id={`source-${r.n}`} className="flex scroll-mt-28 gap-3 px-5 py-4 target:bg-brand-teal/10">
                    <span className="mt-0.5 flex h-6 min-w-6 shrink-0 items-center justify-center rounded-sm bg-brand-teal px-1.5 font-sans text-[11px] font-extrabold text-white">
                      {r.n}
                    </span>
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-serif text-[15px] font-semibold leading-snug text-ink underline decoration-brand-teal/40 decoration-2 underline-offset-4 hover:text-brand-teal"
                      >
                        {r.label}
                      </a>
                    ) : (
                      <span className="font-serif text-[15px] font-semibold leading-snug text-ink">{r.label}</span>
                    )}
                  </li>
                ))}
              </ol>
              <p className="border-t border-hairline bg-neutral-50 px-5 py-3 text-[11.5px] leading-relaxed text-ink-soft">
                Numbers match the bracketed citations in the text.
              </p>
            </div>
          </aside>
        )}
      </div>

      {/* footer */}
      <div className="mx-auto w-full max-w-3xl px-5 pb-12 sm:px-6">
        <ShareRow title={article.seoTitle || article.title} url={url} />
        <section aria-label="About the author" className="mt-10 flex flex-col items-center border-t border-hairline pt-8 text-center">
          <ImagePlaceholder className="h-16 w-16" rounded="rounded-full" label="" alt="" src={authorInfo.image} />
          <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink-soft">Written by</p>
          <Link href={`/authors/${authorInfo.slug}`} rel="author" className="mt-1 font-serif text-lg font-bold text-ink hover:text-brand-teal">
            {authorInfo.name}
          </Link>
          {authorInfo.bio && <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{authorInfo.bio}</p>}
        </section>
      </div>

      {/* keep reading */}
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
    <div className="flex flex-col items-center gap-3">
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