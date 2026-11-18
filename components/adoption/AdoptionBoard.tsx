"use client";
// Client component: species filter for the server-rendered adoption cards. Cards carry
// data-species; CSS (.adoption-list in globals.css) hides the ones that do not match.
// Without JS there is no filter bar and every card is visible.
import { useState, type ReactNode } from "react";

type Filter = "all" | "kot" | "pies";

const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Wszystkie" },
  { id: "kot", label: "Koty" },
  { id: "pies", label: "Psy" },
];

/** Polish plural: 1 kot, 2-4 koty (but 12-14 kotów), 5+ kotów. */
function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  const last = n % 10;
  const lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20) ? few : many;
}

function summary(filter: Filter, n: number) {
  if (filter === "kot") return n === 0 ? "Teraz nie mamy kotów do adopcji." : `${n} ${plural(n, "kot szuka", "koty szukają", "kotów szuka")} domu`;
  if (filter === "pies") return n === 0 ? "Teraz nie mamy psów do adopcji." : `${n} ${plural(n, "pies szuka", "psy szukają", "psów szuka")} domu`;
  return `${n} ${plural(n, "zwierzę szuka", "zwierzęta szukają", "zwierząt szuka")} domu`;
}

type Props = { counts: Record<"kot" | "pies", number>; children: ReactNode };

export function AdoptionBoard({ counts, children }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const count = filter === "all" ? counts.kot + counts.pies : counts[filter];

  return (
    <>
      <div className="js-only flex flex-col items-center gap-3">
        <div role="group" aria-label="Pokaż zwierzęta" className="flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className="min-h-11 rounded-full px-5 font-bold text-plum-800 ring-2 ring-inset ring-plum-100 transition-[background-color,color,translate] duration-300 hover:-translate-y-0.5 hover:ring-plum-300 aria-pressed:bg-plum-600 aria-pressed:text-white aria-pressed:ring-plum-600"
            >
              {f.label}
            </button>
          ))}
        </div>
        <p role="status" className="text-sm text-plum-700">
          {summary(filter, count)}
        </p>
      </div>
      <ul data-filter={filter} className="adoption-list mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </ul>
    </>
  );
}
