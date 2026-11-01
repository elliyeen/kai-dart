import { expect, test } from "@playwright/test";
import { noHorizontalOverflow } from "./helpers";

test("landing: no tournament content, CTAs reach the platform, tabs and accordion work", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Transit for Everyone");
  expect(await page.locator("body").innerText()).not.toMatch(/fifa|world cup|at&t stadium|arlington/i);
  await expect(page.getByTestId("hero-metric")).toHaveText("75");
  await page.getByRole("tab", { name: "Verify" }).click();
  await expect(page.getByRole("tab", { name: "Verify" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Verify" }).press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Coordinate" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Operations Layer" }).click();
  await expect(page.getByRole("button", { name: "Operations Layer" })).toHaveAttribute("aria-expanded", "true");
  await noHorizontalOverflow(page);
  await page.getByRole("link", { name: /Explore Station Intelligence/ }).first().click();
  await expect(page).toHaveURL(/\/stations\/?$/);
});

test("old World Cup route is gone", async ({ request }) => {
  expect((await request.get("world-cup-2026")).status()).toBe(404);
});
