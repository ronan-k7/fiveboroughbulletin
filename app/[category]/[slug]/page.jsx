import { notFound } from "next/navigation";
import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SidebarWidget from "@/components/SidebarWidget";
import RelatedPicks from "@/components/RelatedPicks";
import CenteredArticle from "@/components/CenteredArticle";
import ProfileArticle from "@/components/ProfileArticle";
import RichText from "@/components/RichText";
import {
  getAllArticlesFlat,
  getArticleBySlug,
  getAuthor,
  withRelations,
  getSidebarResolved,
  getRelatedPicks,
  getLatestArticles,
} from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { articleImageAlt, articleMetadata, articlePath, breadcrumbNode, graph, newsArticleNode } from "@/lib/seo";

export function generateStaticParams() {
  return getAllArticlesFlat().map((a) => ({ category: a.category, slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const raw = getArticleBySlug(category, slug);
  if (!raw) return { title: "Article not found", robots: { index: false, follow: false } };
  return articleMetadata(withRelations(raw, category), getAuthor(raw.author));
}

export default async function ArticlePage({ params }) {
  const { category: categorySlug, slug } = await params;
  const raw = getArticleBySlug(categorySlug, slug);
  if (!raw) notFound();

  const article = withRelations(raw, categorySlug);
  const related = getRelatedPicks(raw, categorySlug);
  const sidebar = getSidebarResolved({ exclude: { category: categorySlug, slug } });

  // Body paragraphs: insert the related-picks block after the first couple
  // of paragraphs (matches the reference video), then continue the rest,
  // so the body never ends with a sudden empty stretch before it does.
  // Articles marked  "layout": "centered"  use the centre-aligned feature page
  // (components/CenteredArticle.jsx); everything else keeps the layout below.
  const structuredData = (
    <JsonLd
      data={graph(
        newsArticleNode(article, article.authorInfo),
        breadcrumbNode([
          { name: "Home", path: "/" },
          ...(article.categoryInfo
            ? [{ name: article.categoryInfo.label, path: `/${article.categoryInfo.slug}` }]
            : []),
          { name: article.title, path: articlePath(article) },
        ])
      )}
    />
  );
  // "layout": "profile" -> long-form profile page (components/ProfileArticle.jsx).
  if (article.layout === "profile") {
    return (
      <>
        {structuredData}
        <ProfileArticle
          article={article}
          keepReading={getLatestArticles(3, { category: categorySlug, slug })}
        />
      </>
    );
  }
  if (article.layout === "centered") {
    return (
      <>
        {structuredData}
        <CenteredArticle
          article={article}
          keepReading={getLatestArticles(3, { category: categorySlug, slug })}
        />
      </>
    );
  }

  const paragraphs = article.content || [];
  const splitPoint = Math.min(2, paragraphs.length);
  const firstHalf = paragraphs.slice(0, splitPoint);
  const secondHalf = paragraphs.slice(splitPoint);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6">
      <JsonLd
        data={graph(
          newsArticleNode(article, article.authorInfo),
          breadcrumbNode([
            { name: "Home", path: "/" },
            ...(article.categoryInfo
              ? [{ name: article.categoryInfo.label, path: `/${article.categoryInfo.slug}` }]
              : []),
            { name: article.title, path: articlePath(article) },
          ])
        )}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
        <article className="min-w-0">
          {article.categoryInfo && (
            <Link
              href={`/${article.categoryInfo.slug}`}
              className="text-xs font-bold uppercase tracking-wide text-brand-teal hover:underline"
            >
              {article.categoryInfo.label}
            </Link>
          )}
          <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{article.excerpt}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-hairline py-3 text-sm">
            <Link
              href={`/authors/${article.authorInfo.slug}`}
              className="flex items-center gap-2.5 font-semibold text-ink hover:text-brand-teal transition-colors"
            >
              <ImagePlaceholder
                className="h-9 w-9 shrink-0"
                rounded="rounded-full"
                label=""
                src={article.authorInfo.image}
              />
              {article.authorInfo.name}
            </Link>
            <span className="text-hairline-dark">&middot;</span>
            <span className="text-ink-soft">
              Published: {article.date}
              {article.time ? ` · ${article.time}` : ""}
            </span>
          </div>

          <ImagePlaceholder className="mt-6 aspect-[16/9] w-full" src={article.image} alt={articleImageAlt(article)} />
          {article.imageCaption && (
            <p className="mt-2 text-xs text-ink-soft">{article.imageCaption}</p>
          )}

          <div className={`mt-6 space-y-5 text-[17px] leading-relaxed text-ink ${article.italic ? "font-serif italic" : ""}`}>
            {firstHalf.filter((p) => typeof p === "string").map((para, idx) => (
              <p key={idx}><RichText text={para} /></p>
            ))}
          </div>

          {related.length > 0 && <RelatedPicks items={related} />}

          {secondHalf.length > 0 && (
            <div className={`space-y-5 text-[17px] leading-relaxed text-ink ${article.italic ? "font-serif italic" : ""}`}>
              {secondHalf.filter((p) => typeof p === "string").map((para, idx) => (
                <p key={idx}><RichText text={para} /></p>
              ))}
            </div>
          )}
        </article>

        {/* Right rail: "Other news" + "Most read" grouped together and
            pinned as one sticky unit so the column keeps filling the
            viewport as the user scrolls, instead of running out early
            and leaving a gap above the footer once the article body
            (left column) ends. */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
          <SidebarWidget title="Other news" items={sidebar.latest} numbered={false} />
          <SidebarWidget title="Most read" items={sidebar.mostRead} />
        </div>
      </div>
    </div>
  );
}
