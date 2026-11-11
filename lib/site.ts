import { settings } from "@/lib/content";

/** Public origin of the site. Override with NEXT_PUBLIC_SITE_URL until the final domain is set. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? settings.siteUrl).replace(/\/$/, "");

/** Preview builds (npm run build:preview) are for showing drafts – never indexed by search engines. */
export const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "1";

export const absoluteUrl = (pathname = "/") => `${siteUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

/** "724 236 270" → "+48724236270" */
export const toE164 = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("48") && digits.length === 11 ? `+${digits}` : `+48${digits}`;
};

export const telHref = (phone: string) => `tel:${toE164(phone)}`;

export const buildDate = new Date();

export type NavItem = { href: string; label: string };

export const navItems: readonly NavItem[] = [
  { href: "/o-nas/", label: "O nas" },
  { href: "/jak-pomagamy/", label: "Jak pomagamy" },
  { href: "/#historie", label: "Historie" },
  { href: "/galeria/", label: "Galeria" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#kontakt", label: "Kontakt" },
];

/** Subpages listed in the sitemap and llms.txt */
export const pages = [
  { path: "/o-nas/", name: "O nas", priority: 0.8 },
  { path: "/jak-pomagamy/", name: "Jak pomagamy", priority: 0.8 },
  { path: "/galeria/", name: "Galeria", priority: 0.6 },
  { path: "/polityka-prywatnosci/", name: "Polityka prywatności", priority: 0.2 },
] as const;
