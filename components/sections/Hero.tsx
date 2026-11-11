import { Heart, House, Percent, Stethoscope, Syringe } from "lucide-react";
import { LogoImage } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Picture } from "@/components/ui/Picture";
import { Wave } from "@/components/ui/Wave";
import { home } from "@/lib/content";
import { nbsp } from "@/lib/typography";

const pillarIcons = [Stethoscope, Syringe, House];

export function Hero() {
  const { hero } = home;
  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-plum-800 text-cream-50">
      <div aria-hidden="true" data-parallax="-0.12" className="bg-paws absolute -inset-y-24 inset-x-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_85%_10%,rgb(123_79_157/0.55),transparent_70%)]"
      />

      <Container className="grid items-center gap-12 pb-28 pt-10 sm:pt-14 lg:grid-cols-[1.08fr_1fr] lg:gap-12 lg:pb-36 lg:pt-20">
        <div>
          <p className="ribbon anim-slide-in inline-block bg-cream-200 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-plum-900 sm:text-sm">
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="anim-rise mt-6 font-display text-[clamp(2.6rem,7.4vw,4.9rem)] font-bold uppercase leading-[1.02] tracking-[0.005em] text-balance"
            style={{ ["--d" as string]: "80ms" }}
          >
            {hero.titleBefore}{" "}
            <span className="relative inline-block whitespace-nowrap text-sun-400">
              {hero.titleHighlight}
              <svg
                viewBox="0 0 240 16"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
                className="anim-draw absolute -bottom-2 left-0 h-3 w-full sm:-bottom-3 sm:h-4"
                style={{ ["--d" as string]: "650ms" }}
              >
                <path d="M3 11c38-6 82-8 128-7 38 1 72 3 106-1" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="anim-rise-soft mt-9 max-w-xl text-lg leading-relaxed text-cream-100 text-pretty sm:text-xl" style={{ ["--d" as string]: "160ms" }}>
            {nbsp(hero.lead)}
          </p>

          <div className="anim-rise mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: "280ms" }}>
            <ButtonLink href="#pomoc-wplata" variant="sun">
              <Heart aria-hidden="true" className="size-5" />
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink href="#pomoc-15" variant="outlineLight">
              <Percent aria-hidden="true" className="size-5" />
              {hero.secondaryCta}
            </ButtonLink>
          </div>

          <ul className="anim-rise mt-10 flex flex-wrap gap-x-6 gap-y-3" style={{ ["--d" as string]: "400ms" }}>
            {hero.pillars.map((pillar, i) => {
              const Icon = pillarIcons[i] ?? Heart;
              return (
                <li key={pillar} className="group flex items-center gap-2.5 font-semibold text-cream-100">
                  <span className="grid size-9 place-items-center rounded-full bg-cream-50/10 ring-1 ring-cream-100/30 transition-[transform,scale,rotate,translate,background-color] duration-300 group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-cream-50/20">
                    <Icon aria-hidden="true" className="size-4.5 text-sun-400" />
                  </span>
                  {pillar}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Photo collage: tilted "polaroids" in cream frames */}
        <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none">
          <div data-parallax="0.06" className="absolute left-0 top-[2%] w-[84%]">
          <figure className="anim-drop-soft hover-straighten -rotate-2 rounded-[1.75rem] bg-cream-50 p-2 shadow-2xl shadow-plum-950/50 sm:p-2.5" style={{ ["--d" as string]: "120ms" }}>
            <Picture
              name="hero-kittens"
              alt="Sześć pręgowanych kociąt w kojcu na kolorowych kocykach patrzy prosto w obiektyw"
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 84vw"
              priority
              className="aspect-[3/2] w-full rounded-[1.3rem] object-cover"
            />
          </figure>
          </div>
          <div data-parallax="0.16" className="absolute bottom-[1%] right-0 w-[45%]">
          <figure className="anim-drop hover-straighten relative rotate-3 rounded-[1.75rem] bg-cream-50 p-2 pb-10 shadow-2xl shadow-plum-950/50 sm:p-2.5 sm:pb-12" style={{ ["--d" as string]: "320ms" }}>
            <Picture
              name="hero-adas"
              alt="Adaś - biało-czarny kociak z zabliźnionym oczkiem patrzy w górę"
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 15rem, 45vw"
              className="aspect-[4/5] w-full rounded-[1.3rem] object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-2 text-center font-display text-lg font-semibold uppercase tracking-wide text-plum-800 sm:bottom-3 sm:text-xl">
              {hero.photoCaption}
            </figcaption>
          </figure>
          </div>
          <div data-parallax="0.24" className="absolute bottom-[6%] left-[5%] w-[34%]">
            <div className="anim-pop grid aspect-square w-full -rotate-6 place-items-center rounded-full bg-cream-50 p-[8%] shadow-xl shadow-plum-950/40 ring-4 ring-sun-400 transition-transform duration-500 hover:rotate-6 hover:scale-105" style={{ ["--d" as string]: "560ms" }}>
              <LogoImage sizes="(min-width: 1024px) 12rem, 34vw" className="w-full" />
            </div>
          </div>
        </div>
      </Container>

      <Wave className="absolute inset-x-0 -bottom-px text-cream-50" />
    </section>
  );
}
