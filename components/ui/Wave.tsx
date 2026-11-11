import { cn } from "@/lib/typography";

/** Soft organic edge between sections; colour comes from `currentColor`. */
export function Wave({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("block h-12 w-full sm:h-16 lg:h-20", flip && "rotate-180", className)}
    >
      <path fill="currentColor" d="M0 90V46c120 22 260 36 420 30 170-6 300-44 480-48 190-4 320 30 540 52v10H0z" />
    </svg>
  );
}
