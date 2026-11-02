import { NextResponse } from "next/server";

/**
 * Live market quotes for the header ticker.
 *
 * For each symbol we try, in order:
 *   1. Yahoo Finance chart API (query1, then query2 host)
 *   2. Stooq daily CSV (keyless fallback; only if a `stooq` symbol is set)
 * Everything is fetched server-side (no CORS issues) and cached for 60
 * seconds by Next, so heavy traffic only hits the providers about once a
 * minute per symbol.
 *
 * "change" is measured against the previous close, i.e. the daily change
 * you see on any finance site; it resets with each new session.
 *
 * Symbols that fail are left out. If every provider fails we serve the last
 * good snapshot (up to 30 minutes old); if there is none, we return an empty
 * list and the header shows nothing — never made-up numbers.
 *
 * Troubleshooting: open /api/markets?debug=1 to see why a symbol failed.
 */

export const dynamic = "force-dynamic";

// U.S. markets only (all prices in USD). To add / remove / reorder ticker
// items, edit this list only. `decimals` controls how the price is shown.
const SYMBOLS = [
  { symbol: "^GSPC", stooq: "^spx", label: "S&P 500", decimals: 2 },
  { symbol: "^DJI", stooq: "^dji", label: "Dow Jones", decimals: 2 },
  { symbol: "^IXIC", stooq: "^ndq", label: "Nasdaq", decimals: 2 },
  { symbol: "^RUT", label: "Russell 2000", decimals: 2 },
  { symbol: "GC=F", stooq: "xauusd", label: "Gold", decimals: 2 },
  { symbol: "CL=F", stooq: "cl.f", label: "Oil (WTI)", decimals: 2 },
  { symbol: "BTC-USD", stooq: "btcusd", label: "Bitcoin", decimals: 0 },
];

const STALE_MAX_MS = 30 * 60 * 1000;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
let lastGood = { at: 0, items: [] };

function build(def, price, prev, updatedAt) {
  if (!Number.isFinite(price) || !Number.isFinite(prev) || prev === 0) {
    throw new Error("missing price data");
  }
  const change = price - prev;
  return {
    symbol: def.symbol,
    label: def.label,
    decimals: def.decimals,
    price,
    change,
    changePercent: (change / prev) * 100,
    updatedAt: updatedAt || Date.now(),
  };
}

async function fromYahoo(def) {
  let lastErr;
  for (const host of ["query1", "query2"]) {
    try {
      const url = `https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        def.symbol
      )}?interval=1d&range=1d&region=US&lang=en-US`;
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) throw new Error(`yahoo ${host} HTTP ${res.status}`);
      const meta = (await res.json())?.chart?.result?.[0]?.meta;
      return build(
        def,
        meta?.regularMarketPrice,
        meta?.chartPreviousClose ?? meta?.previousClose,
        meta?.regularMarketTime ? meta.regularMarketTime * 1000 : undefined
      );
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function ymd(d) {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

async function fromStooq(def) {
  if (!def.stooq) throw new Error("no stooq symbol");
  const to = new Date();
  const from = new Date(Date.now() - 12 * 24 * 3600 * 1000);
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(def.stooq)}&i=d&d1=${ymd(
    from
  )}&d2=${ymd(to)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`stooq HTTP ${res.status}`);
  const rows = (await res.text())
    .trim()
    .split(/\r?\n/)
    .slice(1) // header: Date,Open,High,Low,Close,Volume
    .map((l) => l.split(","))
    .filter((c) => c.length >= 5 && Number.isFinite(parseFloat(c[4])));
  if (rows.length < 2) throw new Error("stooq: not enough rows");
  const last = rows[rows.length - 1];
  const prev = rows[rows.length - 2];
  return build(def, parseFloat(last[4]), parseFloat(prev[4]), Date.parse(last[0]));
}

async function fetchQuote(def, errors) {
  try {
    return await fromYahoo(def);
  } catch (e) {
    errors.push(`${def.label}: ${e.message}`);
  }
  try {
    return await fromStooq(def);
  } catch (e) {
    errors.push(`${def.label} (stooq): ${e.message}`);
  }
  return null;
}

export async function GET(request) {
  const errors = [];
  const results = await Promise.all(SYMBOLS.map((d) => fetchQuote(d, errors)));
  const items = results.filter(Boolean);

  let out = items;
  if (items.length > 0) {
    lastGood = { at: Date.now(), items };
  } else if (Date.now() - lastGood.at < STALE_MAX_MS) {
    out = lastGood.items;
  }

  const debug = new URL(request.url).searchParams.get("debug") === "1";
  return NextResponse.json(
    { items: out, fetchedAt: Date.now(), ...(debug ? { errors } : {}) },
    {
      headers: {
        "Cache-Control":
          out.length > 0 ? "public, s-maxage=60, stale-while-revalidate=300" : "no-store",
      },
    }
  );
}
