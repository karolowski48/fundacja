import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Internal link without background prefetch. React 19 embeds preload hints for eager images in
 * each page's RSC payload, so prefetching every nav target would download other pages' hero
 * images on every visit. Pages are static and small, so on-click loading is instant enough.
 */
export function AppLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch={false} {...props} />;
}
