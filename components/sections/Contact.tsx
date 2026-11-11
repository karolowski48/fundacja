import { Mail, Phone } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { LogoImage } from "@/components/layout/Logo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BrandIconName } from "@/lib/brand-icons";
import { home, settings } from "@/lib/content";
import { telHref } from "@/lib/site";
import { nbsp } from "@/lib/typography";

export function Contact() {
  const { contact } = home;
  const { social } = settings;
  const socials: Array<{ icon: BrandIconName; name: string; href: string; handle: string }> = [
    { icon: "facebook", name: "Facebook", href: social.facebook, handle: "Empatia na dłoni" },
    { icon: "instagram", name: "Instagram", href: social.instagram, handle: social.instagramHandle },
    { icon: "tiktok", name: "TikTok", href: social.tiktok, handle: social.tiktokHandle },
  ];

  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="bg-cream-100 py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeading id="kontakt-title" eyebrow={contact.eyebrow} title={contact.title} lead={contact.lead} />
          <address className="mt-8 space-y-4 not-italic">
            <a href={telHref(settings.phone)} className="group flex items-center gap-4 rounded-[1.5rem] bg-white p-4 ring-1 ring-plum-100 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-plum-300 sm:p-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-plum-600 text-white transition-colors duration-300 group-hover:bg-sun-400 group-hover:text-plum-950">
                <Phone aria-hidden="true" className="ring-on-hover size-6" />
              </span>
              <span>
                <span className="block text-sm font-bold text-plum-700">Telefon</span>
                <span className="font-display text-2xl font-bold tracking-wide text-plum-800 sm:text-3xl">{settings.phone}</span>
              </span>
            </a>
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-4 rounded-[1.5rem] bg-white p-4 ring-1 ring-plum-100 hover:ring-plum-300 sm:p-5">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-plum-600 text-white">
                  <Mail aria-hidden="true" className="size-6" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-plum-700">E-mail</span>
                  <span className="text-lg font-bold text-plum-800">{settings.email}</span>
                </span>
              </a>
            )}
            <ul className="grid gap-3 sm:grid-cols-3" data-reveal-stagger>
              {socials.map((s) => (
                <li key={s.name}>
                  <ExternalLink href={s.href} className="group flex h-full items-center gap-3 rounded-[1.5rem] bg-white p-4 ring-1 ring-plum-100 transition-[transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-plum-300 sm:flex-col sm:items-start">
                    <BrandIcon name={s.icon} className="size-7 text-plum-700 transition-[transform,scale,rotate,translate,color] duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-plum-500" />
                    <span>
                      <span className="block font-bold text-plum-800">{s.name}</span>
                      <span className="block break-all text-sm text-plum-700">{s.handle}</span>
                    </span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </address>
        </div>

        <aside data-reveal aria-labelledby="tiktok-title" className="group on-dark relative isolate flex flex-col overflow-hidden rounded-[2rem] bg-plum-800 p-6 text-cream-50 sm:p-10">
          <div aria-hidden="true" className="bg-paws absolute inset-0 -z-10" />
          <div className="flex items-center gap-4">
            <span className="grid size-24 shrink-0 place-items-center rounded-full bg-cream-50 p-2.5 ring-4 ring-sun-400 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105 sm:size-28">
              <LogoImage sizes="7rem" className="w-full" />
            </span>
            <BrandIcon name="tiktok" className="size-10 text-cream-50 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          </div>
          <h3 id="tiktok-title" className="mt-6 font-display text-3xl font-bold uppercase tracking-wide">
            {contact.tiktokTitle}
          </h3>
          <p className="mt-3 text-lg text-cream-100">{nbsp(contact.tiktokText)}</p>
          <div className="mt-auto pt-8">
            <ButtonLink href={social.tiktok} variant="sun" external>
              Obserwuj {social.tiktokHandle}
            </ButtonLink>
          </div>
        </aside>
      </Container>
    </section>
  );
}
