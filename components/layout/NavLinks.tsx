"use client";
// Client component: needs the current pathname to mark the active page (aria-current) and the
// open/closed state of the "O fundacji" dropdown (disclosure pattern: button + list of links).
import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
// type-only: lib/site reads content files on the server, it must not end up in the client bundle
import type { NavEntry, NavGroup, NavItem } from "@/lib/site";
import { cn } from "@/lib/typography";

export function useIsCurrent() {
  const pathname = usePathname();
  return (href: string) =>
    !href.includes("#") && (pathname === href || pathname === href.replace(/\/$/, ""));
}

const linkClass =
  "nav-link relative inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 font-semibold transition-colors hover:text-plum-600";

export function NavLinks({ items }: { items: readonly NavEntry[] }) {
  const isCurrent = useIsCurrent();
  return (
    <ul className="flex items-center gap-0.5">
      {items.map((item) =>
        "items" in item ? (
          <li key={item.label}>
            <NavMenu group={item} />
          </li>
        ) : (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={cn(linkClass, isCurrent(item.href) ? "text-plum-600" : "text-plum-800")}
            >
              {item.label}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}

/**
 * Dropdown for a group of links (owner's decision: opens on mouse hover).
 * - Mouse: opens when the pointer enters, closes ~0.2 s after it leaves; a click never closes it under the cursor.
 * - Keyboard: Enter/Space toggles, ArrowDown opens it and moves into the list, arrows/Home/End move between
 *   links, Escape closes it and returns focus to the button, Tab out of it closes it.
 * - Touch (no hover): a tap toggles it; a tap elsewhere closes it.
 */
function NavMenu({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pointerType = useRef("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isCurrent = useIsCurrent();
  const hasCurrent = group.items.some((item: NavItem) => isCurrent(item.href));

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const links = () => Array.from(wrap.querySelectorAll<HTMLAnchorElement>("ul a"));
    const focusLink = (index: number) => {
      const all = links();
      all[(index + all.length) % all.length]?.focus();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const all = links();
      const index = all.indexOf(document.activeElement as HTMLAnchorElement);
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        // render the open list right now, so its links are focusable in this same keypress
        flushSync(() => setOpen(true));
        focusLink(index + 1);
      } else if (e.key === "ArrowUp" && open) {
        e.preventDefault();
        focusLink(index <= 0 ? all.length - 1 : index - 1);
      } else if (e.key === "Home" && index >= 0) {
        e.preventDefault();
        focusLink(0);
      } else if (e.key === "End" && index >= 0) {
        e.preventDefault();
        focusLink(all.length - 1);
      }
    };
    // Tab past the last link (or anywhere outside) closes the menu
    const onFocusOut = (e: FocusEvent) => {
      if (!wrap.contains(e.relatedTarget as Node | null)) setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrap.contains(e.target as Node)) setOpen(false);
    };
    // hover (mouse only - touch has no hover and would open + toggle-close on the same tap)
    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(closeTimer.current);
      setOpen(true);
    };
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // a short grace period, so a diagonal move towards the list does not close it (WCAG 1.4.13: hoverable)
      closeTimer.current = setTimeout(() => setOpen(false), 200);
    };

    wrap.addEventListener("keydown", onKeyDown);
    wrap.addEventListener("focusout", onFocusOut);
    wrap.addEventListener("pointerenter", onPointerEnter);
    wrap.addEventListener("pointerleave", onPointerLeave);
    if (open) document.addEventListener("pointerdown", onPointerDown);
    return () => {
      wrap.removeEventListener("keydown", onKeyDown);
      wrap.removeEventListener("focusout", onFocusOut);
      wrap.removeEventListener("pointerenter", onPointerEnter);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        data-current={hasCurrent || undefined}
        onPointerDown={(e) => (pointerType.current = e.pointerType)}
        onClick={(e) => {
          // the mouse already opened it on hover - clicking must not close it under the cursor
          if (e.detail !== 0 && pointerType.current === "mouse") return setOpen(true);
          setOpen((o) => !o);
        }}
        className={cn(
          linkClass,
          "gap-1 pr-2",
          hasCurrent || open ? "text-plum-600" : "text-plum-800",
        )}
      >
        {group.label}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      {/* pt-2 instead of a margin: no gap between button and list, so the pointer never "leaves" on the way.
          Closed = display:none (never focusable); opening plays .nav-menu-in. No transition on
          `visibility`: descendants kept inheriting "hidden" for a moment and refused focus. */}
      <div className={cn("absolute left-0 top-full z-10 pt-2", !open && "hidden")}>
        <ul
          id={listId}
          className="nav-menu-in w-60 rounded-2xl bg-white p-2 shadow-xl shadow-plum-900/15 ring-1 ring-plum-100"
        >
          {group.items.map((item) => {
            const current = isCurrent(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center rounded-xl px-4 font-semibold transition-colors hover:bg-plum-50 hover:text-plum-600",
                    current ? "bg-plum-50 text-plum-600" : "text-plum-800",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
