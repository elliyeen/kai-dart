import { expect, test } from "@playwright/test";
import { BASE, UNIQUE_NAMES, isDesktop, noHorizontalOverflow, setRole } from "./helpers";

const rowNames = (page: import("@playwright/test").Page) => page.getByTestId("station-row").evaluateAll((els) => els.map((e) => e.querySelector("span.truncate")!.textContent));

test.describe("station directory", () => {
  test("lists every unique original station and the counts add up", async ({ page }) => {
    await page.goto("stations");
    await expect(page.getByTestId("result-count")).toHaveText(new RegExp(`^${UNIQUE_NAMES.length} of ${UNIQUE_NAMES.length} stations`));
    await expect(page.getByTestId("station-row")).toHaveCount(BASE.length);              // one row per original line-station entry
    expect(new Set(await rowNames(page))).toEqual(new Set(UNIQUE_NAMES));
    // organized by line colour, in the original line order
    const heads = await page.locator('[data-testid^="group-"] h3').allInnerTexts();
    expect(heads.map((h) => h.split("\n")[0])).toEqual(["Red Line", "Green Line", "Blue Line", "Orange Line", "Silver Line"]);
    await noHorizontalOverflow(page);
  });

  for (const line of ["red", "blue", "green", "orange", "silver"]) {
    test(`${line} line filter shows exactly that line's stations`, async ({ page }) => {
      await page.goto("stations");
      await page.getByRole("group", { name: "Filter by line" }).getByRole("button", { name: new RegExp(`^${line} line`, "i") }).click();
      const expected = new Set(BASE.filter((b) => b.lineId === line).map((b) => b.name));
      await expect(page.getByTestId("result-count")).toContainText(`${expected.size} of`);
      await expect(page.getByTestId("station-row")).toHaveCount(BASE.filter((b) => b.lineId === line).length);
      await expect(page.locator('[data-testid^="group-"]')).toHaveCount(1);
      await expect(page).toHaveURL(new RegExp(`line=${line}`));
      expect(new Set(await rowNames(page))).toEqual(expected);
    });
  }

  test("search narrows the list and a deep link restores it", async ({ page }) => {
    await page.goto("stations");
    await page.getByLabel("Search stations").fill("akard");
    await expect(page.getByTestId("station-row")).toHaveCount(4);                         // Akard serves four lines
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

test("each line collapses and expands on its own", async ({ page }) => {
  await page.goto("stations");
  await page.waitForLoadState("networkidle");
  const red = page.getByTestId("group-red"), green = page.getByTestId("group-green");
  const redRows = red.getByTestId("station-row"), greenRows = green.getByTestId("station-row");
  const before = await redRows.count();
  expect(before).toBeGreaterThan(0);
  await page.getByTestId("toggle-red").click();
  await expect(page.getByTestId("toggle-red")).toHaveAttribute("aria-expanded", "false");
  await expect(redRows.first()).toBeHidden();
  await expect(greenRows.first()).toBeVisible();
  await page.getByTestId("toggle-red").click();
  await expect(redRows).toHaveCount(before);
  await expect(redRows.first()).toBeVisible();
  await page.getByTestId("toggle-all-lines").click();
  await expect(greenRows.first()).toBeHidden();
  await page.getByTestId("toggle-all-lines").click();
  await expect(greenRows.first()).toBeVisible();
});

test("restored tools: report an issue, track it, log, checklist, intelligence", async ({ page }) => {
  await page.goto("stations/report");
  await expect(page.getByTestId("report-submit")).toBeDisabled();
  await page.getByTestId("type-safety").click();
  await expect(page.getByTestId("priority-critical")).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("textbox").first().fill("Test note");
  await page.getByTestId("report-submit").click();
  const ref = (await page.getByTestId("report-ref").textContent())!;
  await page.getByRole("link", { name: "Track this ticket" }).click();
  await expect(page.getByTestId("ticket-current")).toContainText("Open");
  await page.getByTestId("status-in_progress").click();
  await expect(page.getByTestId("ticket-current")).toContainText("In progress");
  await page.goto("stations/issues");
  await expect(page.getByTestId("issue-row").first()).toContainText(ref);
  await page.goto("stations/checklist");
  await page.getByTestId("ans-pass").first().click();
  await expect(page.getByTestId("checklist-count")).toContainText("1 of 45");
  await page.goto("stations/intelligence");
  await expect(page.getByTestId("intelligence")).toContainText("not machine-learning predictions");
  await expect(page.getByTestId(isDesktop(page) ? "side-nav" : "tools-bar")).toBeVisible();
});

test("auto demo opens on Park Lane as a digital twin and the groups in the tools menu are labelled", async ({ page }) => {
  await page.goto("stations/loop");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Park Lane station");
  await expect(page.getByTestId("loop-scene")).toHaveAttribute("data-scene", "park-lane");
  await expect(page.getByTestId("station-twin")).toBeVisible();
  for (const g of ["Field work", "Intelligence", "Operations"]) await expect(page.getByTestId(isDesktop(page) ? "side-nav" : "tools-bar").getByRole("group", { name: g })).toBeVisible();
});

test("auto demo loop runs, can be deep-linked and paused", async ({ page }) => {
  await page.goto("stations/loop#akard");
  await expect(page.getByTestId("loop-scene")).toHaveAttribute("data-scene", "akard");
  await expect(page.getByTestId("loop-log")).toContainText("Platform B camera offline");
  await expect(page.getByTestId("loop-owner")).toContainText("Camera and Security Systems Contractor");
  await page.getByTestId("loop-toggle").click();
  await expect(page.getByTestId("loop-toggle")).toContainText("Play");
  const before = await page.getByTestId("loop-score").textContent();
  await page.waitForTimeout(600);
  expect(await page.getByTestId("loop-score").textContent()).toBe(before);
  await page.getByRole("button", { name: "Park Lane" }).click();
  await expect(page.getByTestId("loop-scene")).toHaveAttribute("data-scene", "park-lane");
  await expect(page.getByTestId("station-twin")).toBeVisible();
  await expect(page.getByTestId("loop-now")).toContainText("Step");
});

test("audit log records sign-in and actions; inventory lists owned assets", async ({ page }) => {
  await page.goto("stations");
  await page.waitForLoadState("networkidle");
  await setRole(page, "Operations Command");
  await page.goto("stations/audit");
  await expect(page.getByTestId("audit-row").first()).toBeVisible();
  await expect(page.getByTestId("audit-table")).toContainText("sign_in");
  await expect(page.getByTestId("audit-table")).toContainText("Platform Admin");
  await page.goto("stations/inventory");
  await expect(page.getByTestId("inv-row").first()).toBeVisible();
  await expect(page.getByTestId("inv-table")).toContainText("Facilities Maintenance");
  await expect(page.getByTestId("dictionary")).toContainText("audit_log");
});

test("test case scenarios page shows all four stations with steps", async ({ page }) => {
  await page.goto("stations/scenarios");
  for (const id of ["park-lane", "spring-valley", "akard", "smu-mockingbird"]) await expect(page.getByTestId(`scenario-${id}`)).toBeVisible();
  await expect(page.getByTestId("scenario-akard")).toContainText("Approves moving an officer to Platform B");
  await expect(page.getByTestId("scenario-akard").getByTestId("scenario-step")).toHaveCount(9);
});

test("contractors page lists contract holders and personnel; elevator waits on parts in its own color state", async ({ page }) => {
  await page.goto("stations/contractors");
  await expect(page.getByTestId("providers")).toContainText("CT-ELV-001");
  await expect(page.getByTestId("personnel")).toContainText("On site");
  await page.goto("stations/loop#smu-mockingbird");
  await expect(page.getByTestId("loop-stage")).toContainText("Waiting on parts", { timeout: 25000 });
});

test("side navigation slides between full width and an icon rail, remembers the choice, and reaches every tool", async ({ page }) => {
  test.skip(!isDesktop(page), "the sidebar is a desktop (lg+) control; phones and tablets use the bottom bar");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("stations");
  const side = page.getByTestId("side-nav");
  await expect(side).toHaveAttribute("data-collapsed", "false");
  const wide = (await side.boundingBox())!.width;
  for (const g of ["Field work", "Intelligence", "Operations"]) await expect(side.getByRole("group", { name: g })).toBeVisible();
  await page.getByTestId("side-toggle").click();
  await expect(side).toHaveAttribute("data-collapsed", "true");
  await expect.poll(async () => (await side.boundingBox())!.width, { timeout: 3000 }).toBeLessThan(wide / 2);
  await page.reload();
  await expect(page.getByTestId("side-nav")).toHaveAttribute("data-collapsed", "true");
  await page.keyboard.press("Control+b");
  await expect(page.getByTestId("side-nav")).toHaveAttribute("data-collapsed", "false");
  await side.getByRole("link", { name: "Inspection checklist" }).click();
  await expect(page).toHaveURL(/stations\/checklist/);
  await expect(page.getByText("KAI facilities management")).toHaveCount(0);
});

test("account menu: bottom-of-sidebar switcher lists all seven demo roles, switches account and logs it", async ({ page }) => {
  test.skip(!isDesktop(page), "the account menu lives in the desktop sidebar; phones and tablets use the header selector");
  await page.goto("stations");
  await expect(page.getByTestId("account-name")).toHaveText("Executive");
  await page.getByTestId("account-button").click();
  await expect(page.getByRole("menuitemradio")).toHaveCount(7);
  await expect(page.getByTestId("account-menu")).toContainText("Simulation only");
  await page.getByTestId("role-option-inspector").click();
  await expect(page.getByTestId("account-menu")).toBeHidden();
  await expect(page.getByTestId("account-name")).toHaveText("Field Inspector");
  await page.goto("stations/audit");
  await expect(page.getByTestId("audit-table")).toContainText("switch_account");
});
