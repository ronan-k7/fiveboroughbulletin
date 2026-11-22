import { Fragment } from "react";
import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import ArticleCard from "@/components/ArticleCard";
import RichText from "@/components/RichText";
import JsonLd from "@/components/JsonLd";
import { ICONS } from "@/components/SocialIcons";
import { getAuthor, withRelations, getLatestArticles } from "@/lib/content";
import { absoluteUrl, articleImageAlt, articleMetadata, articlePath, breadcrumbNode, graph, newsArticleNode } from "@/lib/seo";
import { formatLongDate } from "@/lib/format";

/**
 * /politics/turhan-mildon-and-his-connection-to-alina-habba
 *
 * Standalone feature article. It uses the same look as the site's centred
 * feature stories (navy hero, lead photo overlapping the hero, serif reading
 * column with drop cap, pull quote, timeline, share row, author box and
 * "Keep reading"), but lives in its own folder so no existing file is touched.
 * (A real folder takes priority over the app/[category]/[slug] route.)
 *
 * TO EDIT: change the ARTICLE object below.
 *   - strings in `content` are paragraphs ([link](url), **bold**, *italic* work)
 *   - { type: "heading", text }       section subheading
 *   - { type: "pullquote", text, cite } large quote
 *   - { type: "timeline", title, eyebrow, items: [{ date, text }] }
 * Lead image: /public/images/turhan-mildon-and-alina-habba.jpg (change `image` to use another file).
 */
