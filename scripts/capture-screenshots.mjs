// Captures REAL browser screenshots of the static export (out/) into docs/screenshots/release/.
// Usage: GITHUB_PAGES=true npm run build && node scripts/capture-screenshots.mjs
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";

const OUT = "docs/screenshots/release";
fs.mkdirSync(OUT, { recursive: true });
const server = spawn("node", ["scripts/serve-out.mjs"], { env: { ...process.env, PORT: "4180" }, stdio: "ignore" });
await new Promise((r) => setTimeout(r, 1200));
const base = "http://localhost:4180/kai-dart/";
const browser = await chromium.launch();

const shot = async (name, width, height, path, { full = false, prep } = {}) => {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce", hasTouch: width < 1100 });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: "networkidle" });
  if (full) { for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 400) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(80); } await page.evaluate(() => window.scrollTo(0, 0)); }
  if (prep) await prep(page);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  console.log("wrote", name);
  await ctx.close();
};
const role = (label) => (p) => p.getByTestId("role-select").selectOption({ label });
const act = async (p, r, btn) => { await p.getByTestId("role-select").selectOption({ label: r }); await p.getByRole("button", { name: btn, exact: true }).click(); };

await shot("landing-1440", 1440, 900, "", { full: true });
await shot("landing-390", 390, 844, "", { full: true });
await shot("desktop-network-1440", 1440, 900, "stations");
await shot("desktop-network-1280", 1280, 800, "stations");
await shot("desktop-akard-1440", 1440, 900, "stations?station=akard");
await shot("desktop-akard-awaiting-verification-1440", 1440, 900, "stations?station=akard", { prep: async (p) => { await act(p, "Operations Command", "Assign Work"); await act(p, "Contractor / Crew", "Submit Proof"); await role("Field Inspector")(p); } });
await shot("desktop-network-after-verification-1440", 1440, 900, "stations?station=akard", { prep: async (p) => { await act(p, "Operations Command", "Assign Work"); await act(p, "Contractor / Crew", "Submit Proof"); await act(p, "Field Inspector", "Verify"); await role("Executive")(p); await p.goto(base + "stations", { waitUntil: "networkidle" }); } });
await shot("desktop-red-line-filter-1440", 1440, 900, "stations?line=red");
await shot("ipad-1024-network", 1024, 768, "stations");
await shot("ipad-1024-akard", 1024, 768, "stations/akard");
await shot("ipad-768-network", 768, 1024, "stations");
await shot("ipad-768-akard", 768, 1024, "stations/akard");
for (const w of [430, 390]) {
  const h = w === 430 ? 932 : 844;
  await shot(`mobile-${w}-network`, w, h, "stations");
  await shot(`mobile-${w}-akard`, w, h, "stations/akard", { full: true });
  await shot(`mobile-${w}-work-contractor`, w, h, "stations/work", { prep: role("Contractor / Crew") });
}
await browser.close();
server.kill();
