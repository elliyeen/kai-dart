import { describe, expect, it } from "vitest";
import { STATIONS } from "@/lib/stations";
import { ROLLOUT, publicStopFor, rolloutOf } from "@/lib/stations/rollout";
import { PUBLIC_STOPS } from "@/lib/stations/publicData.generated";
import { DFW_COUNTIES } from "@/lib/geo/dfw-counties";

describe("rollout status", () => {
  it("only references real stations", () => {
    const keys = new Set(STATIONS.map((s) => s.key));
    for (const k of Object.keys(ROLLOUT)) expect(keys.has(k), k).toBe(true);
  });
  it("never marks a station connected without evidence", () => {
    for (const [k, e] of Object.entries(ROLLOUT))
      if (e.status === "connected") {
        expect(e.evidence.source, k).toBeTruthy();
        expect(e.evidence.authorizedBy, k).toBeTruthy();
        expect(Date.parse(e.evidence.connectedAt), k).not.toBeNaN();
      }
  });
  it("starts honest: nothing is LIVE-connected; Akard is the single demo station", () => {
    expect(STATIONS.filter((s) => rolloutOf(s.key) === "connected")).toHaveLength(0);
    expect(STATIONS.filter((s) => rolloutOf(s.key) === "demo").map((s) => s.key)).toEqual(["akard"]);
  });
  it("links every station to official public schedule data (derived, never hand-set)", () => {
    const states = STATIONS.map((s) => rolloutOf(s.key));
    expect(states.filter((x) => x === "not-connected")).toHaveLength(0);
    expect(states.filter((x) => x === "public-data")).toHaveLength(STATIONS.length - 1); // Akard shows as the demo station
    for (const s of STATIONS) expect(publicStopFor(s.key), s.key).toBeTruthy();
    expect(Object.values(ROLLOUT).some((e) => (e.status as string) === "public-data")).toBe(false);
  });
  it("covers all 115 original records with an official stop id", () => {
    expect(Object.keys(PUBLIC_STOPS)).toHaveLength(115);
    for (const v of Object.values(PUBLIC_STOPS)) expect(v.stopId).toMatch(/^\d+$/);
  });
});

describe("DFW base map data", () => {
  it("covers every station inside the included county outlines' bounding box", () => {
    const pts = DFW_COUNTIES.flatMap((c) => c.rings.flat());
    const [minLng, maxLng] = [Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[0]))];
    const [minLat, maxLat] = [Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[1]))];
    for (const s of STATIONS) {
      expect(s.lng).toBeGreaterThan(minLng); expect(s.lng).toBeLessThan(maxLng);
      expect(s.lat).toBeGreaterThan(minLat); expect(s.lat).toBeLessThan(maxLat);
    }
    expect(DFW_COUNTIES.map((c) => c.name)).toEqual(expect.arrayContaining(["Dallas", "Collin", "Denton", "Tarrant"]));
  });
});
