import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { noHorizontalOverflow } from "./helpers";

const DEMO_URL = "stations/park-lane/demo";

test("PL-T01 no autoplay; Play runs all steps to the CTA with a fake clock", async ({ page }) => {
  await page.clock.install();
  await page.goto(DEMO_URL);
  await expect(page.getByTestId("pl-disclosure")).toContainText("SIMULATED DEMONSTRATION");
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-playing", "0");
  await page.clock.runFor(3000);
  await expect(page.getByTestId("pl-time")).toContainText("0:00 /");
  await page.getByTestId("pl-play").click();
  await page.clock.runFor(95_000);
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-step", "cta");
  await expect(page.getByTestId("pl-cta")).toBeVisible();
  await expect(page.getByTestId("pl-end-note")).toContainText("Simulated outcomes");
  for (const k of ["clean", "elev", "kiosk"]) await expect(page.getByTestId(`pl-issue-${k}`)).toHaveAttribute("data-status", "verified");
  await expect(page.getByTestId("pl-score")).toContainText("88");
  await expect(page.getByTestId("pl-active-note")).toContainText("3 of 3 incidents independently verified");
});

test("PL-T02 pause freezes state; resume continues; restart resets", async ({ page }) => {
  await page.clock.install();
  await page.goto(DEMO_URL);
  await page.getByTestId("pl-play").click();
  await page.clock.runFor(25_000);
  await page.getByTestId("pl-pause").click();
  const t1 = await page.getByTestId("pl-demo").getAttribute("data-t");
  await page.clock.runFor(10_000);
  expect(await page.getByTestId("pl-demo").getAttribute("data-t")).toBe(t1);
  await page.getByTestId("pl-play").click();
  await page.clock.runFor(2000);
  expect(Number(await page.getByTestId("pl-demo").getAttribute("data-t"))).toBeGreaterThan(Number(t1));
  await page.getByTestId("pl-restart").click();
  await expect(page.getByTestId("pl-time")).toContainText("0:00 /");
  for (const k of ["clean", "elev", "kiosk"]) await expect(page.getByTestId(`pl-issue-${k}`)).toHaveAttribute("data-status", "none");
  await expect(page.getByTestId("pl-score")).toContainText("88");
});

test("PL-T04 contractor claim never verifies; inspector step does; rework path leaves it unresolved", async ({ page }) => {
  await page.goto(DEMO_URL);
  await page.getByTestId("pl-scrub").fill("42000");
  await expect(page.getByTestId("pl-issue-elev")).toHaveAttribute("data-status", "fix_claimed");
  await expect(page.getByTestId("pl-awaiting")).toBeVisible();
  await page.getByTestId("pl-scrub").fill("47000");
  await expect(page.getByTestId("pl-issue-elev")).toHaveAttribute("data-status", "verified");
  await page.getByTestId("pl-rework").check();
  await page.getByTestId("pl-scrub").fill("42000");
  await expect(page.getByTestId("pl-issue-elev")).toHaveAttribute("data-status", "rejected");
  await expect(page.getByTestId("pl-log")).toContainText("rejects");
});

test("Next/Back stay consistent around the kiosk step", async ({ page }) => {
  await page.goto(DEMO_URL);
  await page.getByTestId("pl-scrub").fill("52000");
  await page.getByTestId("pl-next").click();
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-step", "exec");
  await page.getByTestId("pl-back").click();
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-step", "kiosk");
  await page.getByTestId("pl-back").click();
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-step", "elev");
  await page.getByTestId("pl-next").click();
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-step", "kiosk");
  await expect(page.getByTestId("pl-issue-kiosk")).toHaveAttribute("data-status", "none");
});

test("PL-T03 hard reload starts from baseline (no stale state)", async ({ page }) => {
  await page.goto(DEMO_URL);
  await page.getByTestId("pl-scrub").fill("60000");
  await page.reload();
  await expect(page.getByTestId("pl-time")).toContainText("0:00 /");
  await expect(page.getByTestId("pl-issue-clean")).toHaveAttribute("data-status", "none");
});

test("keyboard: Space plays, Arrow steps, R restarts", async ({ page }) => {
  await page.goto(DEMO_URL);
  await page.getByTestId("pl-demo").focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-playing", "1");
  await page.keyboard.press("Space");
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-playing", "0");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-step", "clean");
  await page.keyboard.press("r");
  await expect(page.getByTestId("pl-demo")).toHaveAttribute("data-step", "overview");
});

test("PL-T06 layout, axe, no overflow, controls reachable", async ({ page }) => {
  await page.goto(DEMO_URL);
  await noHorizontalOverflow(page);
  await expect(page.getByTestId("pl-play")).toBeVisible();
  await page.getByTestId("pl-scrub").fill("86000");
  await expect(page.getByTestId("pl-cta")).toBeVisible();
  await noHorizontalOverflow(page);
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});

test("PL-T09/T10 no external requests; CTA links resolve; works offline after load", async ({ page, context }) => {
  const external: string[] = [];
  page.on("request", (rq) => { const u = new URL(rq.url()); if (u.hostname !== "localhost" && !u.protocol.startsWith("data")) external.push(rq.url()); });
  const errors: string[] = []; page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(DEMO_URL);
  await page.waitForLoadState("networkidle");
  await context.setOffline(true);
  await page.getByTestId("pl-play").click();
  await page.getByTestId("pl-scrub").fill("86000");
  await expect(page.getByTestId("pl-cta")).toBeVisible();
  await context.setOffline(false);
  for (const href of ["/get-started", "/architecture", "/stations/park-lane"]) {
    const r = await page.request.get(`.${href}`.replace("./", "") );
    expect(r.status(), href).toBe(200);
  }
  expect(errors).toEqual([]);
  expect(external.filter((u) => !/fonts\.(googleapis|gstatic)|mapbox/.test(u))).toEqual([]);
});

test("CTAs from /stations and the Park Lane station page reach the demo", async ({ page }) => {
  await page.goto("stations");
  await page.getByTestId("pl-demo-cta").click();
  await expect(page).toHaveURL(/stations\/park-lane\/demo/);
  await page.goto("stations/park-lane");
  await page.getByTestId("act-pl-demo").click();
  await expect(page.getByRole("heading", { name: /Park Lane — guided demo/ })).toBeVisible();
});

test("PL-T08 malformed station slug under demo path is a safe 404; markup in query is inert", async ({ page }) => {
  const r = await page.goto("stations/park-lane%3Cscript%3Ealert(1)%3C/script%3E/demo");
  expect(r?.status()).toBe(404);
  await page.goto(`${DEMO_URL}?x=%3Cscript%3Ewindow.__x=1%3C/script%3E`);
  expect(await page.evaluate(() => (window as unknown as { __x?: number }).__x)).toBeUndefined();
});
