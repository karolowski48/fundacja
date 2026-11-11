# CLAUDE.md — Strona Fundacji Empatia na rzecz Zwierząt

Ten plik jest jedynym źródłem prawdy o tym, JAK budować tę stronę. Każda sesja Claude Code
zaczyna od przeczytania go w całości. Jeśli coś w kodzie przeczy temu plikowi — kod jest do poprawy,
chyba że właściciel projektu zdecydował inaczej (wtedy zaktualizuj ten plik).

Język komunikacji z użytkownikiem: polski. Język kodu, nazw plików, komentarzy i commitów: angielski.
Język treści strony: polski (`<html lang="pl">`).

---

## 1. O co chodzi

Strona internetowa (na razie tylko strona główna, one‑page z sekcjami + kilka podstron prawnych)
dla **Fundacji Empatia na rzecz Zwierząt** — małej fundacji prowadzonej przez **Sylwię Łętochę**,
która od lat opiekuje się bezdomnymi („wolno żyjącymi") kotami oraz innymi zwierzętami
(na logo i zdjęciach: pies, koty, królik, gołąb, szynszyla, ptaki). Marka w social mediach:
**„Empatia na dłoni"** (`empatia.na.dloni` na IG, `empatianadloni` na TikToku).

Cele strony (w tej kolejności):
1. **Darowizny** — konto bankowe, BLIK, zrzutka, 1,5% podatku. To jest główne CTA.
2. **Zaufanie i przejrzystość** — kim jesteśmy, co robimy, dowody (historie „kiedyś / teraz", liczby).
3. **Kontakt i social** — telefon, FB, IG, TikTok.
4. Później: aktualności i historie zwierząt edytowane przez właścicielkę w **Sveltia CMS**.

Etapy:
- **Etap 0 (ten plik)** — instrukcja budowy. ✅
- **Etap 1** — strona główna + podstrony O nas, Jak pomagamy, Galeria na `localhost`, pełny branding,
  animacje (GSAP), treści ze zrzutki, SEO/GEO, WCAG 2.1 AA. ✅ (stan: sekcja 17)
- **Etap 2** — deploy na **Cloudflare Pages** (darmowy hosting, static export).
- **Etap 3** — **Sveltia CMS** (`/admin`) do edycji aktualności, historii zwierząt i ustawień.

---

## 2. Dane fundacji (fakty do użycia na stronie)

| Pole | Wartość | Status |
|---|---|---|
| Nazwa pełna | Fundacja Empatia na rzecz Zwierząt | potwierdzone (brelok) |
| Marka / handle | Empatia na dłoni | potwierdzone |
| Hasło | „Dla tych, którzy mają tylko nas" | potwierdzone (brelok) |
| Założycielka | Sylwia Łętocha | potwierdzone (zrzutka) |
| Telefon kontaktowy | 724 236 270 | od właścicielki |
| Konto bankowe | 91 1020 2892 0000 5202 1039 7216 | od właścicielki |
| BLIK (przelew na telefon) | 663 806 717, tytuł: „Darowizna" | od właścicielki |
| 1,5% podatku — KRS | 0000270261 | od właścicielki |
| 1,5% — cel szczegółowy | FUNDACJA EMPATIA NA RZECZ ZWIERZĄT 38275 | od właścicielki |
| Zrzutka | https://zrzutka.pl/xg7gtb | od właścicielki |
| Facebook | https://www.facebook.com/share/18htfEvXte/ | od właścicielki |
| Instagram | https://www.instagram.com/empatia.na.dloni | od właścicielki (bez parametrów utm) |
| TikTok | https://www.tiktok.com/@empatianadloni | od właścicielki (bez parametrów) |
| Własny KRS / NIP / REGON fundacji | — | **DO USTALENIA** |
| Adres siedziby / gmina działania | — | **DO USTALENIA** |
| E-mail | — | **DO USTALENIA** |
| Domena docelowa | — | **DO USTALENIA** (placeholder: `https://empatianadloni.pl`) |

**Ważne o 1,5%:** KRS 0000270261 należy do **Fundacji Studenckiej „Młodzi‑Młodym"** (organizacja
parasolowa OPP). Empatia zbiera 1,5% jako *cel szczegółowy* tej organizacji. Na stronie napisz to
uczciwie: „Przekaż 1,5% podatku: KRS 0000270261, w polu *cel szczegółowy* wpisz:
FUNDACJA EMPATIA NA RZECZ ZWIERZĄT 38275". Nie pisz, że 0000270261 to KRS naszej fundacji.

**Placeholdery:** wszystkie wartości „DO USTALENIA" trzymaj w `content/settings.json` i renderuj
warunkowo (brak wartości = sekcja/wiersz się nie wyświetla). Nigdy nie wymyślaj danych
rejestrowych ani adresu.

---

## 3. Stack i decyzje techniczne

| Obszar | Decyzja | Dlaczego |
|---|---|---|
| Framework | **Next.js (najnowszy stabilny, App Router)** + **TypeScript strict** | wymóg właściciela |
| Rendering | **`output: 'export'`** — czysto statyczny HTML | darmowy Cloudflare Pages, zero serwera, max szybkość, Sveltia działa na statycznych plikach |
| Style | **Tailwind CSS v4** + tokeny w `@theme` w `app/globals.css` | szybko, spójnie, łatwe tokeny brandu |
| Fonty | **Oswald** (nagłówki) + **Nunito** (tekst) jako `next/font/local` z plików `app/fonts/*-pl.woff2` | własny podzbiór łacina + polskie znaki (`npm run fonts`): 2 pliki / 53 KB zamiast 4 / 126 KB z Google |
| Ikony | `lucide-react` (tylko używane ikony, z `aria-hidden`) | lekkie, dostępne |
| Obrazy | komponent `Picture` (natywny `<img>` z `srcset`) + **skrypt `sharp`** generujący WebP w kilku szerokościach i `public/images/manifest.json` | static export nie ma optymalizatora; `next/image` z `unoptimized` nie robi `srcset` |
| Treści | pliki w `content/` (JSON importowany statycznie + Markdown z frontmatter przez `gray-matter` i `marked`) | od razu kompatybilne ze Sveltia CMS; zmiana kształtu JSON wywala `tsc` |
| Animacje | **GSAP 3 + ScrollTrigger**, ładowane leniwie (`import()` w `components/Motion.tsx`) + animacje wejścia hero w czystym CSS | GSAP nie konkuruje z pierwszym malowaniem; zasady w sekcji 6.1 |
| Lint/format | ESLint (next/core-web-vitals + `jsx-a11y`), Prettier | WCAG już na etapie lintu |
| Testy | Playwright + `@axe-core/playwright` (smoke a11y na stronie głównej), `tsc --noEmit` | wykrywanie regresji dostępności |
| Hosting | **Cloudflare Pages**, preset „Next.js (Static HTML Export)" | darmowy, globalne CDN |
| CMS | **Sveltia CMS** (etap 3) + `sveltia-cms-auth` na Cloudflare Workers | darmowy, Git‑based, działa ze static export |
| Analityka | **Cloudflare Web Analytics** (bez cookies) — opcjonalnie, dopiero po deployu | brak banera cookies = prostsze RODO |
| Package manager | `npm` | prostota |

**Czego NIE robić:**
- Nie używaj Server Actions, route handlers, middleware, ISR, `dynamic` — static export ich nie wspiera.
- Nie używaj `next/image` z remote loaderem ani `<Image>` bez `width`/`height`.
- Nie dodawaj zewnętrznych skryptów (Google Fonts przez `<link>`, GTM, embedy FB/IG/TikTok iframe) — psują wydajność, prywatność i a11y. Social = zwykłe linki. GSAP jest w bundlu, nie z CDN.
- Nie używaj `next/script` ze `strategy="beforeInteractive"` do flagi `js` — w App Router jest odroczony i powoduje CLS. Flaga to zwykły `<script>` w `<head>` w `app/layout.tsx`.
- Nie wołaj `ReactDOM.preload()` dla obrazów i nie włączaj prefetchu linków: React 19 dokleja wskazówki preload do payloadu RSC, a prefetch pobierałby obrazy hero innych stron. Linki wewnętrzne przez `AppLink` (`prefetch={false}`).
- Nie wprowadzaj `localStorage`/cookies bez potrzeby. Żadnego banera cookies, dopóki nie ma cookies.
- Nie twórz kolejnych stron poza listą w sekcji 7 bez pytania.
- Nie commituj i nie pushuj bez polecenia właściciela.

### Konfiguracja `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,          // /polityka-prywatnosci/index.html — Cloudflare Pages serwuje poprawnie
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
```

### Node

Używaj Node 22 LTS (lokalnie działa też 24). W Cloudflare Pages ustaw zmienną `NODE_VERSION=22`. Dodaj `.nvmrc` z `22`.

---

## 4. Struktura repozytorium

```
.
├── CLAUDE.md
├── README.md                      # krótki: jak uruchomić, jak deployować, jak edytować treści
├── .nvmrc
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── package.json
├── app/
│   ├── fonts.ts + fonts/          # next/font/local, podzbiory *-pl.woff2 + licencje OFL
│   ├── o-nas/ jak-pomagamy/ galeria/   # podstrony (page.tsx czytają content/*.json)
│   ├── llms.txt/route.ts          # generowany z content/ (force-static)
│   ├── layout.tsx                 # <html lang="pl">, fonty, flaga js, skip-link, Header, Footer, ScrollToTop, Motion, JSON-LD
│   ├── page.tsx                   # strona główna — składa sekcje z components/sections
│   ├── globals.css                # @import "tailwindcss"; @theme { tokeny }; focus, reduced-motion
│   ├── sitemap.ts                 # export const dynamic = "force-static"
│   ├── robots.ts                  # export const dynamic = "force-static"; blokuje /admin/
│   ├── manifest.ts                # PWA manifest (ikona, theme_color)
│   ├── icon.png / apple-icon.png / opengraph-image.png   # z logo
│   ├── not-found.tsx
│   ├── polityka-prywatnosci/page.tsx
│   └── (etap 3) aktualnosci/page.tsx, aktualnosci/[slug]/page.tsx (generateStaticParams)
├── components/
│   ├── ui/                        # ButtonLink, ExternalLink, AppLink, Container, SectionHeading, Picture, CopyField, Paw, Wave, Breadcrumbs, BrandIcon
│   ├── layout/                    # Header, NavLinks, MobileNav, Footer, PageHero, LegalPage, Logo, ScrollToTop
│   ├── sections/                  # Hero, Stats, About, Help, Stories(+List), Donate, Faq, Contact, CtaBand
│   ├── gallery/Gallery.tsx        # filtry + lightbox na <dialog>
│   ├── Motion.tsx                 # GSAP (leniwie), patrz 6.1
│   └── JsonLd.tsx
├── content/                       # ŹRÓDŁO TREŚCI (edytowalne później w CMS)
│   ├── settings.json              # dane fundacji, social, dane do wpłat, SEO defaults
│   ├── home.json                  # teksty sekcji strony głównej
│   ├── about.json / help.json / gallery.json   # podstrony
│   ├── pages/*.md                 # polityka prywatności
│   ├── faq.json
│   ├── stories/*.md               # historie zwierząt „kiedyś / teraz"
│   └── news/*.md                  # aktualności
├── lib/
│   ├── content.ts                 # loadery treści (JSON + fs/gray-matter/marked), typy
│   ├── images.ts                  # manifest obrazów, getImage() wywala build przy złej nazwie
│   ├── icons.ts                   # dozwolone nazwy ikon w content/*.json
│   ├── seo.ts                     # buildMetadata(), JSON-LD helpers
│   ├── site.ts                    # siteUrl, navItems, pages (sitemap), telHref
│   └── typography.ts              # nbsp() - sierotki, cn()
├── public/
│   ├── images/                    # zoptymalizowane WebP (generowane skryptem, commitowane)
│   ├── brand/                     # logo.png, logo-transparent.png, pattern-paw.svg, lanyard.png
│   ├── admin/                     # (etap 3) index.html + config.yml Sveltia
│   ├── _headers                   # nagłówki bezpieczeństwa/cache dla Cloudflare Pages
│   ├── llms.txt
│   └── favicon.ico
├── scripts/
│   ├── optimize-images.mjs        # sharp: source → public/images/{name}-{w}.webp + manifest + blur
│   ├── brand-assets.mjs           # favicony, ikony PWA, OG/Twitter image, logo WebP
│   ├── subset-fonts.mjs           # podzbiory fontów PL
│   ├── extract-logo.mjs           # jednorazowo: logo bez tła
│   └── cut-sources.mjs            # jednorazowo: pary „kiedyś/teraz” z rollupu, kafelki z kolażu
├── source-images/                 # ORYGINAŁY (duże pliki właścicielki + ze zrzutki); w .gitignore poza brand/
├── tests/
│   └── a11y.spec.ts               # Playwright + axe na "/"
└── out/                           # build (gitignore)
```

Pliki, które właściciel wrzucił do katalogu projektu, przenieś (kopiuj, nie usuwaj oryginałów
dopóki właściciel nie potwierdzi) do `source-images/` pod czytelnymi nazwami:

| Oryginał | Nowa nazwa | Użycie |
|---|---|---|
| `Empatią zmieniamy świat! - 2.png` (1050×600, logo na jasnofioletowym tle) | `brand/logo-on-purple.png` | OG image, social |
| `8355B150-….png` (1536×1024, logo na ciemnym tle) | `brand/logo-dark-bg.png` | **wytnij logo bez tła** → `public/brand/logo.png` (+ `logo.webp`); ikona strony |
| `D88C7FC4-….png` (breloki/smycze) | `brand/lanyard.png` | sekcja „Kupując na stoisku pomagasz" / „Jak pomóc" |
| `Blue and Pink Minimalist Sales Flyer RollUp.jpeg` (rollup) | `brand/rollup-kiedys-teraz.jpg` | ŹRÓDŁO treści historii „kiedyś / teraz" (nie publikuj jako jeden obraz; wytnij pary zdjęć zwierząt) |
| `098C7C90-….jpeg` (kolaż 8 zdjęć) | `photos/collage.jpg` | wytnij pojedyncze kafelki do sekcji „Komu pomagamy" |
| `AJhNNqfGX81B1rDd.jpg` (Sylwia dokarmia koty zimą, znak wodny Foto Gabka) | `photos/feeding-winter.jpg` | hero lub „Nasza historia" — **sprawdź zgodę na użycie (znak wodny fotografa)** |
| `IMG_4435.jpeg` (6 kociąt w klatce) | `photos/kittens-cage.jpg` | hero / sekcja azylu |
| `IMG_8680.jpeg` (biało‑czarny kociak bez oczka — „Adaś") | `photos/adas.jpg` | historia Adasia / hero portret |
| `wizualizacja.jpg` | `reference/inspiration.jpg` | TYLKO referencja stylu, nie publikować |

Zdjęcia ze zrzutki (opis + galeria): pobierz jednorazowo skryptem do `source-images/zrzutka/`,
obejrzyj, wybierz. Adresy (wszystkie `https://zrzutka.pl/uploads/chipin/xg7gtb/...`):

```
cover/orginal/beedecab2052349b4841d7e44c84e7b3.jpg   cover/orginal/f5b7426ab36b0ac5d5d10a1b9fba7d1f.jpg
cover/orginal/1fa02039bd10e4bfc74691aeedfce9b2.jpg   cover/orginal/c58ccf772d28e40a8c24ffbf154c519c.jpg
content/NGWwYyGxomrzeaFr.jpg  content/RQyrkP3X7iUSSDbS.jpg  content/772axvFT4gRzZJZV.jpg  content/dIH0t0Q3s7f80AJd.jpg
content/zmxU5ePZ66CpFwnT.jpg  content/nG9r0MTfYQeNri8Z.jpg  content/15D87Fmcxf9uNJbB.jpg  content/kXOXGDrPy83r7sli.jpg
content/hz3XcE98QsicCd6l.jpg  content/YfO4zkPRTBOGy40W.jpg  content/dCEvu0ofeu6ymOai.jpg  content/DqbCSzuWl7tQDhcr.jpg
content/AJhNNqfGX81B1rDd.jpg  content/HCCMT7RQcEbR7UrI.jpg  content/bV30Nm3HWMGC9a0n.jpg  content/BfE2rfFq7UcHRHT9.jpg
content/xp9EaDYlWlGevtdM.jpg  content/tqThKD3Mhf2IBsMp.jpg  content/kQi6PsYWtAQeV2A0.jpg  content/mHuNTRRq9U0Ewm4H.jpg
content/OwjvAAJx10lvdJkt.jpg  content/U0qWBBMbtMiVPlup.jpg  content/uPiHKHYx5qD2Aibj.jpg
```
(Zdjęcia z `uploads/chipin/tmp/.../content/` to faktury — nie pobieraj.)
Opis zrzutki wymienia podpisy: „na zdjęciu Venus", „na zdjęciu Monte", „budki styropianowe ze słomą
i kocami", „moje pierwsze notatki" — dopasuj po obejrzeniu.

---

## 5. Branding

### 5.1 Kolory (tokeny Tailwind v4 w `@theme`)

Wartości spróbkowane z logo, breloków i rollupu. Używaj TYLKO tych tokenów, nie dopisuj nowych
kolorów „na oko".

```css
@theme {
  /* fiolety — rdzeń marki */
  --color-plum-950: #1f0f27;   /* najciemniejszy tekst na jasnym, tło stopki */
  --color-plum-900: #2e1538;   /* tekst główny */
  --color-plum-800: #462451;   /* ciemny fiolet z breloka — tła sekcji, nagłówki */
  --color-plum-700: #5e3375;   /* hover primary */
  --color-plum-600: #7b4f9d;   /* PRIMARY — litery logo; przyciski, linki */
  --color-plum-500: #b460bc;   /* fiolet z rollupu — tylko duży tekst/dekor */
  --color-plum-300: #c480d6;   /* jasny fiolet z tła logo — TYLKO tła/dekor, nigdy tekst */
  --color-plum-100: #efe3f5;   /* delikatne tła kart */
  --color-plum-50:  #f8f3fb;

  /* krem/beż — ze wstęgi logo i jasnej strony breloka */
  --color-cream-50:  #fdf9f1;  /* tło strony (zamiast czystej bieli) */
  --color-cream-100: #f9efd9;
  --color-cream-200: #f3e3c3;  /* wstęga logo #f9e2b8 */
  --color-cream-300: #e8d1a7;  /* łapki na fioletowym pasku breloka */

  /* akcent — żółty z rollupu */
  --color-sun-400: #f7cf61;    /* CTA wtórne na ciemnym fiolecie, podkreślenia, badge */
  --color-sun-500: #e6b93c;

  /* semantyka */
  --color-ink:      var(--color-plum-900);
  --color-surface:  var(--color-cream-50);
  --color-primary:  var(--color-plum-600);
  --color-accent:   var(--color-sun-400);
  --color-focus:    #1d4ed8;   /* obrys fokusa na jasnych tłach; na ciemnych (klasa .on-dark) żółty sun-400 */
}
```

**Pary kontrastowe (zweryfikowane, WCAG AA):**
| Tekst | Tło | Kontrast | Użycie |
|---|---|---|---|
| plum-900 `#2e1538` | cream-50 `#fdf9f1` | ≈ 14:1 | tekst podstawowy |
| plum-600 `#7b4f9d` | biały / cream-50 | ≈ 6:1 | linki, przyciski outline, małe nagłówki |
| biały | plum-600 `#7b4f9d` | ≈ 6:1 | przycisk primary |
| biały / cream-100 | plum-800 `#462451` | ≈ 12:1 | sekcje ciemne, stopka |
| plum-900 | sun-400 `#f7cf61` | ≈ 9:1 | przycisk akcent |
| sun-400 | plum-800 | ≈ 8:1 | podkreślenia na ciemnym |
| biały | plum-500 `#b460bc` | ≈ 3.9:1 | **tylko tekst ≥ 24px/18.5px bold** (AA large) |
| cokolwiek | plum-300 `#c480d6` | — | **NIE do tekstu** — tylko tła z ciemnym tekstem (plum-900 na plum-300 ≈ 6:1 OK) |

