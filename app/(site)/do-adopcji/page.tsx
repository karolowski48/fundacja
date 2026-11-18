import { Check, ChevronDown, HeartHandshake, Phone, Search } from "lucide-react";
import { AdoptionBoard } from "@/components/adoption/AdoptionBoard";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink, buttonBase } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Paw } from "@/components/ui/Paw";
import { SampleBadge, SampleNote } from "@/components/ui/Placeholder";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  adoptionPage,
  getAdoptionAnimals,
  settings,
  type AdoptionAnimal,
  placeholderNotes,
} from "@/lib/content";
import { getImage, imageUrl } from "@/lib/images";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl, buildDate, telHref } from "@/lib/site";
import { cn, nbsp } from "@/lib/typography";

const path = "/do-adopcji/";
export const metadata = buildMetadata({
  title: adoptionPage.seo.title,
  description: adoptionPage.seo.description,
  path,
});

const sexLabels = {
  kot: { samica: "Kotka", samiec: "Kocur" },
  pies: { samica: "Suczka", samiec: "Pies" },
} as const;
const speciesLabels = { kot: "Kot", pies: "Pies" } as const;

/** "Kotka · ok. 2 lata" */
function describe(a: AdoptionAnimal) {
  return [a.sex ? sexLabels[a.species][a.sex] : speciesLabels[a.species], a.age]
    .filter(Boolean)
    .join(" · ");
}

function statusLabel(a: AdoptionAnimal) {
  if (a.status === "szuka domu") return "Szuka domu";
  return a.sex === "samica" ? "Zarezerwowana" : "Zarezerwowany";
}

const socialButton =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-bold text-plum-800 ring-1 ring-plum-100 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-plum-600";

function ContactButtons({ name, className }: { name?: string; className?: string }) {
  const about = name ? ` o ${name}` : "";
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      <li>
        <a
          href={telHref(settings.phone)}
          className={cn(buttonBase, "min-h-11 bg-sun-400 px-5 py-2 text-plum-950 hover:bg-sun-500")}
        >
          <Phone aria-hidden="true" className="size-4" />
          <span>
            Zadzwoń<span className="sr-only">{about}</span>: {settings.phone}
          </span>
        </a>
      </li>
      <li>
        <ExternalLink href={settings.social.facebook} className={socialButton}>
          <BrandIcon name="facebook" className="size-4" />
          Facebook<span className="sr-only"> - napisz{about}</span>
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href={settings.social.instagram} className={socialButton}>
          <BrandIcon name="instagram" className="size-4" />
          Instagram<span className="sr-only"> - napisz{about}</span>
        </ExternalLink>
      </li>
    </ul>
  );
}

function AnimalCard({ animal }: { animal: AdoptionAnimal }) {
  const { list, contact } = adoptionPage;
  const titleId = `${animal.slug}-imie`;
  const reserved = animal.status === "zarezerwowany";
  return (
    // id = file name, so a single card can be shared as /do-adopcji/#imie
    <li id={animal.slug} data-species={animal.species}>
      <article
        aria-labelledby={titleId}
        className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-plum-100 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-plum-900/10"
      >
        <div className="relative overflow-hidden">
          {animal.placeholder && <SampleBadge className="absolute right-3 top-3 z-10" />}
          <Picture
            name={animal.image}
            alt={animal.imageAlt}
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <p
            className={cn(
              "absolute left-3 top-3 rounded-full px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider shadow-md",
              reserved ? "bg-plum-800 text-cream-50" : "bg-sun-400 text-plum-950",
            )}
          >
            {statusLabel(animal)}
          </p>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3
            id={titleId}
            className="font-display text-3xl font-semibold uppercase tracking-wide text-plum-800"
          >
            {animal.name}
          </h3>
          <p className="mt-1 font-semibold text-plum-700">{describe(animal)}</p>

          {animal.facts.length > 0 && (
            <ul
              className="mt-4 space-y-1.5"
              aria-label={`Najważniejsze informacje: ${animal.name}`}
            >
              {animal.facts.map((fact) => (
                <li key={fact} className="flex gap-2.5 text-plum-900">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-plum-600" />
                  <span>{nbsp(fact)}</span>
                </li>
              ))}
            </ul>
          )}

          {animal.storyLead && (
            <div
              className="prose-content prose-card mt-4 text-plum-900"
              dangerouslySetInnerHTML={{ __html: animal.storyLead }}
            />
          )}
          {animal.storyMore && (
            <details className="card-details group/story mt-2">
              <summary className="inline-flex min-h-11 items-center gap-1.5 rounded-full font-bold text-plum-600 underline-offset-4 hover:underline">
                {list.storyMore}
                <span className="sr-only">: {animal.name}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-open/story:rotate-180"
                />
              </summary>
              <div
                className="card-details-body prose-content prose-card text-plum-900"
                dangerouslySetInnerHTML={{ __html: animal.storyMore }}
              />
            </details>
          )}

          <details className="card-details group/adopt mt-auto pt-6">
            <summary
              className={cn(
                buttonBase,
                "w-full bg-plum-600 text-white hover:bg-plum-700 group-open/adopt:bg-plum-800",
              )}
            >
              <HeartHandshake aria-hidden="true" className="size-5" />
              {list.adoptCta}
              <span className="sr-only">: {animal.name}</span>
              <ChevronDown
                aria-hidden="true"
                className="size-5 transition-transform duration-300 group-open/adopt:rotate-180"
              />
            </summary>
            <div className="card-details-body mt-3 rounded-[1.25rem] bg-plum-50 p-4 ring-1 ring-plum-100">
              <p className="mb-3 text-plum-900">{nbsp(contact.text)}</p>
              <ContactButtons name={animal.name} />
            </div>
          </details>
        </div>
      </article>
    </li>
  );
}

