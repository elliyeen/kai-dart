import { expect, test } from "@playwright/test";

test("FAQ page has exactly 14 answers and links to Get Started", async ({ page }) => {
  await page.goto("faq");
  const items = page.getByTestId("faq").locator("details");
  await expect(items).toHaveCount(14);
  await items.nth(11).locator("summary").click();
  await page.getByTestId("faq").getByRole("link", { name: "Get Started page" }).click();
  await expect(page).toHaveURL(/get-started/);
});

test("Get Started page shows four steps", async ({ page }) => {
  await page.goto("get-started");
  await expect(page.getByTestId("step")).toHaveCount(4);
  await expect(page.getByText("three stations", { exact: false }).first()).toBeVisible();
});

test("landing links to the FAQ and Get Started pages", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("link", { name: "See all 14 questions" })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Get started" })).toBeVisible();
});

test("Checkout flow completes to an honest summary that is not marked as sent", async ({ page }) => {
  await page.goto("get-started");
  await page.getByRole("link", { name: "Start checkout" }).click();
  await expect(page).toHaveURL(/get-started\/checkout/);
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await page.getByLabel("Organization").fill("Sample Transit Agency");
  await page.getByLabel("Your name").fill("Sample Person");
  await page.getByLabel("Work email").fill("person@example.com");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("Park Lane")).toBeChecked();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Procurement or sign-off contact").fill("Sample Signer");
  await page.getByLabel("Their email").fill("signer@example.com");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Prepared with DART").first()).toBeVisible();
  await page.getByRole("button", { name: "Create summary" }).click();
  const done = page.getByTestId("checkout-done");
  await expect(done).toContainText("It has not been sent anywhere yet");
  await expect(done.getByRole("link", { name: "Open in email" })).toHaveAttribute("href", /^mailto:signer%40example\.com/);
});
