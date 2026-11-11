import { ArrowRight, Images } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StoriesList } from "@/components/sections/StoriesList";
import { home, settings, type Story } from "@/lib/content";
import { nbsp } from "@/lib/typography";

const photoSizes = "(min-width: 1024px) 11rem, (min-width: 640px) 22vw, 46vw";

function StoryCard({ story, extra }: { story: Story; extra: boolean }) {
  const titleId = `story-${story.slug}`;
  return (
    <li data-extra={extra || undefined}>
      <article
        aria-labelledby={titleId}
        tabIndex={-1}
        className="group h-full rounded-[1.75rem] bg-white p-3 shadow-sm ring-1 ring-plum-100 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-plum-900/10"
      >
        <div className="relative grid grid-cols-2 gap-2">
          <figure className="relative">
            <Picture
              name={story.imageBefore}
              alt={story.altBefore}
              sizes={photoSizes}
              className="aspect-square w-full rounded-[1.25rem] object-cover grayscale-[35%] transition-[rotate,filter] duration-500 group-hover:-rotate-3 group-hover:grayscale-0"
            />
            <figcaption className="absolute left-2 top-2 rounded-full bg-plum-800 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider text-cream-50">
              Kiedyś
            </figcaption>
          </figure>
          <figure className="relative">
            <Picture
              name={story.imageAfter}
              alt={story.altAfter}
              sizes={photoSizes}
              className="aspect-square w-full rounded-[1.25rem] object-cover transition-[rotate,scale] duration-500 group-hover:rotate-3 group-hover:scale-105"
            />
            <figcaption className="absolute left-2 top-2 rounded-full bg-sun-400 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider text-plum-950">
              Teraz
            </figcaption>
          </figure>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-10 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-plum-700 shadow-md ring-4 ring-white transition-[background-color,color,scale] duration-300 group-hover:scale-125 group-hover:bg-sun-400 group-hover:text-plum-950"
          >
            <ArrowRight className="size-5" />
          </span>
        </div>
        <div className="px-3 pb-3 pt-4">
          <h3 id={titleId} className="font-display text-2xl font-semibold uppercase tracking-wide text-plum-800">
            {story.name}
          </h3>
          <p className="mt-1 text-plum-900">
            <span className="font-bold text-plum-700">Kiedyś: </span>
            {nbsp(story.before)}
          </p>
          {story.now && (
            <p className="mt-1 text-plum-900">
              <span className="font-bold text-plum-700">Teraz: </span>
              {nbsp(story.now)}
            </p>
          )}
        </div>
      </article>
    </li>
  );
}

export function Stories({ stories }: { stories: Story[] }) {
  const { stories: copy } = home;
  return (
    <section id="historie" aria-labelledby="historie-title" className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="historie-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
          <div className="flex flex-wrap gap-3 self-start lg:self-auto">
            <ButtonLink href="/galeria/" variant="plum">
              <Images aria-hidden="true" className="size-5" />
              Galeria
            </ButtonLink>
            <ButtonLink href={settings.social.instagram} variant="outlinePlum" external>
              <BrandIcon name="instagram" className="size-5" />
              Więcej na Instagramie
            </ButtonLink>
          </div>
        </div>
        <StoriesList total={stories.length} initial={copy.initialCount}>
          {stories.map((story, i) => (
            <StoryCard key={story.slug} story={story} extra={i >= copy.initialCount} />
          ))}
        </StoriesList>
      </Container>
    </section>
  );
}
