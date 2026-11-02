/**
 * Tiny inline-markup helpers for article body text (no dependency needed).
 *
 * In any article paragraph in data/categories/*.json you can write:
 *   [anchor text](https://example.com/page)   -> link  (http(s) = opens in a new tab,
 *                                                       "/path" = internal link)
 *   **bold**                                  -> bold
 *   *italic*                                  -> italic
 *
 * Plain paragraphs without any markup render exactly as before.
 */
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

/** Splits a string into [{ type: "text" | "link" | "bold" | "italic", text, href? }]. */
export function parseInline(input) {
  const str = String(input ?? "");
  const out = [];
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(str))) {
    if (m.index > last) out.push({ type: "text", text: str.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ type: "link", text: m[1], href: m[2] });
    else if (m[3] !== undefined) out.push({ type: "bold", text: m[3] });
    else out.push({ type: "italic", text: m[4] });
    last = m.index + m[0].length;
  }
  if (last < str.length) out.push({ type: "text", text: str.slice(last) });
  return out;
}

/** Removes the markup, leaving plain text (for meta descriptions, JSON-LD, word counts). */
export function stripInline(input) {
  return parseInline(input)
    .map((t) => t.text)
    .join("");
}

/**
 * Body items are either a plain string (paragraph) or an object block:
 *   { type: "stats", ... } | { type: "pullquote", ... }
 * Returns the readable text of every block, as plain strings.
 */
export function bodyPlainText(content = []) {
  return content
    .flatMap((block) => {
      if (typeof block === "string") return [stripInline(block)];
      if (block?.type === "stats") {
        return [
          ...(block.items || []).map((i) => `${i.value} ${i.label}`),
          stripInline(block.text || ""),
        ];
      }
      if (block?.type === "pullquote") return [stripInline(block.text || "")];
      return [];
    })
    .filter(Boolean);
}

/** Only the paragraph strings (used where a block object makes no sense, e.g. the first-paragraph fallback). */
export function firstParagraph(content = []) {
  const p = content.find((b) => typeof b === "string");
  return p ? stripInline(p) : "";
}
