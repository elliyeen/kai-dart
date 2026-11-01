import { describe, expect, it } from "vitest";
import { SCENARIOS } from "@/lib/scenarios";

describe("test case scenarios", () => {
  it("covers the four demo stations", () => {
    expect(SCENARIOS.map((s) => s.station)).toEqual(["Park Lane", "Spring Valley", "Akard", "SMU/Mockingbird"]);
  });
  it("every step names actor, input, output and owner", () => {
    for (const s of SCENARIOS) for (const st of s.steps) for (const k of ["actor", "input", "output", "owner"] as const) expect(st[k].length, `${s.testId} ${st.stage} ${k}`).toBeGreaterThan(0);
  });
  it("ends in independent verification by a different actor than the one who did the work", () => {
    for (const s of SCENARIOS) {
      const last = s.steps[s.steps.length - 1];
      expect(last.stage).toBe("Verified");
      expect(last.actor).toBe("Field Inspector");
      expect(s.steps.filter((x) => x.stage === "In progress").every((x) => x.actor !== last.actor)).toBe(true);
    }
  });
});
