import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Partners } from "@/components/sections/Partners";
import { partners } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { buildDate } from "@/lib/site";

const path = "/partnerzy/";
export const metadata = buildMetadata({ title: partners.seo.title, description: partners.seo.description, path });

export default function PartnersPage() {
  return (
    <>
      <PageHero {...partners.hero} />
      <Partners id="partnerzy" variant="page" />
      <CtaBand />
      <JsonLd data={webPageJsonLd({ path, name: partners.seo.title, description: partners.seo.description, dateModified: buildDate })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: partners.hero.title, path }])} />
    </>
  );
}
