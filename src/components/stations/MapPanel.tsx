"use client";
import { useMemo } from "react";
import { DFW_COUNTIES } from "@/lib/geo/dfw-counties";
import { LINES, STATIONS, STATION_RECORDS, type LineId } from "@/lib/stations";
import { rolloutOf, ROLLOUT_LABEL, type RolloutStatus } from "@/lib/stations/rollout";
import StationsMapbox from "./StationsMapbox";

const W = 640, H = 600, PAD = 20;
// City labels for orientation only (approximate city-center coordinates).
type City = { name: string; lat: number; lng: number; dx: number; dy: number; anchor: "start" | "end" | "middle" };
const CITIES: City[] = [
  { name: "Dallas", lat: 32.7767, lng: -96.797, dx: -16, dy: -10, anchor: "end" }, { name: "Plano", lat: 33.0198, lng: -96.6989, dx: 14, dy: -8, anchor: "start" },
  { name: "Irving", lat: 32.814, lng: -96.9489, dx: -12, dy: 4, anchor: "end" }, { name: "Garland", lat: 32.9126, lng: -96.6389, dx: -8, dy: -12, anchor: "end" },
  { name: "DFW Airport", lat: 32.8998, lng: -97.0403, dx: 10, dy: -12, anchor: "start" }, { name: "Rowlett", lat: 32.9029, lng: -96.5639, dx: 0, dy: -14, anchor: "middle" },
];

/** Dallas–Fort Worth base map: Census county outlines + the app's own station coordinates. Not to scale for navigation. */
type MapProps = { mode?: "network" | "rollout"; selectedKey?: string | null; line?: LineId | null; onSelect?: (key: string) => void };
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

/** Mapbox when a public token is configured at build time; otherwise the self-contained SVG county map. */
export default function MapPanel(props: MapProps) {
  if (MAPBOX_TOKEN) {
    return (
      <figure className="m-0">
        <StationsMapbox token={MAPBOX_TOKEN} mode={props.mode ?? "network"} line={props.line} selectedKey={props.selectedKey} onSelect={props.onSelect} />
        <figcaption className="mt-2 text-xs text-gray-600">Base map © Mapbox © OpenStreetMap. Station positions: the app&apos;s station coordinates. Orientation only, not a navigation map.</figcaption>
      </figure>
    );
  }
  return <SvgCountyMap {...props} />;
}

