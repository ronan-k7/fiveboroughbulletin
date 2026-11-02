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
export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [prevQuery, setPrevQuery] = useState(query);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const mounted = useMounted();

  const containerRef = useRef(null);
  const inputWrapRef = useRef(null);
  const inputRef = useRef(null);
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
    const el = inputWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  }, []);

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
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function goTo(article) {
    router.push(`/${article.category}/${article.slug}`);
    closeAndReset();
  }

  function handleToggle() {
    if (open) closeAndReset();
    else setOpen(true);
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

  return (
    <div ref={containerRef} className="relative flex items-center">
      <div
        ref={inputWrapRef}
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? "mr-2 w-72 opacity-100" : "mr-0 w-0 opacity-0"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search vozpópuli..."
          aria-label="Search vozpópuli"
          className="h-11 w-72 rounded-xl border border-hairline bg-white px-4 text-sm text-ink shadow-inner outline-none placeholder:text-ink-soft/60 focus:border-header-cyan focus:ring-2 focus:ring-header-cyan/40"
        />
      </div>

      <button
        type="button"
        onClick={handleToggle}
        aria-label={open ? "Close search" : "Search"}
        aria-expanded={open}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-header-navy text-white shadow-[0_0_0_1px_rgba(34,211,238,0.45),0_10px_26px_-6px_rgba(14,165,233,0.6)] transition-all hover:shadow-[0_0_0_1px_rgba(34,211,238,0.75),0_12px_30px_-4px_rgba(14,165,233,0.8)]"
      >
        {open ? <CloseIcon /> : <SearchIcon />}
      </button>

      {mounted &&
        showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width }}
            className="z-[100] max-h-[70vh] overflow-y-auto rounded-xl border border-hairline bg-white shadow-[0_20px_45px_-12px_rgba(2,6,15,0.35)]"
            role="listbox"
          >
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
                      <ImagePlaceholder className="h-12 w-12 shrink-0 rounded-lg" src={a.image} />
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
          </div>,
          document.body
        )}
    </div>
  );
}
