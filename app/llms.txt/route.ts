import { about, adoptionPage, faq, getAdoptionAnimals, getStatute, helpPage, partners, settings, team } from "@/lib/content";
import { absoluteUrl, linksPagePath } from "@/lib/site";

export const dynamic = "force-static";

// Plain-text summary for AI assistants, generated from the same content as the page.
export function GET() {
  const { donation, social } = settings;
  const animals = getAdoptionAnimals();
  const statute = getStatute();
  const lines = [
    `# ${settings.name}`,
    "",
    `> ${settings.tagline}. Fundacja ratuje, leczy, dokarmia i sterylizuje bezdomne koty oraz pomaga innym zwierzętom w potrzebie (psom, ptakom, gryzoniom i królikom). Założycielka: ${settings.founder}. Marka w mediach społecznościowych: „${settings.brand}”.`,
    "",
    "## Jak pomóc",
    `- Przelew: ${donation.bankAccount}, odbiorca: ${donation.bankAccountOwner}, tytuł: „${donation.transferTitle}”`,
    `- BLIK na telefon: ${donation.blikPhone}, tytuł: „${donation.transferTitle}”`,
    `- 1,5% podatku: KRS ${donation.taxKrs} (${donation.taxUmbrellaOrg}), cel szczegółowy: ${donation.taxPurpose}`,
    `- Zbiórka online: ${donation.zrzutkaUrl}`,
    "",
    "## Kontakt",
    `- Telefon: ${settings.phone}${settings.phoneNote ? ` (${settings.phoneNote})` : ""}`,
    ...(settings.email ? [`- E-mail: ${settings.email}`] : []),
    `- Facebook: ${social.facebook}`,
    `- Instagram: ${social.instagram}`,
    `- TikTok: ${social.tiktok}`,
    "",
    "## Strony",
    `- [Strona główna](${absoluteUrl("/")}): kim jesteśmy, jak pomagamy, historie zwierząt, dane do wpłat, FAQ`,
    `- [O nas](${absoluteUrl("/o-nas/")}): ${about.seo.description}`,
    `- [Jak pomagamy](${absoluteUrl("/jak-pomagamy/")}): ${helpPage.seo.description}`,
    `- [Zwierzęta do adopcji](${absoluteUrl("/do-adopcji/")}): ${adoptionPage.seo.description}`,
    `- [Nasza Empatyczna Ekipa](${absoluteUrl("/nasza-ekipa/")}): ${team.seo.description}`,
    `- [Galeria](${absoluteUrl("/galeria/")}): zdjęcia zwierząt pod opieką fundacji`,
    `- [Nasi partnerzy](${absoluteUrl("/partnerzy/")}): ${partners.seo.description}`,
    `- [Wszystkie linki](${absoluteUrl(linksPagePath)}): Facebook, Instagram, zrzutka, wolontariat, dane do wpłat`,
    ...(statute ? [`- [${statute.label}](${absoluteUrl(statute.href)})`] : []),
    `- [Polityka prywatności](${absoluteUrl("/polityka-prywatnosci/")})`,
    "",
    ...(animals.length > 0
      ? ["## Zwierzęta do adopcji", ...animals.map((a) => `- ${a.name} (${a.species}${a.age ? `, ${a.age}` : ""}): ${a.status} - ${absoluteUrl(`/do-adopcji/#${a.slug}`)}`), ""]
      : []),
    "## Jak pomagamy",
    ...helpPage.areas.map((a) => `- ${a.title}: ${a.lead}`),
    "",
    "## Najczęstsze pytania",
    ...faq.flatMap((item) => [`### ${item.question}`, item.answer, ""]),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