function SvgCountyMap({ mode = "network", selectedKey, line, onSelect }: MapProps) {
  const g = useMemo(() => {
    const lats = STATIONS.map((s) => s.lat), lngs = STATIONS.map((s) => s.lng);
    const pad = 0.035;
    const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats) - pad, Math.max(...lats) + pad, Math.min(...lngs) - pad, Math.max(...lngs) + pad];
    const cosLat = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);   // true-shape longitude scaling
    const k = Math.min((W - 2 * PAD) / ((maxLng - minLng) * cosLat), (H - 2 * PAD) / (maxLat - minLat));
    const ox = (W - (maxLng - minLng) * cosLat * k) / 2, oy = (H - (maxLat - minLat) * k) / 2;
    const proj = (lat: number, lng: number) => [ox + (lng - minLng) * cosLat * k, H - oy - (lat - minLat) * k] as const;
    const counties = DFW_COUNTIES.map((c) => {
      const ring = c.rings.reduce((a, b) => (b.length > a.length ? b : a));
      const d = c.rings.map((r) => r.map(([lng, lat], i) => { const [x, y] = proj(lat, lng); return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`; }).join("") + "Z").join("");
      // Label sits just inside the county's top-left corner so it never lands on the rail network.
      const xs = ring.map(([lng, lat]) => proj(lat, lng)[0]), ys = ring.map(([lng, lat]) => proj(lat, lng)[1]);
      const lx = Math.min(...xs) + 12, ly = Math.min(...ys) + 20;
      return { fips: c.fips, name: c.name, d, lx, ly };
    });
    const paths = LINES.map((l) => ({ id: l.id, color: l.color, d: STATION_RECORDS.filter((r) => r.lineId === l.id).map((r, i) => { const [x, y] = proj(r.lat, r.lng); return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ") }));
    return { proj, counties, paths };
  }, []);

  const rollout = mode === "rollout";
  const sel = STATIONS.find((s) => s.key === selectedKey);
  const dot = (s: (typeof STATIONS)[number]) => {
    const [x, y] = g.proj(s.lat, s.lng);
    const dim = !rollout && line && !s.lineIds.includes(line);
    if (rollout) {
      const st: RolloutStatus = rolloutOf(s.key);
      if (st === "demo") return <circle key={s.key} cx={x} cy={y} r={8} fill="#F59E0B" stroke="#0B1F33" strokeWidth={2}><title>{`${s.name} — ${ROLLOUT_LABEL[st]}`}</title></circle>;
      if (st === "connected") return <circle key={s.key} cx={x} cy={y} r={6} fill="#0057A8" stroke="#fff" strokeWidth={1.5}><title>{`${s.name} — ${ROLLOUT_LABEL[st]}`}</title></circle>;
      if (st === "pilot-planned") return <circle key={s.key} cx={x} cy={y} r={6} fill="#fff" stroke="#0057A8" strokeWidth={2} strokeDasharray="3 2"><title>{`${s.name} — ${ROLLOUT_LABEL[st]}`}</title></circle>;
      return <circle key={s.key} cx={x} cy={y} r={3.6} fill="#fff" stroke="#6B7280" strokeWidth={1.4}><title>{`${s.name} — ${ROLLOUT_LABEL[st]}`}</title></circle>;
    }
    return (
      <circle key={s.key} cx={x} cy={y} r={s.key === selectedKey ? 7 : 3.6} fill={s.key === selectedKey ? "#0B1F33" : "#fff"} stroke="#0B1F33" strokeWidth={1.5} opacity={dim ? 0.2 : 1}
        onClick={onSelect ? () => onSelect(s.key) : undefined} style={onSelect ? { cursor: "pointer" } : undefined}><title>{s.name}</title></circle>
    );
  };

  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" data-testid={`map-${mode}`}
        aria-label={rollout ? "Map of the Dallas–Fort Worth area showing each station's KAI rollout status. Use the station directory for a text list." : "Map of DART rail stations by line over Dallas–Fort Worth counties. Use the station list for keyboard access."}
        className="w-full h-auto bg-slate-50 border border-gray-200 rounded-2xl">
        <defs><clipPath id={`clip-${mode}`}><rect width={W} height={H} rx="16" /></clipPath></defs>
        <g clipPath={`url(#clip-${mode})`}>
          {g.counties.map((c) => <path key={c.fips} d={c.d} fill="#E7EBF0" stroke="#fff" strokeWidth={2} />)}
          {g.counties.map((c) => c.lx > 6 && c.lx < W - 120 && c.ly > 14 && c.ly < H - 20 && <text key={c.fips} x={c.lx} y={c.ly} textAnchor="start" fontSize="11" letterSpacing="1.5" fill="#4B5563">{c.name.toUpperCase()} CO.</text>)}
          {g.paths.map((p) => <path key={p.id} d={p.d} fill="none" stroke={p.color} strokeWidth={rollout ? 2 : 2.5} opacity={rollout ? 0.3 : !line || line === p.id ? 0.85 : 0.12} strokeLinejoin="round" />)}
          {CITIES.map((c) => { const [x, y] = g.proj(c.lat, c.lng); return <text key={c.name} x={x + c.dx} y={y + c.dy} textAnchor={c.anchor} fontSize="12.5" fontWeight="600" fill="#1F2937" paintOrder="stroke" stroke="#E7EBF0" strokeWidth="4">{c.name}</text>; })}
          {STATIONS.map(dot)}
          {rollout && (() => { const a = STATIONS.find((s) => rolloutOf(s.key) === "demo"); if (!a) return null; const [x, y] = g.proj(a.lat, a.lng); return <text x={x + 14} y={y + 4} fontSize="13" fontWeight="700" fill="#0B1F33" paintOrder="stroke" stroke="#fff" strokeWidth="4">{a.name} (demo)</text>; })()}
          {!rollout && sel && (() => { const [x, y] = g.proj(sel.lat, sel.lng); return <text x={Math.min(x + 12, W - 110)} y={y - 10} fontSize="14" fill="#0B1F33" fontWeight="600" paintOrder="stroke" stroke="#fff" strokeWidth="4">{sel.name}</text>; })()}
        </g>
      </svg>
      <figcaption className="mt-2 text-xs text-gray-600">County outlines: US Census cartographic boundaries. Station positions: the app&apos;s station coordinates. Orientation only, not a navigation map.</figcaption>
    </figure>
  );
}
