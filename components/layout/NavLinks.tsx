"use client";
// Client component: needs the current pathname to mark the active page (aria-current).
import { AppLink as Link } from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/site";
import { cn } from "@/lib/typography";

export function useIsCurrent() {
  const pathname = usePathname();
  return (href: string) => !href.includes("#") && (pathname === href || pathname === href.replace(/\/$/, ""));
}

export function NavLinks({ items }: { items: readonly NavItem[] }) {
  const isCurrent = useIsCurrent();
  return (
    <ul className="flex items-center gap-0.5">
      {items.map((item) => {
        const current = isCurrent(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "nav-link relative inline-flex min-h-11 items-center rounded-full px-3 font-semibold transition-colors hover:text-plum-600",
                current ? "text-plum-600" : "text-plum-800",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
