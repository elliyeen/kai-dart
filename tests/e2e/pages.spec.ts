import { expect, test } from "@playwright/test";

test("FAQ page has exactly 14 answers and links to Get Started", async ({ page }) => {
  await page.goto("faq");
  const items = page.getByTestId("faq").locator("details");
  await expect(items).toHaveCount(14);
  await items.nth(11).locator("summary").click();
  await page.getByTestId("faq").getByRole("link", { name: "Get Started page" }).click();
  await expect(page).toHaveURL(/get-started/);
});

test("Get Started page: hero, four steps, proposed terms, and a path to checkout", async ({ page }) => {
  await page.goto("get-started");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A more intelligent transit network.");
  await expect(page.getByTestId("step")).toHaveCount(4);
  await expect(page.getByTestId("deployment-summary")).toContainText("not terms approved by DART");
  await page.getByRole("link", { name: "Configure your proposal" }).click();
  await expect(page).toHaveURL(/checkout/);
});

test("landing links to the FAQ and Get Started pages", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("link", { name: "See all 14 questions" })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Get started" })).toBeVisible();
});

test("Checkout: validation, live summary, no payment, honest next steps", async ({ page }) => {
  await page.goto("checkout");
  await expect(page.getByTestId("order-summary")).toContainText("$0.00");
  await expect(page.getByTestId("order-summary")).toContainText("No payment collected");
  await expect(page.getByTestId("order-summary")).toContainText("Custom pricing / pending approved quote");
  await page.getByRole("button", { name: "Review proposal" }).click();
  await expect(page.getByText("Enter your organization.")).toBeVisible();
  await expect(page.getByText("Confirm that this is not a binding purchase.")).toBeVisible();
  await page.getByLabel("Organization").fill("Sample Transit Agency");
  await page.getByLabel("Business email", { exact: true }).fill("person@gmail.com");
  await page.getByRole("button", { name: "Review proposal" }).click();
  await expect(page.getByText("Use a business email address.")).toBeVisible();
  await page.getByLabel("Business email", { exact: true }).fill("person@agency.example.org");
  await page.getByLabel("Custom or network expansion").check();
  await expect(page.getByTestId("order-summary")).toContainText("Custom or network expansion");
  await page.getByLabel("Negotiated custom term").check();
  await expect(page.getByTestId("order-summary")).toContainText("Negotiated custom term");
  await page.getByLabel(/I understand this is a request for a proposal/).check();
  await page.getByRole("button", { name: "Review proposal" }).click();
  const done = page.getByTestId("next-steps");
  await expect(done).toContainText("has not been submitted or sent anywhere");
  await expect(done.getByTestId("proposal-summary")).toContainText("Amount due today: $0.00. No payment collected.");
  await expect(done.getByTestId("proposal-summary")).not.toContainText("$1");
  await page.getByRole("button", { name: "Edit configuration" }).click();
  await expect(page.getByLabel("Organization")).toHaveValue("Sample Transit Agency");
});

test("Checkout prepopulates the organization only from the DART demo link", async ({ page }) => {
  await page.goto("checkout");
  await expect(page.getByLabel("Organization")).toHaveValue("");
  await page.goto("checkout?demo=dart");
  await expect(page.getByLabel("Organization")).toHaveValue("Dallas Area Rapid Transit");
});

test("Architecture page: five steps, security strip, keyboard-selectable details, text fallback", async ({ page }) => {
  await page.goto("architecture");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("DART Super Intelligence");
  await expect(page.getByText("Turn transit data into the right action, at the right time.")).toBeVisible();
  await expect(page.getByText("Request a Proposal")).toHaveCount(0);
  await expect(page.getByTestId("arch-flow").getByText("Platform", { exact: true })).toHaveCount(0);
  await expect(page.getByTestId("arch-node")).toHaveCount(5);
  await expect(page.getByTestId("arch-node").nth(4)).not.toContainText("Work");
  await expect(page.getByTestId("arch-node").nth(4)).toContainText("Safer. Cleaner. DART");
  await expect(page.getByTestId("arch-sec")).toHaveCount(4);
  await page.getByTestId("arch-node").nth(2).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("arch-detail")).toContainText("Intelligence");
  await expect(page.getByTestId("arch-detail")).toContainText("synthetic");
  await expect(page.getByTestId("arch-node").nth(1)).toContainText("Ingest · Model · Analyze");
  await page.getByTestId("arch-sec").nth(1).click();
  await expect(page.getByTestId("arch-detail")).toContainText("simulation, not access control");
  await page.getByTestId("arch-text").locator("summary").click();
  await expect(page.getByTestId("arch-text")).toContainText("map KAI's controls to FISMA");
});

test("intelligence engine can be viewed for each line", async ({ page }) => {
  await page.goto("stations/intelligence");
  const all = Number(await page.getByTestId("intel-summary").locator("dd").first().textContent());
  const seen: number[] = [];
  for (const line of ["red", "green", "blue", "orange", "silver"]) {
    await page.getByRole("group", { name: "Filter by line" }).getByRole("button", { name: new RegExp(`^${line} line`, "i") }).click();
    await expect(page.getByTestId("intelligence")).toContainText(`Showing ${line[0].toUpperCase()}${line.slice(1)} Line`);
    seen.push(Number(await page.getByTestId("intel-summary").locator("dd").first().textContent()));
  }
  expect(seen.every((n) => n > 0 && n <= all)).toBe(true);
  expect(new Set(seen).size).toBeGreaterThan(1);
});
