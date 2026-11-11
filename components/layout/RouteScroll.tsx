"use client";
// Client component: predictable scroll position on navigation.
// - New page → top of the page (or the #anchor if the link has one), instantly.
// - Back/forward → left to the browser/Next scroll restoration.
// - Link to the page you are already on (e.g. the logo on the home page) → smooth scroll to top.
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function RouteScroll() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => (fromHistory.current = true);

    // Capture phase runs before next/link, which skips navigation when the event is already handled
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash) return;
      e.preventDefault();
      if (window.location.hash) window.history.replaceState(window.history.state, "", url.pathname);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    const position = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    position();
    // once more after images/fonts settle the layout of the new page
    const frame = requestAnimationFrame(position);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
