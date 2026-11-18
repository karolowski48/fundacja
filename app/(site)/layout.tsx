import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

// Every regular page: header, footer and back-to-top. The QR links page (app/(links)) has none of them.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
