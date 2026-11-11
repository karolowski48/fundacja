import type { MetadataRoute } from "next";
import { settings } from "@/lib/content";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: settings.name,
    short_name: settings.shortName,
    description: settings.seo.defaultDescription,
    lang: "pl",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf9f1",
    theme_color: "#462451",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
