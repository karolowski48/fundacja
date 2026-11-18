import type { ReactNode } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { settings } from "@/lib/content";
import { buildDate } from "@/lib/site";

// Minimal "link in bio" layout for the QR code page: no site header, menu or big footer -
// someone who scanned a collection box sees the links straight away.
export default function LinksLayout({ children }: { children: ReactNode }) {
  return (
    <div className="links-page on-dark relative isolate flex min-h-dvh flex-col overflow-hidden bg-plum-800 text-cream-50">
      <div aria-hidden="true" className="bg-paws absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_26rem_at_50%_0%,rgb(123_79_157/0.6),transparent_70%)]"
      />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-lg flex-1 px-4 pb-12 pt-10 sm:pt-14">
        {children}
      </main>
      <footer className="border-t border-cream-100/15 px-4 py-6 text-center text-sm text-cream-100">
        <p>
          © {buildDate.getFullYear()} {settings.name}
        </p>
        <p className="mt-2">
          <Link href="/polityka-prywatnosci/" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-sun-400">
            Polityka prywatności
          </Link>
        </p>
      </footer>
    </div>
  );
}
