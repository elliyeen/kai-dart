"use client";
import { useMemo } from "react";
import { LINES, STATIONS, STATION_RECORDS, type LineId } from "@/lib/stations";

const W = 640, H = 560, PAD = 28;

/** Schematic SVG built from the app's own station coordinates. Not to scale, not a navigational map. */
export default function MapPanel({ selectedKey, line, onSelect }: { selectedKey?: string | null; line?: LineId | null; onSelect?: (key: string) => void }) {
  const proj = useMemo(() => {
    const lats = STATIONS.map((s) => s.lat), lngs = STATIONS.map((s) => s.lng);
    const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
    const k = Math.min((W - 2 * PAD) / (maxLng - minLng), (H - 2 * PAD) / (maxLat - minLat));
    return (lat: number, lng: number) => [PAD + (lng - minLng) * k, H - PAD - (lat - minLat) * k] as const;
  }, []);
  const paths = useMemo(() => LINES.map((l) => ({
    id: l.id, color: l.color,
    d: STATION_RECORDS.filter((r) => r.lineId === l.id).map((r, i) => { const [x, y] = proj(r.lat, r.lng); return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`; }).join(" "),
  })), [proj]);
  const sel = STATIONS.find((s) => s.key === selectedKey);

  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Schematic map of DART rail stations by line. Use the station list for keyboard access." className="w-full h-auto bg-slate-50 border border-gray-200 rounded-lg">
        {paths.map((p) => <path key={p.id} d={p.d} fill="none" stroke={p.color} strokeWidth={2.5} opacity={!line || line === p.id ? 0.85 : 0.12} strokeLinejoin="round" />)}
        {STATIONS.map((s) => {
          const [x, y] = proj(s.lat, s.lng);
          const dim = line && !s.lineIds.includes(line);
          return (
            <circle key={s.key} cx={x} cy={y} r={s.key === selectedKey ? 7 : 3.5} fill={s.key === selectedKey ? "#0B1F33" : "#fff"} stroke="#0B1F33" strokeWidth={1.5} opacity={dim ? 0.2 : 1}
              onClick={onSelect ? () => onSelect(s.key) : undefined} style={onSelect ? { cursor: "pointer" } : undefined}>
              <title>{s.name}</title>
            </circle>
          );
        })}
        {sel && (() => { const [x, y] = proj(sel.lat, sel.lng); return <text x={Math.min(x + 12, W - 110)} y={y - 10} fontSize="14" fill="#0B1F33" fontWeight="600" paintOrder="stroke" stroke="#fff" strokeWidth="4">{sel.name}</text>; })()}
      </svg>
      <figcaption className="mt-2 text-xs text-gray-600">Schematic from the app&apos;s station coordinates; not to scale and not a navigation map.</figcaption>
    </figure>
  );
}
