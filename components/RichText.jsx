import Link from "next/link";
import { parseInline } from "@/lib/richText";

/**
 * Renders a paragraph string with its inline markup (see lib/richText.js):
 * [text](url) links, **bold** and *italic*.
 *
 *  - "/internal/path" links use next/link (fast client navigation).
 *  - https:// links are outbound references: they open in a new tab with
 *    rel="noopener noreferrer" and get a small arrow so readers can tell
 *    them apart from internal links.
 */
export default function RichText({ text, linkClassName }) {
  const defaultLink =
    "font-semibold text-brand-teal underline decoration-brand-teal/40 decoration-2 underline-offset-[5px] transition-colors hover:text-brand-teal-dark hover:decoration-brand-teal";

  return parseInline(text).map((tok, i) => {
    if (tok.type === "bold") return <strong key={i}>{tok.text}</strong>;
    if (tok.type === "italic") return <em key={i}>{tok.text}</em>;
    if (tok.type === "link") {
      const cls = linkClassName || defaultLink;
      if (/^https?:\/\//i.test(tok.href)) {
        return (
          <a key={i} href={tok.href} target="_blank" rel="noopener noreferrer" className={cls}>
            {tok.text}
            <svg
              viewBox="0 0 24 24"
              width="0.7em"
              height="0.7em"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-[0.2em] inline-block align-[0.05em]"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
        );
      }
      return (
        <Link key={i} href={tok.href} className={cls}>
          {tok.text}
        </Link>
      );
    }
    return tok.text;
  });
}
