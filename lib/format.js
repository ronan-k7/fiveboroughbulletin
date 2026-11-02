/** "2026-11-02" -> "November 2, 2026" (parsed by hand so the day never shifts with the viewer's timezone). */
export function formatLongDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  if (!m) return iso || "";
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

/** Whole minutes to read `text` (plain string or array of strings) at ~220 wpm, minimum 1. */
export function readingMinutes(text) {
  const str = Array.isArray(text) ? text.join(" ") : String(text || "");
  const words = str.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
