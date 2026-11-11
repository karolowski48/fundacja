"use client";
// Client component: category filter + accessible lightbox built on the native <dialog>
// (focus trap, Escape and focus return come from the browser). Without JS every tile is a
// plain link to the full-size image.
/* eslint-disable @next/next/no-img-element -- pre-generated responsive WebP, see scripts/optimize-images.mjs */
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/typography";

export type GalleryItem = {
  key: string;
  src: string;
  srcSet: string;
  full: string;
  width: number;
  height: number;
  blur: string;
  alt: string;
  caption: string;
  category: string;
  featured: boolean;
};

type Props = { items: GalleryItem[]; categories: Array<{ id: string; label: string }> };

function photosLabel(n: number) {
  if (n === 1) return "zdjęcie";
  const last = n % 10;
  const lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20) ? "zdjęcia" : "zdjęć";
}

export function Gallery({ items, categories }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const visible = filter === "all" ? items : items.filter((i) => i.category === filter);
  const current = index !== null ? visible[index] : undefined;

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setIndex(null);
    // mouse convenience: clicking the dimmed backdrop closes (keyboard users have Escape + the close button)
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === dialog || target.dataset.backdrop !== undefined) dialog.close();
    };
    const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0]?.clientX ?? null);
    const onTouchEnd = (e: TouchEvent) => {
      const start = touchX.current;
      const end = e.changedTouches[0]?.clientX;
      if (start !== null && end !== undefined && Math.abs(end - start) > 50) step(end < start ? 1 : -1);
      touchX.current = null;
    };
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("click", onClick);
    dialog.addEventListener("touchstart", onTouchStart, { passive: true });
    dialog.addEventListener("touchend", onTouchEnd);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("click", onClick);
      dialog.removeEventListener("touchstart", onTouchStart);
      dialog.removeEventListener("touchend", onTouchEnd);
    };
  }, [step]);

  const label = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  return (
    <>
      <div className="js-only flex flex-col items-center gap-3">
        <div role="group" aria-label="Filtruj zdjęcia" className="flex flex-wrap justify-center gap-2">
          {[{ id: "all", label: "Wszystkie" }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
              className="min-h-11 rounded-full px-5 font-bold text-plum-800 ring-2 ring-inset ring-plum-100 transition-[background-color,color,transform,scale,rotate,translate] duration-300 hover:-translate-y-0.5 hover:ring-plum-300 aria-pressed:bg-plum-600 aria-pressed:text-white aria-pressed:ring-plum-600"
            >
              {c.label}
            </button>
          ))}
        </div>
        <p role="status" className="text-sm text-plum-700">
          {visible.length} {photosLabel(visible.length)}
          {filter !== "all" && ` w kategorii „${label(filter)}”`}
        </p>
      </div>

      <ul className="mt-8 grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {visible.map((item, i) => (
          <li key={item.key} className={cn("gallery-tile", item.featured && "col-span-2 row-span-2")}>
            <a
              href={item.full}
              onClick={(e) => {
                e.preventDefault();
                open(i);
              }}
              className="group relative block aspect-square overflow-hidden rounded-[1.25rem] bg-plum-100 shadow-sm ring-1 ring-plum-100 sm:rounded-[1.5rem]"
            >
              <img
                src={item.src}
                srcSet={item.srcSet}
                sizes={item.featured ? "(min-width: 1024px) 34rem, (min-width: 640px) 66vw, 100vw" : "(min-width: 1024px) 17rem, (min-width: 640px) 33vw, 50vw"}
                width={item.width}
                height={item.height}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-110"
                style={{ backgroundImage: `url(${item.blur})`, backgroundSize: "cover" }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-plum-950/85 via-plum-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-2 p-3 text-sm font-bold text-cream-50 opacity-0 transition-[opacity,transform,scale,rotate,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:p-4"
              >
                <span>{item.caption}</span>
                <ZoomIn className="size-5 shrink-0 text-sun-400" />
              </span>
              <span className="sr-only"> - {item.caption}, otwórz powiększenie</span>
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Podgląd zdjęcia"
        className="lightbox m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-plum-950/95"
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 z-10 grid size-12 place-items-center rounded-full bg-cream-50 text-plum-900 shadow-lg transition-transform hover:rotate-90 hover:bg-sun-400"
        >
          <X aria-hidden="true" className="size-6" />
          <span className="sr-only">Zamknij podgląd</span>
        </button>
        {current && (
          <div data-backdrop className="flex h-full flex-col items-center justify-center gap-4 p-4 sm:p-8">
            <figure key={current.key} className="lightbox-figure flex max-h-full min-h-0 flex-col items-center">
              <img
                src={current.full}
                srcSet={current.srcSet}
                sizes="100vw"
                alt={current.alt}
                width={current.width}
                height={current.height}
                className="max-h-[calc(100dvh-9rem)] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <figcaption className="mt-4 text-center text-cream-50">
                <span className="font-display text-xl font-semibold uppercase tracking-wide">{current.caption}</span>
                <span className="ml-3 text-sm text-cream-100">
                  {(index ?? 0) + 1} / {visible.length}
                </span>
              </figcaption>
            </figure>
          </div>
        )}
        {visible.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-cream-50/90 text-plum-900 shadow-lg transition-[transform,scale,rotate,translate,background-color] hover:-translate-x-0.5 hover:bg-sun-400 sm:left-6"
            >
              <ChevronLeft aria-hidden="true" className="size-7" />
              <span className="sr-only">Poprzednie zdjęcie</span>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-cream-50/90 text-plum-900 shadow-lg transition-[transform,scale,rotate,translate,background-color] hover:translate-x-0.5 hover:bg-sun-400 sm:right-6"
            >
              <ChevronRight aria-hidden="true" className="size-7" />
              <span className="sr-only">Następne zdjęcie</span>
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
