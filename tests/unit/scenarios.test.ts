import { describe, expect, it } from "vitest";
import { SCENARIOS, STAGES, blockedWindow, stageStarts } from "@/lib/scenarios";
import { PROVIDER_BY_ID, TECHNICIANS } from "@/lib/vendors";

describe("test case scenarios", () => {
  it("covers the four demo stations", () => {
    expect(SCENARIOS.map((s) => s.station)).toEqual(["Park Lane", "Spring Valley", "Akard", "SMU/Mockingbird"]);
  });
  it("every step names actor, input, output and owner, and times only move forward", () => {
    for (const s of SCENARIOS) {
      let prev = -1;
      for (const st of s.steps) { for (const k of ["actor", "input", "output", "owner"] as const) expect(st[k].length, `${s.testId} ${k}`).toBeGreaterThan(0); expect(st.atMin).toBeGreaterThanOrEqual(prev); prev = st.atMin; }
    }
  });
  it("routes to a named provider and technician, with acknowledgment before arrival and confirmation before verification", () => {
    for (const s of SCENARIOS) {
      expect(PROVIDER_BY_ID[s.providerId], s.testId).toBeDefined();
      expect(TECHNICIANS.some((t) => t.id === s.technician && t.providerId === s.providerId), s.testId).toBe(true);
      const st = stageStarts(s);
      expect(STAGES.every((g) => Number.isFinite(st[g]))).toBe(true);
      expect(st.Dispatched).toBeLessThan(st.Accepted); expect(st.Accepted).toBeLessThan(st["On site"]);
      expect(st["On site"]).toBeLessThan(st.Completed); expect(st.Completed).toBeLessThan(st.Verified);
      expect(st.Verified).toBe(s.totalMin);
    }
  });
  it("ends in independent verification by an inspector who is not the technician's crew", () => {
    for (const s of SCENARIOS) {
      const last = s.steps[s.steps.length - 1];
      expect(last.stage).toBe("Verified"); expect(last.actor).toBe("Field Inspector");
      expect(s.steps.filter((x) => x.stage === "Accepted" || x.stage === "On site").every((x) => x.actor !== last.actor)).toBe(true);
    }
  });
  it("records waiting-on-parts as its own period for the elevator", () => {
    const e = SCENARIOS.find((s) => s.id === "smu-mockingbird")!;
    expect(blockedWindow(e)).toEqual([32, 52]);
    expect(SCENARIOS.filter((s) => blockedWindow(s)).length).toBe(1);
  });
});
