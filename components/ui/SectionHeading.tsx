import { Paw } from "@/components/ui/Paw";
import { cn, nbsp } from "@/lib/typography";

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, lead, align = "left", tone = "light", className }: Props) {
  const dark = tone === "dark";
  return (
    <div data-reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em]",
            dark ? "text-sun-400" : "text-plum-600",
          )}
        >
          <Paw className="size-4" />
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          "font-display text-[clamp(1.875rem,3.6vw,2.75rem)] font-bold leading-[1.1] text-balance",
          dark ? "text-cream-50" : "text-plum-800",
        )}
      >
        {nbsp(title)}
      </h2>
      {lead && <p className={cn("mt-4 text-lg text-pretty", dark ? "text-cream-100" : "text-plum-700")}>{nbsp(lead)}</p>}
    </div>
  );
}
