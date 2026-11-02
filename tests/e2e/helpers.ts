import { expect, type Page } from "@playwright/test";
import baseline from "../../docs/baseline/stations-baseline.json";

export const BASE = baseline.records as Array<{ id: string; name: string; lineId: string }>;
export const UNIQUE_NAMES = [...new Set(BASE.map((b) => b.name))];
export const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;

export async function setRole(page: Page, label: string) {
  if (isDesktop(page)) {
    await page.getByTestId("account-button").click();
    await page.getByRole("menuitemradio", { name: new RegExp(`^${label.replace(/[/]/g, "\\$&")}`) }).click();
  } else await page.getByTestId("role-select").selectOption({ label });
}
export async function noHorizontalOverflow(page: Page) {
  const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(o, "horizontal overflow px").toBeLessThanOrEqual(0);
}
