import { about, faq, helpPage, settings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Plain-text summary for AI assistants, generated from the same content as the page.
export function GET() {
  const { donation, social } = settings;
  const lines = [
    `# ${settings.name}`,
    "",
    `> ${settings.tagline}. Fundacja ratuje, leczy, dokarmia i sterylizuje bezdomne koty oraz pomaga innym zwierzętom w potrzebie (psom, królikom, ptakom, szynszylom). Założycielka: ${settings.founder}. Marka w mediach społecznościowych: „${settings.brand}”.`,
    "",
    "## Jak pomóc",
    `- Przelew: ${donation.bankAccount}, odbiorca: ${donation.bankAccountOwner}, tytuł: „${donation.transferTitle}”`,
    `- BLIK na telefon: ${donation.blikPhone}, tytuł: „${donation.transferTitle}”`,
    `- 1,5% podatku: KRS ${donation.taxKrs} (${donation.taxUmbrellaOrg}), cel szczegółowy: ${donation.taxPurpose}`,
    `- Zbiórka online: ${donation.zrzutkaUrl}`,
    "",
    "## Kontakt",
    `- Telefon: ${settings.phone}`,
    ...(settings.email ? [`- E-mail: ${settings.email}`] : []),
    `- Facebook: ${social.facebook}`,
    `- Instagram: ${social.instagram}`,
    `- TikTok: ${social.tiktok}`,
    "",
    "## Strony",
    `- [Strona główna](${absoluteUrl("/")}): kim jesteśmy, jak pomagamy, historie zwierząt, dane do wpłat, FAQ`,
    `- [O nas](${absoluteUrl("/o-nas/")}): ${about.seo.description}`,
    `- [Jak pomagamy](${absoluteUrl("/jak-pomagamy/")}): ${helpPage.seo.description}`,
    `- [Galeria](${absoluteUrl("/galeria/")}): zdjęcia zwierząt pod opieką fundacji`,
    `- [Polityka prywatności](${absoluteUrl("/polityka-prywatnosci/")})`,
    "",
    "## Jak pomagamy",
    ...helpPage.areas.map((a) => `- ${a.title}: ${a.lead}`),
    "",
    "## Najczęstsze pytania",
    ...faq.flatMap((item) => [`### ${item.question}`, item.answer, ""]),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