### 5.2 Typografia

- **Nagłówki (H1-H3, eyebrow, liczby):** `Oswald` 500-700, uppercase dla H1/eyebrow (jak
  „DLA TYCH, KTÓRZY MAJĄ TYLKO NAS" na breloku), `letter-spacing: 0.02em`. H2 może być
  normal-case 600.
- **Tekst:** `Nunito` 400/600/700, 17-18 px bazowo, `line-height 1.6`, max szerokość wiersza
  `65ch`.
- Skala (clamp, mobile → desktop): H1 `clamp(2.25rem, 5vw, 4rem)`, H2 `clamp(1.75rem, 3.5vw, 2.75rem)`,
  H3 `1.375rem`, body `1.0625rem`, small `0.9375rem`. Nigdy poniżej 14 px.
- Polskie znaki: oba fonty mają subset `latin-ext` — ustaw `subsets: ["latin", "latin-ext"]`.
- `font-display: swap` zapewnia `next/font`.

### 5.3 Motywy graficzne (to buduje rozpoznawalność, nie kolory same w sobie)

1. **Łapki** — wzór z wewnętrznej strony breloka: kremowe łapki na ciemnym fiolecie. Zrób
   `public/brand/pattern-paw.svg` (jedna łapka, 5 elips) i użyj jako `background-image` z
   niską opacity (8-12%) w ciemnych sekcjach oraz jako separator `PawDivider` (rząd 5-7 łapek,
   `aria-hidden`). Nie przesadzaj: max 2 sekcje z wzorem.
2. **Wstęga** — kremowa wstęga z logo. Użyj jej kształtu (łagodny łuk, `border-radius` +
   `clip-path`) jako tła podpisu/eyebrow w hero i w kartach historii. Nie powielaj wstęgi jako
   obrazka — buduj w CSS/SVG.
3. **Ręcznie rysowany, ciepły charakter** logo — stąd: zaokrąglone rogi (`rounded-2xl`/`3xl`),
   miękkie cienie (`shadow-plum-900/10`), obrazy w „polaroidowych" ramkach kremowych w sekcji
   historii, delikatne obroty (±2°) w kafelkach zdjęć.
4. **Żółty** tylko jako iskra: podkreślenia słów kluczowych w H1 (jak „RATOWAĆ… ŻYCIA" na
   rollupie), badge „kiedyś / teraz", przycisk 1,5%.

### 5.4 Logo — zasady

- Logo = ilustracja 5 zwierząt + motyl + wstęga „EMPATIA". Używaj wersji **bez tła** (wytnij
  z `logo-dark-bg.png`; jeśli wycięcie wychodzi brzydko, użyj wersji na jasnofioletowym tle w
  kółku). Minimalna szerokość 120 px. Nie rozciągaj, nie zmieniaj kolorów, nie nakładaj tekstu.
