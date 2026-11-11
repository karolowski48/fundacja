import { Heart } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LogoImage } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavLinks } from "@/components/layout/NavLinks";
import { settings } from "@/lib/content";
import { navItems, telHref } from "@/lib/site";

const cta = { href: "/#pomoc-wplata", label: "Wpłać darowiznę" };

export function Header() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-plum-100 bg-cream-50/95 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-cream-50/85">
      <div className="relative mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 rounded-xl">
          <LogoImage sizes="80px" eager className="w-16 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 lg:w-20" />
          <span className="sr-only font-display text-[0.95rem] font-semibold uppercase leading-[1.1] tracking-wide text-plum-800 min-[400px]:not-sr-only">
            <span className="block">{settings.shortName}</span>
            <span className="block text-plum-600">na rzecz Zwierząt</span>
          </span>
        </Link>

        <nav aria-label="Menu główne" className="hidden xl:block">
          <NavLinks items={navItems} />
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={cta.href}
            className="group hidden min-h-11 items-center gap-2 rounded-full bg-sun-400 px-5 font-bold text-plum-950 shadow-sm transition-[background-color,transform,scale,rotate,translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-sun-500 hover:shadow-md sm:inline-flex"
          >
            <Heart aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:scale-125 group-hover:fill-current" />
            Wpłać
          </a>
          <MobileNav
            items={navItems}
            cta={cta}
            phone={{ label: settings.phone, href: telHref(settings.phone) }}
            socials={[
              { icon: "facebook", name: "Facebook", href: settings.social.facebook },
              { icon: "instagram", name: "Instagram", href: settings.social.instagram },
              { icon: "tiktok", name: "TikTok", href: settings.social.tiktok },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
