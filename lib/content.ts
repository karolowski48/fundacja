// Content loaders. Everything the page says lives in /content (editable later in Sveltia CMS).
// JSON files are imported statically, so a missing or renamed field fails `next build` (typecheck).
// Markdown collections are validated at build time and throw on a missing required field.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { nbsp } from "@/lib/typography";
import settingsJson from "@/content/settings.json";
import homeJson from "@/content/home.json";
import faqJson from "@/content/faq.json";
import aboutJson from "@/content/about.json";
import helpJson from "@/content/help.json";
import galleryJson from "@/content/gallery.json";
import teamJson from "@/content/team.json";
import adoptionPageJson from "@/content/adoption-page.json";
import linksJson from "@/content/links.json";
import partnersJson from "@/content/partners.json";
import placeholdersJson from "@/content/placeholders.json";
import teamFixture from "@/tests/fixtures/team.json";

/**
 * `CONTENT_FIXTURES=1` builds the site with sample data from tests/fixtures (volunteers, animals for
 * adoption) so the filled-in layouts can be tested before the real content arrives. Never set it for
 * a deploy - see scripts/test-fixtures.mjs.
 */
const useFixtures = process.env.CONTENT_FIXTURES === "1";

/**
 * Sample cards (volunteers, animals, partners, statute) shown while the real list is still empty -
 * the owner asked for them on 18.11.2026 to see the layouts filled in. Every sample carries a visible
 * "Przykład" badge and is left out of JSON-LD and llms.txt. They disappear by themselves once real data
 * exists; before launch set settings.json → showPlaceholders: false (CLAUDE.md §14).
 */
export const placeholdersOn = !useFixtures && settingsJson.showPlaceholders === true;
export const placeholderNotes = placeholdersJson.notes;

export const settings = settingsJson;
export const home = homeJson;
export const about = aboutJson;
export const helpPage = helpJson;
export const gallery = galleryJson;
export const adoptionPage = adoptionPageJson;
const partnersSource: Partners = partnersJson;
export const partners: Partners =
  partnersSource.items.length === 0 && placeholdersOn
    ? { ...partnersSource, items: placeholdersJson.partners.map((p) => ({ ...p, placeholder: true })) }
    : partnersSource;
export type Settings = typeof settingsJson;

export type FaqItem = { question: string; answer: string; link?: { href: string; label: string } };
export const faq: FaqItem[] = faqJson.items;

const CONTENT_DIR = path.join(process.cwd(), "content");

// ───────────── Team (/nasza-ekipa/) ─────────────
// Publish only volunteers who agreed to it (CLAUDE.md §8).

export type TeamMember = {
  name: string;
  /** Short role shown as a badge, e.g. "Kiermasze", "Rękodzieło", "Zbiórki", "Codzienna pomoc". */
  role: string;
  description: string;
  /** Name from public/images/manifest.json or a CMS upload path ("/images/uploads/x.jpg"). */
  image: string;
  imageAlt: string;
  /** Sample card from content/placeholders.json */
  placeholder?: boolean;
};
export type FairPhoto = { image: string; alt: string; caption: string };
type TextBlock = { eyebrow: string; title: string };
export type Team = {
  seo: { title: string; description: string };
  intro: TextBlock & { lead: string; crumb: string };
  roles: TextBlock & { items: Array<{ icon: string; title: string; text: string }> };
  membersSection: TextBlock & { emptyTitle: string; emptyText: string };
  members: TeamMember[];
  fairsSection: TextBlock & { lead: string };
  fairs: FairPhoto[];
  join: { title: string; text: string; cta: string; fallbackNote: string };
  /** Google Form "Zostań wolontariuszem". Empty → the button leads to the contact section. */
  volunteerFormUrl: string;
};
const teamSource: Team = useFixtures ? teamFixture : teamJson;
export const team: Team =
  teamSource.members.length === 0 && placeholdersOn
    ? { ...teamSource, members: placeholdersJson.team.map((m) => ({ ...m, placeholder: true })) }
    : teamSource;

// ───────────── Partners ─────────────

