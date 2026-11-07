import { expect, test } from "@playwright/test";

// Responsive on any device and browser: runs in Chromium, Firefox, WebKit and phone/tablet device profiles.
const ROUTES = ["", "faq", "get-started", "checkout", "architecture", "contact", "stations", "stations/akard", "stations/report", "stations/inventory", "stations/contractors"];
const WIDTHS = [320, 360, 390, 430, 600, 768, 834, 1024, 1280, 1440, 1920, 2560];

for (const route of ROUTES) {
  test(`no horizontal overflow or clipped content at every width: /${route}`, async ({ page }) => {
    test.setTimeout(150_000);
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: w < 700 ? 800 : 900 });
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(150);
      const m = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const clipped: string[] = [];
        for (const el of document.querySelectorAll<HTMLElement>("main h1, main h2, main button, main a, main input, main label")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          // ignore elements inside an intentional horizontal scroller
          let scroller = false;
          for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { if (/(auto|scroll)/.test(getComputedStyle(a).overflowX) && a.scrollWidth > a.clientWidth) { scroller = true; break; } }
          if (!scroller && (r.right > vw + 1 || r.left < -1)) clipped.push(`${el.tagName}:${(el.textContent || "").trim().slice(0, 30)}`);
        }
        return { over: document.documentElement.scrollWidth - vw, clipped: clipped.slice(0, 5) };
      });
      expect(m.over, `overflow at ${w}px`).toBeLessThanOrEqual(0);
      expect(m.clipped, `clipped elements at ${w}px`).toEqual([]);
    }
  });
}

test("viewport meta is set and text can be zoomed", async ({ page }) => {
  await page.goto("");
  const meta = await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(meta).toContain("width=device-width");
  expect(meta ?? "").not.toMatch(/user-scalable=no|maximum-scale=1(\.0)?(,|$)/);
});

test("core content is present without JavaScript (progressive enhancement)", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const [route, text] of [["", "Super experience"], ["faq", "FAQ"], ["get-started", "A more intelligent transit network."], ["architecture", "DART Super Intelligence"], ["checkout", "Configure your proposal"]] as const) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(text);
  }
  await ctx.close();
});

test("main flows work on this browser: mobile menu, architecture, checkout", async ({ page }) => {
  await page.goto("architecture");
  await expect(page.getByTestId("arch-node")).toHaveCount(5);
  await expect(page.getByTestId("arch-akard")).toBeVisible();
  await page.goto("checkout");
  await page.getByLabel("Organization").fill("Sample Transit Agency");
  await page.getByLabel("Business email", { exact: true }).fill("person@agency.example.org");
  await page.getByLabel(/I understand this is a request for a proposal/).check();
  await page.getByRole("button", { name: "Review proposal" }).click();
  await expect(page.getByTestId("next-steps")).toContainText("has not been submitted or sent anywhere");
});

test("reduced motion and dark scheme keep text readable (contrast of headings and paragraphs)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  for (const route of ["", "faq", "get-started", "checkout", "architecture", "stations"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    const bad = await page.evaluate(() => {
      const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d", { willReadFrequently: true })!;
      // Resolve any CSS color (rgb, oklch, lab) to rgba via a 1px canvas.
      const parse = (c: string) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
      const lum = ([r, g, b]: number[]) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const bgOf = (el: Element) => { for (let a: Element | null = el; a; a = a.parentElement) { const c = parse(getComputedStyle(a).backgroundColor); if (c.length >= 3 && (c[3] ?? 1) > 0.5) return c; } return [255, 255, 255]; };
      const out: string[] = [];
      for (const el of document.querySelectorAll("main h1, main h2, main p, main li, main label, main button")) {
        const r = el.getBoundingClientRect(); if (!r.width || !r.height || !(el.textContent ?? "").trim()) continue;
        let overPhoto = false; for (let a: Element | null = el; a && a !== document.body; a = a.parentElement) { if (a.querySelector(":scope > img")) { overPhoto = true; break; } }
        if (overPhoto) continue;
        const fg = parse(getComputedStyle(el).color), bg = bgOf(el);
        const l1 = lum(fg), l2 = lum(bg), ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        if (ratio < 3) out.push(`${el.tagName}:${(el.textContent ?? "").trim().slice(0, 24)} ${ratio.toFixed(1)}`);
      }
      return out.slice(0, 5);
    });
    expect(bad, `low contrast in dark scheme on /${route}`).toEqual([]);
  }
});
