import { House } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Paw } from "@/components/ui/Paw";

export const metadata = { title: "Nie znaleziono strony", robots: { index: false } };

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="py-24 sm:py-32">
      <Container className="max-w-2xl text-center">
        <div className="flex justify-center gap-3 text-plum-300">
          <Paw className="size-8 -rotate-12" />
          <Paw className="size-8 translate-y-3 rotate-6" />
          <Paw className="size-8 -rotate-6" />
        </div>
        <h1 id="nf-title" className="mt-8 font-display text-5xl font-bold uppercase text-plum-800">
          Ta ścieżka prowadzi donikąd
        </h1>
        <p className="mt-4 text-lg text-plum-700">Strona, której szukasz, nie istnieje albo została przeniesiona.</p>
        <ButtonLink href="/" variant="plum" className="mt-8">
          <House aria-hidden="true" className="size-5" />
          Wróć na stronę główną
        </ButtonLink>
      </Container>
    </section>
  );
}
