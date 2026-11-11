import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/o-nas/", "/jak-pomagamy/", "/galeria/", "/polityka-prywatnosci/"];

test.use({ reducedMotion: "reduce" });

for (const path of pages) {
  test(`axe: no WCAG 2.1 A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
    expect(summary, summary.join("\n")).toEqual([]);
  });
}

test("one h1, lang=pl, landmarks present", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("main#main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
});

test("skip link is the first focusable element and moves focus to main", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow is checked on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Przejdź do treści" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("mobile off-canvas menu: opens as a dialog, traps focus, Escape closes and returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "menu button only exists on small screens");
  await page.goto("/");
  const button = page.getByRole("button", { name: "Menu", exact: true });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  const box = await menu.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.width).toBeGreaterThan(viewport.width * 0.8);
  expect(Math.round(box!.x + box!.width)).toBe(viewport.width);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(button).toBeFocused();
});

test("mobile menu link closes the menu and opens the page at the top", async ({ page, isMobile }) => {
  test.skip(!isMobile, "menu button only exists on small screens");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "O nas" }).click();
  await expect(page).toHaveURL(/\/o-nas\/$/);
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("navigating from the bottom of a page lands at the top of the next one", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.locator("header").getByRole("link", { name: "Jak pomagamy" }).click();
  await expect(page).toHaveURL(/\/jak-pomagamy\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  // logo from the bottom of a subpage goes to the top of the home page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.locator("header a[href='/']").click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  // logo on the home page itself scrolls back to the top
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.locator("header a[href='/']").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("footer credits CtrlZ Studio in a new tab", async ({ page }) => {
  await page.goto("/");
  const credit = page.locator("footer").getByRole("link", { name: /CtrlZ Studio/ });
  await expect(credit).toHaveAttribute("href", "https://ctrlzstudio.pl/");
  await expect(credit).toHaveAttribute("target", "_blank");
  await expect(page.locator("footer")).not.toContainText("Aktualizacja");
  await expect(page.locator("footer")).not.toContainText("Deklaracja");
});

test("no horizontal scroll at 320 px (reflow, WCAG 1.4.10)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("stories: 'show all' reveals hidden cards (tablet and desktop)", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones get a slider with every story instead");
  await page.goto("/");
  const cards = page.locator("#stories-list > li");
  const visibleBefore = await cards.evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== "none").length);
  expect(visibleBefore).toBe(6);
  const toggle = page.locator('button[aria-controls="stories-list"][aria-expanded]');
  await expect(toggle).toHaveAccessibleName(/Pokaż wszystkie historie/);
  await toggle.click();
  await expect(toggle).toHaveAccessibleName(/Pokaż mniej/);
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const visibleAfter = await cards.evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== "none").length);
  expect(visibleAfter).toBe(await cards.count());
  await expect(page.getByRole("button", { name: /Następna karta/ }).first()).toBeHidden();
});

for (const [list, label, total] of [
  ["help-cards", "obszary pomocy", 6],
  ["stories-list", "historie zwierząt", 12],
] as const) {
  test(`phone slider: ${list}`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "sliders exist only below 640 px");
    await page.goto("/");
    const ul = page.locator(`#${list}`);
    await expect(ul).toHaveCSS("display", "flex");
    await expect(ul).toHaveCSS("overflow-x", "auto");
    const visible = await ul.locator(":scope > li").evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== "none").length);
    expect(visible).toBe(total);
    const region = page.getByRole("region", { name: label.charAt(0).toUpperCase() + label.slice(1), exact: true });
    await expect(region).toBeVisible();
    await expect(region).toContainText(`1 / ${total}`);
    const next = region.getByRole("button", { name: `Następna karta: ${label}` });
    await next.scrollIntoViewIfNeeded();
    await next.click();
    await expect(region).toContainText(`2 / ${total}`);
    await expect.poll(() => ul.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
    await expect(region.getByRole("button", { name: `Poprzednia karta: ${label}` })).toHaveAttribute("aria-disabled", "false");
  });
}

test("no requests to third-party hosts", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (req) => {
    const url = new URL(req.url());
    if (url.hostname !== "localhost") external.push(req.url());
  });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForLoadState("networkidle");
  expect(external).toEqual([]);
});

test("external links open in a new tab and announce it", async ({ page }) => {
  await page.goto("/");
  const external = page.locator('a[href^="http"]');
  const count = await external.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const link = external.nth(i);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toContainText("otwiera się w nowej karcie");
  }
});

test("FAQ keeps only one answer open", async ({ page }) => {
  await page.goto("/");
  const summaries = page.locator("#faq summary");
  await summaries.nth(0).click();
  await summaries.nth(1).click();
  await expect(page.locator("#faq details[open]")).toHaveCount(1);
  await expect(page.locator("#faq details").nth(1)).toHaveAttribute("open", "");
});

test("gallery: filter and keyboard lightbox", async ({ page }) => {
  await page.goto("/galeria/");
  const tiles = page.locator("main ul li a[href*='/images/']");
  const all = await tiles.count();
  await page.getByRole("button", { name: "Inne zwierzęta" }).click();
  await expect(page.getByRole("button", { name: "Inne zwierzęta" })).toHaveAttribute("aria-pressed", "true");
  expect(await tiles.count()).toBeLessThan(all);
  await tiles.first().click();
  const dialog = page.getByRole("dialog", { name: "Podgląd zdjęcia" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Zamknij podgląd" })).toBeFocused();
  await expect(dialog).toContainText("1 /");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("2 /");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(tiles.first()).toBeFocused();
});

test("back-to-top button appears after scrolling and returns to the top", async ({ page }) => {
  await page.goto("/");
  const button = page.locator("button.scroll-top");
  await expect(button).toHaveAttribute("data-visible", "false");
  await expect(button).toHaveAttribute("inert", "");
  await page.evaluate(() => window.scrollTo(0, 2500));
  await expect(button).toHaveAttribute("data-visible", "true");
  await page.getByRole("button", { name: "Przewiń na górę strony" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});
