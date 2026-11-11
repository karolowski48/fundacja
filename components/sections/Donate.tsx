import { HandHeart, HeartHandshake, Percent, Phone, Store } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { CopyField } from "@/components/ui/CopyField";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Wave } from "@/components/ui/Wave";
import { home, settings } from "@/lib/content";
import { telHref } from "@/lib/site";
import { nbsp } from "@/lib/typography";

const digits = (s: string) => s.replace(/\D/g, "");
const cardTitle = "font-display text-2xl font-bold uppercase tracking-wide text-plum-800 sm:text-[1.75rem]";

export function Donate() {
  const { donate } = home;
  const { donation, social } = settings;

  return (
    <section id="pomoc" aria-labelledby="pomoc-title" className="on-dark relative isolate overflow-hidden bg-plum-800 py-28 text-cream-50 sm:py-36">
      <div aria-hidden="true" className="bg-paws absolute inset-0 -z-10" />
      <Wave flip className="absolute inset-x-0 -top-px text-cream-50" />
      <Container>
        <SectionHeading id="pomoc-title" eyebrow={donate.eyebrow} title={donate.title} lead={donate.lead} align="center" tone="dark" />

        <div className="mt-14 grid gap-6 lg:grid-cols-2" data-reveal-stagger>
          <article id="pomoc-wplata" aria-labelledby="pomoc-wplata-title" className="on-light group rounded-[2rem] bg-cream-50 p-5 text-plum-900 shadow-2xl shadow-plum-950/30 sm:p-8">
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-plum-600 text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <HandHeart aria-hidden="true" className="size-7" />
              </span>
              <h3 id="pomoc-wplata-title" className={cardTitle}>
                {donate.transfer.title}
              </h3>
            </div>
            <p className="mt-4">{nbsp(donate.transfer.text)}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <CopyField label="Numer konta" value={donation.bankAccount} copyValue={digits(donation.bankAccount)} spokenName="numer konta" large className="sm:col-span-2" />
              <div>
                <dt className="text-sm font-bold text-plum-700">Odbiorca</dt>
                <dd className="mt-1.5 font-semibold">{donation.bankAccountOwner}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-plum-700">Tytuł przelewu</dt>
                <dd className="mt-1.5 font-semibold">„{donation.transferTitle}”</dd>
              </div>
              <CopyField
                label="BLIK - przelew na numer telefonu"
                value={donation.blikPhone}
                copyValue={digits(donation.blikPhone)}
                spokenName="numer telefonu do BLIK"
                className="sm:col-span-2"
              />
            </dl>
            <ButtonLink href={donation.zrzutkaUrl} variant="plum" external className="mt-8 w-full sm:w-auto">
              {donate.transfer.zrzutkaCta}
            </ButtonLink>
          </article>

          <article id="pomoc-15" aria-labelledby="pomoc-15-title" className="on-light group relative overflow-hidden rounded-[2rem] bg-cream-50 p-5 text-plum-900 shadow-2xl shadow-plum-950/30 sm:p-8">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-sun-400" />
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sun-400 text-plum-950 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Percent aria-hidden="true" className="size-7" />
              </span>
              <h3 id="pomoc-15-title" className={cardTitle}>
                {donate.tax.title}
              </h3>
            </div>
            <p className="mt-4">{nbsp(donate.tax.text)}</p>
            <dl className="mt-6 space-y-4">
              <CopyField label="Numer KRS" value={donation.taxKrs} spokenName="numer KRS" large />
              <CopyField label="Cel szczegółowy" value={donation.taxPurpose} spokenName="cel szczegółowy" />
            </dl>
            <p className="mt-6 rounded-2xl bg-plum-50 p-4 text-sm text-plum-800 ring-1 ring-plum-100">{nbsp(donate.tax.note)}</p>
          </article>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]" data-reveal-stagger>
          <article aria-labelledby="pomoc-stoisko-title" className="on-light group grid overflow-hidden rounded-[2rem] bg-cream-100 text-plum-900 sm:grid-cols-[1fr_1.1fr]">
            <div className="overflow-hidden">
            <Picture
              name="lanyard"
              alt={donate.shop.imageAlt}
              sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 92vw"
              className="h-full min-h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            </div>
            <div className="p-6 sm:p-8">
              <Store aria-hidden="true" className="size-8 text-plum-600 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
              <h3 id="pomoc-stoisko-title" className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-plum-800">
                {donate.shop.title}
              </h3>
              <p className="mt-3">{nbsp(donate.shop.text)}</p>
              <ul className="mt-5 flex flex-wrap gap-3">
                <li>
                  <ExternalLink href={social.instagram} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-bold text-plum-800 ring-1 ring-plum-100 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-plum-600">
                    <BrandIcon name="instagram" className="size-4" /> Instagram
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href={social.facebook} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-bold text-plum-800 ring-1 ring-plum-100 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-plum-600">
                    <BrandIcon name="facebook" className="size-4" /> Facebook
                  </ExternalLink>
                </li>
              </ul>
            </div>
          </article>

          <article aria-labelledby="pomoc-wolontariat-title" className="group flex flex-col rounded-[2rem] bg-plum-900 p-6 ring-1 ring-cream-100/20 sm:p-8">
            <HeartHandshake aria-hidden="true" className="size-8 text-sun-400 transition-transform duration-300 group-hover:scale-125" />
            <h3 id="pomoc-wolontariat-title" className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-cream-50">
              {donate.volunteer.title}
            </h3>
            <p className="mt-3 text-cream-100">{nbsp(donate.volunteer.text)}</p>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <ButtonLink href={telHref(settings.phone)} variant="sun">
                <Phone aria-hidden="true" className="ring-on-hover size-5" />
                Zadzwoń: {settings.phone}
              </ButtonLink>
              <ButtonLink href="#kontakt" variant="outlineLight">
                Napisz do nas
              </ButtonLink>
            </div>
          </article>
        </div>
      </Container>
      <Wave className="absolute inset-x-0 -bottom-px text-cream-50" />
    </section>
  );
}
