import { expect, test } from "@playwright/test";
import { noHorizontalOverflow, setRole } from "./helpers";

test("every station page has Report an issue, Deploy crew and its own autonomous demo", async ({ page }) => {
  for (const key of ["akard", "convention-blue", "park-lane"]) {
    await page.goto(`stations/${key}`);
    await expect(page.getByTestId("act-report")).toBeVisible();
    await expect(page.getByTestId("act-deploy")).toBeVisible();
    await expect(page.getByTestId("station-loop")).toBeVisible();
    await expect(page.getByTestId("loop-scene")).toBeVisible();
    await expect(page.getByTestId("loop-log")).toContainText(/detected|Detected|offline|full|Graffiti|issue|signal/i);
  }
});

test("report an issue from a station sheet is prefilled and creates a ticket", async ({ page }) => {
  await page.goto("stations/convention-blue");
  await page.getByTestId("act-report").click();
  await expect(page.getByTestId("report-station")).toHaveValue("convention-r");
  await page.getByTestId("type-safety").click();
  await page.getByTestId("report-submit").click();
  await expect(page.getByTestId("report-ref")).toContainText("KAI");
});

test("deploy crew: disabled with a reason for read-only roles, works for Operations, listed on the station", async ({ page }) => {
  await page.goto("stations/convention-blue");
  await expect(page.getByTestId("act-deploy")).toBeDisabled();
  await expect(page.getByTestId("deploy-hint")).toContainText("Only Operations");
  await setRole(page, "Operations Command");
  await page.getByTestId("act-deploy").click();
  await page.getByTestId("deploy-crew").selectOption({ label: "Elevator Services Contractor" });
  await page.getByTestId("deploy-priority-critical").click();
  await page.getByTestId("deploy-submit").click();
  await expect(page.getByTestId("deploy-done")).toContainText("simulation");
  await expect(page.getByTestId("deploy-done")).toContainText("ELV-0");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("deployed-list")).toContainText("Elevator Services Contractor");
  await noHorizontalOverflow(page);
});

test("inspection checklist: 45 items, 80% to submit, attestation, KAI loop creates work orders", async ({ page }) => {
  await page.goto("stations/checklist");
  await expect(page.getByTestId("check-item")).toHaveCount(45);
  await expect(page.getByTestId("checklist-submit")).toHaveText("36 more to enable");
  await page.getByTestId("checklist-station").selectOption({ label: "Akard" });
  await page.getByTestId("checklist-inspector").fill("Test Inspector");
  const pass = page.getByTestId("ans-pass");
  for (let i = 0; i < 36; i++) await pass.nth(i).click();
  await page.getByTestId("ans-fail").nth(2).click();   // fail the third item (replaces its pass)
  await expect(page.getByTestId("checklist-count")).toContainText("36 of 45");
  await expect(page.getByTestId("checklist-missing")).toHaveText("Sign the attestation");
  await page.getByTestId("checklist-attest").check();
  await page.getByTestId("checklist-submit").click();
  await expect(page.getByTestId("kai-stage-learn")).toHaveAttribute("data-on", "true", { timeout: 10_000 });
  await expect(page.getByTestId("kai-actions").locator("li")).toHaveCount(1);
  await expect(page.getByTestId("kai-loop")).toContainText("no ML model");
  await page.goto("stations/issues");
  await expect(page.getByTestId("issue-row").first()).toContainText("Inspection:");
});

test("checklist tour opens and steps through", async ({ page }) => {
  await page.goto("stations/checklist");
  await page.getByTestId("checklist-tour").click();
  await expect(page.getByTestId("sheet-tour")).toContainText("1 of 4");
  for (let i = 0; i < 4; i++) await page.getByTestId("tour-next").click();
  await expect(page.getByTestId("sheet-tour")).not.toBeVisible();
});
