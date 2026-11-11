// Content loaders. Everything the page says lives in /content (editable later in Sveltia CMS).
// JSON files are imported statically, so a missing or renamed field fails `next build` (typecheck).
// Markdown collections are validated at build time and throw on a missing required field.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import settingsJson from "@/content/settings.json";
import homeJson from "@/content/home.json";
import faqJson from "@/content/faq.json";
import aboutJson from "@/content/about.json";
import helpJson from "@/content/help.json";
import galleryJson from "@/content/gallery.json";

export const settings = settingsJson;
export const home = homeJson;
export const faq = faqJson.items;
export const about = aboutJson;
export const helpPage = helpJson;
export const gallery = galleryJson;
export type Settings = typeof settingsJson;
export type FaqItem = (typeof faqJson.items)[number];

const CONTENT_DIR = path.join(process.cwd(), "content");

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
