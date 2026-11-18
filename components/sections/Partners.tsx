/* eslint-disable @next/next/no-img-element -- partner logos are small static files (SVG/PNG) from public/partners/ */
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { SampleNote } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { partners, placeholderNotes, settings } from "@/lib/content";
import { telHref } from "@/lib/site";
import { cn, nbsp } from "@/lib/typography";

type Props = {
  id: string;
  className?: string;
  /** "page" = the logo grid of /partnerzy/ (the page hero already has the heading). */
  variant?: "section" | "page";
};

/** "Nasi partnerzy" (/partnerzy/ and /o-nas/): logos in greyscale, in colour on hover/focus; a text label until a logo file arrives. */
export function Partners({ id, className, variant = "section" }: Props) {
  const { section, items } = partners;
  if (items.length === 0) return null;
  const titleId = `${id}-title`;
  const page = variant === "page";

  return (
    <section
      id={id}
      {...(page ? { "aria-label": "Lista partnerów" } : { "aria-labelledby": titleId })}
      className={cn(page ? "py-14 sm:py-20" : "py-20 sm:py-24", className)}
    >
      <Container>
        {!page && (
          <SectionHeading
            id={titleId}
            eyebrow={section.eyebrow}
            title={section.title}
            lead={section.lead}
            align="center"
          />
        )}
        {items.some((p) => p.placeholder) && (
          <SampleNote text={placeholderNotes.partners} className={page ? "mb-8" : "mt-8"} />
        )}
        {/* two per row on phones, centred so a single partner never looks lost */}
        <ul
          className={cn("flex flex-wrap justify-center gap-4 sm:gap-6", !page && "mt-10")}
          data-reveal-stagger
        >
          {items.map((partner, i) => (
            <li key={`${partner.name}-${i}`} className="w-[calc(50%-0.5rem)] sm:w-56">
              {partner.placeholder ? (
                <p className="flex h-28 flex-col items-center justify-center gap-1 rounded-[1.5rem] border-2 border-dashed border-plum-300 bg-white/60 px-5 text-center">
                  <span className="font-display text-lg font-semibold uppercase tracking-wide text-plum-700">
                    {partner.name}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-plum-600">
                    Przykład
                  </span>
                </p>
              ) : (
                <ExternalLink
                  href={partner.url}
                  className="group flex h-28 items-center justify-center rounded-[1.5rem] bg-white px-5 shadow-sm ring-1 ring-plum-100 transition-[transform,translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-plum-900/10 hover:ring-plum-300 focus-visible:-translate-y-1"
                >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
                    />
                  ) : (
                    <span className="text-center font-display text-xl font-semibold uppercase leading-tight tracking-wide text-plum-800 transition-colors duration-300 group-hover:text-plum-600 sm:text-2xl">
                      {partner.name}
                    </span>
                  )}
                </ExternalLink>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-plum-700">
          {nbsp(section.join)}{" "}
          <a
            href={telHref(settings.phone)}
            className="inline-flex items-center gap-1.5 font-bold text-plum-600 underline underline-offset-4 hover:text-plum-800"
          >
            <Phone aria-hidden="true" className="size-4" />
            {settings.phone}
          </a>
        </p>
      </Container>
    </section>
  );
}
