import { ChevronRight } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { cn } from "@/lib/typography";

export function Breadcrumbs({ current, tone = "light" }: { current: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Okruszki">
      <ol className={cn("flex flex-wrap items-center gap-1 text-sm", dark ? "text-cream-100" : "text-plum-700")}>
        <li>
          <Link href="/" className={cn("underline underline-offset-4", dark ? "hover:text-sun-400" : "hover:text-plum-900")}>
            Strona główna
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4" />
        </li>
        <li aria-current="page" className="font-semibold">
          {current}
        </li>
      </ol>
    </nav>
  );
}
