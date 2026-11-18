import { settings } from "@/lib/content";

/** Public origin of the site. Override with NEXT_PUBLIC_SITE_URL until the final domain is set. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? settings.siteUrl).replace(/\/$/, "");

/** Preview builds (npm run build:preview) are for showing drafts - never indexed by search engines. */
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
/** A desktop dropdown ("O fundacji"); on phones and in the footer its links are listed flat. */
export type NavGroup = { label: string; items: readonly NavItem[] };
export type NavEntry = NavItem | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

/**
 * Main menu. Desktop (from 1280 px) shows the "O fundacji" group as a dropdown (opens on hover) so the bar
 * never wraps. FAQ is not in the menu (owner's decision) - it stays a section of the home page.
 */
export const navItems: readonly NavEntry[] = [
  {
    label: "O fundacji",
    items: [
      { href: "/o-nas/", label: "O nas" },
      { href: "/nasza-ekipa/", label: "Nasza Empatyczna Ekipa" },
      { href: "/partnerzy/", label: "Partnerzy" },
    ],
  },
  { href: "/jak-pomagamy/", label: "Jak pomagamy" },
  { href: "/do-adopcji/", label: "Do adopcji" },
  { href: "/#historie", label: "Historie" },
  { href: "/galeria/", label: "Galeria" },
  { href: "/#kontakt", label: "Kontakt" },
];

/** Every menu link in order - the mobile menu and the footer show them all. */
export const flatNavItems: readonly NavItem[] = navItems.flatMap((entry) => (isNavGroup(entry) ? entry.items : [entry]));

/** QR-code page. The path is printed on collection boxes and business cards - never change it. */
export const linksPagePath = "/linki/";

/** Subpages listed in the sitemap and llms.txt */
export const pages = [
  { path: "/o-nas/", name: "O nas", priority: 0.8 },
  { path: "/jak-pomagamy/", name: "Jak pomagamy", priority: 0.8 },
  { path: "/do-adopcji/", name: "Zwierzęta do adopcji", priority: 0.8 },
  { path: "/nasza-ekipa/", name: "Nasza Empatyczna Ekipa", priority: 0.7 },
  { path: "/galeria/", name: "Galeria", priority: 0.6 },
  { path: "/partnerzy/", name: "Nasi partnerzy", priority: 0.5 },
  { path: linksPagePath, name: "Wszystkie linki", priority: 0.5 },
  { path: "/polityka-prywatnosci/", name: "Polityka prywatności", priority: 0.2 },
] as const;
