"use client";
// Client component: progressive "show all" for the story grid (640 px and up; without JS every card is
// visible) and a swipeable slider with every story on phones (see MobileSlider.tsx).
import { useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { buttonBase } from "@/components/ui/ButtonLink";
import { SliderControls, useMobileSlider } from "@/components/ui/MobileSlider";

export function StoriesList({ children, total, initial }: { children: ReactNode; total: number; initial: number }) {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const slider = useMobileSlider(listRef);

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      // move focus to the first newly revealed story so keyboard users land on new content
      requestAnimationFrame(() => listRef.current?.querySelector<HTMLElement>("[data-extra] article")?.focus());
    }
  }

  return (
    <>
      <div {...(slider.active && { role: "region", "aria-roledescription": "karuzela", "aria-label": "Historie zwierząt" })}>
        <ul
          ref={listRef}
          id="stories-list"
          data-expanded={expanded}
          className="stories-list mobile-slider mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          data-reveal-stagger
          {...(slider.active && slider.needsTabStop && { tabIndex: 0 })}
        >
          {children}
        </ul>
        <SliderControls {...slider} controls="stories-list" label="historie zwierząt" />
      </div>
      {total > initial && (
        <div className="js-only mt-10 flex justify-center max-sm:hidden">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="stories-list"
            onClick={toggle}
            className={`${buttonBase} bg-plum-600 text-white hover:bg-plum-700 hover:shadow-lg`}
          >
            {expanded ? "Pokaż mniej historii" : `Pokaż wszystkie historie (${total})`}
            <ChevronDown aria-hidden="true" className={`size-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </>
  );
}
