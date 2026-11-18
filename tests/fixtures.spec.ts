// Filled-in layouts, checked against a build with the fictional sample data from tests/fixtures/.
// Run with `npm run test:fixtures` (builds with CONTENT_FIXTURES=1, tests, then rebuilds the real site).
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.skip(process.env.CONTENT_FIXTURES !== "1", "needs the fixture build: npm run test:fixtures");
test.use({ reducedMotion: "reduce" });

for (const path of ["/do-adopcji/", "/nasza-ekipa/", "/linki/"]) {
  test(`axe with sample data: ${path}`, async ({ page }) => {
    await page.goto(path);
    // open every disclosure so its content is checked too
    await page.locator("main details:not([open]) > summary").evaluateAll((els) => els.forEach((s) => (s.parentElement as HTMLDetailsElement).open = true));
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
    expect(summary, summary.join("\n")).toEqual([]);
  });
}

test("adoption: filter by species with a live count", async ({ page }) => {
  await page.goto("/do-adopcji/");
  const cards = page.locator(".adoption-list > li");
  const visible = () => cards.evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== "none").map((e) => e.id));
  const group = page.getByRole("group", { name: "Pokaż zwierzęta" });
  const status = page.locator("main [role='status']").first();

  // drafts and "_" files are not published
  await expect(cards).toHaveCount(3);
  await expect(page.locator("#szkic-testowy, #_wzor")).toHaveCount(0);
  await expect(group.getByRole("button", { name: "Wszystkie" })).toHaveAttribute("aria-pressed", "true");
  await expect(status).toHaveText("3 zwierzęta szukają domu");

  await group.getByRole("button", { name: "Koty" }).click();
  await expect(group.getByRole("button", { name: "Koty" })).toHaveAttribute("aria-pressed", "true");
  await expect(group.getByRole("button", { name: "Wszystkie" })).toHaveAttribute("aria-pressed", "false");
  await expect(status).toHaveText("2 koty szukają domu");
  expect(await visible()).toEqual(["kot-testowy-a", "kot-testowy-b"]);

  await group.getByRole("button", { name: "Psy" }).click();
  await expect(status).toHaveText("1 pies szuka domu");
  expect(await visible()).toEqual(["pies-testowy"]);

  await group.getByRole("button", { name: "Wszystkie" }).click();
  expect(await visible()).toHaveLength(3);
});

test("adoption card: facts, status badge, story and 'Chcę adoptować' contact", async ({ page }) => {
  await page.goto("/do-adopcji/#kot-testowy-a");
  const card = page.locator("#kot-testowy-a");
  await expect(card).toBeInViewport();
  await expect(card.getByRole("heading", { level: 3 })).toHaveText("Kot testowy A");
  await expect(card).toContainText("Kotka · ok. 2 lata");
  await expect(card).toContainText("Szuka domu");
  await expect(card.getByRole("list", { name: /Najważniejsze informacje/ }).getByRole("listitem")).toHaveCount(2);
  await expect(card).toContainText("Pierwszy akapit historii testowej");
  await expect(card.getByText("Drugi akapit historii testowej")).toBeHidden();
  await card.getByText("Czytaj całą historię").click();
  await expect(card.getByText("Drugi akapit historii testowej")).toBeVisible();

  await expect(card.getByRole("link", { name: /Zadzwoń/ })).toBeHidden();
  await card.locator("summary", { hasText: "Chcę adoptować" }).click();
  await expect(card.getByRole("link", { name: /Zadzwoń o Kot testowy A/ })).toHaveAttribute("href", "tel:+48724236270");
  await expect(card.getByRole("link", { name: /Facebook/ })).toHaveAttribute("target", "_blank");
  await expect(card.getByRole("link", { name: /Instagram/ })).toHaveAttribute("target", "_blank");

  await expect(page.locator("#kot-testowy-b")).toContainText("Zarezerwowany");
  // a single-paragraph story has no "read more"
  await expect(page.locator("#kot-testowy-b").getByText("Czytaj całą historię")).toHaveCount(0);
});

test("adoption: ItemList JSON-LD lists the animals", async ({ page }) => {
  await page.goto("/do-adopcji/");
  const blocks = await page.locator("script[type='application/ld+json']").allTextContents();
  const list = blocks.map((b) => JSON.parse(b)).find((d) => d["@type"] === "ItemList");
  expect(list.numberOfItems).toBe(3);
  expect(list.itemListElement[0].url).toMatch(/\/do-adopcji\/#kot-testowy-a$/);
});

test("team: member cards, fair photos in the lightbox, join button opens the form", async ({ page }) => {
  await page.goto("/nasza-ekipa/");
  await expect(page.locator("[data-empty-state]")).toHaveCount(0);
  const members = page.locator("#ekipa article");
  await expect(members).toHaveCount(3);
  await expect(members.first()).toContainText("Kiermasze");
  await expect(members.first().getByRole("heading", { level: 3 })).toHaveText("Osoba testowa A");

  const tiles = page.locator("#kiermasze a[href*='/images/']");
  await expect(tiles).toHaveCount(3);
  await expect(page.locator("#kiermasze").getByRole("group")).toHaveCount(0); // no filter bar
  await tiles.first().click();
  const dialog = page.getByRole("dialog", { name: "Podgląd zdjęcia" });
  await expect(dialog).toContainText("Kiermasz testowy 1");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  const join = page.locator("#dolacz").getByRole("link", { name: /Zostań wolontariuszem/ });
  await expect(join).toHaveAttribute("href", "https://example.com/formularz-testowy");
  await expect(join).toHaveAttribute("target", "_blank");
});

test("statute PDF appears in the footer, on /o-nas/ and on /linki/ once it is set", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer").getByRole("link", { name: /Statut fundacji \(PDF, 1 KB\)/ })).toHaveAttribute("target", "_blank");
  await page.goto("/o-nas/");
  await expect(page.locator("main").getByRole("link", { name: /Statut fundacji \(PDF/ })).toHaveAttribute("href", "/dokumenty/statut-testowy.pdf");
  await page.goto("/linki/");
  await expect(page.getByRole("link", { name: /Statut fundacji/ })).toHaveAttribute("target", "_blank");
});

test("/linki/: the volunteer form link becomes active once its URL is set", async ({ page }) => {
  await page.goto("/linki/");
  const item = page.locator("nav[aria-label='Najważniejsze linki'] li", { hasText: "Zostań wolontariuszem" });
  await expect(item).not.toContainText("Wkrótce");
  await expect(item.getByRole("link")).toHaveAttribute("href", "https://example.com/formularz-testowy");
});
