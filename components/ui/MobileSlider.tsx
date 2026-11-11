"use client";
// Client component: below 640 px a card list becomes a swipeable slider (native CSS scroll-snap,
// styles in globals.css → .mobile-slider). From 640 px up the same <ul> is the normal grid.
// Controls: previous / next buttons, position dots and a "3 / 6" counter announced politely.
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/typography";

const MOBILE = "(max-width: 639.98px)";

export function useMobileSlider(listRef: RefObject<HTMLUListElement | null>) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [needsTabStop, setNeedsTabStop] = useState(false);

  const slides = useCallback(
    () => Array.from(listRef.current?.children ?? []).filter((el): el is HTMLElement => el instanceof HTMLElement && el.offsetParent !== null),
    [listRef],
  );

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const media = window.matchMedia(MOBILE);
    let frame = 0;

    const measure = () => {
      frame = 0;
      const items = slides();
      setCount(items.length);
      const first = items[0];
      if (!first) return;
      const maxScroll = list.scrollWidth - list.clientWidth;
      if (list.scrollLeft >= maxScroll - 4) return setIndex(items.length - 1);
      const step = (items[1]?.offsetLeft ?? first.offsetLeft + first.offsetWidth) - first.offsetLeft;
      setIndex(Math.max(0, Math.min(items.length - 1, Math.round(list.scrollLeft / step))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const onMedia = () => {
      setActive(media.matches);
      // a scrollable region needs a keyboard stop when its cards have nothing focusable inside
      setNeedsTabStop(!list.querySelector("a[href], button, [tabindex='0']"));
      measure();
    };

    onMedia();
    media.addEventListener("change", onMedia);
    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onMedia);
      list.removeEventListener("scroll", onScroll);
    };
  }, [listRef, slides]);

  const goTo = useCallback(
    (i: number) => {
      const list = listRef.current;
      const items = slides();
      const target = items[Math.max(0, Math.min(items.length - 1, i))];
      if (!list || !target || !items[0]) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      list.scrollTo({ left: target.offsetLeft - items[0].offsetLeft, behavior: reduce ? "auto" : "smooth" });
    },
    [listRef, slides],
  );

  return { active, index, count, needsTabStop, prev: () => goTo(index - 1), next: () => goTo(index + 1), goTo };
}

type ControlsProps = { index: number; count: number; prev: () => void; next: () => void; controls: string; label: string };

export function SliderControls({ index, count, prev, next, controls, label }: ControlsProps) {
  if (count < 2) return null;
  const atStart = index === 0;
  const atEnd = index === count - 1;
  const many = count > 8; // smaller dots so 12 of them + both buttons fit a 320 px screen
  const button =
    "grid size-12 shrink-0 place-items-center rounded-full bg-white text-plum-800 shadow-md shadow-plum-900/10 ring-1 ring-plum-100 transition-[background-color,color,opacity,scale] duration-300 active:scale-95 aria-disabled:opacity-40 not-aria-disabled:hover:bg-plum-600 not-aria-disabled:hover:text-white";
  return (
    <div className="js-only mt-2 flex items-center justify-between gap-3 sm:hidden">
      <button type="button" onClick={prev} aria-controls={controls} aria-disabled={atStart} className={button}>
        <ChevronLeft aria-hidden="true" className="size-6" />
        <span className="sr-only">Poprzednia karta: {label}</span>
      </button>
      <div className="flex min-w-0 flex-col items-center gap-2">
        <div aria-hidden="true" className={cn("flex items-center", many ? "gap-1" : "gap-1.5")}>
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={cn(
                "rounded-full transition-[width,background-color] duration-300",
                many ? "h-1.5" : "h-2",
                i === index ? (many ? "w-4 bg-plum-600" : "w-6 bg-plum-600") : cn("bg-plum-300/60", many ? "w-1.5" : "w-2"),
              )}
            />
          ))}
        </div>
        <p aria-live="polite" className="text-sm font-semibold tabular-nums text-plum-700">
          {index + 1} / {count}
        </p>
      </div>
      <button type="button" onClick={next} aria-controls={controls} aria-disabled={atEnd} className={button}>
        <ChevronRight aria-hidden="true" className="size-6" />
        <span className="sr-only">Następna karta: {label}</span>
      </button>
    </div>
  );
}

type SliderProps = { id: string; label: string; className?: string; children: ReactNode };

/** Generic wrapper for server-rendered <li> cards (used by "Jak pomagamy"). */
export function MobileSlider({ id, label, className, children }: SliderProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const slider = useMobileSlider(listRef);
  return (
    <div {...(slider.active && { role: "region", "aria-roledescription": "karuzela", "aria-label": label })}>
      <ul
        ref={listRef}
        id={id}
        className={cn("mobile-slider", className)}
        data-reveal-stagger
        {...(slider.active && slider.needsTabStop && { tabIndex: 0 })}
      >
        {children}
      </ul>
      <SliderControls {...slider} controls={id} label={label} />
    </div>
  );
}
