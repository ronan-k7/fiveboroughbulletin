"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export default function Header({ latestHeadlines = [] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Mobile search: the logo is removed from the row the moment search opens
  // (so it can never be squeezed/cut), and comes back only after the input
  // has finished sliding shut.
  const [logoHidden, setLogoHidden] = useState(false);
  const [searchUsed, setSearchUsed] = useState(false);
  const logoTimer = useRef(null);
  const handleMobileSearchOpen = useCallback((isOpen) => {
    clearTimeout(logoTimer.current);
    if (isOpen) {
      setSearchUsed(true);
      setLogoHidden(true);
    } else {
      logoTimer.current = setTimeout(() => setLogoHidden(false), 320);
    }
  }, []);
  useEffect(() => () => clearTimeout(logoTimer.current), []);

  // Compact sticky header on scroll.
  //
  // The header's LAYOUT height never changes. Collapsing used to animate
  // max-height / padding / logo height, which resized the sticky header and
  // reflowed the whole page on every frame: content jumped, the browser
  // clamped scrollY mid-animation, and the old code needed a 300ms scroll
  // lock plus wide thresholds to stop it flip-flopping.
  //
  // Now the header keeps its expanded size and the collapse is purely
  // visual, done with transforms (compositor only, no reflow):
  //  - the whole header slides up by `collapse` px, tucking the Latest bar
  //    (and, on md+, the extra row padding) above the viewport;
  //  - on md+ the row's content is nudged back down and the logo is scaled,
  //    so the compact row ends up exactly where the old py-2 / h-10 layout was.
  // With no layout feedback the scroll handler can be a plain hysteresis
  // check, driven by requestAnimationFrame.
  const barRef = useRef(null);
  const [collapse, setCollapse] = useState(0);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return undefined;
    const mq = window.matchMedia("(min-width: 768px)");
    // md+: also hide 2 x 16px of row padding (py-4 -> py-2 equivalent).
    const measure = () => setCollapse(el.offsetHeight + (mq.matches ? 32 : 0));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    mq.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, []);

  useEffect(() => {
    const COLLAPSE_AT = 48;
    const EXPAND_AT = 8;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > COLLAPSE_AT) return true;
        if (prev && y <= EXPAND_AT) return false;
        return prev;
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className="sticky top-0 z-30 bg-white shadow-sm transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none"
      style={{ transform: scrolled ? `translate3d(0, -${collapse}px, 0)` : "translate3d(0, 0, 0)" }}
    >
      <div ref={barRef}>
        <LatestNewsBar headlines={latestHeadlines} />
      </div>

      {/* Desktop / tablet header row */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-white via-[#f6f9fb] to-[#eef3f8] md:block">
        <HeaderPattern />
        <div
          className={`relative mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            scrolled ? "translate-y-4" : ""
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

          {/* Not rendered at all while mobile search is open (so no part of it can
              show, even squeezed); fades back in after the search closes */}
          {!logoHidden && (
            <Logo className={`min-w-0 flex-1 ${searchUsed ? "logo-fade-in" : ""}`} />
          )}

          <HeaderSearch mobile onOpenChange={handleMobileSearchOpen} />
        </div>
      </div>
      <MobileNavStrip />
      <div className="border-b border-hairline md:hidden" />

    </header>
    {/* Outside <header>: the header is transformed, which would otherwise
        become the containing block for this drawer's position: fixed. */}
    <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