const ARTICLE = {
  category: "politics",
  slug: "turhan-mildon-and-his-connection-to-alina-habba",
  title: "From Caracas to Washington: The Rise of Turhan Mildon and His Connection to Alina Habba",
  subCategoryLabel: "Politics",
  excerpt: "A journey through international business, political connections and personal relationships tells the story of Turkish businessman Turhan Mildon, whose growing interests in Venezuela brought him into the orbit of some of Washington's most influential figures.",
  author: "fiveboroughbulletin-staff",
  date: "2026-11-21",
  time: "09:00 ET",
  image: "turhan-mildon-and-alina-habba.jpg",
  imageAlt: "Side-by-side portraits of a woman in a navy blazer and a man in a dark suit",
  imagePosition: "50% 22%",
  layout: "centered",
  keywords: ["Turhan Mildon", "Alina Habba", "Venezuela", "Alex Saab", "Donald Trump", "Washington politics"],
  content: [
    "Sometimes, the story behind a businessman's success is about much more than the companies he owns or the investments he makes. It is also about the people he meets, the relationships he builds and the opportunities that come along when political circumstances begin to change.",
    "The story of Turkish businessman Turhan Mildon brings all these elements together. His business journey, which reportedly took him from the Democratic Republic of Congo to Venezuela and eventually closer to Washington's political circles, has attracted attention because of his relationship with Alina Habba, Donald Trump's former personal lawyer.",
    "What makes the story particularly interesting is the timing. As Mildon was developing his business interests in Venezuela, the country's political situation was changing. His connections there were becoming increasingly uncertain, and his relationship with Habba brought him into a very different network of influence.",
    "An investigation by The New York Times, based on interviews with more than two dozen people, explored how these worlds came together. It also raised questions about whether personal relationships and political connections played a role in protecting Mildon's business interests.",
    "Both Habba and her spokesperson disputed important aspects of the reporting. Habba also denied intervening with the administration on behalf of her husband.",
    {"type": "pullquote", "text": "Habba specifically denied intervening with the administration on behalf of her husband.", "cite": "Habba's response, as reported"},
    "Nevertheless, the story offers a closer look at the complicated relationship between international business, political access and personal connections.",
    {"type": "heading", "text": "A Business Journey That Began in Africa"},
    "Before his name became connected to Venezuela and Washington, Turhan Mildon had already established business interests in another part of the world.",
    "His earlier activities were based in the Democratic Republic of Congo, where he developed construction businesses. According to the reporting, Mildon eventually became an adviser to President Felix Tshisekedi and obtained a diplomatic passport.",
    "For someone working in international construction and investment, these kinds of relationships can be important. Large projects often involve government approvals, local partnerships and an understanding of the country's political environment.",
    "Building a successful business in such places requires more than financial resources. Knowing the right people and understanding how decisions are made can be equally valuable.",
    "Mildon's experience in Congo appears to have helped him develop a network that extended beyond ordinary business relationships.",
    "By the end of 2023, he had arrived in Venezuela after being invited by a Venezuelan friend. It was another opportunity to expand his international business interests, although the country presented a very different set of challenges.",
    "Venezuela's political and economic environment had been difficult for years. Businesses operating there had to deal with uncertainty, government involvement and changing political relationships. For Mildon, entering this market meant becoming part of a business environment where connections could matter as much as commercial experience.",
    {"type": "heading", "text": "Venezuela, Alex Saab and a Changing Political Situation"},
    "One name that plays an important role in this story is Alex Saab, a Colombian businessman who became closely associated with the government of Nicolás Maduro.",
    "Saab's business relationships and reported influence within Venezuela had made him a controversial figure. His connections to government-linked commercial arrangements were particularly relevant to businesses operating in sectors such as construction and infrastructure.",
    "According to the investigation, Mildon's business interests in Venezuela were connected to a network that included Saab. The relationship became especially important as the country's political situation began to change.",
    "The reporting describes how the fall of Nicolás Maduro and the subsequent extradition of Saab threatened Mildon's business operations in Venezuela. Arrangements that had once appeared valuable suddenly faced uncertainty.",
    "This created a difficult situation for an investor whose commercial interests depended, at least partly, on relationships within the existing political and business system.",
    "When governments change, business agreements can come under review. People who once held considerable influence may lose their positions, and companies that benefited from earlier arrangements can find themselves facing difficult questions. Mildon was now dealing with exactly the kind of uncertainty that can make international business challenging.",
    "His previous connections in Caracas might no longer have been enough. The investigation suggests that he began looking towards Washington, where a different set of political relationships could become important.",
    {"type": "heading", "text": "How Alina Habba Entered the Story"},
    "Alina Habba was already a familiar name in American political and legal circles because of her work as Donald Trump's personal lawyer. Her association with Trump brought her considerable public attention, particularly during a period when his legal and political battles were regularly making headlines. Over time, she became one of the recognisable figures within his wider political circle.",
    "Her relationship with Turhan Mildon brought an unexpected international business dimension to her personal life.",
    "The two eventually married in September at New York's Waldorf Astoria Hotel. Their wedding was attended by several prominent figures from Washington's political and legal establishment. Among the reported guests were U.S. Attorney General Todd Blanche, FBI Director Kash Patel and White House attorney Will Scharf.",
    "It was an event that attracted attention not only because of the couple but also because of the people who attended. For Mildon, the wedding marked his arrival into a social circle connected to some of the most influential personalities in American politics. For Habba, it brought her personal relationship and professional world closer together in the public eye.",
    "However, the timing of their relationship became particularly interesting because of the challenges Mildon was reportedly facing with his Venezuelan investments.",
    {
      "type": "timeline",
      "title": "Key moments",
      "eyebrow": "As described in the reporting",
      "items": [
        { "date": "Earlier", "text": "Mildon builds construction businesses in the Democratic Republic of Congo and becomes an adviser to President Felix Tshisekedi." },
        { "date": "End of 2023", "text": "He arrives in Venezuela after an invitation from a Venezuelan friend." },
        { "date": "As Maduro falls", "text": "Maduro's fall and Alex Saab's extradition threaten Mildon's Venezuelan operations." },
        { "date": "September", "text": "Mildon and Alina Habba marry at New York's Waldorf Astoria." }
      ]
    },
    {"type": "heading", "text": "From Caracas to Washington: Looking for a New Network"},
    "The most interesting part of the investigation is how it describes Mildon's changing approach to protecting his business interests.",
    "His earlier connections were largely based in Caracas. But with the political situation surrounding Maduro and Saab changing, he faced the possibility that some of those relationships might no longer provide the support they once had. Washington offered a different environment.",
    "According to the investigation, Mildon began cultivating relationships in the American capital while trying to protect his investments in Venezuela. His relationship with Habba placed him closer to a political and social circle that included people connected to the Trump administration. The reporting suggests that this connection helped create opportunities for Mildon at a time when his Venezuelan business interests were under pressure.",
    "One of the most significant claims concerns contracts involving state-owned cement plants in Venezuela. According to the investigation, Habba's relationship with Trump's political circle helped slow efforts to cancel contracts under which Mildon operated those plants. This is a serious claim because it raises questions about whether personal relationships could have influenced decisions affecting private business interests in another country.",
    "However, the distinction between reported allegations and established facts is important. Habba and her spokesperson questioned central aspects of the investigation. Habba specifically denied intervening with the administration on behalf of her husband. Without further independently established evidence, the allegations should not be treated as proof of wrongdoing.",
    "Still, the questions raised by the investigation explain why the relationship has attracted so much attention.",
    {"type": "heading", "text": "A Wedding That Brought Washington's Power Circle Together"},
    "The wedding at the Waldorf Astoria was more than just a personal celebration in the eyes of those following the story. The presence of senior political and legal figures made it an event worth examining, particularly given the questions surrounding Mildon's international business interests.",
    "For most couples, a wedding is simply an opportunity to celebrate with family and friends. But when the guest list includes some of the country's most powerful political figures, the occasion can also reveal something about the social networks surrounding the people involved.",
    "The reported attendance of Todd Blanche, Kash Patel and Will Scharf placed the celebration firmly within the wider Washington conversation. It also highlighted how Mildon had become connected to people operating in a very different world from the construction and investment businesses with which he had built his career.",
    "Of course, attending a wedding does not establish involvement in a business deal or political decision. Personal relationships should not automatically be interpreted as evidence of improper influence. But the circumstances surrounding the event made it difficult for observers to ignore the broader questions.",
    {"type": "heading", "text": "The Bigger Picture: Business and Political Influence"},
    "The story of Mildon and Habba also reflects a wider reality of international business. In some countries, especially those where the government plays a major role in the economy, business success can depend heavily on political decisions.",
    "Construction companies, infrastructure investors and industrial operators often need government approvals and long-term agreements to operate successfully. When political leadership changes, those agreements can become uncertain. For investors, maintaining relationships across different countries and political environments can therefore be an important part of managing risk.",
    "Mildon's reported journey from Congo to Venezuela and then towards Washington illustrates how international business networks can develop across borders. However, there is an important difference between maintaining professional relationships and using political access to influence decisions for personal financial benefit. That distinction is at the centre of the questions raised by the investigation.",
    "The situation also highlights why relationships involving political figures and private businesspeople often receive close public attention. When the two worlds overlap, people naturally want to know whether decisions are being made fairly and transparently.",
    {"type": "heading", "text": "A Story That Leaves Important Questions"},
    "At its heart, this is a story about a businessman whose international ambitions brought him into contact with influential people across several countries.",
    "Mildon's reported experience in the Democratic Republic of Congo helped establish his early business network. His move into Venezuela introduced him to a politically sensitive commercial environment, where his business interests became connected to relationships involving Alex Saab. As the political situation changed, his attention reportedly shifted towards Washington.",
    "His marriage to Alina Habba brought him closer to an influential American political circle at a particularly important moment for his Venezuelan investments. The investigation raises questions about whether those connections played a role in protecting his commercial interests. At the same time, Habba and her spokesperson have challenged the reporting, and Habba has denied acting on behalf of her husband.",
    "Ultimately, the story is about more than business contracts or a high-profile wedding. It is about how closely personal relationships, political networks and international investments can sometimes become connected. It also raises a question that goes beyond Mildon and Habba: when private business interests come close to political power, how can the public be confident that decisions are being made in the right way?",
    "There are no simple answers. But the events described in the investigation show why transparency and accountability matter, particularly when business interests cross international borders and reach into the highest levels of political influence.",
    "For now, the story of Turhan Mildon and Alina Habba remains one that invites scrutiny, debate and further questions about where business relationships end and political influence begins.",
    "*Editorial note: This article is based on reporting by The New York Times and has not independently verified the allegations. Claims concerning political influence and Venezuelan contracts are attributed to that investigation rather than presented as proven facts.*",
  ],
  sources: [
    // { publisher: "Publisher name", label: "Headline of the source", url: "https://..." },
  ],
  topics: [],
  seoTitle: "Turhan Mildon and Alina Habba: From Caracas to Washington",
  seoDescription: "Turkish businessman Turhan Mildon's Venezuelan interests, his marriage to Alina Habba and the questions raised by a New York Times investigation.",
  updated: "2026-11-21",
};

