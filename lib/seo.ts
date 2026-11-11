import type { Metadata } from "next";
import { settings, type FaqItem } from "@/lib/content";
import { absoluteUrl, siteUrl, toE164 } from "@/lib/site";

type PageMeta = { title?: string; description?: string; path: string };

export function buildMetadata({ title, description, path }: PageMeta): Metadata {
  const desc = description ?? settings.seo.defaultDescription;
  return {
    title: title ?? { absolute: settings.seo.defaultTitle },
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: path,
      siteName: settings.name,
      title: title ?? settings.seo.defaultTitle,
      description: desc,
    },
    twitter: { card: "summary_large_image", title: title ?? settings.seo.defaultTitle, description: desc },
  };
}

const orgId = `${siteUrl}/#organization`;

/** Organization + WebSite graph - rendered on every page. */
export function organizationJsonLd() {
  const { address, social, donation } = settings;
  const hasAddress = Boolean(address.city);
  const identifiers = [
    settings.krs && { "@type": "PropertyValue", propertyID: "KRS", value: settings.krs },
    settings.nip && { "@type": "PropertyValue", propertyID: "NIP", value: settings.nip },
    settings.regon && { "@type": "PropertyValue", propertyID: "REGON", value: settings.regon },
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "NGO"],
        "@id": orgId,
        name: settings.name,
        alternateName: [settings.brand, settings.shortName],
        url: absoluteUrl("/"),
        logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.png"), width: 600, height: 427 },
        image: absoluteUrl("/opengraph-image.jpg"),
        slogan: settings.tagline,
        description:
          "Fundacja Empatia na rzecz Zwierząt ratuje, leczy, dokarmia i sterylizuje bezdomne koty oraz pomaga innym zwierzętom w potrzebie.",
        founder: { "@type": "Person", name: settings.founder },
        telephone: toE164(settings.phone),
        ...(settings.email && { email: settings.email }),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: toE164(settings.phone),
          contactType: "general inquiries",
          availableLanguage: ["pl"],
        },
        ...(hasAddress && {
          address: {
            "@type": "PostalAddress",
            streetAddress: address.street,
            postalCode: address.postalCode,
            addressLocality: address.city,
            addressRegion: address.region,
            addressCountry: "PL",
          },
        }),
        ...(identifiers.length > 0 && { identifier: identifiers }),
        knowsAbout: ["pomoc bezdomnym kotom", "sterylizacja i kastracja kotów", "leczenie kotów wolno żyjących", "adopcja kotów"],
        sameAs: [social.facebook, social.instagram, social.tiktok, donation.zrzutkaUrl],
        potentialAction: { "@type": "DonateAction", target: donation.zrzutkaUrl, recipient: { "@id": orgId } },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: absoluteUrl("/"),
        name: settings.name,
        inLanguage: "pl-PL",
        publisher: { "@id": orgId },
      },
    ],
  };
}

export function webPageJsonLd({ path, name, description, dateModified }: { path: string; name: string; description: string; dateModified: Date }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "pl-PL",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": orgId },
    dateModified: dateModified.toISOString(),
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
