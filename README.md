# Fundacja Empatia na rzecz Zwierząt - strona internetowa

Statyczna strona (Next.js 16 + TypeScript, Tailwind CSS 4, GSAP) przygotowana pod darmowy hosting
Cloudflare Pages. Szczegółowe zasady budowy, branding i checklisty SEO/WCAG: [CLAUDE.md](CLAUDE.md).

## Uruchomienie lokalne

Wymagany Node 22 lub nowszy.

```bash
npm install
npm run dev
```

Strona działa pod http://localhost:3000.

Podgląd wersji produkcyjnej (dokładnie to, co trafi na Cloudflare):

```bash
npm run build
npm run preview
```

Podgląd działa pod http://localhost:4173.

## Testy

```bash
npm run lint && npm run typecheck && npm run build
npm run test:a11y
```

`test:a11y` używa zainstalowanego Google Chrome i sprawdza wszystkie strony narzędziem axe
(WCAG 2.1 A/AA) oraz klawiaturę, menu, galerię, FAQ i linki zewnętrzne.

## Gdzie są treści

Wszystkie teksty i dane fundacji są w katalogu `content/`:

| Plik | Co zawiera |
|---|---|
| `settings.json` | nazwa, telefon, konto, BLIK, 1,5%, social media, domyślne SEO |
| `home.json` | teksty sekcji strony głównej |
| `about.json`, `help.json`, `gallery.json` | podstrony O nas, Jak pomagamy, Galeria |
| `faq.json` | pytania i odpowiedzi |
| `stories/*.md` | historie zwierząt „kiedyś / teraz” |
| `pages/*.md` | polityka prywatności |

Później te pliki będzie można edytować w panelu Sveltia CMS (plan w CLAUDE.md, sekcja 13).

## Zdjęcia

1. Oryginał wrzuć do `source-images/`.
2. Dopisz go do listy `IMAGES` w `scripts/optimize-images.mjs`.
3. Uruchom `npm run images` - powstaną pliki WebP w kilku rozmiarach i wpis w `public/images/manifest.json`.
4. W treściach używaj nazwy obrazu (np. `help-feeding`).

## Wdrożenie na Cloudflare Pages

Preset „Next.js (Static HTML Export)”, polecenie `npm run build`, katalog wyjściowy `out`,
zmienna `NODE_VERSION=22`. Docelowy adres ustaw w `content/settings.json` (`siteUrl`)
albo zmienną `NEXT_PUBLIC_SITE_URL`. Szczegóły: CLAUDE.md, sekcja 14.

## Licencje zasobów

- Fonty Oswald i Nunito: SIL Open Font License 1.1 (`app/fonts/OFL-*.txt`).
- Ikony marek (Facebook, Instagram, TikTok): Simple Icons, CC0.
- Ikony interfejsu: Lucide, ISC.
- Zdjęcie dokarmiania zimą: Foto Gabka - wymaga potwierdzenia zgody na publikację.
