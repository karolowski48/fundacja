import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/JsonLd";
import type { Page } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo";

export function LegalPage({ page, path }: { page: Page; path: string }) {
  const updated = new Intl.DateTimeFormat("pl-PL", { dateStyle: "long" }).format(new Date(page.updated));
  return (
    <article aria-labelledby="page-title" className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Breadcrumbs current={page.title} />
        <h1 id="page-title" className="mt-6 font-display text-[clamp(2.25rem,5vw,3.25rem)] font-bold uppercase leading-[1.05] text-plum-800">
          {page.title}
        </h1>
        <p className="mt-3 text-plum-700">
          Ostatnia aktualizacja: <time dateTime={page.updated}>{updated}</time>
        </p>
        {page.draft && (
          <p className="mt-6 rounded-2xl bg-sun-400/30 p-4 font-semibold text-plum-900 ring-1 ring-sun-500">
            Wersja robocza - dokument zostanie uzupełniony o dane rejestrowe fundacji.
          </p>
        )}
        <div className="prose-content mt-8 text-lg" dangerouslySetInnerHTML={{ __html: page.html }} />
      </Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Strona główna", path: "/" },
          { name: page.title, path },
        ])}
      />
    </article>
  );
}
