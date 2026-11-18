import { Gallery } from "@/components/gallery/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { gallery, settings } from "@/lib/content";
import { toGalleryItem } from "@/lib/gallery";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const path = "/galeria/";
export const metadata = buildMetadata({ title: gallery.seo.title, description: gallery.seo.description, path });

export default function GalleryPage() {
  const items = gallery.items.map(toGalleryItem);
  return (
    <>
      <PageHero {...gallery.hero} />
      <section aria-label="Zdjęcia" className="pb-4 pt-14 sm:pt-20">
        <Container>
          <Gallery items={items} categories={gallery.categories} />
          <div className="mt-12 flex justify-center">
            <ButtonLink href={settings.social.instagram} variant="outlinePlum" external>
              <BrandIcon name="instagram" className="size-5" />
              Więcej zdjęć na Instagramie
            </ButtonLink>
          </div>
        </Container>
      </section>
      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "@id": `${absoluteUrl(path)}#gallery`,
          url: absoluteUrl(path),
          name: gallery.seo.title,
          description: gallery.seo.description,
          inLanguage: "pl-PL",
          isPartOf: { "@id": `${absoluteUrl("/")}#website` },
          associatedMedia: items.map((item) => ({
            "@type": "ImageObject",
            contentUrl: absoluteUrl(item.full),
            caption: item.caption,
            description: item.alt,
            width: item.width,
            height: item.height,
          })),
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: "Galeria", path }])} />
    </>
  );
}
