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
    // Existing Chromium viewport projects run everything except the cross-browser sweep.
    { name: "desktop-1440", testIgnore: /cross-browser/, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "ipad-1024", testIgnore: /cross-browser/, use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 }, hasTouch: true } },
    { name: "ipad-768", testIgnore: /cross-browser/, use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "mobile-430", testIgnore: /cross-browser/, use: { ...devices["Desktop Chrome"], viewport: { width: 430, height: 932 }, hasTouch: true } },
    { name: "mobile-390", testIgnore: /cross-browser/, use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, hasTouch: true } },
    // Cross-browser and real device profiles run the cross-browser sweep only.
    { name: "firefox-1280", testMatch: /cross-browser/, use: { ...devices["Desktop Firefox"], viewport: { width: 1280, height: 800 } } },
    { name: "safari-1280", testMatch: /cross-browser/, use: { ...devices["Desktop Safari"], viewport: { width: 1280, height: 800 } } },
    { name: "iphone-14", testMatch: /cross-browser/, use: { ...devices["iPhone 14"] } },
    { name: "ipad-pro-11", testMatch: /cross-browser/, use: { ...devices["iPad Pro 11"] } },
    { name: "pixel-7", testMatch: /cross-browser/, use: { ...devices["Pixel 7"] } },
    { name: "chrome-sweep", testMatch: /cross-browser/, use: { ...devices["Desktop Chrome"] } },
  ],
});
