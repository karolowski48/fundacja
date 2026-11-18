// Behaviour added after the owner's change list (November 2026): stats, wording fixes, phone note,
// new pages (/nasza-ekipa/, /do-adopcji/, /linki/), partners, statute and the grouped desktop menu.
// Pages with sample data are checked by tests/fixtures.spec.ts (npm run test:fixtures).
import { expect, test, type Page } from "@playwright/test";

const fixtures = process.env.CONTENT_FIXTURES === "1";

test.use({ reducedMotion: "reduce" });

test.describe("home page content", () => {
  test("stats show the owner's numbers", async ({ page }) => {
    await page.goto("/");
    const stats = page.locator("section[aria-labelledby='stats-title'] dd .sr-only");
    await expect(stats).toHaveText(["174", "ok. 160", "ok. 120", "7 dni"]);
    await expect(page.locator("section[aria-labelledby='stats-title'] [data-count]")).toHaveCount(4);
    expect(await page.locator("[data-count]").evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.count))).toEqual(["174", "160", "120", "7"]);
    await expect(page.locator("main")).not.toContainText("544");
  });

  test("'who we help' says Gryzoniom, the other-animals card lists rodents", async ({ page }) => {
    await page.goto("/");
    const species = page.locator("#jak-pomagamy ul", { has: page.locator("img[alt='Szara szynszyla je siano z miski']") });
    await expect(species.locator("li").last()).toHaveText("Gryzoniom");
    await expect(page.locator("#jak-pomagamy")).not.toContainText("Szynszylom");
    await expect(page.locator("#help-cards")).toContainText("psom, ptakom, gryzoniom i królikom");
  });

  test("new quote with the founder's signature", async ({ page }) => {
    await page.goto("/");
    const quote = page.locator("#o-nas figure").filter({ has: page.locator("blockquote") });
    await expect(quote).toContainText("Zawsze chciałam zostać weterynarzem. Teraz już wiem, że nie muszę nim być, żeby ratować zwierzęta.");
    await expect(quote).toContainText("Sylwia Łętocha, założycielka fundacji");
    await page.goto("/o-nas/");
    await expect(page.locator("main blockquote")).toContainText("Zawsze chciałam zostać weterynarzem.");
  });

  test("donation card: transfer title 'Darowizna na cele statutowe' with a copy button", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const card = page.locator("#pomoc-wplata");
    await expect(card).toContainText("Wpisz tytuł „Darowizna na cele statutowe”");
    const title = card.locator("div", { has: page.locator("dt", { hasText: "Tytuł przelewu" }) });
    await expect(title.locator("dd")).toContainText("Darowizna na cele statutowe");
    await title.getByRole("button", { name: /Kopiuj tytuł przelewu/ }).click();
    await expect(title.getByRole("status")).toHaveText("Skopiowano tytuł przelewu do schowka.");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("Darowizna na cele statutowe");
    await expect(page.locator("footer")).toContainText("Darowizna na cele statutowe");
  });

  test("volunteer card mentions puppies and links to the new pages", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("article[aria-labelledby='pomoc-wolontariat-title']");
    await expect(card).toContainText("Szukamy domów tymczasowych dla psiaków i kociaków");
    await expect(card.getByRole("link", { name: "Zwierzęta do adopcji" })).toHaveAttribute("href", "/do-adopcji/");
    await expect(card.getByRole("link", { name: "Poznaj naszą ekipę" })).toHaveAttribute("href", "/nasza-ekipa/");
  });

  test("phone note sits right under the number in the contact section", async ({ page }) => {
    await page.goto("/");
    const note = page.locator("#kontakt [data-phone-note]");
    await expect(note).toHaveText(
      "Nie zawsze mamy możliwość przyjęcia kolejnego zwierzęcia, ale zawsze staram się w jakiś sposób pomóc, doradzić lub pokierować dalej.",
    );
    const phone = await page.locator("#kontakt a[href^='tel:']").first().boundingBox();
    const noteBox = await note.boundingBox();
    expect(noteBox!.y).toBeGreaterThan(phone!.y + phone!.height - 1);
  });

  test("FAQ: adoption answer covers dogs and links to the adoption page", async ({ page }) => {
    await page.goto("/");
    const item = page.locator("#faq details", { hasText: "Czy mogę adoptować kota lub psa?" });
    await item.locator("summary").click();
    await expect(item.getByRole("link", { name: "Zobacz zwierzęta do adopcji" })).toHaveAttribute("href", "/do-adopcji/");
  });

  test("partners: own page /partnerzy/ (and /o-nas/), no longer on the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#partnerzy")).toHaveCount(0);
    await page.goto("/partnerzy/");
    await expect(page.locator("h1")).toHaveText("Nasi partnerzy");
    for (const path of ["/partnerzy/", "/o-nas/"]) {
      if (path !== "/partnerzy/") await page.goto(path);
      const section = page.locator("#partnerzy");
      const link = section.getByRole("link", { name: /CtrlZ Studio/ });
      await expect(link).toHaveAttribute("href", "https://ctrlzstudio.pl/");
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });

  test("statute link is hidden while settings.documents.statutePdf is empty", async ({ page }) => {
    test.skip(fixtures, "the fixture build sets a sample statute");
    await page.goto("/");
    await expect(page.locator("footer")).not.toContainText("Statut");
  });
});