- W nagłówku: logo (wys. 56 px desktop / 44 px mobile) + obok tekst „Fundacja Empatia na rzecz
  Zwierząt" (Oswald, 2 linie) — ukryty na bardzo wąskich ekranach, ale ZAWSZE w `aria-label`
  linku do strony głównej.
- Favicon/ikona: sama głowa psa + kotów bez wstęgi nie czyta się w 32 px — zrób prostą ikonę:
  fioletowe koło plum-600 z kremową łapką. OG image: `logo-on-purple.png` 1200×630 z dopiskiem
  hasła.

---

## 6. Kierunek wizualny

Referencja: `wizualizacja.jpg` (strona „Paw & Purpose" — ciepłe, jasne, zaokrąglone sekcje,
karty, kafelki kategorii, pasek statystyk, sekcja „happy tails" z polaroidami, CTA kafelki
wolontariat/darowizna, opinie, newsletter, stopka z kolumnami).

**Bierzemy z referencji:** ogólną architekturę one‑page, lekkość, dużo powietrza, zaokrąglone
karty, pasek „ikona + 3 słowa" pod hero, polaroidy w sekcji historii, dwa duże kafelki CTA
obok siebie, stopkę w kolumnach.

**Robimy INACZEJ (ma wyglądać jak inna strona, nie skórka):**
- Paleta: ciemny fiolet + krem + żółty zamiast szałwii/beżu. Hero na **ciemnym fiolecie
  plum-800 z wzorem łapek**, nie na jasnym tle. Jasne sekcje na cream-50, naprzemiennie z
  jedną ciemną.
