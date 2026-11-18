/* eslint-disable @next/next/no-img-element -- static export has no image optimizer; we ship our own
   pre-generated WebP srcset (scripts/optimize-images.mjs), which next/image cannot express here. */
import type { CSSProperties } from "react";
import { Cat, Dog, PawPrint, UserRound, type LucideIcon } from "lucide-react";
import { getImage, imageUrl } from "@/lib/images";
import { cn } from "@/lib/typography";

/** "placeholder:person|cat|dog" - drawn stand-in for a photo that has not arrived yet (content/placeholders.json). */
const placeholderIcons: Record<string, LucideIcon> = { person: UserRound, cat: Cat, dog: Dog };

type Props = {
  /** Name from public/images/manifest.json, an absolute path for raw CMS uploads ("/images/uploads/x.jpg")
   *  or "placeholder:person" / "placeholder:cat" / "placeholder:dog" for a drawn stand-in. */
  name: string;
  alt: string;
  /** Rendered width hint for srcset selection, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes: string;
  priority?: boolean;
  className?: string;
  position?: string;
};

export function Picture({ name, alt, sizes, priority = false, className, position }: Props) {
  if (name.startsWith("placeholder:")) {
    const Icon = placeholderIcons[name.slice("placeholder:".length)] ?? PawPrint;
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("relative grid place-items-center bg-[linear-gradient(135deg,var(--color-plum-100),var(--color-cream-100))]", className)}
      >
        <PawPrint aria-hidden="true" className="absolute bottom-[14%] right-[14%] w-[12%] -rotate-12 text-plum-300/60" />
        <PawPrint aria-hidden="true" className="absolute left-[12%] top-[26%] w-[9%] rotate-12 text-plum-300/50" />
        <Icon aria-hidden="true" strokeWidth={1.25} className="h-auto w-[34%] text-plum-600/55" />
      </div>
    );
  }
  if (name.startsWith("/")) {
    return <img src={name} alt={alt} loading="lazy" decoding="async" className={className} style={{ objectPosition: position }} />;
  }

  const img = getImage(name);
  const srcSet = img.widths.map((w) => `${imageUrl(name, w)} ${w}w`).join(", ");
  const fallback = imageUrl(name, img.widths.find((w) => w >= 768) ?? img.widths[img.widths.length - 1]!);

  // No ReactDOM.preload() here: Next prefetches linked pages' RSC payloads and would replay their
  // preload hints, downloading other pages' hero images. The <img> is in the initial HTML and
  // fetchPriority="high" is enough for the LCP image.
  const style: CSSProperties = {
    backgroundImage: `url(${img.blur})`,
    backgroundSize: "cover",
    backgroundPosition: position ?? "center",
    objectPosition: position,
  };

  return (
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={img.width}
      height={img.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding={priority ? "sync" : "async"}
      className={className}
      style={style}
    />
  );
}
