import { expect, test } from "@playwright/test";

test("FAQ page has exactly 14 answers and links to Get Started", async ({ page }) => {
  await page.goto("faq");
  const items = page.getByTestId("faq").locator("details");
  await expect(items).toHaveCount(14);
  await items.nth(11).locator("summary").click();
  await page.getByTestId("faq").getByRole("link", { name: "Get Started page" }).click();
  await expect(page).toHaveURL(/get-started/);
});

test("Get Started page shows four steps and a working Discuss a Pilot link", async ({ page }) => {
  await page.goto("get-started");
  await expect(page.getByTestId("step")).toHaveCount(4);
  await expect(page.getByText("three stations", { exact: false }).first()).toBeVisible();
  await page.getByRole("link", { name: /Discuss a Pilot/ }).click();
  await expect(page).toHaveURL(/contact/);
});

test("landing links to the FAQ and Get Started pages", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("link", { name: "See all 14 questions" })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Get started" })).toBeVisible();
});
