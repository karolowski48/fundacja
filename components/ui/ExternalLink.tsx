import type { ReactNode } from "react";

/** Every link to another website opens in a new tab (owner's decision) and says so to screen readers. */
export const newTabProps = { target: "_blank", rel: "noopener" } as const;

export function NewTabNote() {
  return <span className="sr-only"> (otwiera się w nowej karcie)</span>;
}

export function ExternalLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a href={href} {...newTabProps} className={className}>
      {children}
      <NewTabNote />
    </a>
  );
}
