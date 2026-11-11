import { brandIcons, type BrandIconName } from "@/lib/brand-icons";
import { cn } from "@/lib/typography";

export function BrandIcon({ name, className }: { name: BrandIconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={cn("shrink-0", className)} fill="currentColor">
      <path d={brandIcons[name].path} />
    </svg>
  );
}