test.describe("stat counters", () => {
  test.use({ reducedMotion: "no-preference" });

  test("count up to 174, ok. 160, ok. 120 and 7 dni", async ({ page }) => {
    await page.goto("/");
    // GSAP starts on idle; the counters must be below the fold at that moment to animate
    await page.waitForFunction(() => document.querySelector("[data-count]") !== null);
    await page.waitForTimeout(1200);
    await page.locator("section[aria-labelledby='stats-title']").scrollIntoViewIfNeeded();
    const counters = page.locator("section[aria-labelledby='stats-title'] [data-count]");
    await expect(counters).toHaveText(["174", "ok. 160", "ok. 120", "7 dni"], { timeout: 6000 });
  });
});

test.describe("navigation", () => {
  async function headerBoxes(page: Page) {
    const header = page.locator("header");
    return {
      logo: (await header.locator("a[href='/']").boundingBox())!,
      nav: (await header.getByRole("navigation", { name: "Menu główne" }).boundingBox())!,
      donate: (await header.getByRole("link", { name: "Wpłać", exact: true }).boundingBox())!,
    };
  }

  for (const width of [1280, 1440]) {
    test(`desktop menu fits on one line at ${width} px`, async ({ page, isMobile }) => {
      test.skip(isMobile, "desktop menu");
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const { logo, nav, donate } = await headerBoxes(page);
      expect(nav.height).toBeLessThanOrEqual(48);
      expect(nav.x).toBeGreaterThanOrEqual(logo.x + logo.width);
      expect(nav.x + nav.width).toBeLessThanOrEqual(donate.x);
      // the off-canvas dialog has its own (hidden) "Menu główne" nav - only count the desktop bar
      const items = page.locator("header > div > nav[aria-label='Menu główne'] > ul > li");
      await expect(items).toHaveCount(6);
      const tops = await items.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
      expect(new Set(tops).size).toBe(1);
    });
  }

  test("'O fundacji' opens on hover and stays open while the pointer is over it", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop menu");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const nav = page.locator("header").getByRole("navigation", { name: "Menu główne" });
    const button = nav.getByRole("button", { name: "O fundacji" });
    await button.hover();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await nav.getByRole("link", { name: "Partnerzy", exact: true }).hover();
    await page.waitForTimeout(400);
    await expect(button).toHaveAttribute("aria-expanded", "true");
    // a click while hovering keeps it open
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await page.mouse.move(640, 600);
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Partnerzy", exact: true })).toBeHidden();
  });

  test("'O fundacji' dropdown: mouse, keyboard, Escape", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop menu");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const nav = page.locator("header").getByRole("navigation", { name: "Menu główne" });
    const button = nav.getByRole("button", { name: "O fundacji" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Nasza ekipa" })).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    for (const name of ["O nas", "Nasza ekipa", "Partnerzy"]) await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();

    // keyboard: ArrowDown opens and moves into the list, Tab past the last link closes it
    await page.keyboard.press("ArrowDown");
    await expect(nav.getByRole("link", { name: "O nas", exact: true })).toBeFocused();
    await page.keyboard.press("End");
    await expect(nav.getByRole("link", { name: "Partnerzy", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Jak pomagamy" })).toBeFocused();

    // click outside closes; a link navigates and marks the group as current
    await button.click();
    await page.locator("main").click({ position: { x: 5, y: 400 } });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await nav.getByRole("link", { name: "Nasza ekipa" }).click();
    await expect(page).toHaveURL(/\/nasza-ekipa\/$/);
    await expect(button).toHaveAttribute("data-current", "true");
    await expect(nav.getByRole("link", { name: "Do adopcji" })).toHaveAttribute("href", "/do-adopcji/");
  });

  test("mobile off-canvas menu lists every page", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu button only exists on small screens");
    await page.goto("/");
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    const links = page.getByRole("dialog", { name: "Menu" }).getByRole("navigation").getByRole("link");
    await expect(links).toHaveText(["O nas", "Nasza ekipa", "Partnerzy", "Jak pomagamy", "Do adopcji", "Historie", "Galeria", "Kontakt"]);
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Do adopcji" }).click();
    await expect(page).toHaveURL(/\/do-adopcji\/$/);
  });

  test("footer links to every page and to /linki/ (not in the main menu)", async ({ page }) => {
    await page.goto("/");
    const footerNav = page.locator("footer nav");
    await expect(footerNav.getByRole("link", { name: "Wszystkie linki" })).toHaveAttribute("href", "/linki/");
    await expect(footerNav.getByRole("link", { name: "Do adopcji" })).toHaveAttribute("href", "/do-adopcji/");
    await expect(footerNav.getByRole("link", { name: "Nasza ekipa" })).toHaveAttribute("href", "/nasza-ekipa/");
    await expect(page.locator("header a[href='/linki/']")).toHaveCount(0);
  });

  test("menu: FAQ is not in the navigation, Galeria is a top-level item", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop menu");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const top = page.locator("header > div > nav[aria-label='Menu główne'] > ul > li > a, header > div > nav[aria-label='Menu główne'] > ul > li > div > button");
    await expect(top).toHaveText(["O fundacji", "Jak pomagamy", "Do adopcji", "Historie", "Galeria", "Kontakt"]);
    await expect(page.locator("header a[href='/#faq'], footer nav a[href='/#faq']")).toHaveCount(0);
    await expect(page.locator("#faq")).toHaveCount(1); // the section itself stays on the home page
  });

  test("sitemap lists the new pages", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    const xml = await res.text();
    for (const path of ["/do-adopcji/", "/nasza-ekipa/", "/partnerzy/", "/linki/"]) expect(xml).toContain(`${path}</loc>`);
  });
});

