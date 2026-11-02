"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import MainNav from "./MainNav";
import LatestNewsBar from "./LatestNewsBar";
import MobileNavDrawer from "./MobileNavDrawer";
import MobileNavStrip from "./MobileNavStrip";
import HeaderPattern from "./HeaderPattern";
import HeaderSearch from "./HeaderSearch";

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Shrinks the header/logo once the page scrolls past the top strip,
  // matching the reference video's compact sticky header on scroll.
  //
  // This has two feedback-loop hazards, both caused by the header being
  // `sticky`: collapsing the "Latest" bar shrinks the sticky header, which
  // shrinks the scrollable area, which the browser reflects by reducing
  // window.scrollY in real time WHILE the collapse is still animating.
  // That drop can itself cross back below a "re-expand" threshold and
  // undo the collapse before it finishes, which un-shrinks the header and
  // pushes scrollY back up past the "collapse" threshold — repeating
  // every time the user's scroll position sits anywhere near the top.
  //
  // Two changes close this off:
  //  1. The expand threshold sits comfortably below zero-crossing noise
  //     (0 instead of 8) and the collapse threshold is set well above the
  //     bar's own height (~70px expanded->collapsed delta, including
  //     mobile's taller two-row strip), so the animation-driven scrollY
  //     dip can no longer bridge the gap between the two thresholds.
  //  2. Scroll events are ignored for the duration of the CSS transition
  //     once a state flip starts, so the animation's own scroll-position
  //     side effects can never trigger a second flip before the first one
  //     has settled.
  useEffect(() => {
    const COLLAPSE_AT = 96;
    const EXPAND_AT = 0;
    const TRANSITION_MS = 320; // matches the 300ms CSS transition + margin
    let locked = false;
    let lockTimer = null;

    const onScroll = () => {
      if (locked) return;
      setScrolled((prev) => {
        let next = prev;
        if (!prev && window.scrollY > COLLAPSE_AT) next = true;
        else if (prev && window.scrollY <= EXPAND_AT) next = false;
        if (next !== prev) {
          locked = true;
          clearTimeout(lockTimer);
          lockTimer = setTimeout(() => {
            locked = false;
          }, TRANSITION_MS);
        }
        return next;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(lockTimer);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        }`}
      >
        <LatestNewsBar />
      </div>

      {/* Desktop / tablet header row */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-white via-[#f6f9fb] to-[#eef3f8] md:block">
        <HeaderPattern />
        <div
          className={`relative mx-auto flex max-w-[1440px] items-center justify-between px-6 transition-[padding] duration-300 ease-out ${
            scrolled ? "py-2" : "py-4"
          }`}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink shadow-[0_8px_20px_-6px_rgba(14,165,233,0.35)] ring-1 ring-black/5 transition-all hover:text-header-cyan hover:shadow-[0_8px_24px_-4px_rgba(14,165,233,0.55)] hover:ring-header-cyan/40"
          >
            <HamburgerIcon />
          </button>

          <Logo shrink={scrolled} />

          <HeaderSearch />
        </div>
      </div>
      <div className="hidden border-b border-hairline md:block" />
      <MainNav className="mx-auto hidden max-w-[1440px] px-6 md:block" />
      <div className="hidden border-b border-hairline md:block" />

      {/* Mobile header row */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#f6f9fb] to-[#eef3f8] md:hidden">
        <HeaderPattern />
        <div className="relative flex items-center justify-between gap-2 px-3 py-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-ink shadow-[0_6px_16px_-4px_rgba(14,165,233,0.4)] ring-1 ring-black/5"
          >
            <HamburgerIcon />
          </button>

          <Logo className="min-w-0 flex-1" />

          <Link
            href="/account"
            aria-label="Account"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-header-navy text-white shadow-[0_0_0_1px_rgba(34,211,238,0.45),0_6px_16px_-4px_rgba(14,165,233,0.6)]"
          >
            <AccountIcon />
          </Link>
        </div>
      </div>
      <MobileNavStrip />
      <div className="border-b border-hairline md:hidden" />

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
