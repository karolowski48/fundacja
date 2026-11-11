import manifest from "@/public/images/manifest.json";

export type ImageEntry = { width: number; height: number; widths: number[]; blur: string };

const images: Record<string, ImageEntry> = manifest;

/** Looks up a generated image; an unknown name fails the build instead of shipping a broken picture. */
export function getImage(name: string): ImageEntry {
  const entry = images[name];
  if (!entry) {
    throw new Error(`Unknown image "${name}". Add it to scripts/optimize-images.mjs and run \`npm run images\`.`);
  }
  return entry;
}

export const imageUrl = (name: string, width: number) => `/images/${name}-${width}.webp`;