export type Partner = {
  name: string;
  url: string;
  /** file in public/partners/, e.g. "/partners/ctrlz.svg"; empty → text label */
  logo: string;
  /** Sample tile from content/placeholders.json (not a link) */
  placeholder?: boolean;
};
export type Partners = {
  seo: { title: string; description: string };
  hero: { eyebrow: string; title: string; lead: string; crumb: string };
  section: { eyebrow: string; title: string; lead: string; join: string };
  items: Partner[];
};

// ───────────── Links page (/linki/ - printed as a QR code, the path never changes) ─────────────

export type LinkItem = { id: string; label: string; description: string; icon: string; url: string };
type LinksContent = Omit<typeof linksJson, "links" | "more"> & { links: LinkItem[]; more: LinkItem[] };
const linksContent: LinksContent = linksJson;

/** An empty `url` falls back to the same address used elsewhere on the site, so it is set in one place. */
function resolveLink(item: LinkItem): LinkItem {
  if (item.url) return item;
  const fallback: Record<string, string> = {
    facebook: settings.social.facebook,
    instagram: settings.social.instagram,
    tiktok: settings.social.tiktok,
    zrzutka: settings.donation.zrzutkaUrl,
    wolontariat: team.volunteerFormUrl,
  };
  return { ...item, url: fallback[item.id] ?? "" };
}

export const links = { ...linksContent, links: linksContent.links.map(resolveLink), more: linksContent.more.map(resolveLink) };

// ───────────── Documents ─────────────

export type SiteDocument = {
  href: string;
  label: string;
  /** "PDF, 240 KB" */
  details: string;
  /** The sample PDF from content/placeholders.json (kept out of llms.txt) */
  placeholder?: boolean;
};