- Kompozycja hero: po lewej duży uppercase H1 (Oswald) z jednym słowem podkreślonym żółtym
  „markerem", pod spodem 2 przyciski (primary żółty „Wpłać teraz", outline biały „Przekaż 1,5%"),
  po prawej **kolaż 3 zdjęć w kremowych ramkach, lekko obrócone**, zamiast jednego zdjęcia w blobie.
- Bez wyszukiwarki/filtrów adopcyjnych (nie mamy bazy adopcyjnej). Zamiast tego pasek
  **liczb** („~30 wysterylizowanych kotów", „544 wspierających zrzutkę", „kilkanaście adopcji") —
  liczby z `content/home.json`, do potwierdzenia z właścicielką.
- Sekcja „Komu pomagamy" jako rząd okrągłych fotek (kot, pies, królik, ptak, szynszyla) z
  kolażu — zamiast rysunkowych kafelków kategorii.
- Historie „kiedyś → teraz" jako karty z **dwoma zdjęciami i strzałką** (dokładnie jak na
  rollupie) — to jest nasz unikalny element, referencja tego nie ma.
- Brak sekcji newsletter (nie mamy narzędzia). Zamiast tego pasek social „Zobacz codzienność na
  TikToku".
- Nagłówek: sticky, kremowy z cienką fioletową linią; CTA „Wpłać" żółte.

Mobile‑first. Każda sekcja musi wyglądać dobrze na 360 px szerokości, potem 768, 1024, 1440.
Szerokość kontenera `max-w-6xl` (72rem), gutter `px-4 sm:px-6 lg:px-8`.

### 6.1 Animacje i hovery (decyzja właściciela: „ładne animacje i hovery, można GSAP”)

- **Wejście hero i nagłówków podstron = CSS** (`.anim-rise`, `.anim-drop`, `.anim-pop`, `.anim-draw`,
  opóźnienie przez `style={{"--d": "120ms"}}`). Startują od pierwszej klatki, nie czekają na JS.
  Akapit hero jest elementem LCP: animuj go tylko `transform` (`.anim-rise-soft`), nigdy `opacity`.
- **Przewijanie = GSAP** w `components/Motion.tsx`, sterowane atrybutami:
  `data-reveal` (blok), `data-reveal-stagger` (dzieci kaskadowo), `data-count` (licznik; obok musi być
  `sr-only` z wartością), `data-parallax="0.1"` (na wrapperze, nie na elemencie z animacją CSS),
  `data-draw-line` (linia osi czasu). Efekt „magnetycznych” przycisków został usunięty na prośbę
  właściciela (dawał dwustopniowe, nierówne przesunięcie) — nie przywracać.
- GSAP ładuje się w `requestIdleCallback`; elementy już widoczne przy starcie nie są animowane.
- Ukrywanie przed pokazaniem **tylko `opacity`** (nigdy `visibility`/`autoAlpha`) — fokus klawiatury
  nie może trafić na niewidoczny element; `focusin` od razu pokazuje element.
- **Płynność hoverów:** w Tailwind 4 klasy `translate-*`, `rotate-*`, `scale-*` ustawiają OSOBNE właściwości
  CSS (`translate`, `rotate`, `scale`), a nie `transform`. Element, który się rusza na hover, musi mieć
  `transition-transform` (obejmuje wszystkie cztery) albo `transition-[...]` z `translate`/`rotate`/`scale`
  na liście. Domyślny czas przejść to 300 ms (`--default-transition-duration` w `@theme`); nie schodź poniżej.
- Hovery w CSS/Tailwind: uniesienie kart (`hover:-translate-y-1.5` + cień), zoom zdjęć w `overflow-hidden`,
  „prostowanie” polaroidów (`.hover-straighten`), obrót ikon, dzwoniąca słuchawka (`.ring-on-hover`),
  podkreślenie w nawigacji (`.nav-link`). Każdy hover ma odpowiednik dla `focus-visible`, gdy element jest linkiem.
- Bez animacji w pętli bez interakcji (WCAG 2.2.2) — łapki w `CtaBand` ruszają się tylko przy hoverze.
- `prefers-reduced-motion: reduce` wyłącza wszystko (globalna reguła CSS + wczesny `return` w `Motion`).

---

## 7. Strona główna — sekcje, treść, komponenty

Kolejność i `id` (nawigacja kotwicowa, `scroll-margin-top` pod sticky header):

