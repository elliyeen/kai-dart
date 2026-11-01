"use client";
import { useState } from "react";
import { Layers, Sparkles, Waypoints, Footprints } from "lucide-react";
import { AKARD_ASSETS, AKARD_LAYOUT_NOTE, assetStatus, type TwinAsset } from "@/lib/stations/geometry";
import { EFF_LABEL, type Eff } from "@/lib/stations/effective";
import type { DemoState } from "@/lib/demo/workflow";

const TONE: Record<Eff, { dot: string; ring: string }> = {
  critical: { dot: "#DC2626", ring: "#FCA5A5" }, closed: { dot: "#6B7280", ring: "#D1D5DB" }, deploying: { dot: "#D97706", ring: "#FCD34D" },
  warning: { dot: "#D97706", ring: "#FCD34D" }, good: { dot: "#16A34A", ring: "#86EFAC" }, assigned: { dot: "#2563EB", ring: "#93C5FD" },
  awaiting: { dot: "#4F46E5", ring: "#A5B4FC" }, verified: { dot: "#16A34A", ring: "#86EFAC" }, unknown: { dot: "#6B7280", ring: "#D1D5DB" },
};
// Callout anchor points (percent of the twin canvas) and the matching marker position in the SVG (viewBox 1000x440).
const POS: Record<TwinAsset["id"], { left: number; top: number; mx: number; my: number; bubble: { left: number; top: number } }> = {
  "platform-a": { left: 22, top: 18, mx: 220, my: 115, bubble: { left: 9, top: 7 } },
  "platform-b": { left: 74, top: 80, mx: 740, my: 355, bubble: { left: 61, top: 69 } },
  access:       { left: 50, top: 50, mx: 500, my: 220, bubble: { left: 57, top: 41 } },
};

export default function AkardTwin({ demo, selected, onSelect }: { demo: DemoState; selected: TwinAsset["id"]; onSelect: (id: TwinAsset["id"]) => void }) {
  const [callouts, setCallouts] = useState(true);
  const [highlight, setHighlight] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);
  const issueActive = demo.wo.status !== "verified";

  return (
    <section aria-labelledby="twin-h" className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <h2 id="twin-h" className="sr-only">Akard Station schematic digital twin</h2>
      <div className="relative bg-[#EEF2F6]" style={{ aspectRatio: "1000 / 440" }}>
        <svg viewBox="0 0 1000 440" className="absolute inset-0 w-full h-full" role="img" aria-label="Schematic plan of Akard Station: two side platforms either side of the tracks, with an at-grade street crossing between them.">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#E2E8F0" strokeWidth="1" /></pattern>
            <pattern id="ties" width="14" height="30" patternUnits="userSpaceOnUse"><rect width="6" height="30" fill="#C3CBD6" /></pattern>
          </defs>
          <rect width="1000" height="440" fill="url(#grid)" />
          {/* street (at grade) */}
          <rect x="440" y="0" width="120" height="440" fill="#D5DBE3" />
          <path d="M500 0V440" stroke="#fff" strokeWidth="3" strokeDasharray="18 14" />
          <text x="500" y="428" textAnchor="middle" fontSize="13" fill="#374151" letterSpacing="2">STREET LEVEL</text>
          {/* track bed */}
          <rect x="0" y="178" width="1000" height="84" fill="url(#ties)" opacity="0.55" />
          {[196, 244].map((y) => <g key={y}><line x1="0" x2="1000" y1={y} y2={y} stroke="#6B7280" strokeWidth="3" /><line x1="0" x2="1000" y1={y + 12} y2={y + 12} stroke="#6B7280" strokeWidth="3" /></g>)}
          {/* platforms */}
          <rect x="60" y="60" width="880" height="96" rx="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="60" y="284" width="880" height="96" rx="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          {highlight && issueActive && <rect x="540" y="284" width="400" height="96" rx="14" fill="#F59E0B" opacity="0.18" stroke="#D97706" strokeWidth="2.5" strokeDasharray="8 6" />}
          <text x="100" y="96" fontSize="15" fill="#334155" fontWeight="600">PLATFORM A</text>
          <text x="100" y="320" fontSize="15" fill="#334155" fontWeight="600">PLATFORM B</text>
          {AKARD_ASSETS.map((a) => { const p = POS[a.id], t = TONE[assetStatus(a.id, demo)]; return (
            <g key={a.id}><circle cx={p.mx} cy={p.my} r={selected === a.id ? 17 : 12} fill={t.ring} opacity="0.7" /><circle cx={p.mx} cy={p.my} r="8" fill={t.dot} stroke="#fff" strokeWidth="2.5" /></g>
          ); })}
        </svg>

        {callouts && AKARD_ASSETS.map((a) => {
          const st = assetStatus(a.id, demo), p = POS[a.id];
          return (
            <button key={a.id} type="button" onClick={() => onSelect(a.id)} aria-pressed={selected === a.id} data-testid={`twin-${a.id}`}
              style={{ left: `${p.bubble.left}%`, top: `${p.bubble.top}%` }}
              className={`absolute min-h-11 px-3 py-1.5 rounded-xl bg-white text-left shadow-md border text-[13px] leading-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${selected === a.id ? "border-[#0057A8] ring-2 ring-[#0057A8]/25" : "border-gray-200 hover:border-gray-400"}`}>
              <span className="block font-semibold text-gray-900">{a.name}</span>
              <span className="flex items-center gap-1.5 text-gray-800"><span aria-hidden="true" className="inline-block w-2 h-2 rounded-full" style={{ background: TONE[st].dot }} />{EFF_LABEL[st]} · demo</span>
            </button>
          );
        })}

        <div className="absolute left-3 bottom-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full bg-[#0057A8] text-white text-sm font-semibold"><Waypoints className="w-4 h-4" aria-hidden="true" />2D plan</span>
          <div className="relative">
            <button type="button" aria-expanded={layersOpen} aria-controls="layers-menu" onClick={() => setLayersOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full bg-white text-gray-900 text-sm font-semibold border border-gray-200 shadow-sm hover:bg-gray-50"><Layers className="w-4 h-4" aria-hidden="true" />Layers</button>
            {layersOpen && (
              <div id="layers-menu" className="absolute bottom-12 left-0 w-60 rounded-xl bg-white border border-gray-200 shadow-lg p-3 space-y-1">
                <label className="flex items-center gap-2 min-h-11 text-sm text-gray-900"><input type="checkbox" checked={callouts} onChange={(e) => setCallouts(e.target.checked)} className="w-4 h-4" /><Sparkles className="w-4 h-4" aria-hidden="true" />Status callouts</label>
                <label className="flex items-center gap-2 min-h-11 text-sm text-gray-900"><input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} className="w-4 h-4" /><Footprints className="w-4 h-4" aria-hidden="true" />Demo issue area</label>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="px-4 py-2.5 text-xs text-gray-700 border-t border-gray-100">{AKARD_LAYOUT_NOTE} No elevators or escalators are shown: no inventory has been verified for this station.</p>
    </section>
  );
}
