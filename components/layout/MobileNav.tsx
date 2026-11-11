"use client";
// Client component: off-canvas menu for screens below xl. Built on the native modal <dialog>:
// focus is trapped inside, Escape closes it, the page behind is inert, and focus returns to the
// "Menu" button on close. Slide-in and backdrop blur are CSS (.offcanvas in globals.css).
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Menu, Phone, X } from "lucide-react";
import { LogoImage } from "@/components/layout/Logo";
import { useIsCurrent } from "@/components/layout/NavLinks";
import { AppLink as Link } from "@/components/ui/AppLink";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { NewTabNote, newTabProps } from "@/components/ui/ExternalLink";
import type { BrandIconName } from "@/lib/brand-icons";

type Item = { href: string; label: string };
type Social = { icon: BrandIconName; name: string; href: string };

type Props = {
  items: readonly Item[];
  cta: Item;
  phone: { label: string; href: string };
  socials: Social[];
};

export function MobileNav({ items, cta, phone, socials }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isCurrent = useIsCurrent();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    // clicks on the dimmed backdrop land on the <dialog> itself, outside the panel's box
    const onClick = (e: MouseEvent) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    };
    // the panel never makes sense on desktop – close it if the window grows past the breakpoint
    const wide = window.matchMedia("(min-width: 80rem)");
    const onWide = () => wide.matches && dialog.open && dialog.close();
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("click", onClick);
    wide.addEventListener("change", onWide);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("click", onClick);
      wide.removeEventListener("change", onWide);
    };
  }, []);

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const close = () => dialogRef.current?.close();

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={show}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-bold text-plum-800 ring-2 ring-inset ring-plum-100 transition-colors hover:bg-plum-50 hover:ring-plum-300"
      >
        <Menu aria-hidden="true" className="size-5" />
        Menu
      </button>

      <dialog ref={dialogRef} id="mobile-menu" aria-label="Menu" className="offcanvas">
        <div className="relative isolate flex h-full flex-col overflow-y-auto overscroll-contain px-6 pb-8 pt-5">
          <div aria-hidden="true" className="bg-paws absolute inset-0 -z-10 opacity-60" />
          <div className="flex items-center justify-between gap-4">
            <LogoImage sizes="64px" className="w-16" />
            <button
              type="button"
              onClick={close}
              className="group grid size-12 place-items-center rounded-full bg-plum-100 text-plum-800 transition-colors hover:bg-plum-600 hover:text-white"
            >
              <X aria-hidden="true" className="size-6 transition-transform duration-300 group-hover:rotate-90" />
              <span className="sr-only">Zamknij menu</span>
            </button>
          </div>

          <nav aria-label="Menu główne" className="mt-8">
            <ul className="offcanvas-list">
              {items.map((item) => (
                <li key={item.href} className="border-b border-plum-100">
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className="group flex min-h-14 items-center justify-between gap-3 py-2 font-display text-2xl font-semibold uppercase tracking-wide text-plum-800 transition-colors hover:text-plum-600 aria-[current=page]:text-plum-600"
                  >
                    {item.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-5 -translate-x-2 text-plum-300 opacity-0 transition-[opacity,translate,color] duration-300 group-hover:translate-x-0 group-hover:text-plum-600 group-hover:opacity-100 group-aria-[current=page]:translate-x-0 group-aria-[current=page]:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-5 pt-10">
            <Link
              href={cta.href}
              onClick={close}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-sun-400 px-6 font-bold text-plum-950 shadow-lg shadow-plum-900/10 transition-colors hover:bg-sun-500"
            >
              <Heart aria-hidden="true" className="size-5" />
              {cta.label}
            </Link>
            <a href={phone.href} className="flex items-center gap-3 font-bold text-plum-800 transition-colors hover:text-plum-600">
              <span className="grid size-11 place-items-center rounded-full bg-plum-600 text-white">
                <Phone aria-hidden="true" className="size-5" />
              </span>
              {phone.label}
            </a>
            <ul className="flex gap-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    {...newTabProps}
                    className="grid size-11 place-items-center rounded-full bg-white text-plum-700 ring-1 ring-plum-100 transition-[background-color,color,translate] hover:-translate-y-0.5 hover:bg-plum-600 hover:text-white"
                  >
                    <BrandIcon name={s.icon} className="size-5" />
                    <span className="sr-only">{s.name}</span>
                    <NewTabNote />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </dialog>
    </div>
  );
}
