import {
  SITE_URL,
  SITE_NAME,
  LANGUAGE,
  absoluteUrl,
  buildPageMetadata,
  breadcrumbNode,
  graph,
} from "@/lib/seo";

/**
 * Shared setup for the site-information pages (About, Our Team, Source
 * Methodology, Right of Reply, Contact, Privacy Policy, Terms & Conditions,
 * Legal): one place for the review date, the contact mailboxes and the SEO
 * metadata / JSON-LD, so every one of those pages is built the same way.
 * The page copy itself lives in each page's own file under /app.
 *
 * `group` decides which pages are offered as "related pages" at the foot of
 * each page: "about" = pages that explain how the site works,
 * "info" = contact / privacy / terms / legal.
 */

export const LAST_UPDATED = "2026-11-03";
export const LAST_UPDATED_DISPLAY = "November 3, 2026";

// Mailboxes printed on the information pages. They are derived from the site
// domain -- change them here if the real addresses differ.
export function getContactEmails() {
  let domain = "fiveboroughbulletin.com";
  try {
    domain = new URL(SITE_URL).hostname.replace(/^www\./, "");
  } catch {}
  return {
    editorial: `editorial@${domain}`,
    corrections: `corrections@${domain}`,
    legal: `legal@${domain}`,
  };
}

const PAGES = {
  about: {
    group: "about",
    path: "/about",
    title: "About Five Borough Bulletin",
    label: "About",
    description:
      "About Five Borough Bulletin, an independent news site covering U.S., business, finance, world, politics, investigations, Puerto Rico, technology and sports.",
    schemaType: "AboutPage",
  },
  "our-team": {
    group: "about",
    path: "/our-team",
    title: "Our Team",
    label: "Our Team",
    description:
      "Five Borough Bulletin publishes under one newsroom byline. See who is behind it, what the byline means and how to reach the team.",
    schemaType: "AboutPage",
  },
  "source-methodology": {
    group: "about",
    path: "/source-methodology",
    title: "Source Methodology",
    label: "Source Methodology",
    description:
      "How to read the sources and further reading at the end of Five Borough Bulletin stories, and what a source list does and does not show.",
    schemaType: "WebPage",
  },
  "right-of-reply-policy": {
    group: "about",
    path: "/right-of-reply-policy",
    title: "Right of Reply",
    label: "Right of Reply",
    description:
      "How people and organizations named in a Five Borough Bulletin story can ask for their response to be considered.",
    schemaType: "WebPage",
  },
  contact: {
    group: "info",
    path: "/contact",
    title: "Contact",
    label: "Contact",
    description:
      "How to reach Five Borough Bulletin with story tips, corrections, permission requests and legal or privacy matters.",
    schemaType: "ContactPage",
  },
  "privacy-policy": {
    group: "info",
    path: "/privacy-policy",
    title: "Privacy Policy",
    label: "Privacy Policy",
    description:
      "What information Five Borough Bulletin collects, how it is used and the choices readers have.",
    schemaType: "WebPage",
  },
  "terms-and-conditions": {
    group: "info",
    path: "/terms-and-conditions",
    title: "Terms & Conditions",
    label: "Terms & Conditions",
    description: "The ground rules for using the Five Borough Bulletin website.",
    schemaType: "WebPage",
  },
  legal: {
    group: "info",
    path: "/legal",
    title: "Legal",
    label: "Legal",
    description:
      "Informational-use notice, copyright and reuse, complaints, third-party links and formal legal notices for Five Borough Bulletin.",
    schemaType: "WebPage",
  },
};

export function getStaticPage(slug) {
  return PAGES[slug] || null;
}

export function getStaticPages() {
  return Object.entries(PAGES).map(([slug, page]) => ({ slug, ...page }));
}

/** Next.js metadata object for one of the information pages. */
export function getStaticPageMetadata(slug) {
  const page = PAGES[slug];
  if (!page) return {};
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
  });
}

/** schema.org graph (page + breadcrumb) for one of the information pages. */
export function getStaticPageJsonLd(slug) {
  const page = PAGES[slug];
  if (!page) return null;
  return graph(
    {
      "@type": page.schemaType,
      "@id": `${absoluteUrl(page.path)}#webpage`,
      name: `${page.title} | ${SITE_NAME}`,
      description: page.description,
      url: absoluteUrl(page.path),
      inLanguage: LANGUAGE,
      dateModified: LAST_UPDATED,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: page.label, path: page.path },
    ])
  );
}
