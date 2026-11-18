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
(WCAG 2.1 A/AA) oraz klawiaturę, menu, galerię, FAQ, linki zewnętrzne, liczby, `/linki/` i stany puste.

```bash
npm run test:fixtures
```

Buduje stronę z **fikcyjnymi** danymi z `tests/fixtures/` (wolontariusze, zwierzęta do adopcji, statut),
sprawdza wypełnione układy (filtr adopcji, karty, lightbox kiermaszów), a na koniec zawsze buduje
prawdziwą stronę ponownie. Dane testowe nigdy nie trafiają na stronę.

## Gdzie są treści

Wszystkie teksty i dane fundacji są w katalogu `content/`:

| Plik | Co zawiera |
|---|---|
| `settings.json` | nazwa, telefon, konto, BLIK, 1,5%, social media, domyślne SEO |
| `home.json` | teksty sekcji strony głównej |
| `about.json`, `help.json`, `gallery.json` | podstrony O nas, Jak pomagamy, Galeria |
| `faq.json` | pytania i odpowiedzi |
| `stories/*.md` | historie zwierząt „kiedyś / teraz” |
| `team.json` | Nasza Empatyczna Ekipa: wolontariusze, zdjęcia z kiermaszów, link do ankiety |
| `adoption/*.md`, `adoption-page.json` | zwierzęta do adopcji i teksty tej strony |
| `links.json` | strona `/linki/` pod kod QR |
| `partners.json` | strona `/partnerzy/` (i sekcja na `/o-nas/`) |
| `pages/*.md` | polityka prywatności |

Później te pliki będzie można edytować w panelu Sveltia CMS (plan w CLAUDE.md, sekcja 13).

## Jak dodać…

**Wolontariusza** (tylko osoba, która zgodziła się na publikację): zdjęcie przygotuj jak w sekcji „Zdjęcia”
(np. nazwa `team-ania`), potem w `content/team.json` dopisz do `members`:

```json
{ "name": "Ania", "role": "Kiermasze", "description": "Kilka zdań o tym, jak pomaga.", "image": "team-ania", "imageAlt": "Ania z kotem na rękach przy stoisku fundacji" }
```

`role` to krótka etykieta: Kiermasze, Rękodzieło, Zbiórki albo Codzienna pomoc. Zdjęcia z kiermaszów
dopisuj do `fairs` (`image`, `alt`, `caption`). Gdy przyjdzie link do ankiety Google, wklej go w
`volunteerFormUrl` - przycisk „Zostań wolontariuszem” i pozycja na `/linki/` zaczną prowadzić do formularza.

**Zwierzę do adopcji:** skopiuj `content/adoption/_wzor.md` jako np. `content/adoption/luna.md` (małe litery,
bez polskich znaków - to adres karty `/do-adopcji/#luna`), uzupełnij pola i usuń `draft: true`.
Pierwszy akapit historii widać od razu, kolejne po kliknięciu „Czytaj całą historię”. Gdy zwierzak
znajdzie dom, usuń plik (albo ustaw `draft: true`).

**Partnera:** logo (SVG albo PNG z przezroczystym tłem) wrzuć do `public/partners/`, potem w
`content/partners.json` dopisz `{ "name": "Firma", "url": "https://…", "logo": "/partners/firma.svg" }`.
Bez logo zostaw `"logo": ""` - pokaże się etykieta z nazwą.

**Link na `/linki/`:** edytuj `content/links.json` (kolejność w pliku = kolejność na stronie). Pusty `url`
pokazuje kartę „Wkrótce” (albo bierze adres z `settings.json` dla Facebooka, Instagrama, TikToka i zrzutki
oraz z `team.json → volunteerFormUrl` dla ankiety). **Adresu `/linki/` nigdy nie zmieniamy** - jest w kodzie QR.
Kod QR generujemy dopiero po ustaleniu docelowej domeny: `https://<domena>/linki/`.

**Statut:** plik PDF wrzuć do `public/dokumenty/` (np. `statut.pdf`) i w `content/settings.json` ustaw
`"documents": { "statutePdf": "/dokumenty/statut.pdf" }`. Link „Statut fundacji (PDF, rozmiar)” pojawi się
w stopce, na `/o-nas/` i na `/linki/`. Pusta wartość = link się nie wyświetla.

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
