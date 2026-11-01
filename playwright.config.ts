import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}/kai-dart/`, trace: "retain-on-failure" },
  webServer: { command: "node scripts/serve-out.mjs", url: `http://localhost:${PORT}/kai-dart/`, reuseExistingServer: !process.env.CI, env: { PORT: String(PORT) } },
  projects: [
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "ipad-1024", use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 }, hasTouch: true } },
    { name: "ipad-768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "mobile-430", use: { ...devices["Desktop Chrome"], viewport: { width: 430, height: 932 }, hasTouch: true } },
    { name: "mobile-390", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, hasTouch: true } },
  ],
});
