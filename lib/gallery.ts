import type { GalleryItem } from "@/components/gallery/Gallery";
import { getImage, imageUrl } from "@/lib/images";

export type GalleryEntry = { image: string; alt: string; caption: string; category?: string; featured?: boolean };

/** Builds a lightbox item from a content entry: a manifest name (responsive WebP) or a raw CMS upload path. */
export function toGalleryItem(entry: GalleryEntry, i: number): GalleryItem {
  const base = {
    key: `${entry.image}-${i}`,
    alt: entry.alt,
    caption: entry.caption,
    category: entry.category ?? "",
    featured: entry.featured === true,
  };
  if (entry.image.startsWith("/")) {
    // uploads are not in the manifest: no srcset, nominal size (tiles are square crops anyway)
    return { ...base, src: entry.image, full: entry.image, width: 1200, height: 900, blur: "" };
  }
  const img = getImage(entry.image);
  const largest = img.widths[img.widths.length - 1]!;
  const thumb = img.widths.find((w) => w >= 480) ?? largest;
  return {
    ...base,
    src: imageUrl(entry.image, thumb),
    srcSet: img.widths.map((w) => `${imageUrl(entry.image, w)} ${w}w`).join(", "),
    full: imageUrl(entry.image, largest),
    width: img.width,
    height: img.height,
    blur: img.blur,
  };
}
