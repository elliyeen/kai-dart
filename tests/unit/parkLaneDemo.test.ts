import { describe, expect, it } from "vitest";
import { ACTORS, BASELINE_SCORE, DEMO_DURATION_MS, DEMO_STATION_ID, buildTimeline, canVerify, nextStepTime, prevStepTime, stateAt } from "@/lib/parkLaneDemo";
import { STATION_RECORDS } from "@/lib/stations";

describe("Park Lane demo engine", () => {
  it("uses the real canonical Red Line station id", () => {
    const r = STATION_RECORDS.find((x) => x.id === DEMO_STATION_ID);
    expect(r?.name).toBe("Park Lane"); expect(r?.lineId).toBe("red");
  });
  it("is within 100s and every event lies inside the timeline", () => {
    expect(DEMO_DURATION_MS).toBeLessThanOrEqual(100_000);
    for (const rw of [false, true]) for (const e of buildTimeline(rw).events) expect(e.at).toBeLessThanOrEqual(DEMO_DURATION_MS);
  });
  it("is deterministic: same time gives identical state", () => {
    expect(stateAt(47_300)).toEqual(stateAt(47_300));
    expect(stateAt(DEMO_DURATION_MS)).toEqual(stateAt(DEMO_DURATION_MS));
  });
  it("starts clean and ends with 3 verified and baseline readiness", () => {
    const a = stateAt(0); expect(a.readiness).toBe(BASELINE_SCORE); expect(a.verifiedCount).toBe(0);
    const z = stateAt(DEMO_DURATION_MS); expect(z.verifiedCount).toBe(3); expect(z.readiness).toBe(BASELINE_SCORE); expect(z.done).toBe(true);
  });
  it("contractor claim alone never verifies; readiness stays impacted", () => {
    const s = stateAt(42_000); // elevator fix claimed at 40s, verified at 46s
    expect(s.issues.elev.status).toBe("fix_claimed");
    expect(s.readiness).toBeLessThan(BASELINE_SCORE);
  });
  it("every Verified event is by an Inspector who is not the claimant", () => {
    for (const rw of [false, true]) for (const e of buildTimeline(rw).events.filter((x) => x.status === "verified")) {
      expect(e.claimant).toBeDefined(); expect(canVerify(e.actor, e.claimant!)).toBe(true);
    }
    expect(canVerify(ACTORS.crewElev, ACTORS.crewElev)).toBe(false);
    expect(canVerify(ACTORS.crewClean, ACTORS.crewClean)).toBe(false);
    expect(canVerify(ACTORS.ops, ACTORS.crewClean)).toBe(false);
  });
  it("rework path: rejection leaves the incident unresolved, then verifies", () => {
    expect(stateAt(42_000, true).issues.elev.status).toBe("rejected");
    expect(stateAt(42_000, true).readiness).toBeLessThan(BASELINE_SCORE);
    expect(stateAt(DEMO_DURATION_MS, true).issues.elev.status).toBe("verified");
  });
  it("next/back seek logically", () => {
    expect(nextStepTime(0)).toBe(10_000); expect(nextStepTime(DEMO_DURATION_MS)).toBe(DEMO_DURATION_MS);
    expect(prevStepTime(12_000)).toBe(10_000); expect(prevStepTime(10_500)).toBe(0); expect(prevStepTime(0)).toBe(0);
  });
});
