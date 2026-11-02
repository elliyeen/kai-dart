"use client";
import Link from "next/link";
import { useId } from "react";
import { useDemo } from "@/lib/demo/store";
import { ASSET_META, lineStats, lowest, overall, scoreTone, type RecStatus } from "@/lib/stations/readiness";
import { ISSUE_LABELS, STATIONS, type LineId } from "@/lib/stations";
import { LineDot, StatusIndicator } from "./ui";
import ReadinessHero from "./ReadinessHero";
import type { Eff } from "@/lib/stations/effective";

const DOT: Record<RecStatus, string> = { good: "#16A34A", warning: "#D97706", critical: "#DC2626", closed: "#9CA3AF", deploying: "#2563EB", assigned: "#2563EB", awaiting: "#4F46E5", verified: "#16A34A" };

export function Spark({ scores, statuses, color, label }: { scores: number[]; statuses: RecStatus[]; color: string; label: string }) {
  const id = useId(), W = 300, H = 56, n = scores.length;
  const pts = scores.map((s, i) => [n === 1 ? W / 2 : (i / (n - 1)) * (W - 8) + 4, H - 4 - (s / 100) * (H - 8)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14" role="img" aria-label={label}>
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.22" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`${d} L${pts[n - 1][0]},${H} L${pts[0][0]},${H}Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill={DOT[statuses[i]]} />)}
    </svg>
  );
}

export default function NetworkOverview({ line, onSelect }: { line: LineId | null; onSelect: (key: string) => void }) {
  const demo = useDemo();
  const o = overall(demo);
  const lines = lineStats(demo);
  const low = lowest(demo);
  const stationKeyOf = (id: string) => STATIONS.find((s) => s.recordIds.includes(id))!.key;
  const toEff = (s: RecStatus): Eff => s;

  return (
    <section aria-labelledby="net-h" className="space-y-6 p-4 lg:p-8" data-testid="network-overview">
      <ReadinessHero line={line} onOpen={onSelect} />

      <div>
        <h2 className="text-xs tracking-[0.2em] uppercase text-black mb-2" style={{ fontWeight: 600 }}>Lines — readiness overview · click to drill down</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3" data-testid="line-cards">
          {lines.map((l) => (
            <Link key={l.line.id} href={`/stations/readiness?line=${l.line.id}`} data-testid={`line-card-${l.line.id}`}
              className={`block rounded-2xl border bg-white shadow-sm p-4 hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${line === l.line.id ? "border-[#0057A8]" : "border-gray-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div><p className="flex items-center gap-2 text-lg text-black" style={{ fontWeight: 700 }}><LineDot lineId={l.line.id} />{l.line.name}</p><p className="text-xs text-black">{l.line.terminals} · {l.count} stations</p></div>
                <div className="text-right"><p className="text-3xl leading-none" style={{ fontWeight: 300, color: scoreTone(l.avg) }} data-testid={`line-avg-${l.line.id}`}>{l.avg}</p><p className="text-[10px] tracking-wider uppercase text-black">Avg score</p></div>
              </div>
              <Spark scores={l.records.map((r) => r.demo.score)} statuses={l.statuses} color={l.line.color} label={`${l.line.name} station readiness scores, in line order`} />
              <dl className="grid grid-cols-3 gap-2 text-sm mt-1">
                <div><dt className="text-[10px] tracking-wider uppercase text-black">Uptime</dt><dd style={{ fontWeight: 600 }} className="text-green-800">{l.assets.uptime}%</dd></div>
                <div><dt className="text-[10px] tracking-wider uppercase text-black">Assets</dt><dd style={{ fontWeight: 600 }}>{l.assets.ok}/{l.assets.total}</dd></div>
                <div><dt className="text-[10px] tracking-wider uppercase text-black">Range</dt><dd style={{ fontWeight: 600 }}>{l.min}–{l.max}</dd></div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-1.5">{l.tags.length ? l.tags.map((t) => <span key={t.label} className="text-[11px] border border-gray-200 bg-gray-50 rounded px-2 py-0.5 text-black">{t.label} · {t.n}</span>) : <span className="text-[11px] border border-green-200 bg-green-50 text-green-900 rounded px-2 py-0.5">All clear</span>}</div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs tracking-[0.2em] uppercase text-black mb-2" style={{ fontWeight: 600 }}>Asset dashboards <span className="normal-case tracking-normal font-normal text-black">(synthetic demo counts)</span></h2>
        <div className="grid sm:grid-cols-5 gap-3" data-testid="asset-cards">
          {ASSET_META.map((m) => { const t = o.assets.byType[m.key]; return (
            <Link key={m.key} href={`/stations/assets?type=${m.key}`} className="rounded-2xl border border-gray-200 bg-white p-3 hover:border-gray-400 block" data-testid={`asset-card-${m.key}`}>
              <p className="text-sm text-black" style={{ fontWeight: 700 }}>{m.label}</p><p className="text-[11px] text-black">{m.blurb}</p>
              <p className="mt-2 inline-block text-xs text-white bg-red-700 rounded px-2 py-0.5" style={{ fontWeight: 700 }}>{t.total - t.ok} DOWN</p>
            </Link>); })}
        </div>
      </div>

      <div>
        <h2 className="text-xs tracking-[0.2em] uppercase text-black mb-2" style={{ fontWeight: 600 }}>10 lowest readiness — network-wide</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm" tabIndex={0} role="region" aria-label="10 lowest readiness stations, scrollable">
          <table className="w-full text-sm text-left" data-testid="priority-queue"><caption className="sr-only">The ten lowest readiness line-station entries (synthetic demo scores)</caption>
            <thead><tr className="text-[11px] tracking-wider uppercase text-black border-b border-gray-200"><th scope="col" className="p-3">Station</th><th scope="col" className="p-3">Line</th><th scope="col" className="p-3">Score</th><th scope="col" className="p-3 hidden md:table-cell">Readiness</th><th scope="col" className="p-3 hidden lg:table-cell">Issues</th><th scope="col" className="p-3">Status</th></tr></thead>
            <tbody>{low.map(({ r, status }) => (
              <tr key={r.id} className="border-b border-gray-100">
                <th scope="row" className="p-3 font-medium"><Link href={`/stations/${r.id}`} onClick={(e) => { e.preventDefault(); onSelect(stationKeyOf(r.id)); }} className="inline-flex items-center min-h-11 hover:underline text-black">{r.name}</Link></th>
                <td className="p-3"><span className="inline-flex items-center gap-2"><LineDot lineId={r.lineId} />{r.lineId[0].toUpperCase() + r.lineId.slice(1)} Line</span></td>
                <td className="p-3" style={{ fontWeight: 700, color: scoreTone(r.demo.score) }}>{r.demo.score}</td>
                <td className="p-3 hidden md:table-cell w-40"><span className="block h-1.5 rounded bg-gray-200"><span className="block h-1.5 rounded" style={{ width: `${r.demo.score}%`, background: scoreTone(r.demo.score) }} /></span></td>
                <td className="p-3 hidden lg:table-cell text-black">{r.demo.issues.map((i) => ISSUE_LABELS[i] ?? i).join(" · ") || "—"}</td>
                <td className="p-3"><StatusIndicator status={toEff(status)} size="sm" /></td>
              </tr>))}</tbody>
          </table>
        </div>
        {o.verified > 0 && <p className="mt-2 text-sm text-emerald-900" data-testid="verified-note">Akard: issue independently verified resolved (synthetic demo).</p>}
      </div>

    </section>
  );
}
