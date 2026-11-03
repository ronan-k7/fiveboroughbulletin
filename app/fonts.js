import localFont from "next/font/local";

/**
 * Self-hosted fonts (the same @fontsource files as before, no network calls).
 *
 * Loaded with next/font instead of 15 separate @fontsource CSS imports:
 *  - the CSS shrinks to the weights listed here (latin glyphs only, which
 *    covers English, Spanish and the usual punctuation / curly quotes);
 *  - Next generates a size-adjusted fallback font for each family, so the text
 *    barely moves when Bitter / Inter replace the fallback (less layout shift);
 *  - `preload: false` keeps ~15 font files from competing with the lead photo
 *    for bandwidth on phones; they still load as soon as the CSS is parsed.
 *
 * Both fonts expose a CSS variable (--font-inter / --font-bitter) that
 * app/globals.css maps onto Tailwind's font-sans / font-serif.
 *
 * NOTE: next/font only accepts literal values, so every path is written out
 * in full (no template strings / variables inside these calls).
 */
export const bitter = localFont({
  src: [
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-900-normal.woff2", weight: "900", style: "normal" },
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-600-italic.woff2", weight: "600", style: "italic" },
    { path: "../node_modules/@fontsource/bitter/files/bitter-latin-700-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-bitter",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const inter = localFont({
  src: [
    { path: "../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../node_modules/@fontsource/inter/files/inter-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: false,
  fallback: ["Arial", "Helvetica", "sans-serif"],
  adjustFontFallback: "Arial",
});
