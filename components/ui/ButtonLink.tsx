import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { NewTabNote, newTabProps } from "@/components/ui/ExternalLink";
import { cn } from "@/lib/typography";

const variants = {
  sun: "bg-sun-400 text-plum-950 shadow-lg shadow-plum-950/20 hover:bg-sun-500 hover:shadow-xl",
  plum: "bg-plum-600 text-white shadow-md shadow-plum-900/15 hover:bg-plum-700 hover:shadow-lg",
  outlineLight: "text-cream-50 ring-2 ring-inset ring-cream-100 hover:bg-cream-50 hover:text-plum-800",
  outlinePlum: "text-plum-700 ring-2 ring-inset ring-plum-600 hover:bg-plum-600 hover:text-white",
} as const;

export const buttonBase =
  "group/btn inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold leading-tight transition-[background-color,color,box-shadow,transform,scale,rotate,translate] duration-300 hover:-translate-y-0.5 active:translate-y-0";

type Props = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  external?: boolean;
  className?: string;
};

/** Link styled as a button. External links open in a new tab and get a visual + spoken cue. */
export function ButtonLink({ href, children, variant = "plum", external, className }: Props) {
  return (
    <a href={href} className={cn(buttonBase, variants[variant], className)} {...(external && newTabProps)}>
      {children}
      {external && <ExternalLink aria-hidden="true" className="size-4 opacity-80 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />}
      {external && <NewTabNote />}
    </a>
  );
}
