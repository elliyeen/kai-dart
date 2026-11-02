"use client";
import Link from "next/link";
import { useState } from "react";
import { ISSUE_LABELS, LINES, STATIONS, STATION_RECORDS, type LineId } from "@/lib/stations";
import { LinePicker } from "./LineDirectory";

/** Transparent rules over the demo dataset. These are not machine-learning predictions and carry no accuracy claim. */
export default function Intelligence() {
  const [line, setLine] = useState<LineId | null>(null);
  const onLine = STATIONS.filter((s) => !line || s.lineIds.includes(line));
  const ranked = onLine.filter((s) => s.demo.status !== "closed").sort((a, b) => a.demo.score - b.demo.score);
  const decisions = ranked.filter((s) => s.demo.score < 50).slice(0, 8);
  const avg: Record<string, number> = {};
  for (const l of LINES) { const r = STATION_RECORDS.filter((x) => x.lineId === l.id && x.demo.status !== "closed"); avg[l.id] = r.reduce((n, x) => n + x.demo.score, 0) / Math.max(1, r.length); }
  const anomalies = STATION_RECORDS.filter((r) => (!line || r.lineId === line) && r.demo.status !== "closed" && avg[r.lineId] - r.demo.score >= 25).sort((a, b) => a.demo.score - b.demo.score).slice(0, 8);
  const counts: Record<string, number> = {};
  for (const s of onLine) for (const i of s.demo.issues) counts[i] = (counts[i] ?? 0) + 1;
  const patterns = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const open = ranked.length ? Math.round(ranked.reduce((n, s) => n + s.demo.score, 0) / ranked.length) : 0;
  const lineName = line ? LINES.find((l) => l.id === line)!.name : "all lines";
  const card = "border border-gray-200 rounded-lg p-4";
  return (
    <div className="p-4 lg:p-8 max-w-5xl space-y-6" data-testid="intelligence">
      <div><h1 className="text-4xl text-black" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Intelligence engine</h1>
        <p className="text-sm text-black max-w-2xl">Recommended decisions, anomalies and recurring patterns, computed by simple published rules over the demo dataset. These are rules, not machine-learning predictions, and no accuracy is claimed.</p></div>
      <LinePicker value={line} onChange={setLine} />
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="intel-summary" aria-label={`Summary for ${lineName}`}>
        {[["Stations", String(onLine.length)], ["Average readiness", `${open}%`], ["Below 50%", String(ranked.filter((s) => s.demo.score < 50).length)], ["Open issues", String(onLine.reduce((n, s) => n + s.demo.issues.length, 0))]].map(([k, v]) => <div key={k} className={card}><dt className="text-xs uppercase tracking-wider text-black">{k}</dt><dd className="text-3xl font-light tabular-nums">{v}</dd></div>)}
      </dl>
      <p className="text-xs text-black">Showing {lineName}. Sample demo data, not live DART data.</p>
      <section className={card} aria-labelledby="dec"><h2 id="dec" className="text-lg font-semibold">Recommended decisions</h2><p className="text-xs text-black mb-3">Rule: readiness score below 50 → schedule a priority independent inspection.</p>
        <ul className="divide-y divide-gray-100">{decisions.map((s) => <li key={s.key}><Link className="flex flex-wrap justify-between gap-2 min-h-11 py-2 hover:bg-gray-50" href={`/stations/${s.key}`}><span>Inspect <strong>{s.name}</strong>{s.demo.issues[0] ? ` — ${ISSUE_LABELS[s.demo.issues[0]] ?? s.demo.issues[0]}` : ""}</span><span className="tabular-nums">{s.demo.score}%</span></Link></li>)}</ul></section>
      <section className={card} aria-labelledby="ano"><h2 id="ano" className="text-lg font-semibold">Anomalies</h2><p className="text-xs text-black mb-3">Rule: a station scoring 25+ points below its own line average.</p>
        <ul className="divide-y divide-gray-100">{anomalies.map((r) => <li key={r.id} className="flex justify-between gap-2 min-h-11 py-2"><span>{r.name} <span className="text-black">({LINES.find((l) => l.id === r.lineId)!.name})</span></span><span className="tabular-nums">{r.demo.score}% vs line {Math.round(avg[r.lineId])}%</span></li>)}</ul></section>
      <section className={card} aria-labelledby="pat"><h2 id="pat" className="text-lg font-semibold">Recurring patterns</h2><p className="text-xs text-black mb-3">Most common open issue types on {lineName}.</p>
        <ul>{patterns.map(([k, n]) => <li key={k} className="flex justify-between min-h-9 py-1"><span>{ISSUE_LABELS[k] ?? k}</span><span className="tabular-nums">{n} stations</span></li>)}</ul></section>
    </div>
  );
}