### 0. SkipLink + Header
- `<a href="#main" class="sr-only focus:not-sr-only …">Przejdź do treści</a>` jako PIERWSZY element w `<body>`.
- `<header>` z `<nav aria-label="Menu główne">`: Logo, linki (`lib/site.ts → navItems`): O nas (/o-nas/),
  Jak pomagamy (/jak-pomagamy/), Historie (/#historie), Galeria (/galeria/), FAQ, Kontakt (bez „Jak pomóc” —
  tę rolę pełni przycisk „Wpłać"). Pełne menu od `xl` (1280 px), poniżej przycisk „Menu”. Bieżąca strona ma
  `aria-current="page"` i żółte podkreślenie. Cień nagłówka po przewinięciu (`html[data-scrolled]`).
- **Menu mobilne = off-canvas** (`MobileNav`): natywny modalny `<dialog>` wysuwany z prawej, 85% szerokości
  ekranu (max 28rem), tło przyciemnione i rozmyte (`.offcanvas::backdrop`), animacja przez `@starting-style`.
  Dialog daje pułapkę fokusu, Esc, zablokowane tło i powrót fokusu na przycisk. Zamyka się klikiem w tło,
  kliknięciem linku i po poszerzeniu okna ponad `xl`. Na dole: „Wpłać darowiznę”, telefon, social.
- **Slidery na telefonach** (`components/ui/MobileSlider.tsx`, decyzja właściciela: strona główna była
  za długa): poniżej 640 px karty „Co robimy” (`#help-cards`) i „Historie, które zmieniliśmy”
  (`#stories-list`) to poziomy slider na natywnym `scroll-snap` (klasa `.mobile-slider` w `globals.css`,
  karta = 84% szerokości, widać brzeg następnej). Pod spodem strzałki (`aria-disabled` na końcach),
  kropki i licznik „2 / 6” (`aria-live="polite"`); wrapper dostaje `role="region"` +
  `aria-roledescription="karuzela"` tylko na telefonie. Na telefonie historie pokazują wszystkie karty,
  a przycisk „Pokaż wszystkie” jest ukryty. Od 640 px ten sam `<ul>` jest zwykłą siatką.
  Bez bibliotek do karuzel i bez autoplay. Nowe listy kart na stronie głównej: ten sam komponent.
- **Przewijanie przy nawigacji** (`RouteScroll` + `data-scroll-behavior="smooth"` na `<html>`): nowa strona
  zawsze od góry (albo od kotwicy), wstecz/naprzód zostawione przeglądarce, link do bieżącej strony
  (np. logo na stronie głównej) płynnie przewija do góry. Bez tego atrybutu Next animuje skok na górę,
  a GSAP go przerywa — strona lądowała w przypadkowym miejscu.

### 1. `#hero` — Hero (tło plum-800 + łapki)
- Eyebrow (wstęga kremowa): „Fundacja Empatia na rzecz Zwierząt"
- **H1:** „Dla tych, którzy mają **tylko nas**” (żółte podkreślenie „tylko nas"). Jedyny H1 na stronie.
- Lead: „Ratujemy, leczymy i dokarmiamy bezdomne koty oraz inne zwierzęta, które nie mają
  nikogo. Działamy codziennie, z doświadczeniem i empatią — a Ty możesz działać z nami."
- CTA: „Wpłać darowiznę" (→ `#pomoc`), „Przekaż 1,5% podatku" (→ `#pomoc-15`).
- Pod CTA mini‑pasek 3 ikon: „Leczymy", „Sterylizujemy", „Szukamy domów".
- Prawa strona: 3 zdjęcia (kocięta w klatce, Adaś, dokarmianie zimą) — `priority` na pierwszym
  (LCP), `sizes` poprawne, `alt` opisowy.

### 2. `#liczby` — Pasek liczb (cream-100)
- 3-4 kafelki: liczba (Oswald, plum-600) + opis. Źródło: `content/home.json → stats[]`.
  Start: „ok. 30 — wysterylizowanych kotów", „544 — osób wspiera naszą zrzutkę", „12 — historii
  ze szczęśliwym zakończeniem na stronie" (liczba historii liczona z `content/stories`).
  Oznacz w JSON `"verified": false` tam, gdzie właścicielka musi potwierdzić.

### 3. `#o-nas` — Nasza historia (cream-50, zdjęcie Sylwii z psem z kolażu po lewej)
- H2: „Zaczęło się od jednej kociej mamy"
- Tekst: adaptacja opisu ze zrzutki (patrz sekcja 8). 3-4 akapity, pierwsze zdanie każdego
  akapitu niesie sedno (GEO). Cytat‑wyróżnik: „Ręce poranione, ale serce silne."
- Pod tekstem link „Zobacz naszą codzienność na TikToku" (zewnętrzny, z ikoną i `rel="noopener"`).

### 4. `#jak-pomagamy` — Co robimy (plum-100 tło, karty)
- H2: „Jak pomagamy"
- 6 kart (ikona lucide + tytuł + 2 zdania):
  1. Dokarmianie i budki — codzienne dojazdy, budki styropianowe ze słomą i kocami na zimę.
  2. Leczenie — koci katar, antybiotyki, diagnostyka, odrobaczanie, odpchlenie.
  3. Sterylizacja i kastracja — we współpracy z gminą; „leczyć, nie rozmnażać".
  4. Azyl tymczasowy — osobny budynek, gdzie chore koty zdrowieją, a kociaki oswajają się przed adopcją. „To nie schron, to przystanek do lepszego życia."
  5. Adopcje — oswojone kociaki trafiają do domów; dzikie wracają na miejsce bytowania pod opiekę.
  6. Inne zwierzęta — królik, szynszyla, ptaki, pies — pomagamy każdemu, kto trafi w nasze ręce.
- Pod kartami rząd okrągłych fotek „Komu pomagamy" (z kolażu).

### 5. `#historie` — Kiedyś / Teraz (cream-50)
- H2: „Historie, które zmieniliśmy" ; lead: „Każde z tych zwierząt miało imię, historię i
  drugą szansę."
- Grid kart `StoryCard`: dwa zdjęcia obok siebie (badge „KIEDYŚ" plum / „TERAZ" żółty, strzałka
  `aria-hidden`), imię (H3), jedno zdanie. Dane z `content/stories/*.md`. Pokaż 6, przycisk
  „Pokaż więcej" z `aria-expanded` (progresywne ujawnianie; bez JS renderuj od razu wszystkie
  karty — ukrywaj dopiero po hydracji).
- Treść startowa (z rollupu — przepisz 1:1 do plików, zdjęcia wytnij z rollupu w wysokiej
  rozdzielczości 3591×6917):
  - Hades — Kiedyś: wykarmiany mlekiem, w ciężkim stanie. Teraz: zdrowy, w domu.
  - Mordka — Kiedyś: wyłapany w ciężkim stanie, FeLV+. Teraz: pod opieką, bezpieczny.
  - Coco i Chanel — Kiedyś: wolnożyjące, bezdomne kotki. Teraz: razem w domu.
  - Brownie — Kiedyś: bezdomna, zapchlona, zarobaczona. Teraz: zdrowa, adoptowana.
  - Balbinka — Kiedyś: znaleziona w lesie, zarobaczona. Teraz: w domu.
  - Miki — Kiedyś: bezdomny, chory kociak. Teraz: zdrowy.
  - 5 Burasków — Kiedyś: bezdomne, schorowane. Teraz: wyleczone.
  - Krakers — Kiedyś: złapany na ruchliwej drodze. Teraz: bezpieczny.
  - Suzi — Kiedyś: znaleziona na parkingu pod autem. Teraz: w domu.
  - Biedroneczka — Kiedyś: wyłapana w sklepie Biedronka. Teraz: w domu.
  - Petunia — Kiedyś: znaleziona przy drodze, ciężko chora. Teraz: zdrowa.
  - Adaś — Kiedyś: znaleziony, bez oczka. Teraz: po leczeniu, szczęśliwy (zdjęcie `IMG_8680`).
  „Teraz" na rollupie jest puste (tylko zdjęcie) — powyższe dopowiedzenia są **do potwierdzenia**;
  w frontmatter daj `now: ""` tam, gdzie nie wiemy, i renderuj tylko zdjęcie.

### 6. `#pomoc` — Jak możesz pomóc (plum-800, łapki, kremowe karty)
- H2: „Jak możesz pomóc"; lead: „Sterylizacje mamy dzięki gminie za darmo. Cała reszta —
  leczenie, leki, karma, budki — to Wasze wpłaty."
- Karta **Darowizna** (`id="pomoc-wplata"`): numer konta w `CopyField` (przycisk „Kopiuj" z
  `aria-live` potwierdzeniem; bez JS pokazuje po prostu numer), odbiorca: Fundacja Empatia na
  rzecz Zwierząt, tytuł: „Darowizna". BLIK: 663 806 717 (przelew na telefon), tytuł „Darowizna".
  Link „Wpłać przez zrzutka.pl" (zewnętrzny).
- Karta **1,5% podatku** (`id="pomoc-15"`): KRS 0000270261 + cel szczegółowy
  „FUNDACJA EMPATIA NA RZECZ ZWIERZĄT 38275" (oba w `CopyField`) + jedno zdanie wyjaśnienia
  (sekcja 2). Przycisk żółty.
- Karta **Kup na stoisku**: zdjęcie breloków; „Kupując breloki, bransoletki i zapachy do auta na
  naszym stoisku, pomagasz ratować kolejne zwierzęta." (z rollupu + komentarze zrzutki). Link do
  IG/FB po terminy stoisk.
- Karta **Dom tymczasowy / wolontariat / adopcja**: „Napisz do nas" → `#kontakt`.
- Zasada: **żadnych formularzy płatności** na stronie; tylko dane i linki.

### 7. `#aktualnosci` — Aktualności (etap 3; w etapie 1 ukryta, komponent gotowy, czyta `content/news`)
- 3 najnowsze wpisy: data (`<time datetime>`), tytuł, zajawka, link. Jeśli brak wpisów —
  sekcja się nie renderuje.

### 8. `#faq` — Pytania i odpowiedzi (cream-50)
- H2: „Najczęstsze pytania". `<details>/<summary>` natywne (dostępne bez JS), każda odpowiedź
  1-3 zdania, zaczyna się od bezpośredniej odpowiedzi (GEO). Generuje `FAQPage` JSON-LD.
- Pytania startowe (`content/faq.json`):
  1. Czym zajmuje się Fundacja Empatia na rzecz Zwierząt?
  2. Jak przekazać darowiznę?
  3. Jak przekazać 1,5% podatku na Fundację Empatia?
  4. Na co idą pieniądze?
  5. Czy mogę adoptować kota?
  6. Znalazłem/am bezdomnego lub rannego kota — co robić?
  7. Czy mogę zostać domem tymczasowym lub wolontariuszem?
  8. Gdzie można kupić breloki i inne gadżety fundacji?

### 9. `#kontakt` — Kontakt (cream-100)
- H2: „Kontakt". Telefon jako `<a href="tel:+48724236270">724 236 270</a>`, e-mail (gdy znany),
  social: 3 linki z ikonami + widoczną nazwą (nie same ikony). Bez formularza (static, brak backendu)
  — ewentualnie `mailto:`.

### 10. Footer (plum-950)
- Kolumny: logo + hasło; Nawigacja; Wesprzyj nas (konto, BLIK, 1,5%); Kontakt i social. Dolna linia:
  „© {rok} Fundacja Empatia na rzecz Zwierząt” (+ KRS/NIP gdy znane), link „Polityka prywatności”,
  „Projekt i realizacja: CtrlZ Studio” (https://ctrlzstudio.pl/, nowa karta). Bez daty aktualizacji
  i bez deklaracji dostępności (decyzja właściciela).

### Podstrony z treścią (etap 1)
- `/o-nas/` (`content/about.json`): PageHero, historia Sylwii + cytat, oś czasu 5 kroków (linia rysuje się
  przy przewijaniu), wartości, przejrzystość (zapiski + link do faktur na zrzutce), plany, CtaBand. JSON-LD `AboutPage`.
- `/jak-pomagamy/` (`content/help.json`): PageHero, pasek skrótów do sekcji, 6 obszarów naprzemiennie
  (zdjęcie + lista), proces „krok po kroku” (JSON-LD `HowTo`), „Na co idą pieniądze”, CtaBand.
- `/galeria/` (`content/gallery.json`): filtry kategorii (`aria-pressed`, licznik w `role="status"`),
  siatka z wyróżnionymi kafelkami, lightbox na natywnym `<dialog>` (strzałki, Esc, swipe, powrót fokusu).
  Bez JS kafelek to link do dużego zdjęcia. JSON-LD `ImageGallery`.
- Strona główna linkuje do podstron: „Poznaj naszą historię”, karty „Jak pomagamy” → `/jak-pomagamy/#id`,
  „Galeria” przy historiach.
- **Przycisk „na górę”** (`ScrollToTop`): pojawia się po 600 px, pierścień postępu przewijania,
  `inert` gdy ukryty, po kliknięciu fokus wraca do nagłówka.
- **FAQ**: `<details name="faq">` — przeglądarka sama trzyma otwarte tylko jedno pytanie;
  płynne rozwijanie przez `::details-content` tam, gdzie jest wspierane.

### Podstrony prawne (etap 1, minimalne)
- `/polityka-prywatnosci/` — RODO: administrator, cel (kontakt, darowizny), Cloudflare (hosting,
  ewentualnie Web Analytics bez cookies), prawa osób. Treść szkicowa, oznaczona do weryfikacji.
- `404` — w brandzie, z linkiem do strony głównej.

---

## 8. Treści — zasady

- **Myślniki:** w treściach i interfejsie zwykły łącznik „-” (z odstępami: „tekst - tekst”), nigdy
  półpauza „–” (decyzja właściciela). `nbsp()` dokleja „ -” do poprzedniego słowa, żeby myślnik nie zaczynał linii.
- **Ton:** ciepły, konkretny, pierwsza osoba liczby mnogiej („pomagamy", „leczymy") z wplecioną
  osobistą historią Sylwii w pierwszej osobie w sekcji „O nas". Bez patosu, bez wykrzykników w
  nagłówkach, bez „🐾" emoji w treści (emoji ze zrzutki → ikony lub nic).
- **Adaptacja opisu ze zrzutki:** opis był pisany ZANIM powstała fundacja („Nie jestem fundacją,
  stowarzyszeniem czy schroniskiem. Działam indywidualnie…"). **Tego zdania nie przenosić.**
  Zastąp: „Przez lata działałam sama, potem z wolontariuszkami i stowarzyszeniem. Dziś działamy
  jako Fundacja Empatia na rzecz Zwierząt — nadal z tą samą przejrzystością: prowadzimy zapiski,
  kto został odrobaczony, wysterylizowany, kto poszedł do domu."
- Fakty ze zrzutki, które można użyć: ok. 30 sterylizacji; gmina finansuje sterylizację/kastrację;
  koszty własne: koci katar, antybiotyki, diagnostyka, leki, środki na pasożyty; azyl w osobnym
  budynku; budki styropianowe; plan zakupu lepszej klatki‑łapki; wolontariusze pomagają przy
  wyłapywaniu; TikTok jako dziennik.
- Imiona kotów z zrzutki: Venus, Monte, Pysiulka (z komentarzy), Ptyś.
- Każdy tekst w `content/`, nie w komponentach. Komponenty nie mają hardcodowanych polskich zdań
  poza etykietami UI (te w `content/ui.json` albo stałych w `lib/ui-strings.ts`).
- Alt teksty: opisowe i konkretne („Czarno‑biały kociak Adaś z zabliźnionym lewym oczkiem patrzy
  w górę"), nie „zdjęcie kota". Obrazy dekoracyjne: `alt=""`.

---

## 9. Model treści (gotowy pod Sveltia CMS)

`content/settings.json`
```json
{
  "name": "Fundacja Empatia na rzecz Zwierząt",
  "brand": "Empatia na dłoni",
  "tagline": "Dla tych, którzy mają tylko nas",
  "siteUrl": "https://empatianadloni.pl",
  "phone": "724 236 270",
  "email": "",
  "address": { "street": "", "postalCode": "", "city": "", "region": "" },
  "krs": "", "nip": "", "regon": "",
  "donation": {
    "bankAccount": "91 1020 2892 0000 5202 1039 7216",
    "bankAccountOwner": "Fundacja Empatia na rzecz Zwierząt",
    "transferTitle": "Darowizna",
    "blikPhone": "663 806 717",
    "zrzutkaUrl": "https://zrzutka.pl/xg7gtb",
    "taxKrs": "0000270261",
    "taxPurpose": "FUNDACJA EMPATIA NA RZECZ ZWIERZĄT 38275",
    "taxUmbrellaOrg": "Fundacja Studencka „Młodzi-Młodym”"
  },
  "social": {
    "facebook": "https://www.facebook.com/share/18htfEvXte/",
    "instagram": "https://www.instagram.com/empatia.na.dloni",
    "tiktok": "https://www.tiktok.com/@empatianadloni"
  },
  "seo": {
    "defaultTitle": "Fundacja Empatia na rzecz Zwierząt — pomoc bezdomnym kotom",
    "defaultDescription": "…",
    "ogImage": "/images/og-default.png"
  }
}
```

Obrazy w treściach wskazujemy **nazwą z `public/images/manifest.json`** (np. `story-adas-before`,
`help-feeding`). Nieznana nazwa wywala build. Ścieżka zaczynająca się od `/` (np. upload z CMS
`/images/uploads/x.jpg`) jest renderowana jako zwykły `<img>` bez `srcset`. Ikony w JSON: tylko nazwy z `lib/icons.ts`.

`content/stories/<slug>.md`
```md
---
name: "Adaś"
before: "Znaleziony, bez oczka."
now: ""                      # puste = pokazujemy tylko zdjęcie „teraz”
imageBefore: "story-adas-before"
imageAfter: "story-adas-after"
altBefore: "Biało-czarny kociak w kołnierzu ochronnym po operacji oka"
altAfter: "Adaś leży na plecach i bawi się na dywanie"
order: 12
---
(opcjonalny dłuższy opis — Markdown)
```

`content/news/<yyyy-mm-dd>-<slug>.md`
```md
---
title: "Nadrabiam faktury"
date: 2026-11-03
excerpt: "…"
image: "/images/news/….webp"
draft: false
---
treść
```

Loadery w `lib/content.ts` z typami i walidacją (ręczną, bez zod — mniej zależności; jeśli
walidacja urośnie, dodaj `zod`). Build ma **failować** przy brakującym wymaganym polu.

---

## 10. SEO + GEO (Generative Engine Optimization)

**Metadane (`app/layout.tsx` + `lib/seo.ts`):**
- `metadataBase = new URL(settings.siteUrl)`; `title` template `%s | Fundacja Empatia na rzecz Zwierząt`;
  strona główna: tytuł ≤ 60 znaków, description 140-160 znaków z frazami: „fundacja dla
  zwierząt", „bezdomne koty", „pomoc kotom", „1,5% podatku zwierzęta", „darowizna", + nazwa
  miejscowości/gminy gdy znana.
- `alternates.canonical`, `openGraph` (type website, locale `pl_PL`, image 1200×630),
  `twitter.card = summary_large_image`, `robots: index, follow`, `themeColor` (plum-800).
- Ikony: `app/icon.png` (512), `app/apple-icon.png` (180), `favicon.ico`, `manifest.ts`.

**Structured data (JSON-LD w `<script type="application/ld+json">`, generowane z `settings`):**
- `Organization` z `@type: ["Organization","NGO"]`: name, alternateName „Empatia na dłoni", url,
  logo, sameAs (FB, IG, TikTok, zrzutka), telephone, address (gdy znany), `nonprofitStatus`
  (gdy znany status OPP — raczej nie; pomiń jeśli niepewne), `foundingDate` (do ustalenia).
- `WebSite` (name, url, inLanguage „pl-PL").
- `FAQPage` z `content/faq.json`.
- `BreadcrumbList` na podstronach. `Article`/`NewsArticle` dla aktualności (etap 3).
- Historie: `ItemList` z `name` — opcjonalnie; nie przesadzać.

**Techniczne:**
- `app/sitemap.ts` i `app/robots.ts` z `export const dynamic = "force-static"`; robots
  `Disallow: /admin/`; `Sitemap:` z pełnym URL.
- `trailingSlash: true` → spójne URL‑e. Brak duplikatów `http/https`, `www` — ustawić redirect
  w Cloudflare po deployu (zanotuj w README).
- `public/_headers`:
  ```
  /*
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  /_next/static/*
    Cache-Control: public, max-age=31536000, immutable
  /images/*
    Cache-Control: public, max-age=31536000, immutable
  /admin/*
    X-Robots-Tag: noindex
  ```
  (Przy etapie 3 CSP trzeba rozszerzyć o `unpkg.com` i `api.github.com` TYLKO dla `/admin/*`.)
- Semantyka: jeden `<h1>`, nagłówki bez przeskoków poziomów, `<main id="main">`, `<section
  aria-labelledby>` dla każdej sekcji, `<address>` w kontakcie, `<time>` przy datach.
- Linki zewnętrzne: `rel="noopener"`, bez `nofollow` dla własnych social.

**GEO (cytowalność przez AI Overviews / ChatGPT / Perplexity):**
- Pierwszy akapit po H1 i pierwszy akapit każdej sekcji = samodzielna, pełna odpowiedź
  („Fundacja Empatia na rzecz Zwierząt to fundacja z [miejscowość], która ratuje, leczy i
  sterylizuje bezdomne koty oraz pomaga innym zwierzętom…"). Nazwa własna pełna, nie zaimki.
- Spójne encje: ta sama nazwa fundacji, ten sam numer telefonu i konto wszędzie (strona, stopka,
  JSON-LD, FAQ, llms.txt).
- FAQ z bezpośrednimi odpowiedziami; liczby z datą („stan na listopad 2026").
- `public/llms.txt`: 20-40 linii — kim jesteśmy, co robimy, jak pomóc (konto, KRS + cel
  szczegółowy), kontakt, linki. Generuj z `settings` skryptem lub trzymaj ręcznie, ale spójnie.
- `robots.ts` nie blokuje botów AI (GPTBot, ClaudeBot, PerplexityBot) — chcemy być cytowani.
- Data aktualizacji tylko w JSON-LD (`dateModified` w WebPage) z czasu builda — nie w stopce.

---

## 11. WCAG 2.1 AA — checklista (obowiązkowa przed „done")

**Struktura i nawigacja**
- [ ] `lang="pl"`, tytuł strony unikalny, skip link działa i jest widoczny po fokusie.
- [ ] Landmarki: `header`, `nav[aria-label]`, `main`, `footer`; sekcje z `aria-labelledby`.
- [ ] Kolejność nagłówków logiczna (H1 → H2 → H3). Nagłówki nie są pustymi „ozdobami".
- [ ] Cała strona obsługiwalna klawiaturą: Tab/Shift+Tab, Enter/Space, Esc zamyka menu mobilne.
      Kolejność fokusa = kolejność wizualna. Brak pułapek.
- [ ] Fokus widoczny ZAWSZE: `:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px }`.
      Nigdy `outline: none` bez zamiennika.

**Treść**
- [ ] Kontrast tekstu ≥ 4.5:1 (duży ≥ 3:1), elementów UI/ikon ≥ 3:1 — tylko pary z sekcji 5.1.
- [ ] Informacja nie jest przekazywana samym kolorem (badge „KIEDYŚ/TERAZ" ma tekst, linki w
      tekście są podkreślone).
- [ ] Obrazy: sensowny `alt` lub `alt=""` dla dekoracji; ikony `aria-hidden="true"`; SVG
      informacyjne z `<title>` i `role="img"`.
- [ ] Tekst skaluje się do 200% bez utraty treści; brak poziomego scrolla na 320 px (reflow 1.4.10).
- [ ] Odstępy tekstu (1.4.12) — nie ustawiaj `max-height` na kontenerach tekstu.
- [ ] Linki mają zrozumiałą treść poza kontekstem („Wpłać przez zrzutka.pl", nie „kliknij tutaj").
- [ ] **Linki do innych stron otwierają się w nowej karcie** (decyzja właściciela): zawsze przez
      `ExternalLink` albo `<ButtonLink external>` — dodają `target="_blank" rel="noopener"` i `sr-only`
      „(otwiera się w nowej karcie)”. Linki wewnętrzne (podstrony, kotwice) zostają w tej samej karcie.
- [ ] Cele dotykowe ≥ 44×44 px (2.5.5 to AAA, ale stosujemy); odstępy między przyciskami ≥ 8 px.

**Interakcje**
- [ ] `prefers-reduced-motion: reduce` wyłącza animacje wejścia i smooth scroll.
- [ ] Przycisk „Kopiuj": po kliknięciu komunikat w regionie `aria-live="polite"` („Skopiowano numer konta").
- [ ] Menu mobilne: `aria-expanded`, `aria-controls`, etykieta „Otwórz menu"/„Zamknij menu".
- [ ] `<details>` FAQ działa bez JS; `summary` ma widoczny fokus.
- [ ] Brak treści migającej, brak autoplay.

**Weryfikacja (uruchom i wklej wynik w odpowiedzi do właściciela):**
- `npm run test:a11y` — Playwright + axe, 0 naruszeń `serious`/`critical`.
- `npm run lint` — `jsx-a11y` bez błędów.
- Lighthouse (Chrome DevTools lub `npx unlighthouse --site http://localhost:3000`): Accessibility
  100, SEO 100, Performance ≥ 95 mobile, Best Practices 100.
- Ręcznie: przejście całej strony klawiaturą; VoiceOver (macOS: Cmd+F5) przez hero, nav, FAQ, kopiowanie.

---

## 12. Wydajność

- LCP = pierwsze zdjęcie hero: `priority`, `fetchPriority="high"`, WebP ≤ 120 KB, `sizes`
  dopasowane. Wszystkie inne obrazy `loading="lazy"` + `width/height` (CLS 0).
- Obrazy: skrypt `scripts/optimize-images.mjs` (sharp) generuje dla każdego źródła szerokości
  `480, 768, 1200, 1600` w WebP (jakość 78) + `blurDataURL` (10 px) zapisane do
  `public/images/manifest.json`; komponent `Picture` czyta manifest i buduje `srcSet`.
  Rollup/kolaż tnij na kafelki PRZED optymalizacją (osobne pliki w `source-images/cut/`).
- Fonty: tylko potrzebne wagi (Oswald 500/700, Nunito 400/700), `latin` + `latin-ext`.
- JS: strona jest w 95% Server Components; klient tylko: menu mobilne, CopyField, „Pokaż więcej",
  fade-up observer. Każdy `"use client"` uzasadnij komentarzem.
- Brak zewnętrznych requestów poza własną domeną (sprawdź w DevTools → Network).
- Cel: strona główna < 300 KB transferu bez obrazów, < 1.2 MB z obrazami (mobile).

---

## 13. Sveltia CMS — plan (etap 3, NIE wdrażać w etapie 1)

1. `public/admin/index.html`:
   ```html
   <!DOCTYPE html>
   <html lang="pl">
     <head>
       <meta charset="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <meta name="robots" content="noindex" />
       <title>Panel treści — Fundacja Empatia</title>
     </head>
     <body>
       <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
     </body>
   </html>
   ```
   (Bez `type="module"`, bez własnego CSS — tak zaleca dokumentacja Sveltia.)
2. `public/admin/config.yml`:
   ```yaml
   backend:
     name: github
     repo: <owner>/<repo>
     branch: main
     base_url: https://sveltia-cms-auth.<subdomena>.workers.dev
   site_url: https://<domena>
   locale: pl
   media_folder: public/images/uploads
   public_folder: /images/uploads
   collections:
     - name: settings
       label: Ustawienia
       files:
         - { name: settings, label: Dane fundacji, file: content/settings.json, fields: [...] }
         - { name: home, label: Strona główna, file: content/home.json, fields: [...] }
         - { name: faq, label: FAQ, file: content/faq.json, fields: [...] }
         - { name: about, label: O nas, file: content/about.json, fields: [...] }
         - { name: help, label: Jak pomagamy, file: content/help.json, fields: [...] }
         - { name: gallery, label: Galeria, file: content/gallery.json, fields: [...] }   # obrazy: nazwy z manifestu albo uploady
     - name: stories
       label: Historie zwierząt
       folder: content/stories
       create: true
       slug: "{{slug}}"
       fields: [name, before, now, imageBefore, imageAfter, date, featured, order, body]
     - name: news
       label: Aktualności
       folder: content/news
       create: true
       slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
       fields: [title, date, excerpt, image, draft, body]
   ```
3. Autoryzacja: wdrożyć `sveltia/sveltia-cms-auth` na Cloudflare Workers (przycisk „Deploy to
   Cloudflare Workers" lub `wrangler deploy`), w GitHub utworzyć OAuth App z callback
   `<WORKER_URL>/callback`, w Workerze ustawić `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
   (encrypted), `ALLOWED_DOMAINS=<domena>`. Właścicielka loguje się kontem GitHub z dostępem do repo.
4. Lokalnie Sveltia obsługuje „local repository workflow" przez File System Access API w
   Chrome/Edge — bez proxy. Testować na `npm run dev` → `http://localhost:3000/admin/`.
5. Obrazy wrzucane przez CMS trafiają do `public/images/uploads` bez optymalizacji — komponent
   `Picture` musi obsłużyć też „surowe" ścieżki (fallback na zwykły `<img>` z `loading="lazy"`).
   Opcjonalnie: GitHub Action, która po pushu uruchamia `optimize-images` na uploadach.
6. Każdy zapis w CMS = commit → Cloudflare Pages buduje automatycznie (1-2 min).
7. Rozszerzyć CSP tylko dla `/admin/*` (unpkg.com, api.github.com, github.com, worker URL).

Sveltia jest w becie (przed 1.0) — pinuj wersję w URL dopiero, gdy coś się zepsuje; domyślnie
dokumentacja zaleca URL bez wersji.

---

## 14. Cloudflare Pages — deploy (etap 2)

1. Repo na GitHub (prywatne lub publiczne), branch `main`.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Import Git repository.
3. Preset: **Next.js (Static HTML Export)**. Build command: `npm run build`. Output: `out`.
   Env: `NODE_VERSION=22`.
4. Po deployu: domena własna (CNAME), wymuszenie HTTPS, redirect `www` → bez `www` (lub odwrotnie,
   spójnie z `siteUrl`), włączyć „Always Use HTTPS".
5. Sprawdzić `_headers` (curl -I), `robots.txt`, `sitemap.xml`, OG w debuggerze FB/LinkedIn.
6. Opcjonalnie Cloudflare Web Analytics (beacon bez cookies) — wymaga dodania `static.cloudflareinsights.com`
   do CSP `script-src`/`connect-src`; dopiero po decyzji właścicielki.

Uwaga: Cloudflare promuje teraz „Workers Static Assets" zamiast Pages. Pages nadal działa i jest
darmowy; static export działa w obu. Trzymamy się Pages (decyzja właściciela), migracja na Workers
= ten sam `out/` + `wrangler.toml` z `[assets] directory = "./out"`.

---

## 15. Komendy i workflow

```bash
npm install
npm run dev            # http://localhost:3000
npm run images         # scripts/optimize-images.mjs (po dodaniu zdjęć do source-images/ i wpisu w IMAGES)
npm run brand          # favicony, ikony, obraz OG z logo
npm run fonts          # podzbiory fontów (po zmianie zestawu znaków)
npm run lint
npm run typecheck      # tsc --noEmit
npm run build          # next build → out/
npm run preview        # serve out na :4173 (test static exportu — ZAWSZE przed oddaniem)
npm run test:a11y      # Playwright (lokalny Chrome) + axe na wszystkich stronach; sam startuje serwer na out/
```

**Workflow każdej zmiany:**
1. Przeczytaj CLAUDE.md. Sprawdź `content/` zanim dopiszesz tekst w komponencie.
2. Implementuj mobile‑first. Każdy nowy komponent: typy propsów, brak `any`, brak `!important`.
3. `npm run lint && npm run typecheck && npm run build` muszą przejść. Build static exportu to
   jedyny prawdziwy test — `next dev` toleruje rzeczy, których `export` nie zbuduje.
4. Otwórz stronę w przeglądarce (wbudowana przeglądarka Claude lub `preview_start`) na 375 px i
   1280 px, zrób zrzut, sprawdź konsolę (0 błędów, 0 ostrzeżeń hydration).
5. Uruchom `test:a11y`. Przejdź stronę klawiaturą.
6. W odpowiedzi do właściciela: co zrobione, co „DO USTALENIA", wyniki testów.

**Definicja „strona główna gotowa" (etap 1):**
- Wszystkie sekcje 0-10 z sekcji 7 (poza Aktualnościami) z prawdziwymi treściami i zdjęciami.
- Lighthouse mobile: A11y 100, SEO 100, Perf ≥ 95, BP 100. axe: 0 serious/critical.
- `npm run build` przechodzi, `out/` serwuje się poprawnie z `npx serve`.
- JSON-LD waliduje się w https://validator.schema.org (wklej zawartość ręcznie).
- Brak zewnętrznych requestów. Brak hardcodowanych danych fundacji poza `content/`.
- README.md opisuje uruchomienie, edycję treści i deploy.

---

## 16. Otwarte pytania do właścicielki (nie blokują etapu 1 — używaj placeholderów)

1. Własny numer KRS, NIP, REGON i adres siedziby fundacji (do stopki, JSON-LD, polityki prywatności).
2. Miejscowość / gmina, w której działacie (ważne dla SEO lokalnego: „pomoc kotom [miasto]").
3. Adres e-mail kontaktowy i docelowa domena strony.
4. Czy numer 724 236 270 ma być publiczny na stronie (jest w `tel:` linku, więc widoczny dla wszystkich)?
5. Zgoda fotografa na użycie zdjęcia ze znakiem „Foto Gabka" (lub czysta wersja bez znaku).
6. Potwierdzenie liczb: ok. 30 sterylizacji, liczba adopcji, od kiedy działacie (rok).
7. Dopowiedzenia „TERAZ" dla historii z rollupu (co się stało z każdym zwierzakiem).
8. Czy prowadzicie adopcje i dom tymczasowy formalnie (umowa adopcyjna)? To zmienia treść FAQ.
9. Gdzie i kiedy są stoiska z gadżetami (żeby sekcja „Kup na stoisku" miała konkret).
10. Konto GitHub właścicielki (do logowania w Sveltia w etapie 3).

---

## 17. Stan projektu (11.11.2026)

Zrobione (etap 1): strona główna, `/o-nas/`, `/jak-pomagamy/`, `/galeria/`, polityka prywatności
(wersja robocza), 404, sitemap, robots, manifest, `llms.txt`, OG/Twitter image, animacje GSAP + płynne
hovery, przycisk „na górę”, menu off-canvas, linki zewnętrzne w nowej karcie, FAQ „jedno naraz”,
przewijanie na górę przy zmianie strony, stopka z „Projekt i realizacja: CtrlZ Studio”.

Wyniki weryfikacji (build statyczny, `serve out`):

| Test | Wynik |
|---|---|
| Playwright + axe (5 stron × desktop/mobile + zachowania, nawigacja, menu, stopka, slidery) | 33/33 ✓, 0 naruszeń WCAG 2.1 A/AA |
| Lighthouse desktop `/` | 100 / 100 / 100 / 100 |
| Lighthouse mobile (wszystkie strony) | A11y 100, Best Practices 100, SEO 100, Performance 92-96, CLS 0 |

Performance mobile < 95 wynika z symulacji Lighthouse (Lantern), która dolicza do LCP cały runtime
React/Next pobierany równolegle. Pomiar w prawdziwym Chrome z dławieniem (wolne 4G + CPU 4×): LCP 0,79 s.
Dalsza poprawa wymagałaby mniejszego runtime JS (poza zakresem Next.js).

Treści podstron O nas / Jak pomagamy (oś czasu, wartości, plany, proces) są zredagowane na bazie zrzutki —
**do przeczytania i akceptacji przez właścicielkę**, tak samo jak dopowiedzenia w FAQ.

