import { describe, expect, it } from "vitest";
import { linesGeoJSON, stationBounds, stationsGeoJSON } from "@/lib/stations/geojson";
import { STATIONS } from "@/lib/stations";

describe("Mapbox GeoJSON", () => {
  it("emits one point per station with rollout state and [lng,lat] order", () => {
    const g = stationsGeoJSON();
    expect(g.features).toHaveLength(STATIONS.length);
    const akard = g.features.find((f) => f.properties.key === "akard")!;
    expect(akard.properties.rollout).toBe("pilot-planned");
    expect(akard.geometry.coordinates[0]).toBeLessThan(-96); // longitude first
    expect(akard.geometry.coordinates[1]).toBeGreaterThan(32);
    expect(g.features.filter((f) => f.properties.rollout === "connected")).toHaveLength(0);
    expect(akard.properties.lines.split(",").sort()).toEqual(["blue", "green", "orange", "red"]);
  });
  it("emits five line strings and bounds that contain every station", () => {
    expect(linesGeoJSON().features.map((f) => f.properties.line).sort()).toEqual(["blue", "green", "orange", "red", "silver"]);
    const [[w, s], [e, n]] = stationBounds();
    for (const st of STATIONS) { expect(st.lng).toBeGreaterThanOrEqual(w); expect(st.lng).toBeLessThanOrEqual(e); expect(st.lat).toBeGreaterThanOrEqual(s); expect(st.lat).toBeLessThanOrEqual(n); }
  });
});
