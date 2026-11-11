import { Heart, Percent } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Paw } from "@/components/ui/Paw";

/** Yellow donation call-to-action closing every subpage. */
export function CtaBand({ title = "Każda złotówka to konkretna pomoc", text }: { title?: string; text?: string }) {
  return (
    <section aria-labelledby="cta-title" className="py-16 sm:py-24">
      <Container>
        <div data-reveal className="group relative isolate overflow-hidden rounded-[2.25rem] bg-sun-400 px-6 py-12 text-plum-950 shadow-xl shadow-plum-900/10 sm:px-12 sm:py-14">
          <Paw className="paw-float absolute -right-6 -top-8 -z-10 size-44 rotate-12 text-sun-500" />
          <Paw className="paw-float absolute -bottom-10 left-[38%] -z-10 size-32 -rotate-12 text-sun-500 [animation-delay:-2s]" />
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 id="cta-title" className="font-display text-[clamp(1.875rem,3.6vw,2.75rem)] font-bold uppercase leading-[1.08]">
                {title}
              </h2>
              <p className="mt-3 max-w-xl text-lg">
                {text ??
                  "Sterylizacje mamy dzięki gminie. Leczenie, leki, badania, karmę i budki opłacamy z Waszych wpłat."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink href="/#pomoc-wplata" variant="plum">
                <Heart aria-hidden="true" className="size-5" />
                Wpłać darowiznę
              </ButtonLink>
              <ButtonLink href="/#pomoc-15" variant="outlinePlum" className="bg-sun-400">
                <Percent aria-hidden="true" className="size-5" />
                Przekaż 1,5%
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
