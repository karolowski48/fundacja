import { cn, nbsp } from "@/lib/typography";

/** Badge on a sample card from content/placeholders.json. */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "rounded-full border-2 border-dashed border-plum-300 bg-white px-3 py-0.5 font-display text-xs font-semibold uppercase tracking-wider text-plum-700 shadow-sm",
        className,
      )}
    >
      Przykład
    </p>
  );
}

/** One line above a list that currently shows sample cards. */
export function SampleNote({ text, className }: { text: string; className?: string }) {
  return (
    <p
      data-sample-note
      className={cn(
        "mx-auto w-fit max-w-2xl rounded-2xl border-2 border-dashed border-plum-300 bg-white/70 px-4 py-2 text-center text-sm font-semibold text-plum-700",
        className,
      )}
    >
      {nbsp(text)}
    </p>
  );
}
