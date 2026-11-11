"use client";
// Client component: needs the Clipboard API and local "copied" state.
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/typography";

type Props = {
  label: string;
  value: string;
  /** What lands in the clipboard; defaults to `value`. */
  copyValue?: string;
  /** Spoken name of the value, e.g. "numer konta". */
  spokenName: string;
  large?: boolean;
  className?: string;
};

export function CopyField({ label, value, copyValue, spokenName, large = false, className }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyValue ?? value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <div className={className}>
      <dt className="text-sm font-bold text-plum-700">{label}</dt>
      <dd
        className={cn(
          "mt-1.5 flex items-center justify-between gap-3 rounded-2xl bg-white py-2.5 pl-4 pr-2.5 ring-1 ring-plum-100",
          large && "flex-wrap",
        )}
      >
        <span className={cn("min-w-0 font-bold text-plum-900 tabular-nums", large ? "w-full text-lg tracking-wide sm:w-auto" : "text-base sm:text-[1.0625rem]")}>
          {value}
        </span>
        <button
          type="button"
          onClick={copy}
          className="js-only ml-auto inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-plum-100 px-4 text-sm font-bold text-plum-800 transition-colors hover:bg-plum-600 hover:text-white"
        >
          {status === "copied" ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
          <span>{status === "copied" ? "Skopiowano" : "Kopiuj"}</span>
          <span className="sr-only"> {spokenName}</span>
        </button>
        <span role="status" className="sr-only">
          {status === "copied" ? `Skopiowano ${spokenName} do schowka.` : status === "error" ? `Nie udało się skopiować. Zaznacz ${spokenName} ręcznie.` : ""}
        </span>
      </dd>
    </div>
  );
}
