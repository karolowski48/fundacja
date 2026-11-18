import { Info } from "lucide-react";
import { cn, nbsp } from "@/lib/typography";

/** Owner's note shown right under the phone number (settings.phoneNote) - quoted as written. */
export function PhoneNote({ text, className }: { text: string; className?: string }) {
  return (
    <p data-phone-note className={cn("flex gap-3 rounded-[1.25rem] bg-sun-400/25 px-4 py-3 text-plum-900 ring-1 ring-sun-500/60", className)}>
      <Info aria-hidden="true" className="mt-1 size-5 shrink-0 text-plum-700" />
      <span>{nbsp(text)}</span>
    </p>
  );
}
