import type { MetadataRoute } from "next";
import { absoluteUrl, isPreview, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// AI crawlers are welcome: we want to be cited when people ask how to help cats.
export default function robots(): MetadataRoute.Robots {
  if (isPreview) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
