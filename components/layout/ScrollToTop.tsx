"use client";
// Client component: floating "back to top" button with a scroll-progress ring.
// The same scroll listener flags html[data-scrolled] so the sticky header can show a shadow.
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, y / max) : 0;
      document.documentElement.toggleAttribute("data-scrolled", y > 8);
      setVisible(y > 600);
      ringRef.current?.setAttribute("stroke-dashoffset", String(CIRCUMFERENCE * (1 - progress)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // keyboard users continue from the top of the page
    document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      inert={!visible}
      data-visible={visible}
      className="scroll-top group fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-plum-800 text-cream-50 shadow-xl shadow-plum-950/30 transition-[opacity,transform,scale,rotate,translate,background-color] duration-300 hover:bg-plum-600 sm:bottom-8 sm:right-8"
    >
      <svg viewBox="0 0 56 56" aria-hidden="true" className="absolute inset-0 size-full -rotate-90">
        <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <circle
          ref={ringRef}
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="var(--color-sun-400)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUp aria-hidden="true" className="relative size-6 transition-transform duration-300 group-hover:-translate-y-1" />
      <span className="sr-only">Przewiń na górę strony</span>
    </button>
  );
}
