/* eslint-disable @next/next/no-img-element -- pre-generated WebP logo with its own srcset */
import { cn } from "@/lib/typography";

/** Logo illustration only. Decorative by default - the surrounding link or text names the foundation. */
export function LogoImage({
  className,
  sizes,
  alt = "",
  eager = false,
}: {
  className?: string;
  sizes: string;
  alt?: string;
  eager?: boolean;
}) {
  return (
    <img
      src="/brand/logo-320.webp"
      srcSet="/brand/logo-160.webp 160w, /brand/logo-320.webp 320w, /brand/logo-640.webp 640w"
      sizes={sizes}
      width={1161}
      height={826}
      alt={alt}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      className={cn("h-auto", className)}
    />
  );
}