function itemListJsonLd(animals: AdoptionAnimal[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: adoptionPage.hero.title,
    url: absoluteUrl(path),
    numberOfItems: animals.length,
    itemListElement: animals.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${absoluteUrl(path)}#${a.slug}`,
      name: `${a.name} - ${describe(a)}`,
      ...(!a.image.startsWith("/") && {
        image: absoluteUrl(imageUrl(a.image, getImage(a.image).widths.at(-1)!)),
      }),
    })),
  };
}

export default function AdoptionPage() {
  const animals = getAdoptionAnimals();
  const { hero, list, empty, contact } = adoptionPage;
  const counts = {
    kot: animals.filter((a) => a.species === "kot").length,
    pies: animals.filter((a) => a.species === "pies").length,
  };

  return (
    <>
      <PageHero {...hero} />

      <section aria-labelledby="adoption-title" className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            id="adoption-title"
            eyebrow={list.eyebrow}
            title={list.title}
            align="center"
            className="mb-10"
          />
          {animals.some((a) => a.placeholder) && (
            <SampleNote text={placeholderNotes.adoption} className="-mt-2 mb-8" />
          )}
          {animals.length > 0 ? (
            <AdoptionBoard counts={counts}>
              {animals.map((animal) => (
                <AnimalCard key={animal.slug} animal={animal} />
              ))}
            </AdoptionBoard>
          ) : (
            <div
              data-reveal
              data-empty-state
              className="relative isolate mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-white px-6 py-12 text-center shadow-sm ring-1 ring-plum-100 sm:px-12"
            >
              <Paw className="absolute -left-6 -top-6 -z-10 size-28 -rotate-12 text-plum-100" />
              <Paw className="absolute -bottom-8 -right-4 -z-10 size-32 rotate-12 text-cream-200" />
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-plum-600 text-white shadow-lg ring-4 ring-plum-100">
                <Search aria-hidden="true" className="size-8" />
              </span>
              <h3 className="mt-6 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold uppercase leading-tight tracking-wide text-plum-800">
                {nbsp(empty.title)}
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-lg text-plum-700">{nbsp(empty.text)}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href={settings.social.facebook} variant="plum" external>
                  <BrandIcon name="facebook" className="size-5" />
                  Facebook
                </ButtonLink>
                <ButtonLink href={settings.social.instagram} variant="outlinePlum" external>
                  <BrandIcon name="instagram" className="size-5" />
                  Instagram
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </section>

      <section
        id="jak-adoptowac"
        aria-labelledby="adopt-contact-title"
        className="bg-cream-100 py-16 sm:py-20"
      >
        <Container className="flex flex-col items-center text-center">
          <SectionHeading
            id="adopt-contact-title"
            eyebrow={contact.eyebrow}
            title={contact.title}
            lead={contact.text}
            align="center"
          />
          <div data-reveal className="mt-8">
            <ContactButtons className="justify-center gap-3" />
          </div>
        </Container>
      </section>

      <CtaBand />

      <JsonLd
        data={{
          ...webPageJsonLd({
            path,
            name: adoptionPage.seo.title,
            description: adoptionPage.seo.description,
            dateModified: buildDate,
          }),
          "@type": "CollectionPage",
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Strona główna", path: "/" },
          { name: hero.title, path },
        ])}
      />
      {/* structured data only for real animals - never for sample cards */}
      {animals.some((a) => !a.placeholder) && (
        <JsonLd data={itemListJsonLd(animals.filter((a) => !a.placeholder))} />
      )}
    </>
  );
}
