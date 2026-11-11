import { ArrowRight, Quote } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home, settings } from "@/lib/content";
import { nbsp } from "@/lib/typography";

export function About() {
  const { about } = home;
  return (
    <section id="o-nas" aria-labelledby="o-nas-title" className="py-20 sm:py-28">
      <Container className="grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:sticky lg:top-28 lg:order-1" data-reveal>
          <figure className="group relative overflow-hidden rounded-[2rem] shadow-xl shadow-plum-900/15">
            <Picture
              name="feeding-winter"
              alt="Sylwia w kurtce z kapturem kuca w śniegu przy budce i głaszcze dwa czarne koty jedzące z misek"
              sizes="(min-width: 1024px) 34rem, 92vw"
              className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <figcaption className="absolute right-3 top-3 rounded-full bg-plum-950/80 px-3 py-1 text-xs font-semibold text-cream-50">
              {about.photoCredit}
            </figcaption>
          </figure>
          <div className="mt-6 grid grid-cols-2 gap-4 px-1 sm:gap-6 sm:px-4">
            <figure className="hover-straighten -rotate-2 rounded-2xl bg-white p-2 pb-3 shadow-lg shadow-plum-900/15 ring-1 ring-plum-100">
              <Picture
                name="notes"
                alt="Odręczna tabela w zeszycie z imionami kotów, rysunkami i datami zabiegów"
                sizes="(min-width: 1024px) 15rem, 44vw"
                className="aspect-[4/5] w-full rounded-xl object-cover object-top"
              />
              <figcaption className="mt-2 px-1 text-center text-xs font-semibold leading-snug text-plum-800 sm:text-sm">
                {about.notesCaption}
              </figcaption>
            </figure>
            <figure className="hover-straighten mt-6 rotate-2 rounded-2xl bg-white p-2 pb-3 shadow-lg shadow-plum-900/15 ring-1 ring-plum-100">
              <Picture
                name="sylwia-dog"
                alt="Sylwia Łętocha przytula czarnego psa na łące"
                sizes="(min-width: 1024px) 15rem, 44vw"
                position="45% 40%"
                className="aspect-[4/5] w-full rounded-xl object-cover"
              />
              <figcaption className="mt-2 px-1 text-center text-xs font-semibold leading-snug text-plum-800 sm:text-sm">
                {about.founderCaption}
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="order-1 lg:order-2" data-reveal>
          <SectionHeading id="o-nas-title" eyebrow={about.eyebrow} title={about.title} />
          <div className="mt-6 space-y-4 text-lg text-plum-900">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{nbsp(p)}</p>
            ))}
          </div>

          <figure className="group mt-8 rounded-[1.75rem] bg-plum-50 p-6 ring-1 ring-plum-100 transition-shadow duration-300 hover:shadow-lg hover:shadow-plum-900/10 sm:p-7">
            <Quote aria-hidden="true" className="size-8 text-plum-500 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
            <blockquote className="mt-2 font-display text-xl font-medium leading-snug text-plum-800 sm:text-2xl">
              <p>„{nbsp(about.quote)}”</p>
            </blockquote>
            <figcaption className="mt-4 text-plum-700">
              <span className="font-bold">{about.quoteAuthor}</span>, {about.quoteRole}
            </figcaption>
          </figure>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/o-nas/" variant="plum">
              Poznaj naszą historię
              <ArrowRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonLink href={settings.social.tiktok} variant="outlinePlum" external>
              <BrandIcon name="tiktok" className="size-5" />
              Codzienność na TikToku
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
