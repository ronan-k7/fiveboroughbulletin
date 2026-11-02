"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import siteConfig from "@/data/siteConfig.json";
import HeaderGlow from "./HeaderGlow";
import MarketTicker from "./MarketTicker";

// How long each headline owns the bar on desktop/tablet, fade in + hold +
// fade out included. Keep in sync with `.latest-fade` in app/globals.css.
const SLOT_MS = 2500;

const subscribeNoop = () => () => {};

// Mobile marquee speed, in characters per second of scrolling.
const MARQUEE_CHARS_PER_SEC = 8;

/**
 * Top strip of the header: a dark "circuit glow" bar with the LATEST badge
 * and the newest stories, plus a live markets ticker on desktop/tablet.
 *
 * `headlines` ([{ title, href }], newest first) is chosen on the server in
 * SiteChrome from the article data, so it follows the "latest by date" rule
 * automatically when you add articles.
 *  - md and up : one headline at a time, smooth fade, 2.5s each, looping.
 *  - below md  : all headlines scroll continuously to the left (marquee).
 */
export default function LatestNewsBar({ headlines = [] }) {
  // On the homepage, skip articles flagged "hideFromHome" in their JSON.
  // Everywhere else the bar shows the 4 newest stories, flagged or not.
  // (Applied after mount so the server HTML and the first client render match.)
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const onHome = mounted && pathname === "/";
  const shown = (onHome ? headlines.filter((h) => !h.hideFromHome) : headlines).slice(0, 4);
  const items = shown.length
    ? shown
    : [{ title: siteConfig.latestNewsPlaceholder, href: "/" }];

  return (
    <div className="relative overflow-hidden bg-header-navy">
      <HeaderGlow />
      <div className="relative mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-2.5 md:gap-4 md:px-6">
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <span className="rounded-md bg-gradient-to-br from-header-cyan-bright to-header-cyan-dark px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-[0_0_14px_rgba(34,211,238,0.55)] md:px-3.5 md:py-1.5 md:text-[13px]">
            Latest
          </span>
        </div>

        <span className="hidden h-4 w-px shrink-0 bg-white/25 sm:block" aria-hidden="true" />

        {/* Mobile: scrolling marquee */}
        <MobileMarquee items={items} />

        {/* Desktop / tablet: fading single headline */}
        <FadingHeadline items={items} />

        <MarketTicker className="hidden min-w-[250px] shrink-0 md:flex" />
      </div>
    </div>
  );
}

function FadingHeadline({ items }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), SLOT_MS);
    return () => clearInterval(id);
  }, [items.length]);

  const current = items[index % items.length];

  return (
    <p className="hidden min-w-0 flex-1 truncate font-sans text-[13.5px] leading-6 text-white/90 md:block">
      {/* key restarts the CSS fade each time the headline changes */}
      <Link key={index} href={current.href} className="latest-fade inline-block max-w-full truncate align-top hover:underline">
        {current.title}
      </Link>
    </p>
  );
}

function MobileMarquee({ items }) {
  const totalChars = items.reduce((n, it) => n + it.title.length + 8, 0);
  const duration = Math.max(18, totalChars / MARQUEE_CHARS_PER_SEC);

  // Two identical copies side by side; the track slides left by exactly one
  // copy's width and restarts, which looks like an endless loop.
  const copy = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i} className="flex shrink-0 items-center">
          <Link
            href={it.href}
            tabIndex={hidden ? -1 : undefined}
            className="whitespace-nowrap text-[12.5px] leading-6 text-white/90"
          >
            {it.title}
          </Link>
          <span className="mx-4 text-[8px] text-header-cyan-bright" aria-hidden="true">
            &#9679;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="latest-marquee-mask min-w-0 flex-1 overflow-hidden md:hidden">
      <div className="latest-marquee flex w-max" style={{ animationDuration: `${duration}s` }}>
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}
