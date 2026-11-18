import { createElement } from "react";
import { ArrowRight, ExternalLink as ExternalIcon, HandHeart, Phone } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { LogoImage } from "@/components/layout/Logo";
import { AppLink as Link } from "@/components/ui/AppLink";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { CopyField } from "@/components/ui/CopyField";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { PhoneNote } from "@/components/ui/PhoneNote";
import type { BrandIconName } from "@/lib/brand-icons";
import { brandIcons } from "@/lib/brand-icons";
import { getStatute, links, settings, type LinkItem } from "@/lib/content";
import { contentIcon } from "@/lib/icons";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { buildDate, linksPagePath, telHref } from "@/lib/site";
import { cn, nbsp } from "@/lib/typography";

// THIS PATH IS PRINTED AS A QR CODE (collection boxes, business cards) - never rename /linki/.
// The links themselves live in content/links.json and can change at any time.
const path = linksPagePath;
export const metadata = buildMetadata({ title: links.seo.title, description: links.seo.description, path });

const digits = (s: string) => s.replace(/\D/g, "");
const isBrand = (icon: string): icon is BrandIconName => icon in brandIcons;

function Icon({ name, className }: { name: string; className?: string }) {
  if (isBrand(name)) return <BrandIcon name={name} className={className} />;
  return createElement(contentIcon(name), { "aria-hidden": true, className });
}

const cardBase = "flex min-h-[4.75rem] items-center gap-4 rounded-[1.5rem] p-3 pr-5";

/** One "link in bio" button. Empty URL → a dashed "wkrótce" card that is not a link at all. */
function LinkCard({ item, soon }: { item: LinkItem; soon: string }) {
  const body = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-plum-600 text-white transition-[rotate,scale,background-color,color] duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-sun-400 group-hover:text-plum-950">
        <Icon name={item.icon} className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span data-link-label className="block font-display text-xl font-semibold uppercase leading-tight tracking-wide text-plum-800">{item.label}</span>
        <span className="mt-0.5 block text-sm leading-snug text-plum-700">{nbsp(item.description)}</span>
      </span>
    </>
  );

  if (!item.url) {
    return (
      <div className={cn(cardBase, "border-2 border-dashed border-cream-100/40 text-cream-100")}>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-plum-900/70 text-cream-100">
          <Icon name={item.icon} className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span data-link-label className="block font-display text-xl font-semibold uppercase leading-tight tracking-wide text-cream-50">{item.label}</span>
          <span className="mt-0.5 block text-sm leading-snug text-cream-100">{nbsp(item.description)}</span>
        </span>
        <span className="shrink-0 rounded-full bg-sun-400 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider text-plum-950">{soon}</span>
      </div>
    );
  }

  const className = cn(
    cardBase,
    // no .on-light here: the focus ring is drawn outside the card, on the dark background (yellow ring)
    "group bg-cream-50 shadow-lg shadow-plum-950/25 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl",
  );
  const internal = item.url.startsWith("/") && !item.url.endsWith(".pdf");
  return internal ? (
    <Link href={item.url} className={className}>
      {body}
      <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-plum-600 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  ) : (
    <ExternalLink href={item.url} className={className}>
      {body}
      <ExternalIcon aria-hidden="true" className="size-5 shrink-0 text-plum-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </ExternalLink>
  );
}

export default function LinksPage() {
  const { donation } = settings;
  const statute = getStatute();
  const more: LinkItem[] = [
    ...links.more,
    ...(statute ? [{ id: "statut", label: "Statut fundacji", description: statute.details, icon: "file-text", url: statute.href }] : []),
  ];

  return (
    <>
      <div className="text-center">
        <span className="anim-drop-soft mx-auto grid size-32 place-items-center rounded-full bg-cream-50 p-3 shadow-xl shadow-plum-950/40 ring-4 ring-sun-400">
          <LogoImage sizes="8rem" eager className="w-full" />
        </span>
        <h1 className="anim-rise-soft mt-6 font-display text-[clamp(1.75rem,7vw,2.25rem)] font-bold uppercase leading-[1.08] tracking-wide text-balance" style={{ ["--d" as string]: "80ms" }}>
          {settings.name}
        </h1>
        <p className="anim-rise-soft mt-2 font-display text-lg font-medium uppercase tracking-wide text-sun-400" style={{ ["--d" as string]: "140ms" }}>
          {settings.tagline}
        </p>
        <p className="anim-rise-soft mx-auto mt-4 max-w-md text-cream-100" style={{ ["--d" as string]: "200ms" }}>
          {nbsp(links.intro.lead)}
        </p>
      </div>

      <nav aria-label="Najważniejsze linki" className="mt-8">
        <ul className="space-y-3" data-reveal-stagger>
          {links.links.map((item) => (
            <li key={item.id}>
              <LinkCard item={item} soon={links.soon} />
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="links-donate-title" className="on-light mt-10 rounded-[2rem] bg-cream-50 p-5 text-plum-900 shadow-xl shadow-plum-950/30 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sun-400 text-plum-950">
            <HandHeart aria-hidden="true" className="size-6" />
          </span>
          <h2 id="links-donate-title" className="font-display text-2xl font-bold uppercase tracking-wide text-plum-800">
            {links.donate.title}
          </h2>
        </div>
        <p className="mt-3">{nbsp(links.donate.text)}</p>
        <dl className="mt-4 space-y-3">
          <CopyField label="BLIK - przelew na numer telefonu" value={donation.blikPhone} copyValue={digits(donation.blikPhone)} spokenName="numer telefonu do BLIK" />
          <CopyField label="Numer konta" value={donation.bankAccount} copyValue={digits(donation.bankAccount)} spokenName="numer konta" large />
          <CopyField label="Tytuł przelewu" value={donation.transferTitle} spokenName="tytuł przelewu" />
          <div>
            <dt className="text-sm font-bold text-plum-700">Odbiorca</dt>
            <dd className="mt-1 font-semibold">{donation.bankAccountOwner}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="links-phone-title" className="on-light mt-4 rounded-[2rem] bg-cream-50 p-5 text-plum-900 shadow-xl shadow-plum-950/30 sm:p-6">
        <h2 id="links-phone-title" className="sr-only">
          Telefon
        </h2>
        <a href={telHref(settings.phone)} className="group flex items-center gap-4 rounded-[1.25rem]">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-plum-600 text-white transition-colors duration-300 group-hover:bg-sun-400 group-hover:text-plum-950">
            <Phone aria-hidden="true" className="ring-on-hover size-6" />
          </span>
          <span>
            <span className="block text-sm font-bold text-plum-700">Zadzwoń</span>
            <span className="font-display text-3xl font-bold tracking-wide text-plum-800">{settings.phone}</span>
          </span>
        </a>
        {settings.phoneNote && <PhoneNote text={settings.phoneNote} className="mt-4" />}
      </section>

      <nav aria-label="Więcej o fundacji" className="mt-10">
        <ul className="space-y-3">
          {more.map((item) => (
            <li key={item.id}>
              <LinkCard item={item} soon={links.soon} />
            </li>
          ))}
        </ul>
      </nav>

      <JsonLd data={webPageJsonLd({ path, name: `${links.seo.title} - ${settings.name}`, description: links.seo.description, dateModified: buildDate })} />
    </>
  );
}
