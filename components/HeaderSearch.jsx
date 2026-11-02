"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllArticlesFlat, getCategory } from "@/lib/content";
import ImagePlaceholder from "./ImagePlaceholder";

function SearchIcon({ className = "" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className = "" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

const subscribeNoop = () => () => {};

/**
 * True only once the component has mounted in the browser. Used to defer
 * the portal render until after hydration, so the server-rendered HTML
 * (which has no `document` to portal into) matches the client's first
 * render -- avoiding a hydration mismatch.
 */
function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

function matchesQuery(article, q) {
  const haystack = [article.title, article.excerpt, article.subCategoryLabel, ...(article.keywords || [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

/**
 * Header search control. Replaces the desktop header's old "Subscribe" CTA
 * slot with an icon button (styled like the mobile header's navy/cyan
 * Account button, so it matches the header's existing icon-button language)
 * that expands into a text input. Suggestions appear in a floating panel
 * below the input as the user types.
 *
 * The suggestions panel is rendered into a portal on document.body and
 * positioned with `position: fixed`, computed from the input's own
 * bounding box. That's needed because the header rows this control lives
 * in use `overflow-hidden` (to clip the decorative HeaderPattern
 * background) -- an absolutely-positioned dropdown would get clipped at
 * the header's bottom edge instead of floating over the page content.
 */
export default function HeaderSearch({ mobile = false, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [prevQuery, setPrevQuery] = useState(query);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const mounted = useMounted();

  const containerRef = useRef(null);
  const inputWrapRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Small, eagerly-loaded dataset (see lib/content.js), so filtering it
  // client-side on every keystroke is cheap -- no need for a search API.
  const allArticles = useMemo(() => getAllArticlesFlat(), []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allArticles
      .filter((a) => matchesQuery(a, q))
      .sort((a, b) => {
        // Title matches float above excerpt/keyword-only matches.
        const aTitleHit = a.title.toLowerCase().includes(q) ? 0 : 1;
        const bTitleHit = b.title.toLowerCase().includes(q) ? 0 : 1;
        return aTitleHit - bTitleHit;
      })
      .slice(0, 6);
  }, [query, allArticles]);

  // Reset the keyboard-highlighted suggestion whenever the query text
  // itself changes (adjusted during render rather than in an effect, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(-1);
  }

  const recalcPosition = useCallback(() => {
    if (mobile) {
      const box = containerRef.current;
      if (!box) return;
      setCoords({ top: box.getBoundingClientRect().bottom + 10, left: 12, width: 0 });
      return;
    }
    const el = inputWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  }, [mobile]);

  useEffect(() => {
    if (!open) return undefined;
    recalcPosition();
    window.addEventListener("resize", recalcPosition);
    window.addEventListener("scroll", recalcPosition, true);
    return () => {
      window.removeEventListener("resize", recalcPosition);
      window.removeEventListener("scroll", recalcPosition, true);
    };
  }, [open, recalcPosition]);

  useEffect(() => {
    if (open) recalcPosition();
  }, [query, open, recalcPosition]);

  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  function closeAndReset() {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (e) => {
      const insideContainer = containerRef.current?.contains(e.target);
      const insideDropdown = dropdownRef.current?.contains(e.target);
      if (!insideContainer && !insideDropdown) {
        closeAndReset();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function goTo(article) {
    router.push(`/${article.category}/${article.slug}`);
    closeAndReset();
  }

  function handleToggle() {
    if (open) {
      closeAndReset();
    } else {
      // Position before opening so the mobile panel never flashes at the top-left.
      recalcPosition();
      setOpen(true);
      if (mobile) inputRef.current?.focus({ preventScroll: true });
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      closeAndReset();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const picked = activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
      if (picked) {
        goTo(picked);
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        closeAndReset();
      }
    }
  }

  const trimmed = query.trim();
  const showDropdown = open && trimmed.length > 0;

  const results = (
    <>
      {suggestions.length === 0 ? (
        <p className="p-4 text-sm text-ink-soft">No results for “{trimmed}”.</p>
      ) : (
        <ul>
          {suggestions.map((a, idx) => (
            <li key={`${a.category}-${a.slug}`} role="option" aria-selected={idx === activeIndex}>
              <Link
                href={`/${a.category}/${a.slug}`}
                onClick={closeAndReset}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex items-center gap-3 border-b border-hairline p-3 last:border-0 ${
                  idx === activeIndex ? "bg-neutral-50" : "hover:bg-neutral-50"
                }`}
              >
                <ImagePlaceholder className="h-12 w-12 shrink-0 rounded-lg" src={a.image} position={a.imagePosition} />
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wide text-header-cyan-dark">
                    {getCategory(a.category)?.label || a.category}
                  </span>
                  <span className="line-clamp-2 block text-sm font-semibold leading-snug text-ink">
                    {a.title}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {suggestions.length > 0 && (
        <Link
          href={`/search?q=${encodeURIComponent(trimmed)}`}
          onClick={closeAndReset}
          className="block border-t border-hairline p-3 text-center text-xs font-bold uppercase tracking-wide text-header-cyan-dark hover:bg-neutral-50"
        >
          See all results for “{trimmed}”
        </Link>
      )}
    </>
  );

  const buttonClass = mobile
    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-header-navy text-white shadow-[0_0_0_1px_rgba(34,211,238,0.45),0_6px_16px_-4px_rgba(14,165,233,0.6)]"
    : "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-header-navy text-white shadow-[0_0_0_1px_rgba(34,211,238,0.45),0_10px_26px_-6px_rgba(14,165,233,0.6)] transition-all hover:shadow-[0_0_0_1px_rgba(34,211,238,0.75),0_12px_30px_-4px_rgba(14,165,233,0.8)]";

  // Desktop: the input slides out to the left of the button (fixed 18rem).
  // Mobile: the same slide-out, but the container itself grows (flex-grow
  // 0 -> 1) while the header hides the logo (flex-grow 1 -> 0), so the input
  // smoothly takes over the whole row between the menu and search buttons.
  const containerClass = mobile
    ? `relative flex min-w-0 items-center transition-[flex-grow] duration-300 ease-out ${
        open ? "grow" : "grow-0"
      }`
    : "relative flex items-center";
  const wrapClass = mobile
    ? // Closed: zero width so the (invisible) input doesn't reserve ~300px of the
      // row and squeeze the logo to nothing. Open: fills the row.
      `min-w-0 overflow-hidden transition-[margin,opacity] duration-300 ease-out ${
        open ? "mr-2 flex-1 opacity-100" : "mr-0 w-0 flex-none opacity-0"
      }`
    : `overflow-hidden transition-all duration-300 ease-out ${
        open ? "mr-2 w-72 opacity-100" : "mr-0 w-0 opacity-0"
      }`;
  const inputClass = mobile
    ? "h-9 w-full rounded-full border border-hairline bg-white px-4 text-base text-ink shadow-inner outline-none placeholder:text-ink-soft/60 focus:border-header-cyan focus:ring-2 focus:ring-header-cyan/40"
    : "h-11 w-72 rounded-xl border border-hairline bg-white px-4 text-sm text-ink shadow-inner outline-none placeholder:text-ink-soft/60 focus:border-header-cyan focus:ring-2 focus:ring-header-cyan/40";

  return (
    <div ref={containerRef} className={containerClass}>
      <div ref={inputWrapRef} className={wrapClass}>
        <input
          ref={inputRef}
          type="text"
          enterKeyHint="search"
          autoComplete="off"
          tabIndex={open ? 0 : -1}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search the Bulletin..."
          aria-label="Search Five Borough Bulletin"
          className={inputClass}
        />
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label={open ? "Close search" : "Search"}
        aria-expanded={open}
        className={buttonClass}
      >
        {open ? <CloseIcon /> : <SearchIcon className={mobile ? "h-4 w-4" : ""} />}
      </button>

      {/* Suggestions float under the input (desktop: under the input itself,
          mobile: full-width under the header row) */}
      {mounted &&
        showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={
              mobile
                ? { position: "fixed", top: coords.top, left: coords.left, right: coords.left }
                : { position: "fixed", top: coords.top, left: coords.left, width: coords.width }
            }
            className="z-[100] max-h-[70vh] overflow-y-auto overflow-x-hidden rounded-xl border border-hairline bg-white shadow-[0_20px_45px_-12px_rgba(2,6,15,0.35)]"
            role="listbox"
          >
            {results}
          </div>,
          document.body
        )}
    </div>
  );
}
