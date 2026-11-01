import { expect, test } from "@playwright/test";
import { noHorizontalOverflow } from "./helpers";

test("landing: no tournament content, CTAs reach the platform, tabs and accordion work", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Super experience");
  expect(await page.locator("body").innerText()).not.toMatch(/fifa|world cup|at&t stadium|arlington/i);
  await expect(page.getByTestId("hero-metric")).toHaveText("171,000+");
  await expect(page.getByText("Daily Passenger Trips")).toBeVisible();
  await expect(page.getByText("Rail Stations in the DART Network")).toHaveCount(0);
  await expect(page.getByText("Clean Transit for North Texas")).toBeVisible();
  await expect(page.getByText("Transit for North Texas", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Transit for All", { exact: true })).toHaveCount(0);
  await expect(page.getByText("We’re changing public transportation to make it clean, safe and more intelligent than ever.")).toBeVisible();
  await expect(page.getByText("This is the new DART standard.")).toHaveCount(0);
  await expect(page.getByText("Enjoy your ride in North Texas.")).toHaveCount(0);
  await expect(page.getByText("Mission", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Verified public source")).toHaveCount(0);
  // segmented rider tabs
  await expect(page.getByRole("heading", { name: "Clean. Safe. Intelligent." })).toBeVisible();
  await expect(page.getByText("The ride", { exact: true })).toHaveCount(0);
  await page.getByRole("tab", { name: "Verified" }).click();
  await expect(page.getByRole("tab", { name: "Verified" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Verified" }).press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Intelligent" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#panel-intelligent")).toBeVisible();
  await expect(page.getByText("Capabilities", { exact: true })).toHaveCount(0);
  await expect(page.locator("#hero-note")).toHaveCount(0);
  await noHorizontalOverflow(page);
  await expect(page.getByRole("link", { name: /Get started$/ }).first()).toHaveAttribute("href", /get-started/);
  await page.getByRole("link", { name: /Demo$/ }).first().click();
  await expect(page).toHaveURL(/\/stations\/?$/);
});

test("pilot section names the three pilot stations; nothing is shown as live", async ({ page }) => {
  await page.goto("");
  await expect(page.getByTestId("pilot-title")).toHaveText("Pilot for Park Lane, Akard and Spring Valley Station");
  await expect(page.getByText("The Standard in clean transportation in North Texas", { exact: true })).toBeVisible();
  await expect(page.getByText("Bringing stations online.")).toHaveCount(0);
  const legend = page.getByTestId("rollout-legend");
  await expect(legend).toContainText("Pilot site (proposed) · 3");
  await expect(legend).not.toContainText("Connected to live data");
  await expect(legend).toContainText("Public schedule data connected · 73");
  await expect(page.getByTestId("map-rollout").locator("circle")).toHaveCount(76);
  for (const n of ["Park Lane", "Akard", "Spring Valley"]) await expect(page.getByTestId("map-rollout").getByText(n, { exact: true })).toBeVisible();
});

test("image-led experience lineup replaces the data table", async ({ page }) => {
  await page.goto("");
  await expect(page.getByText("Only what can be sourced.")).toHaveCount(0);
  const tabs = page.getByRole("tablist", { name: "DART experience" });
  await expect(tabs.getByRole("tab", { name: /Station/ })).toHaveAttribute("aria-selected", "true");
  await expect(tabs).toContainText("Coming soon");
  await tabs.getByRole("tab", { name: /Cab & Car/ }).click();
  await expect(page.locator("#exp-panel-car")).toBeVisible();
  await tabs.getByRole("tab", { name: /DART Experience/ }).press("ArrowLeft");
  await expect(tabs.getByRole("tab", { name: /Cab & Car/ })).toHaveAttribute("aria-selected", "true");
});

test("old World Cup route is gone", async ({ request }) => {
  expect((await request.get("world-cup-2026")).status()).toBe(404);
});

test("year-to-date trips is labeled as an estimate, not a DART figure", async ({ page }) => {
  await page.goto("");
  const box = page.getByTestId("ytd-trips");
  await expect(box).toContainText("Estimated trips so far");
  await expect(box).toContainText("Estimated from DART");
  await expect(box).toContainText(/≈ [\d,]+/);
});

test("FAQ answers ten questions and expands", async ({ page }) => {
  await page.goto("");
  const items = page.getByTestId("faq").locator("details");
  await expect(items).toHaveCount(10);
  await items.first().locator("summary").click();
  await expect(items.first()).toHaveAttribute("open", "");
  await expect(page.getByTestId("faq")).toContainText("independent");
});
