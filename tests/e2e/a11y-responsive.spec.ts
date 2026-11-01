import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { noHorizontalOverflow } from "./helpers";

const PAGES = ["", "stations", "stations/akard", "stations/inspections", "stations/assets", "stations/readiness", "stations/report", "stations/issues", "stations/checklist", "stations/intelligence", "stations/inventory", "stations/audit", "stations/loop", "stations/scenarios", "stations/convention-blue", "contact"];

for (const path of PAGES) {
  test(`axe WCAG 2.x A/AA: /${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(r.violations.map((v) => `${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`)).toEqual([]);
  });
  test(`no horizontal overflow: /${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await noHorizontalOverflow(page);
  });
}

test("mobile bottom navigation reaches Inspections and back", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 1024, "bottom nav is below 1024px");
  await page.goto("stations");
  const nav = page.getByRole("navigation", { name: "Primary mobile" });
  await nav.getByRole("link", { name: "Inspections", exact: true }).click();
  await expect(page).toHaveURL(/stations\/inspections/);
  await nav.getByRole("link", { name: "Stations", exact: true }).click();
  await expect(page).toHaveURL(/stations\/?$/);
});

test("touch targets are at least 44px on interactive controls", async ({ page }) => {
  await page.goto("stations");
  const small = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("main button, main a, main input, header button, header select, header a")]
    .filter((e) => e.offsetParent && !e.classList.contains("sr-only")).map((e) => ({ t: (e.textContent || e.getAttribute("aria-label") || e.tagName).trim().slice(0, 25), w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height }))
    .filter((r) => r.h < 43.5 || r.w < 43.5));
  expect(small).toEqual([]);
});
