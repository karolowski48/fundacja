import { Check } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { helpPage } from "@/lib/content";
import { contentIcon } from "@/lib/icons";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl, buildDate } from "@/lib/site";
import { cn, nbsp } from "@/lib/typography";

const path = "/jak-pomagamy/";
export const metadata = buildMetadata({ title: helpPage.seo.title, description: helpPage.seo.description, path });

export default function HelpPage() {
  const { hero, areas, process, costs } = helpPage;
  return (
    <>
      <PageHero {...hero} />

      {/* Jump links */}
      <nav aria-label="Na tej stronie" className="relative z-10 -mt-10">
        <Container>
          <ul className="flex flex-wrap justify-center gap-2 rounded-[1.75rem] bg-white p-3 shadow-xl shadow-plum-900/10 ring-1 ring-plum-100">
            {areas.map((area) => {
              const Icon = contentIcon(area.icon);
              return (
                <li key={area.id}>
                  <a
                    href={`#${area.id}`}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold text-plum-800 transition-colors hover:bg-plum-600 hover:text-white"
                  >
                    <Icon aria-hidden="true" className="size-4 text-plum-600 transition-colors group-hover:text-sun-400" />
                    {area.short}
                  </a>
                </li>
              );
            })}
          </ul>
        </Container>
      </nav>

      {/* Areas - alternating rows */}
      <div className="py-16 sm:py-24">
        <Container className="space-y-20 sm:space-y-28">
          {areas.map((area, i) => {
            const Icon = contentIcon(area.icon);
            const flip = i % 2 === 1;
            return (
              <section key={area.id} id={area.id} aria-labelledby={`${area.id}-title`} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div data-reveal className={cn("relative", flip && "lg:order-2")}>
                  <div aria-hidden="true" className={cn("absolute -inset-3 rounded-[2.25rem] bg-plum-100", flip ? "rotate-2" : "-rotate-2")} />
                  <figure className="group relative overflow-hidden rounded-[2rem] shadow-xl shadow-plum-900/15">
                    <Picture
                      name={area.image}
                      alt={area.imageAlt}
                      sizes="(min-width: 1024px) 34rem, 92vw"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </figure>
                  <span className={cn("absolute -bottom-6 grid size-16 place-items-center rounded-2xl bg-sun-400 text-plum-950 shadow-lg ring-4 ring-cream-50", flip ? "-left-2 sm:-left-5" : "-right-2 sm:-right-5")}>
                    <Icon aria-hidden="true" className="size-8" />
                  </span>
                </div>
                <div data-reveal className={cn(flip && "lg:order-1")}>
                  <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-plum-600">
                    {String(i + 1).padStart(2, "0")} / {String(areas.length).padStart(2, "0")}
                  </p>
                  <h2 id={`${area.id}-title`} className="mt-2 font-display text-[clamp(1.875rem,3.4vw,2.6rem)] font-bold leading-[1.1] text-plum-800">
                    {area.title}
                  </h2>
                  <p className="mt-4 text-lg text-plum-900">{nbsp(area.lead)}</p>
                  <ul className="mt-6 space-y-3">
                    {area.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-plum-600 text-white">
                          <Check aria-hidden="true" className="size-4" />
                        </span>
                        <span className="text-plum-900">{nbsp(point)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </Container>
      </div>

      {/* Process */}
      <section aria-labelledby="process-title" className="on-dark relative isolate overflow-hidden bg-plum-800 py-20 text-cream-50 sm:py-28">
        <div aria-hidden="true" className="bg-paws absolute inset-0 -z-10" />
        <Container>
          <SectionHeading id="process-title" eyebrow={process.eyebrow} title={process.title} align="center" tone="dark" />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
            {process.steps.map((step, i) => (
              <li key={step.title} className="group relative rounded-[1.75rem] bg-plum-900 p-7 ring-1 ring-cream-100/15 transition-[transform,scale,rotate,translate,background-color] duration-300 hover:-translate-y-1.5 hover:bg-plum-950">
                <span className="font-display text-6xl font-bold text-sun-400 transition-transform duration-300 group-hover:scale-110 inline-block" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide">
                  <span className="sr-only">Krok {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-cream-100">{nbsp(step.text)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Costs */}
      <section aria-labelledby="costs-title" className="pt-20 sm:pt-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <SectionHeading id="costs-title" eyebrow={costs.eyebrow} title={costs.title} lead={costs.lead} />
          <ul className="grid gap-4 sm:grid-cols-2" data-reveal-stagger>
            {costs.items.map((item) => {
              const Icon = contentIcon(item.icon);
              return (
                <li key={item.label} className="group flex items-center gap-4 rounded-[1.5rem] bg-white p-4 ring-1 ring-plum-100 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-plum-900/10">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-plum-100 text-plum-700 transition-[transform,scale,rotate,translate,background-color,color] duration-300 group-hover:rotate-6 group-hover:bg-sun-400 group-hover:text-plum-950">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <span className="font-bold text-plum-800">{item.label}</span>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <CtaBand />

      <JsonLd
        data={{
          ...webPageJsonLd({ path, name: helpPage.seo.title, description: helpPage.seo.description, dateModified: buildDate }),
          mainEntity: {
            "@type": "HowTo",
            name: process.title,
            step: process.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text, url: absoluteUrl(`${path}#process-title`) })),
          },
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: "Jak pomagamy", path }])} />
    </>
  );
}