test.describe("/linki/ (QR code page)", () => {
  test("minimal layout: no site header or menu, logo and name on top", async ({ page }) => {
    await page.goto("/linki/");
    await expect(page.locator("header")).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Menu główne" })).toHaveCount(0);
    await expect(page.locator("h1")).toHaveText("Fundacja Empatia na rzecz Zwierząt");
    await expect(page.locator("main#main")).toHaveCount(1);
  });

  test("links in the owner's order; external ones open a new tab; no empty href", async ({ page }) => {
    await page.goto("/linki/");
    const main = page.locator("nav[aria-label='Najważniejsze linki'] > ul > li");
    await expect(main).toHaveCount(5);
    const labels = await main.locator("[data-link-label]").allTextContents();
    expect(labels).toEqual(["Facebook", "Instagram", "Zrzutka fundacji", "Wirtualna adopcja", "Zostań wolontariuszem"]);

    const anchors = page.locator("a");
    const count = await anchors.count();
    for (let i = 0; i < count; i++) {
      const href = await anchors.nth(i).getAttribute("href");
      expect(href, `link #${i} has an empty href`).toBeTruthy();
      expect(href).not.toBe("#");
    }
    const external = page.locator('a[href^="http"]');
    expect(await external.count()).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < (await external.count()); i++) {
      await expect(external.nth(i)).toHaveAttribute("target", "_blank");
      await expect(external.nth(i)).toContainText("otwiera się w nowej karcie");
    }
    await expect(page.getByRole("link", { name: /Strona fundacji/ })).toHaveAttribute("href", "/");
    await expect(page.getByRole("link", { name: /TikTok/ })).toHaveAttribute("href", "https://www.tiktok.com/@empatianadloni");
  });

  test("positions without a URL show as 'Wkrótce', never as a dead link", async ({ page }) => {
    test.skip(fixtures, "the fixture build has a volunteer form URL");
    await page.goto("/linki/");
    for (const label of ["Wirtualna adopcja", "Zostań wolontariuszem"]) {
      const item = page.locator("nav[aria-label='Najważniejsze linki'] li", { hasText: label });
      await expect(item).toContainText("Wkrótce");
      await expect(item.locator("a")).toHaveCount(0);
    }
  });

  test("quick donation data and the phone with the owner's note", async ({ page }) => {
    await page.goto("/linki/");
    const donate = page.locator("section[aria-labelledby='links-donate-title']");
    await expect(donate).toContainText("663 806 717");
    await expect(donate).toContainText("91 1020 2892 0000 5202 1039 7216");
    await expect(donate).toContainText("Darowizna na cele statutowe");
    await expect(donate.getByRole("button", { name: /Kopiuj/ })).toHaveCount(3);
    await expect(page.locator("a[href='tel:+48724236270']")).toBeVisible();
    await expect(page.locator("[data-phone-note]")).toContainText("Nie zawsze mamy możliwość przyjęcia kolejnego zwierzęcia");
  });

});

