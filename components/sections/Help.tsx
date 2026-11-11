import { ArrowRight, HeartHandshake, House, Rabbit, Stethoscope, Syringe, Utensils, type LucideIcon } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MobileSlider } from "@/components/ui/MobileSlider";
import { Container } from "@/components/ui/Container";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/lib/content";
import { nbsp } from "@/lib/typography";

const icons: Record<string, LucideIcon> = {
  utensils: Utensils,
  stethoscope: Stethoscope,
  syringe: Syringe,
  house: House,
  "heart-handshake": HeartHandshake,
  rabbit: Rabbit,
};

export function Help() {
  const { help } = home;
  return (
    <section id="jak-pomagamy" aria-labelledby="jak-pomagamy-title" className="relative bg-plum-50 py-20 sm:py-28">
      <Container>
        <SectionHeading id="jak-pomagamy-title" eyebrow={help.eyebrow} title={help.title} lead={help.lead} align="center" />

        <MobileSlider id="help-cards" label="Obszary pomocy" className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {help.items.map((item) => {
            const Icon = icons[item.icon] ?? HeartHandshake;
            return (
              <li
                key={item.title}
                className="group relative flex flex-col rounded-[1.75rem] bg-white shadow-sm ring-1 ring-plum-100 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-plum-900/10 has-[a:focus-visible]:-translate-y-1.5"
              >
                <div className="relative">
                  <div className="overflow-hidden rounded-t-[1.75rem]">
                    <Picture
                      name={item.image}
                      alt={item.imageAlt}
                      sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 84vw"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:aspect-[4/3]"
                    />
                  </div>
                  <span className="absolute -bottom-6 left-6 grid size-12 place-items-center rounded-2xl bg-plum-600 text-white shadow-lg ring-4 ring-white transition-[transform,scale,rotate,translate,background-color,color] duration-300 group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-sun-400 group-hover:text-plum-950">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-9">
                  <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-plum-800">
                    {/* stretched link: the whole card is clickable, the accessible name stays the title */}
                    <Link href={`/jak-pomagamy/#${item.id}`} className="rounded-[1.75rem] after:absolute after:inset-0 after:rounded-[1.75rem] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-3 focus-visible:after:outline-[color:var(--focus-ring)]">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-plum-900">{nbsp(item.text)}</p>
                  <span aria-hidden="true" className="mt-4 inline-flex items-center gap-1.5 font-bold text-plum-600 transition-[gap] duration-300 group-hover:gap-3">
                    Więcej <ArrowRight className="size-4" />
                  </span>
                </div>
              </li>
            );
          })}
        </MobileSlider>

        <div className="mt-10 flex justify-center">
          <ButtonLink href="/jak-pomagamy/" variant="plum">
            Zobacz, jak pomagamy
            <ArrowRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </ButtonLink>
        </div>

        <div className="mt-20 text-center">
          <h3 data-reveal className="font-display text-2xl font-bold text-plum-800 sm:text-3xl">{help.speciesTitle}</h3>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-8 sm:gap-x-10" data-reveal-stagger>
            {help.species.map((s) => (
              <li key={s.label} className="group flex w-28 flex-col items-center gap-3 sm:w-36">
                <Picture
                  name={s.image}
                  alt={s.alt}
                  sizes="(min-width: 640px) 9rem, 7rem"
                  position={"position" in s ? s.position : undefined}
                  className="aspect-square w-full rounded-full object-cover shadow-md shadow-plum-900/15 ring-4 ring-white transition-[transform,scale,rotate,translate,box-shadow] duration-300 group-hover:-translate-y-1.5 group-hover:-rotate-3 group-hover:ring-sun-400 group-hover:shadow-xl"
                />
                <span className="font-display text-lg font-semibold uppercase tracking-wide text-plum-800 transition-colors group-hover:text-plum-600">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
