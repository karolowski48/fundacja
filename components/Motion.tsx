"use client";
// Client component: scroll-driven motion with GSAP + ScrollTrigger.
// - GSAP is loaded lazily on idle, so it never competes with the first paint / LCP.
// - Elements already on screen when GSAP starts are left alone (no flash of hidden content).
// - Hidden-before-reveal uses opacity only (never visibility), so keyboard focus is never lost.
// - Nothing runs when the user prefers reduced motion.
// Hooks: [data-reveal] [data-reveal-stagger] [data-count] [data-parallax] [data-draw-line]
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const offscreen = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;

      const ctx = gsap.context(() => {
        // Single blocks fade up
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          if (!offscreen(el)) return;
          gsap.from(el, {
            opacity: 0,
            y: 48,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // Lists: children cascade in
        gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((list) => {
          const items = Array.from(list.children).filter(
            (c): c is HTMLElement => c instanceof HTMLElement && getComputedStyle(c).display !== "none" && offscreen(c),
          );
          if (items.length === 0) return;
          gsap.set(items, { opacity: 0, y: 40, scale: 0.97 });
          ScrollTrigger.batch(items, {
            start: "top 92%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.09, overwrite: true }),
          });
        });

        // Numbers count up (the screen-reader copy next to them stays static)
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          if (!offscreen(el)) return;
          const target = Number(el.dataset.count);
          const template = el.textContent ?? "";
          const counter = { value: 0 };
          el.textContent = template.replace(String(target), "0");
          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onUpdate: () => {
              el.textContent = template.replace(String(target), String(Math.round(counter.value)));
            },
          });
        });

        // Gentle parallax layers (hero collage, paw backgrounds)
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = Number(el.dataset.parallax || 0.1);
          gsap.to(el, {
            yPercent: -speed * 100,
            ease: "none",
            scrollTrigger: { trigger: el.closest("section") ?? el, start: "top top", end: "bottom top", scrub: 0.5 },
          });
        });

        // Timeline line draws itself while scrolling
        gsap.utils.toArray<HTMLElement>("[data-draw-line]").forEach((el) => {
          gsap.from(el, { scaleY: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 65%", scrub: 0.6 } });
        });
      });

      // Anything that receives keyboard focus is shown immediately
      const onFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        const hidden = target.closest<HTMLElement>("[data-reveal], [data-reveal-stagger] > *");
        if (hidden && getComputedStyle(hidden).opacity !== "1") gsap.to(hidden, { opacity: 1, y: 0, scale: 1, duration: 0.2 });
      };
      document.addEventListener("focusin", onFocus);

      cleanup = () => {
        document.removeEventListener("focusin", onFocus);
        ctx.revert();
      };
      ScrollTrigger.refresh();
    };

    const idle: (cb: () => void) => number =
      "requestIdleCallback" in window ? (cb) => window.requestIdleCallback(cb, { timeout: 1500 }) : (cb) => window.setTimeout(cb, 200);
    idle(() => void start());

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
