"use client";
import Link from "next/link";
import { ISSUE_LABELS, LINES, STATIONS, STATION_RECORDS } from "@/lib/stations";

/** Transparent rules over the demo dataset. These are not machine-learning predictions and carry no accuracy claim. */
export default function Intelligence() {
  const ranked = STATIONS.filter((s) => s.demo.status !== "closed").sort((a, b) => a.demo.score - b.demo.score);
  const decisions = ranked.filter((s) => s.demo.score < 50).slice(0, 8);
  const avg: Record<string, number> = {};
  for (const l of LINES) { const r = STATION_RECORDS.filter((x) => x.lineId === l.id && x.demo.status !== "closed"); avg[l.id] = r.reduce((n, x) => n + x.demo.score, 0) / Math.max(1, r.length); }
  const anomalies = STATION_RECORDS.filter((r) => r.demo.status !== "closed" && avg[r.lineId] - r.demo.score >= 25).sort((a, b) => a.demo.score - b.demo.score).slice(0, 8);
  const counts: Record<string, number> = {};
  for (const s of STATIONS) for (const i of s.demo.issues) counts[i] = (counts[i] ?? 0) + 1;
  const patterns = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const card = "border border-gray-200 rounded-lg p-4";
  return (
    <div className="p-4 lg:p-8 max-w-5xl space-y-6" data-testid="intelligence">
      <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Intelligence engine</h1>
        <p className="text-sm text-gray-700 max-w-2xl">Recommended decisions, anomalies and recurring patterns, computed by simple published rules over the demo dataset. These are rules, not machine-learning predictions, and no accuracy is claimed.</p></div>
      <section className={card} aria-labelledby="dec"><h2 id="dec" className="text-lg font-semibold">Recommended decisions</h2><p className="text-xs text-gray-700 mb-3">Rule: readiness score below 50 → schedule a priority independent inspection.</p>
        <ul className="divide-y divide-gray-100">{decisions.map((s) => <li key={s.key}><Link className="flex flex-wrap justify-between gap-2 min-h-11 py-2 hover:bg-gray-50" href={`/stations/${s.key}`}><span>Inspect <strong>{s.name}</strong>{s.demo.issues[0] ? ` — ${ISSUE_LABELS[s.demo.issues[0]] ?? s.demo.issues[0]}` : ""}</span><span className="tabular-nums">{s.demo.score}%</span></Link></li>)}</ul></section>
      <section className={card} aria-labelledby="ano"><h2 id="ano" className="text-lg font-semibold">Anomalies</h2><p className="text-xs text-gray-700 mb-3">Rule: a station scoring 25+ points below its own line average.</p>
        <ul className="divide-y divide-gray-100">{anomalies.map((r) => <li key={r.id} className="flex justify-between gap-2 min-h-11 py-2"><span>{r.name} <span className="text-gray-700">({LINES.find((l) => l.id === r.lineId)!.name})</span></span><span className="tabular-nums">{r.demo.score}% vs line {Math.round(avg[r.lineId])}%</span></li>)}</ul></section>
      <section className={card} aria-labelledby="pat"><h2 id="pat" className="text-lg font-semibold">Recurring patterns</h2><p className="text-xs text-gray-700 mb-3">Most common open issue types across all stations.</p>
        <ul>{patterns.map(([k, n]) => <li key={k} className="flex justify-between min-h-9 py-1"><span>{ISSUE_LABELS[k] ?? k}</span><span className="tabular-nums">{n} stations</span></li>)}</ul></section>
    </div>
  );
}
