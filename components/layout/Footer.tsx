import { AppLink as Link } from "@/components/ui/AppLink";
import { LogoImage } from "@/components/layout/Logo";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { settings } from "@/lib/content";
import { buildDate, navItems, telHref } from "@/lib/site";

const headingClass = "font-display text-sm font-semibold uppercase tracking-[0.16em] text-sun-400";
const linkClass = "inline-block underline-offset-4 transition-[color,translate] duration-300 hover:translate-x-1 hover:text-sun-400 hover:underline";

export function Footer() {
  const { donation, social } = settings;

  return (
    <footer className="on-dark bg-plum-950 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_1.2fr_1fr] lg:px-8" data-reveal-stagger>
        <div className="group">
          <LogoImage sizes="160px" className="w-36 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105" />
          <p className="mt-5 font-display text-lg font-semibold uppercase leading-snug tracking-wide text-cream-50">{settings.name}</p>
          <p className="mt-2 text-sun-400">{settings.tagline}</p>
        </div>

        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav" className={headingClass}>
            Na stronie
          </h2>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>Wesprzyj nas</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-bold text-cream-50">Numer konta</dt>
              <dd className="tabular-nums">{donation.bankAccount}</dd>
            </div>
            <div>
              <dt className="font-bold text-cream-50">BLIK na telefon</dt>
              <dd className="tabular-nums">{donation.blikPhone}</dd>
            </div>
            <div>
              <dt className="font-bold text-cream-50">1,5% podatku</dt>
              <dd>
                KRS {donation.taxKrs}, cel szczegółowy: {donation.taxPurpose}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className={headingClass}>Kontakt</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={telHref(settings.phone)} className={linkClass}>
                Tel. {settings.phone}
              </a>
            </li>
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className={linkClass}>
                  {settings.email}
                </a>
              </li>
            )}
            <li>
              <ExternalLink href={social.facebook} className={`${linkClass} inline-flex items-center gap-2`}>
                <BrandIcon name="facebook" className="size-4" /> Facebook
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={social.instagram} className={`${linkClass} inline-flex items-center gap-2`}>
                <BrandIcon name="instagram" className="size-4" /> Instagram
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={social.tiktok} className={`${linkClass} inline-flex items-center gap-2`}>
                <BrandIcon name="tiktok" className="size-4" /> TikTok
              </ExternalLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-100/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            © {buildDate.getFullYear()} {settings.name}
            {settings.krs && <> · KRS {settings.krs}</>}
            {settings.nip && <> · NIP {settings.nip}</>}
          </p>
          <Link href="/polityka-prywatnosci/" className={linkClass}>
            Polityka prywatności
          </Link>
          <p>
            Projekt i realizacja:{" "}
            <ExternalLink href="https://ctrlzstudio.pl/" className={`${linkClass} font-bold text-cream-50`}>
              CtrlZ Studio
            </ExternalLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
