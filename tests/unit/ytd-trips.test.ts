import { describe, expect, it } from "vitest";
import { completedDaysThisYear, estimateYtdTrips } from "@/lib/ytd-trips";

describe("year-to-date trip estimate", () => {
  it("counts completed days", () => {
    expect(completedDaysThisYear(new Date(2026, 0, 1))).toBe(0);
    expect(completedDaysThisYear(new Date(2026, 0, 2))).toBe(1);
    expect(completedDaysThisYear(new Date(2026, 10, 1))).toBe(304);
  });
  it("Nov 1 2026 is 171,000 x 304", () => {
    expect(estimateYtdTrips(new Date(2026, 10, 1))).toBe(51_984_000);
  });
});