test("no horizontal scroll on any page at 320 and 375 px (reflow, WCAG 1.4.10)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone widths");
  const paths = ["/", "/o-nas/", "/jak-pomagamy/", "/galeria/", "/do-adopcji/", "/nasza-ekipa/", "/partnerzy/", "/linki/", "/polityka-prywatnosci/"];
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of paths) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} at ${width} px`).toBeLessThanOrEqual(0);
    }
  }
});

test.describe("empty states (until the owner sends photos and texts)", () => {
  test.skip(fixtures, "the fixture build fills these pages with sample data");

  test("/do-adopcji/: friendly empty state with social links, no filter", async ({ page }) => {
    await page.goto("/do-adopcji/");
    await expect(page.locator("h1")).toHaveText("Zwierzęta do adopcji");
    const empty = page.locator("[data-empty-state]");
    await expect(empty).toContainText("Wkrótce pokażemy tu zwierzaki szukające domu");
    await expect(empty.getByRole("link", { name: /Facebook/ })).toHaveAttribute("target", "_blank");
    await expect(empty.getByRole("link", { name: /Instagram/ })).toHaveAttribute("target", "_blank");
    await expect(page.getByRole("group", { name: "Pokaż zwierzęta" })).toHaveCount(0);
    await expect(page.locator("#jak-adoptowac")).toContainText("opowiemy o zwierzaku i ustalimy szczegóły");
    await expect(page.locator("#jak-adoptowac a[href^='tel:']")).toBeVisible();
  });

  test("/nasza-ekipa/: 'Wkrótce przedstawimy tu naszą ekipę', join button goes to contact", async ({ page }) => {
    await page.goto("/nasza-ekipa/");
    await expect(page.locator("h1")).toHaveText("Nasza Empatyczna Ekipa");
    await expect(page.locator("[data-empty-state]")).toContainText("Wkrótce przedstawimy tu naszą ekipę");
    await expect(page.locator("#kiermasze")).toHaveCount(0);
    const join = page.locator("#dolacz").getByRole("link", { name: "Zostań wolontariuszem" });
    await expect(join).toHaveAttribute("href", "/#kontakt");
    await expect(join).not.toHaveAttribute("target", "_blank");
  });
});
