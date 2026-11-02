import { expect, test } from "@playwright/test";
import { setRole } from "./helpers";

test.describe("role views (simulation)", () => {
  test("executive is read-only (R-02)", async ({ page }) => {
    await page.goto("stations/inspections");
    await expect(page.getByText("Executives have read-only access")).toBeVisible();
  });
  test("station manager sees only the scoped stations (R-06)", async ({ page }) => {
    await page.goto("stations/inspections");
    await setRole(page, "Station Manager");
    await expect(page.getByText("Your stations (synthetic scope)")).toBeVisible();
    await expect(page.getByRole("link", { name: "Akard" }).first()).toBeVisible();
  });
  test("contractor sees an empty queue before assignment (R-07)", async ({ page }) => {
    await page.goto("stations/inspections");
    await setRole(page, "Contractor / Crew");
    await expect(page.getByTestId("contractor-empty")).toBeVisible();
  });
  test("security sees the audit timeline (R-08)", async ({ page }) => {
    await page.goto("stations/inspections");
    await setRole(page, "Security / Compliance");
    await expect(page.getByText("Audit log (simulated)")).toBeVisible();
  });
  test("admin sees the roles table with all seven roles (R-09)", async ({ page }) => {
    await page.goto("stations/inspections");
    await setRole(page, "Platform Admin");
    await expect(page.getByText("Roles and scopes (read-only simulation)")).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(7);
  });
});

test("account menu reset returns to Executive (A-03)", async ({ page, isMobile }) => {
  test.skip(!!isMobile || (page.viewportSize()?.width ?? 0) < 1024, "desktop sidebar only");
  await page.goto("stations");
  await setRole(page, "Field Inspector");
  await page.getByTestId("account-button").click();
  await page.getByTestId("account-reset").click();
  await expect(page.getByTestId("account-name")).toHaveText("Executive");
});
