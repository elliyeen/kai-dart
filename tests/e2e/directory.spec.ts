import { expect, test } from "@playwright/test";
import { BASE, UNIQUE_NAMES, noHorizontalOverflow } from "./helpers";

const rowNames = (page: import("@playwright/test").Page) => page.getByTestId("station-row").evaluateAll((els) => els.map((e) => e.querySelector("span.truncate")!.textContent));

test.describe("station directory", () => {
  test("lists every unique original station and the counts add up", async ({ page }) => {
    await page.goto("stations");
    await expect(page.getByTestId("result-count")).toHaveText(new RegExp(`^${UNIQUE_NAMES.length} of ${UNIQUE_NAMES.length} stations`));
    expect(new Set(await rowNames(page))).toEqual(new Set(UNIQUE_NAMES));
    await noHorizontalOverflow(page);
  });

  for (const line of ["red", "blue", "green", "orange", "silver"]) {
    test(`${line} line filter shows exactly that line's stations`, async ({ page }) => {
      await page.goto("stations");
      await page.getByRole("group", { name: "Filter by line" }).getByRole("button", { name: new RegExp(`^${line}$`, "i") }).click();
      const expected = new Set(BASE.filter((b) => b.lineId === line).map((b) => b.name));
      await expect(page.getByTestId("result-count")).toContainText(`${expected.size} of`);
      await expect(page).toHaveURL(new RegExp(`line=${line}`));
      expect(new Set(await rowNames(page))).toEqual(expected);
    });
  }

  test("search narrows the list and a deep link restores it", async ({ page }) => {
    await page.goto("stations");
    await page.getByLabel("Search stations").fill("akard");
    await expect(page.getByTestId("station-row")).toHaveCount(1);
    await page.goto("stations?line=silver&q=carrollton");
    await expect(page.getByTestId("station-row")).toHaveCount(1);
    await expect(page.getByLabel("Search stations")).toHaveValue("carrollton");
    await page.getByLabel("Search stations").fill("zzzz");
    await expect(page.getByTestId("no-results")).toBeVisible();
  });

  test("selecting a station opens its dashboard", async ({ page }) => {
    await page.goto("stations");
    await page.getByLabel("Search stations").fill("cedars");
    await page.getByTestId("station-row").first().click();
    await expect(page).toHaveURL(/stations\/cedars-r/);
    await expect(page.getByTestId("station-detail")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Cedars" })).toBeVisible();
  });

  test("every one of the 115 original ids is a working route", async ({ request }) => {
    const bad: string[] = [];
    for (const b of BASE) { const r = await request.get(`stations/${b.id}`); if (r.status() !== 200) bad.push(`${b.id}:${r.status()}`); }
    expect(bad).toEqual([]);
  });

  test("unknown station returns the 404 page", async ({ request }) => {
    expect((await request.get("stations/not-a-station")).status()).toBe(404);
  });

  test("closed station keeps its record and shows the unverified closure note", async ({ page }) => {
    await page.goto("stations/convention-blue");
    await expect(page.getByText("Reported closure (unverified)")).toBeVisible();
  });
});
