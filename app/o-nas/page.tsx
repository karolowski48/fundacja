import { Quote } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Paw } from "@/components/ui/Paw";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about, settings } from "@/lib/content";
import { contentIcon } from "@/lib/icons";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { buildDate } from "@/lib/site";
import { nbsp } from "@/lib/typography";

const path = "/o-nas/";
export const metadata = buildMetadata({ title: about.seo.title, description: about.seo.description, path });

export default function AboutPage() {
  const { hero, story, timeline, values, transparency, plans } = about;
  return (
    <>
      <PageHero {...hero} />

      {/* Founder story */}
      <section aria-labelledby="story-title" className="py-20 sm:py-28">
        <Container className="grid items-start gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-md lg:sticky lg:top-28" data-reveal>
            <div aria-hidden="true" className="absolute -inset-3 -rotate-3 rounded-[2.25rem] bg-plum-100" />
            <figure className="hover-straighten relative rotate-2 rounded-[2rem] bg-white p-3 shadow-xl shadow-plum-900/15">
              <Picture name={story.image} alt={story.imageAlt} sizes="(min-width: 1024px) 28rem, 90vw" position="45% 35%" className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
              <figcaption className="px-2 pb-1 pt-3 text-center font-display text-lg font-semibold uppercase tracking-wide text-plum-800">
                {story.quoteAuthor}
              </figcaption>
            </figure>
          </div>
          <div data-reveal>
            <SectionHeading id="story-title" eyebrow={story.eyebrow} title={story.title} />
            <div className="mt-6 space-y-4 text-lg text-plum-900">
              {story.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{nbsp(p)}</p>
              ))}
            </div>
            <figure className="mt-8 border-l-4 border-sun-400 pl-6">
              <Quote aria-hidden="true" className="size-7 text-plum-500" />
              <blockquote className="mt-2 font-display text-2xl font-medium leading-snug text-plum-800">
                <p>„{nbsp(story.quote)}”</p>
              </blockquote>
              <figcaption className="mt-3 font-bold text-plum-700">{story.quoteAuthor}</figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section aria-labelledby="timeline-title" className="bg-plum-50 py-20 sm:py-28">
        <Container>
          <SectionHeading id="timeline-title" eyebrow={timeline.eyebrow} title={timeline.title} align="center" />
          <div className="relative mx-auto mt-14 max-w-3xl">
            <div aria-hidden="true" data-draw-line className="absolute bottom-6 left-6 top-6 w-1 origin-top -translate-x-1/2 rounded-full bg-plum-300 sm:left-1/2" />
          <ol className="relative" data-reveal-stagger>
            {timeline.steps.map((step, i) => (
              <li key={step.title} className="relative grid grid-cols-[3rem_1fr] gap-5 pb-10 last:pb-0 sm:grid-cols-[1fr_3.5rem_1fr] sm:gap-6">
                <div className={i % 2 === 0 ? "hidden sm:block" : "hidden sm:block sm:order-3"} />
                <span className="relative z-10 grid size-12 place-items-center rounded-full bg-plum-600 text-white shadow-lg ring-4 ring-plum-50 sm:order-2 sm:size-14">
                  <Paw className="size-6" />
                </span>
                <div className={`group rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-plum-100 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg ${i % 2 === 0 ? "sm:order-3" : "sm:order-1 sm:text-right"}`}>
                  <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-plum-600">Krok {i + 1}</p>
                  <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-wide text-plum-800">{step.title}</h3>
                  <p className="mt-2 text-plum-900">{nbsp(step.text)}</p>
                </div>
              </li>
            ))}
          </ol>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="py-20 sm:py-28">
        <Container>
          <SectionHeading id="values-title" eyebrow={values.eyebrow} title={values.title} align="center" />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
            {values.items.map((v) => {
              const Icon = contentIcon(v.icon);
              return (
                <li key={v.title} className="group rounded-[1.75rem] bg-white p-7 shadow-sm ring-1 ring-plum-100 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-plum-900/10">
                  <span className="grid size-14 place-items-center rounded-2xl bg-plum-100 text-plum-700 transition-[transform,scale,rotate,translate,background-color,color] duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-plum-600 group-hover:text-white">
                    <Icon aria-hidden="true" className="size-7" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-wide text-plum-800">{v.title}</h3>
                  <p className="mt-2 text-plum-900">{nbsp(v.text)}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Transparency */}
      <section aria-labelledby="transparency-title" className="on-dark relative isolate overflow-hidden bg-plum-800 py-20 text-cream-50 sm:py-28">
        <div aria-hidden="true" className="bg-paws absolute inset-0 -z-10" />
        <Container className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div data-reveal>
            <SectionHeading id="transparency-title" eyebrow={transparency.eyebrow} title={transparency.title} tone="dark" />
            <div className="mt-6 space-y-4 text-lg text-cream-100">
              {transparency.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{nbsp(p)}</p>
              ))}
            </div>
            <ButtonLink href={settings.donation.zrzutkaUrl} variant="sun" external className="mt-8">
              {transparency.cta}
            </ButtonLink>
          </div>
          <figure data-reveal className="hover-straighten mx-auto w-full max-w-sm -rotate-3 rounded-[1.75rem] bg-cream-50 p-3 pb-4 shadow-2xl shadow-plum-950/40">
            <Picture name={transparency.image} alt={transparency.imageAlt} sizes="(min-width: 1024px) 24rem, 85vw" className="aspect-[3/4] w-full rounded-[1.25rem] object-cover object-top" />
            <figcaption className="mt-3 text-center font-semibold text-plum-800">Pierwsze zapiski Sylwii</figcaption>
          </figure>
        </Container>
      </section>

      {/* Plans */}
      <section aria-labelledby="plans-title" className="pt-20 sm:pt-28">
        <Container>
          <SectionHeading id="plans-title" eyebrow={plans.eyebrow} title={plans.title} />
          <ul className="mt-12 grid gap-6 md:grid-cols-3" data-reveal-stagger>
            {plans.items.map((plan) => {
              const Icon = contentIcon(plan.icon);
              return (
                <li key={plan.title} className="group relative overflow-hidden rounded-[1.75rem] bg-cream-100 p-7 ring-1 ring-cream-300 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-plum-900/10">
                  <Paw className="absolute -bottom-6 -right-6 size-28 rotate-12 text-cream-200 transition-transform duration-500 group-hover:rotate-[30deg] group-hover:scale-110" />
                  <Icon aria-hidden="true" className="relative size-9 text-plum-600" />
                  <h3 className="relative mt-4 font-display text-xl font-bold uppercase tracking-wide text-plum-800">{plan.title}</h3>
                  <p className="relative mt-2 text-plum-900">{nbsp(plan.text)}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <CtaBand />

      <JsonLd data={{ ...webPageJsonLd({ path, name: about.seo.title, description: about.seo.description, dateModified: buildDate }), "@type": "AboutPage" }} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: "O nas", path }])} />
    </>
  );
}