const article = withRelations(ARTICLE, "politics");
article.authorInfo = getAuthor(ARTICLE.author) || article.authorInfo;

export const metadata = articleMetadata(article, article.authorInfo);

export default function Page() {
  const { categoryInfo, authorInfo } = article;
  const url = absoluteUrl(articlePath(article));
  const keepReading = getLatestArticles(3, { category: "politics", slug: ARTICLE.slug });

  // "From Caracas to Washington: The Rise of ..." -> cyan kicker + headline.
  const colon = article.title.indexOf(": ");
  const hasLead = colon > 0 && colon <= 48;
  const lead = hasLead ? article.title.slice(0, colon) : null;
  const headline = hasLead ? article.title.slice(colon + 2) : article.title;

  const content = article.content;
  const firstPara = content.findIndex((b) => typeof b === "string");
  let lastPara = -1;
  content.forEach((b, i) => {
    if (typeof b === "string" && !b.startsWith("*")) lastPara = i;
  });

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

      {/* hero */}
      <section
        className="relative isolate overflow-hidden bg-header-navy text-white"
        style={{
          backgroundImage:
            "radial-gradient(60rem 28rem at 50% -8%, rgba(14,165,233,0.30), transparent 62%), radial-gradient(34rem 22rem at 105% 70%, rgba(34,211,238,0.14), transparent 60%), radial-gradient(30rem 20rem at -5% 55%, rgba(14,116,144,0.22), transparent 60%)",
        }}
      >
        <div className="mx-auto max-w-4xl px-5 pb-9 pt-7 text-center sm:px-6 sm:pb-12 sm:pt-12">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/${categoryInfo.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-header-cyan-bright/50 bg-header-cyan-bright/10 px-3 py-1 text-header-cyan-bright transition-colors hover:bg-header-cyan-bright hover:text-header-navy"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
              {categoryInfo.label}
            </Link>
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

          <p
            data-speakable
            className="mx-auto mt-5 max-w-2xl text-balance font-serif text-[1.02rem] italic leading-relaxed text-white/80 sm:mt-6 sm:text-xl"
          >
            {article.excerpt}
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:mt-8">
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
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] text-white/65 sm:gap-x-3 sm:text-[13px]">
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

        {/* lead photo straddles the hero's lower edge */}
        <div className="relative before:absolute before:inset-x-0 before:bottom-0 before:h-1/2 before:bg-white before:content-[''] sm:px-6">
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

      {/* body */}
      <div className="mx-auto w-full max-w-[58.25rem] px-5 pb-4 pt-9 sm:px-6 sm:pt-12">
        {content.map((block, idx) => {
          if (typeof block === "string") {
            const isNote = block.startsWith("*");
            const isFirst = idx === firstPara;
            return (
              <Fragment key={idx}>
                <p
                  className={`font-serif leading-[1.85] ${idx === 0 ? "" : "mt-6"} ${
                    isNote
                      ? "mt-10 border-t border-hairline pt-5 text-[0.95rem] text-ink-soft"
                      : "text-[1.075rem] text-ink sm:text-[1.2rem]"
                  } ${
                    isFirst
                      ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:text-[3.9rem] first-letter:font-black first-letter:leading-[0.8] first-letter:text-brand-teal sm:first-letter:text-[4.7rem]"
                      : ""
                  }`}
                >
                  <RichText text={block} />
                  {idx === lastPara && (
                    <span className="ml-2 inline-block h-2 w-2 bg-brand-teal align-middle" aria-hidden="true" />
                  )}
                </p>
              </Fragment>
            );
          }
          if (block.type === "heading") return <SectionHeading key={idx} text={block.text} />;
          if (block.type === "pullquote") return <PullQuote key={idx} block={block} />;
          if (block.type === "timeline") return <Timeline key={idx} block={block} />;
          return null;
        })}
      </div>

      {/* footer */}
      <div className="mx-auto w-full max-w-[58.25rem] px-5 pb-12 sm:px-6">
        <ShareRow title={article.seoTitle || article.title} url={url} />

        {article.sources?.length > 0 && (
          <aside
            aria-labelledby="sources-heading"
            className="mt-10 rounded-xl border border-hairline bg-neutral-50 p-5 sm:p-6"
          >
            <h2 id="sources-heading" className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-teal">
              Sources &amp; further reading
            </h2>
            <ul className="mt-4 divide-y divide-hairline">
              {article.sources.map((s) => (
                <li key={s.url} className="py-3 first:pt-0 last:pb-0">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="group block">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                      {s.publisher}
                    </span>
                    <span className="mt-0.5 block font-serif text-[15.5px] font-semibold leading-snug text-ink underline decoration-brand-teal/0 decoration-2 underline-offset-4 transition group-hover:text-brand-teal group-hover:decoration-brand-teal">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <section
          aria-label="About the author"
          className="mt-10 flex flex-col items-center border-t border-hairline pt-8 text-center"
        >
          <ImagePlaceholder className="h-16 w-16" rounded="rounded-full" label="" alt="" src={authorInfo.image} />
          <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink-soft">Written by</p>
          <Link
            href={`/authors/${authorInfo.slug}`}
            rel="author"
            className="mt-1 font-serif text-lg font-bold text-ink hover:text-brand-teal"
          >
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

/* ------------------------------------------------------------- blocks */

function SectionHeading({ text }) {
  return (
    <h2 className="mt-12 border-l-[6px] border-brand-teal py-0.5 pl-4 font-serif text-[1.6rem] font-black leading-[1.2] text-ink sm:mt-14 sm:text-[2rem]">
      {text}
    </h2>
  );
}

function PullQuote({ block }) {
  return (
    <figure className="my-10 text-center sm:my-14">
      <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor" className="mx-auto text-brand-teal" aria-hidden="true">
        <path d="M9.4 5C5.8 6.2 3.5 9.1 3.5 13.1V19h6.7v-6.4H7c.1-2 1.2-3.6 3.2-4.4L9.4 5zm10 0c-3.6 1.2-5.9 4.1-5.9 8.1V19h6.7v-6.4H17c.1-2 1.2-3.6 3.2-4.4L19.4 5z" />
      </svg>
      <blockquote className="mt-3 text-balance font-serif text-[1.6rem] font-black italic leading-[1.25] text-ink sm:text-[2.2rem]">
        {block.text}
      </blockquote>
      <span className="mx-auto mt-5 block h-0.5 w-12 bg-brand-teal" aria-hidden="true" />
      {block.cite && (
        <figcaption className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-ink-soft">{block.cite}</figcaption>
      )}
    </figure>
  );
}

function Timeline({ block }) {
  const items = block.items || [];
  if (items.length === 0) return null;
  const last = items.length - 1;
  return (
    <section
      aria-label={block.title || "Timeline"}
      className="mx-auto my-10 max-w-[36rem] overflow-hidden rounded-xl bg-header-navy text-white shadow-[0_14px_30px_-16px_rgba(2,6,15,0.6)] ring-1 ring-black/10 sm:my-12"
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
                className={`absolute left-0 top-[0.3rem] h-2.5 w-2.5 rounded-full ring-4 ring-header-navy ${
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