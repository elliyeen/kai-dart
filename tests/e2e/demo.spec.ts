import { expect, test, type Page } from "@playwright/test";
import { setRole } from "./helpers";

const status = (p: Page) => p.getByTestId("wo-status");

test.describe("executive demo and workflow", () => {
  test("guided two-minute demo: network → Akard → assign → proof → independent verify → executive → reset", async ({ page }) => {
    const t0 = Date.now();
    await page.goto("stations");
    await page.getByRole("button", { name: /Guided demo|Demo/ }).first().click();
    const next = page.getByTestId("guide-next");
    await next.click();                                              // 1 network
    await next.click();                                              // 2 open Akard
    await expect(page).toHaveURL(/stations\/akard/);
    await expect(status(page)).toHaveText("Reported — unassigned");
    await next.click();                                              // 3 assign
    await expect(status(page)).toHaveText("Assigned — work in progress");
    await next.click();                                              // 4 proof
    await expect(status(page)).toHaveText("Awaiting independent verification");
    await expect(page.getByTestId("work-order")).toContainText("Not yet verified");
    await next.click();                                              // 5 verify
    await expect(status(page)).toHaveText("Verified resolved");
    await expect(page.getByTestId("work-order")).toContainText("demo.inspector");
    await next.click();                                              // 6 executive network
    await expect(page.getByTestId("guide-step")).toContainText("Demo complete");
    await expect(page.getByTestId("stat-verified").first()).toHaveText("1");
    expect(Date.now() - t0, "demo wall time").toBeLessThan(120_000);
    await page.getByTestId("reset-demo").click();
    await page.goto("stations/akard");
    await expect(status(page)).toHaveText("Reported — unassigned");
  });

  test("manual role path: only the right role can act at each step", async ({ page }) => {
    await page.goto("stations/akard");
    await expect(page.getByTestId("wo-actions").getByRole("button")).toHaveCount(0);   // executive: read-only
    await setRole(page, "Contractor / Crew");
    await expect(page.getByTestId("wo-actions").getByRole("button")).toHaveCount(0);   // not assigned yet
    await setRole(page, "Field Inspector");
    await expect(page.getByTestId("wo-actions").getByRole("button")).toHaveCount(0);   // nothing to verify
    await setRole(page, "Operations Command");
    await page.getByRole("button", { name: "Assign Work" }).click();
    await expect(status(page)).toHaveText("Assigned — work in progress");
    await setRole(page, "Field Inspector");
    await expect(page.getByRole("button", { name: "Verify" })).toHaveCount(0);
    await setRole(page, "Contractor / Crew");
    await page.getByRole("button", { name: "Submit Proof" }).click();
    await expect(status(page)).toHaveText("Awaiting independent verification");
    // the submitter cannot self-verify, admin and ops cannot verify
    for (const r of ["Contractor / Crew", "Platform Admin", "Operations Command", "Executive"]) {
      await setRole(page, r);
      await expect(page.getByRole("button", { name: "Verify" })).toHaveCount(0);
    }
    await setRole(page, "Field Inspector");
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(status(page)).toHaveText("Verified resolved");
  });

  test("inspector can reject; work returns to the crew; state survives a reload", async ({ page }) => {
    await page.goto("stations/akard");
    await setRole(page, "Operations Command"); await page.getByRole("button", { name: "Assign Work" }).click();
    await setRole(page, "Contractor / Crew"); await page.getByRole("button", { name: "Submit Proof" }).click();
    await setRole(page, "Field Inspector"); await page.getByRole("button", { name: "Reject" }).click();
    await expect(status(page)).toHaveText("Assigned — work in progress");
    await expect(page.getByTestId("timeline")).toContainText("Rejected by inspector");
    await page.reload();
    await expect(status(page)).toHaveText("Assigned — work in progress");
    await page.getByTestId("reset-demo").click();
  });

  test("role-scoped surfaces on the Inspections page", async ({ page }) => {
    await page.goto("stations/inspections");
    await setRole(page, "Contractor / Crew");
    await expect(page.getByTestId("contractor-empty")).toBeVisible();
    await setRole(page, "Security / Compliance");
    await expect(page.getByRole("heading", { name: /Audit log/ })).toBeVisible();
    await setRole(page, "Platform Admin");
    await expect(page.getByRole("heading", { name: /Roles and scopes/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Verify|Assign Work|Submit Proof/ })).toHaveCount(0);
    await setRole(page, "Station Manager");
    await expect(page.getByRole("heading", { name: /Your stations/ })).toBeVisible();
    await setRole(page, "Executive");
    await expect(page.getByText("read-only access")).toBeVisible();
  });

  test("direct URL as a role without station access shows no condition detail", async ({ page }) => {
    await page.goto("stations/westmoreland");
    await setRole(page, "Platform Admin");
    await expect(page.getByText("has no access to station condition detail")).toBeVisible();
  });

  test("every station shows its connected public data source and honest live-data status", async ({ page }) => {
    await page.goto("stations/akard");
    await expect(page.getByTestId("ds-public")).toContainText("Matched official stop 22750");
    await expect(page.getByTestId("data-sources")).toContainText("Not connected");
    await expect(page.getByTestId("address")).toContainText("1400 Pacific Ave., Dallas, TX 75202");
    await expect(page.getByTestId("coords")).toContainText("32.781893° N, 96.800633° W");
    await page.goto("stations/north-lake");
    await expect(page.getByTestId("address")).toContainText("1770 W. Walnut Hill Ln., Irving, TX 75038");
    await page.goto("stations/convention-blue");
    await expect(page.getByTestId("ds-public")).toContainText("closure NOT confirmed");
  });

  test("side drawer slides out and back in", async ({ page }) => {
    await page.goto("stations/akard");
    const drawer = page.getByTestId("side-drawer"), toggle = page.getByTestId("drawer-toggle");
    await expect(drawer).toBeVisible(); await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await toggle.click();
    await expect(page.getByTestId("dash-grid")).toHaveAttribute("data-drawer", "closed");
    await expect(drawer).toBeHidden(); await expect(toggle).toHaveAttribute("aria-expanded", "false"); await expect(toggle).toContainText("Show details");
    await page.getByTestId("twin-platform-a").click();                     // selecting an asset reopens it
    await expect(drawer).toBeVisible(); await expect(page.getByTestId("asset-drawer")).toHaveAttribute("data-asset", "platform-a");
    await toggle.click(); await expect(drawer).toBeHidden(); await toggle.click(); await expect(drawer).toBeVisible();
  });

  test("demo labels persist on every surface", async ({ page }) => {
    for (const path of ["stations", "stations/akard", "stations/inspections"]) {
      await page.goto(path);
      await expect(page.getByTestId("demo-banner")).toContainText("SYNTHETIC DEMO");
    }
  });
});
