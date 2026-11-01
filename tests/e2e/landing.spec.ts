import { expect, test } from "@playwright/test";
import { noHorizontalOverflow } from "./helpers";

test("landing: no tournament content, CTAs reach the platform, tabs and accordion work", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Transit for Everyone");
  expect(await page.locator("body").innerText()).not.toMatch(/fifa|world cup|at&t stadium|arlington/i);
  await expect(page.getByTestId("hero-metric")).toHaveText("171,000+");
  await expect(page.getByText("Daily Passenger Trips")).toBeVisible();
  await expect(page.getByText("Rail Stations in the DART Network")).toHaveCount(0);
  await expect(page.getByText("DART clean for all of North Texas")).toBeVisible();
  await expect(page.getByText("Transit for North Texas")).toHaveCount(0);
  await expect(page.getByText("Transit for All", { exact: true })).toHaveCount(0);
  await expect(page.getByText("We’re changing public transportation to make it clean, safe and more intelligent than ever.")).toBeVisible();
  await expect(page.getByText("This is the new DART standard.")).toBeVisible();
  await expect(page.getByText("Enjoy your ride in North Texas.")).toBeVisible();
  await expect(page.getByText("Mission", { exact: true })).toHaveCount(0);
  // segmented rider tabs
  await page.getByRole("tab", { name: "Verified" }).click();
  await expect(page.getByRole("tab", { name: "Verified" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Verified" }).press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Intelligent" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#panel-intelligent")).toBeVisible();
  await expect(page.getByText("Capabilities", { exact: true })).toHaveCount(0);
  await expect(page.locator("#hero-note")).toHaveCount(0);
  await noHorizontalOverflow(page);
  await page.getByRole("link", { name: /Explore Station Intelligence/ }).first().click();
  await expect(page).toHaveURL(/\/stations\/?$/);
});

test("rollout map is honest: nothing connected, Akard is the demo station", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("heading", { name: "Bringing stations online." })).toBeVisible();
  await expect(page.getByTestId("rollout-connected")).toHaveText("0 stations");
  const legend = page.getByTestId("rollout-legend");
  await expect(legend).toContainText("Connected to live data · 0");
  await expect(legend).toContainText("Public schedule data connected · 75");
  await expect(page.getByTestId("rollout-public")).toHaveText("76 of 76");
  await expect(legend).toContainText("Demo station (synthetic) · 1");
  await expect(legend).toContainText("Not yet connected");
  const map = page.getByTestId("map-rollout");
  await expect(map.locator("circle")).toHaveCount(76);
  await expect(map.getByText("Akard (demo)")).toBeVisible();
  await expect(map.getByText("DALLAS CO.")).toBeVisible();
});

test("old World Cup route is gone", async ({ request }) => {
  expect((await request.get("world-cup-2026")).status()).toBe(404);
});
