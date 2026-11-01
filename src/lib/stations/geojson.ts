import { LINES } from "./lines";
import { STATIONS, STATION_RECORDS } from "./index";
import { rolloutOf, ROLLOUT_LABEL } from "./rollout";

export interface StationFeatureProps { key: string; name: string; rollout: string; rolloutLabel: string; lines: string }

/** Station points for Mapbox. `lines` is a comma-joined list ("red,blue") so Mapbox filters can use `in`. */
export function stationsGeoJSON() {
  return {
    type: "FeatureCollection" as const,
    features: STATIONS.map((s) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [s.lng, s.lat] as [number, number] },
      properties: { key: s.key, name: s.name, rollout: rolloutOf(s.key), rolloutLabel: ROLLOUT_LABEL[rolloutOf(s.key)], lines: s.lineIds.join(",") } satisfies StationFeatureProps,
    })),
  };
}

/** One LineString per rail line, in the original app's station order. */
export function linesGeoJSON() {
  return {
    type: "FeatureCollection" as const,
    features: LINES.map((l) => ({
      type: "Feature" as const,
      geometry: { type: "LineString" as const, coordinates: STATION_RECORDS.filter((r) => r.lineId === l.id).map((r) => [r.lng, r.lat] as [number, number]) },
      properties: { line: l.id, color: l.color },
    })),
  };
}

export function stationBounds(): [[number, number], [number, number]] {
  const lngs = STATIONS.map((s) => s.lng), lats = STATIONS.map((s) => s.lat);
  return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
}
