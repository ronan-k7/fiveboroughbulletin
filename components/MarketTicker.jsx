"use client";

import { useEffect, useRef, useState } from "react";

const REFRESH_MS = 60 * 1000; // re-fetch quotes every minute
const ROTATE_MS = 3500; // time each item stays on screen

function CaretIcon({ direction = "up", className = "" }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={className} aria-hidden="true">
      {direction === "down" ? <path d="M6 9 1 3h10L6 9Z" /> : <path d="M6 3l5 6H1l5-6Z" />}
    </svg>
  );
}

function formatPrice(value, decimals) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatPercent(value) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

function Quote({ item, className = "", onAnimationEnd }) {
  const isUp = item.changePercent > 0;
  const isDown = item.changePercent < 0;
  const tone = isDown ? "text-red-500" : isUp ? "text-header-green" : "text-white/70";

  return (
    <div
      onAnimationEnd={onAnimationEnd}
      className={`absolute inset-0 flex items-center justify-end gap-2 whitespace-nowrap text-[13px] font-semibold text-white will-change-transform ${className}`}
      style={{ backfaceVisibility: "hidden" }}
    >
      <span>{item.label}</span>
      <span className="font-medium tabular-nums text-white/70">
        {formatPrice(item.price, item.decimals)}
      </span>
      {(isUp || isDown) && (
        <CaretIcon direction={isDown ? "down" : "up"} className={`h-2.5 w-2.5 ${tone}`} />
      )}
      <span className={`tabular-nums ${tone}`}>{formatPercent(item.changePercent)}</span>
    </div>
  );
}

/**
 * Right side of the header's blue top bar: one live market quote at a time,
 * rolling to the next every few seconds with a smooth 3D flip (outgoing and
 * incoming quotes animate together, so there is no blank gap or width jump).
 * Green + up caret when the item is up on the day, red + down caret when
 * it is down.
 *
 * Quotes come from /api/markets (Yahoo Finance, cached server-side for a
 * minute) and are refreshed every minute while the tab is visible. If the
 * feed is unavailable the area simply stays empty — no fake numbers.
 */
export default function MarketTicker({ className = "" }) {
  const [items, setItems] = useState([]);
  const [view, setView] = useState({ cur: 0, prev: null, n: 0 });
  const itemsRef = useRef([]);

  // Fetch + refresh quotes
  useEffect(() => {
    // The ticker is only visible from md up (see LatestNewsBar). On phones skip
    // the /api/markets request and the refresh timers entirely.
    if (!window.matchMedia("(min-width: 768px)").matches) return undefined;
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/markets", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          itemsRef.current = data.items;
          setItems(data.items);
        }
      } catch {
        /* keep showing whatever we already have */
      }
    };

    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Rotate to the next quote
  useEffect(() => {
    if (items.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanup = null;

    const rotate = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const list = itemsRef.current;
      if (list.length < 2) return;

      setView((v) => {
        const from = list[v.cur % list.length];
        return { cur: (v.cur + 1) % list.length, prev: reduced ? null : from, n: v.n + 1 };
      });

      // Safety net: drop the outgoing quote even if animationend never fires
      clearTimeout(cleanup);
      cleanup = setTimeout(() => setView((v) => (v.prev ? { ...v, prev: null } : v)), 800);
    }, ROTATE_MS);

    return () => {
      clearInterval(rotate);
      clearTimeout(cleanup);
    };
  }, [items.length]);

  const current = items.length > 0 ? items[view.cur % items.length] : null;

  return (
    <div
      className={`relative h-5 items-center ${className}`}
      style={{ perspective: "500px" }}
      aria-label="Market update"
    >
      {current && (
        <>
          <Quote
            key={`cur-${view.n}`}
            item={current}
            className={view.prev ? "ticker-roll-in" : ""}
          />
          {view.prev && (
            <Quote
              key={`prev-${view.n}`}
              item={view.prev}
              className="ticker-roll-out"
              onAnimationEnd={() => setView((v) => ({ ...v, prev: null }))}
            />
          )}
        </>
      )}
    </div>
  );
}
