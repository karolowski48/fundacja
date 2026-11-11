import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Picture } from "@/components/ui/Picture";
import { Wave } from "@/components/ui/Wave";
import { cn, nbsp } from "@/lib/typography";

type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  /** Breadcrumb label; defaults to the eyebrow */
  crumb?: string;
};

/** Plum header band for subpages - same visual language as the home hero, lighter weight. */
export function PageHero({ eyebrow, title, lead, image, imageAlt, imageCredit, crumb }: Props) {
  return (
    <section aria-labelledby="page-title" className="on-dark relative isolate overflow-hidden bg-plum-800 text-cream-50">
      <div aria-hidden="true" className="bg-paws absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_30rem_at_90%_0%,rgb(123_79_157/0.55),transparent_70%)]"
      />
      <Container className={cn("grid items-center gap-10 pb-28 pt-8 sm:pt-10 lg:pb-32", image && "lg:grid-cols-[1.15fr_1fr]")}>
        <div>
          <Breadcrumbs current={crumb ?? eyebrow} tone="dark" />
          <p className="ribbon anim-slide-in mt-8 inline-block bg-cream-200 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-plum-900 sm:text-sm">
            {eyebrow}
          </p>
          <h1
            id="page-title"
            className="anim-rise mt-5 font-display text-[clamp(2.4rem,6vw,4.25rem)] font-bold uppercase leading-[1.03] text-balance"
            style={{ ["--d" as string]: "120ms" }}
          >
            {title}
          </h1>
          <p className="anim-rise mt-6 max-w-2xl text-lg leading-relaxed text-cream-100 text-pretty sm:text-xl" style={{ ["--d" as string]: "220ms" }}>
            {nbsp(lead)}
          </p>
        </div>
        {image && (
          <figure className="anim-drop relative mx-auto w-full max-w-md rotate-2 rounded-[1.75rem] bg-cream-50 p-2.5 shadow-2xl shadow-plum-950/50 transition-transform duration-500 hover:rotate-0 lg:max-w-none" style={{ ["--r" as string]: "2deg" }}>
            <Picture
              name={image}
              alt={imageAlt ?? ""}
              sizes="(min-width: 1024px) 28rem, 90vw"
              priority
              className="aspect-[4/3] w-full rounded-[1.3rem] object-cover"
            />
            {imageCredit && (
              <figcaption className="absolute bottom-5 right-5 rounded-full bg-plum-950/80 px-3 py-1 text-xs font-semibold text-cream-50">
                {imageCredit}
              </figcaption>
            )}
          </figure>
        )}
      </Container>
      <Wave className="absolute inset-x-0 -bottom-px text-cream-50" />
    </section>
  );
}
