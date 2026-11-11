import type { MetadataRoute } from "next";
import { absoluteUrl, buildDate, pages } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: buildDate, changeFrequency: "weekly", priority: 1 },
    ...pages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: buildDate,
      changeFrequency: page.priority > 0.5 ? ("monthly" as const) : ("yearly" as const),
      priority: page.priority,
    })),
  ];
}
