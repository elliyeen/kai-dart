export type LineId = "red" | "green" | "blue" | "orange" | "silver";
export type DemoStatus = "good" | "warning" | "critical" | "deploying" | "closed";

/** One record per original station id / line membership (115 in the baseline). */
export interface StationRecord {
  id: string;
  name: string;
  lineId: LineId;
  city: string;
  lat: number;
  lng: number;
  closure?: string;
  /** SYNTHETIC DEMO condition values carried over from the original app. Not DART data. */
  demo: { score: number; status: DemoStatus; issues: string[] };
}

/** A physical station: all line-membership records that share a name. */
export interface Station {
  /** Canonical key = id of its first (lowest line order) record. */
  key: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  closure?: string;
  lineIds: LineId[];
  recordIds: string[];
  demo: { score: number; status: DemoStatus; issues: string[] };
}
