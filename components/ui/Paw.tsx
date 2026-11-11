import { cn } from "@/lib/typography";

/** Brand paw print (same shape as the lanyard pattern). Decorative only. */
export function Paw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={cn("shrink-0", className)} fill="currentColor">
      <ellipse cx="24" cy="44" rx="8" ry="11" transform="rotate(-20 24 44)" />
      <ellipse cx="40" cy="28" rx="8.5" ry="12" transform="rotate(-8 40 28)" />
      <ellipse cx="60" cy="28" rx="8.5" ry="12" transform="rotate(8 60 28)" />
      <ellipse cx="76" cy="44" rx="8" ry="11" transform="rotate(20 76 44)" />
      <path d="M50 52c12 0 26 12 26 24 0 10-9 14-16 12-5-1.5-7-3-10-3s-5 1.5-10 3c-7 2-16-2-16-12 0-12 14-24 26-24z" />
    </svg>
  );
}
