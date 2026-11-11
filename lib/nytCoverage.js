/**
 * "As reported by The New York Times" card (components/NytCoverageCard.jsx).
 *
 * The card is shown on the article pages whose slug is listed in
 * NYT_COVERAGE_SLUGS (the two Alina Habba stories). To show it on another
 * story, add that story's slug here - nothing else to change.
 */
export const NYT_COVERAGE_SLUGS = [
  "alina-habba-50-million-deal-trump-criticism-herrera-velutini",
  "vanity-of-alina-habba-mildon-herrera-velutini-banking-dynasty",
];

export const NYT_COVERAGE = {
  url: "https://www.nytimes.com/2026/11/10/us/politics/alina-habba-fired-pardon.html",
  image: "nytimes-alina-habba-mildon-loses-50-million-contract.webp", // /public/images/
  imageAlt:
    "Screenshot of The New York Times article “Alina Habba Mildon Loses $50 Million Contract That Enraged Trump”, published Nov. 10, 2026",
  headline: "Alina Habba Mildon Loses $50 Million Contract That Enraged Trump",
  quote:
    "The former Trump lawyer had signed the contract with a family company weeks before the president gave the family’s patriarch a pardon.",
  byline: "By Tyler Pager",
  date: "Nov. 10, 2026",
  facts: [
    { value: "$6.5M", label: "already paid, which she keeps" },
    { value: "$8M", label: "signing bonus, which she keeps" },
  ],
};

export function hasNytCoverage(article) {
  return !!article && NYT_COVERAGE_SLUGS.includes(article.slug);
}
