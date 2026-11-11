import { Phone, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq, home, settings } from "@/lib/content";
import { telHref } from "@/lib/site";
import { nbsp } from "@/lib/typography";

export function Faq() {
  const { faq: copy } = home;
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="faq-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
          <ButtonLink href={telHref(settings.phone)} variant="plum" className="mt-8">
            <Phone aria-hidden="true" className="ring-on-hover size-5" />
            Zadzwoń: {settings.phone}
          </ButtonLink>
        </div>

        <div className="space-y-3" data-reveal-stagger>
          {faq.map((item) => (
            <details key={item.question} name="faq" className="faq group rounded-2xl bg-white ring-1 ring-plum-100 transition-[box-shadow,transform,scale,rotate,translate] duration-300 hover:shadow-md hover:shadow-plum-900/10 open:shadow-lg open:shadow-plum-900/10 open:ring-plum-300">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left text-lg font-bold text-plum-800 hover:text-plum-600 [&::-webkit-details-marker]:hidden">
                <span>{nbsp(item.question)}</span>
                <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-plum-100 text-plum-700 transition-[transform,scale,rotate,translate,background-color,color] duration-300 group-hover:bg-sun-400 group-hover:text-plum-950 group-open:rotate-45 group-open:bg-plum-600 group-open:text-white">
                  <Plus className="size-4" />
                </span>
              </summary>
              <div className="faq-answer px-5 pb-5 text-plum-900">
                <p>{nbsp(item.answer)}</p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