function fileSizeLabel(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

/** Statute PDF from settings.documents.statutePdf (a file in public/dokumenty/). Empty → null, nothing is shown. */
export function getStatute(): SiteDocument | null {
  const real = useFixtures ? "/dokumenty/statut-testowy.pdf" : settings.documents.statutePdf.trim();
  const placeholder = !real && placeholdersOn;
  const href = real || (placeholder ? placeholdersJson.statutePdf : "");
  if (!href) return null;
  const file = useFixtures ? path.join(process.cwd(), "tests", "fixtures", "statut-testowy.pdf") : path.join(process.cwd(), "public", href.replace(/^\//, ""));
  if (!href.startsWith("/") || !fs.existsSync(file)) {
    throw new Error(`content/settings.json: documents.statutePdf "${href}" - file not found in public/ (expected e.g. "/dokumenty/statut.pdf").`);
  }
  const details = `PDF, ${fileSizeLabel(fs.statSync(file).size)}`;
  return placeholder
    ? { href, label: `Statut fundacji (przykład, ${details})`, details, placeholder }
    : { href, label: `Statut fundacji (${details})`, details };
}

function requireString(data: Record<string, unknown>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${file}: missing required field "${key}"`);
  }
  return value;
}

function optionalString(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

export type Story = {
  slug: string;
  name: string;
  before: string;
  now: string;
  imageBefore: string;
  imageAfter: string;
  altBefore: string;
  altAfter: string;
  order: number;
};

export function getStories(): Story[] {
  const dir = path.join(CONTENT_DIR, "stories");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const file = `content/stories/${f}`;
      const { data } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return {
        slug: f.replace(/\.md$/, ""),
        name: requireString(data, "name", file),
        before: requireString(data, "before", file),
        now: optionalString(data, "now"),
        imageBefore: requireString(data, "imageBefore", file),
        imageAfter: requireString(data, "imageAfter", file),
        altBefore: requireString(data, "altBefore", file),
        altAfter: requireString(data, "altAfter", file),
        order: typeof data.order === "number" ? data.order : 999,
      };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "pl"));
}

export type Page = { title: string; description: string; updated: string; draft: boolean; html: string };

export function getPage(slug: string): Page {
  const file = `content/pages/${slug}.md`;
  const { data, content } = matter(fs.readFileSync(path.join(CONTENT_DIR, "pages", `${slug}.md`), "utf8"));
  const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : requireString(data, "updated", file);
  return {
    title: requireString(data, "title", file),
    description: requireString(data, "description", file),
    updated,
    draft: data.draft === true,
    // Markdown comes only from our own repository (CMS commits), never from visitors
    html: marked.parse(content, { async: false }),
  };
}

// ───────────── Animals for adoption (content/adoption/*.md, files starting with "_" are ignored) ─────────────

export type AdoptionSpecies = "kot" | "pies";
export type AdoptionStatus = "szuka domu" | "zarezerwowany";
export type AdoptionAnimal = {
  slug: string;
  name: string;
  species: AdoptionSpecies;
  sex: "samica" | "samiec" | "";
  age: string;
  status: AdoptionStatus;
  image: string;
  imageAlt: string;
  facts: string[];
  /** First paragraph of the story (HTML), always visible. */
  storyLead: string;
  /** The rest of the story (HTML), behind "Czytaj całą historię". */
  storyMore: string;
  order: number;
  /** Sample card from content/placeholders.json */
  placeholder?: boolean;
};

function oneOf<T extends string>(data: Record<string, unknown>, key: string, allowed: readonly T[], file: string, fallback?: T): T {
  const value = data[key] ?? fallback;
  if (typeof value !== "string" || !(allowed as readonly string[]).includes(value)) {
    throw new Error(`${file}: field "${key}" must be one of ${allowed.map((a) => `"${a}"`).join(", ")}`);
  }
  return value as T;
}

/** Polish typesetting inside Markdown prose (list markers stay untouched). */
function nbspMarkdown(md: string): string {
  return md
    .split("\n")
    .map((line) => {
      const marker = line.match(/^(\s*(?:[-*+]|\d+\.)\s+)(.*)$/);
      return marker ? marker[1] + nbsp(marker[2] ?? "") : nbsp(line);
    })
    .join("\n");
}

function placeholderAnimals(): AdoptionAnimal[] {
  const species = ["kot", "pies"] as const;
  const sexes = ["samica", "samiec", ""] as const;
  const statuses = ["szuka domu", "zarezerwowany"] as const;
  const file = "content/placeholders.json";
  return placeholdersJson.adoption.map((a) => ({
    slug: a.slug,
    name: a.name,
    species: oneOf({ species: a.species }, "species", species, file),
    sex: oneOf({ sex: a.sex }, "sex", sexes, file, ""),
    age: a.age,
    status: oneOf({ status: a.status }, "status", statuses, file),
    image: a.image,
    imageAlt: a.imageAlt,
    facts: a.facts,
    storyLead: marked.parse(nbsp(a.story[0] ?? ""), { async: false }),
    storyMore: a.story.length > 1 ? marked.parse(a.story.slice(1).map(nbsp).join("\n\n"), { async: false }) : "",
    order: a.order,
    placeholder: true,
  }));
}

export function getAdoptionAnimals(): AdoptionAnimal[] {
  const real = readAdoptionAnimals();
  return real.length === 0 && placeholdersOn ? placeholderAnimals() : real;
}

function readAdoptionAnimals(): AdoptionAnimal[] {
  const dir = useFixtures ? path.join(process.cwd(), "tests", "fixtures", "adoption") : path.join(CONTENT_DIR, "adoption");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const file = `content/adoption/${f}`;
      const slug = f.replace(/\.md$/, "");
      if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`${file}: file name must use only a-z, 0-9 and "-" (it becomes the card's address)`);
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      if (data.draft === true) return null;
      const facts = Array.isArray(data.facts) ? data.facts.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];
      const blocks = content.trim().split(/\n\s*\n/).filter(Boolean);
      const md = (part: string[]) => (part.length ? marked.parse(nbspMarkdown(part.join("\n\n")), { async: false }) : "");
      return {
        slug,
        name: requireString(data, "name", file),
        species: oneOf(data, "species", ["kot", "pies"] as const, file),
        sex: oneOf(data, "sex", ["samica", "samiec", ""] as const, file, ""),
        age: optionalString(data, "age"),
        status: oneOf(data, "status", ["szuka domu", "zarezerwowany"] as const, file, "szuka domu"),
        image: requireString(data, "image", file),
        imageAlt: requireString(data, "imageAlt", file),
        facts,
        storyLead: md(blocks.slice(0, 1)),
        storyMore: md(blocks.slice(1)),
        order: typeof data.order === "number" ? data.order : 999,
      };
    })
    .filter((a): a is AdoptionAnimal => a !== null)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "pl"));
}
