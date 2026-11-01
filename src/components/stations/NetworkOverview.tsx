"use client";
import Link from "next/link";
import { useId } from "react";
import { PERSONA_BY_ROLE } from "@/lib/demo/roles";
import { useDemo } from "@/lib/demo/store";
import { ASSET_META, lineStats, lowest, overall, scoreTone, type RecStatus } from "@/lib/stations/readiness";
import { ISSUE_LABELS, STATIONS, type LineId } from "@/lib/stations";
import { LineDot, DemoBadge, StatusIndicator } from "./ui";
import MapPanel from "./MapPanel";
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

function Stat({ n, label, sub, id, tone }: { n: number | string; label: string; sub: string; id: string; tone?: string }) {
  return <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm"><p className="text-xs tracking-[0.14em] uppercase text-gray-700">{label}</p><p className="text-4xl mt-1" style={{ fontWeight: 300, color: tone ?? "#111827" }} data-testid={id}>{n}</p><p className="text-xs text-gray-700 mt-1">{sub}</p></div>;
}

export default function NetworkOverview({ line, onSelect }: { line: LineId | null; onSelect: (key: string) => void }) {
  const demo = useDemo();
  const persona = PERSONA_BY_ROLE[demo.role];
  const o = overall(demo);
  const lines = lineStats(demo);
  const low = lowest(demo);
  const stationKeyOf = (id: string) => STATIONS.find((s) => s.recordIds.includes(id))!.key;
  const toEff = (s: RecStatus): Eff => s;

  return (
    <section aria-labelledby="net-h" className="space-y-6 p-4 lg:p-8" data-testid="network-overview">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gray-700">KAI facilities management · DART rail network</p>
          <h1 id="net-h" className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Station Readiness Command Center</h1>
          <p className="text-sm text-gray-700 mt-1">Viewing as {persona.label} — {persona.blurb}</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <Stat id="stat-critical" n={o.critical} label="Critical stations" sub={`Line-station entries · ${o.criticalUnique} unique stations`} tone="#B91C1C" />
        <Stat id="stat-attention" n={o.attention} label="Needs attention" sub={`Scheduled service needed · ${o.attentionUnique} unique`} tone="#B45309" />
        <Stat id="stat-avg" n={o.avg} label="Avg readiness" sub="Network average / 100" tone="#B45309" />
        <Stat id="stat-awaiting" n={o.awaiting} label="Awaiting verification" sub="Independent inspector pending" />
        <Stat id="stat-verified" n={o.verified} label="Verified resolved" sub="Independently verified" tone="#15803D" />
      </div>
      <p className="text-xs text-gray-700 -mt-3">All readiness scores, issues and asset counts on this page are <strong>synthetic demo values</strong>, not DART data. Line and station membership comes from the original app and is checked against DART&apos;s public schedule feed.</p>

      <div>
        <h2 className="text-xs tracking-[0.2em] uppercase text-gray-800 mb-2" style={{ fontWeight: 600 }}>Lines — readiness overview · click to drill down</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3" data-testid="line-cards">
          {lines.map((l) => (
            <Link key={l.line.id} href={`/stations/readiness?line=${l.line.id}`} data-testid={`line-card-${l.line.id}`}
              className={`block rounded-2xl border bg-white shadow-sm p-4 hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${line === l.line.id ? "border-[#0057A8]" : "border-gray-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div><p className="flex items-center gap-2 text-lg text-gray-900" style={{ fontWeight: 700 }}><LineDot lineId={l.line.id} />{l.line.name}</p><p className="text-xs text-gray-700">{l.line.terminals} · {l.count} stations</p></div>
                <div className="text-right"><p className="text-3xl leading-none" style={{ fontWeight: 300, color: scoreTone(l.avg) }} data-testid={`line-avg-${l.line.id}`}>{l.avg}</p><p className="text-[10px] tracking-wider uppercase text-gray-700">Avg score</p></div>
              </div>
              <Spark scores={l.records.map((r) => r.demo.score)} statuses={l.statuses} color={l.line.color} label={`${l.line.name} station readiness scores, in line order`} />
              <dl className="grid grid-cols-3 gap-2 text-sm mt-1">
                <div><dt className="text-[10px] tracking-wider uppercase text-gray-700">Uptime</dt><dd style={{ fontWeight: 600 }} className="text-green-800">{l.assets.uptime}%</dd></div>
                <div><dt className="text-[10px] tracking-wider uppercase text-gray-700">Assets</dt><dd style={{ fontWeight: 600 }}>{l.assets.ok}/{l.assets.total}</dd></div>
                <div><dt className="text-[10px] tracking-wider uppercase text-gray-700">Range</dt><dd style={{ fontWeight: 600 }}>{l.min}–{l.max}</dd></div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-1.5">{l.tags.length ? l.tags.map((t) => <span key={t.label} className="text-[11px] border border-gray-200 bg-gray-50 rounded px-2 py-0.5 text-gray-900">{t.label} · {t.n}</span>) : <span className="text-[11px] border border-green-200 bg-green-50 text-green-900 rounded px-2 py-0.5">All clear</span>}</div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs tracking-[0.2em] uppercase text-gray-800 mb-2" style={{ fontWeight: 600 }}>Asset dashboards <span className="normal-case tracking-normal font-normal text-gray-700">(synthetic demo counts)</span></h2>
        <div className="grid sm:grid-cols-5 gap-3" data-testid="asset-cards">
          {ASSET_META.map((m) => { const t = o.assets.byType[m.key]; return (
            <Link key={m.key} href={`/stations/assets?type=${m.key}`} className="rounded-2xl border border-gray-200 bg-white p-3 hover:border-gray-400 block" data-testid={`asset-card-${m.key}`}>
              <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>{m.label}</p><p className="text-[11px] text-gray-700">{m.blurb}</p>
              <p className="mt-2 inline-block text-xs text-white bg-red-700 rounded px-2 py-0.5" style={{ fontWeight: 700 }}>{t.total - t.ok} DOWN</p>
            </Link>); })}
        </div>
      </div>

      <div>
        <h2 className="text-xs tracking-[0.2em] uppercase text-gray-800 mb-2" style={{ fontWeight: 600 }}>10 lowest readiness — network-wide</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm" tabIndex={0} role="region" aria-label="10 lowest readiness stations, scrollable">
          <table className="w-full text-sm text-left" data-testid="priority-queue"><caption className="sr-only">The ten lowest readiness line-station entries (synthetic demo scores)</caption>
            <thead><tr className="text-[11px] tracking-wider uppercase text-gray-700 border-b border-gray-200"><th scope="col" className="p-3">Station</th><th scope="col" className="p-3">Line</th><th scope="col" className="p-3">Score</th><th scope="col" className="p-3 hidden md:table-cell">Readiness</th><th scope="col" className="p-3 hidden lg:table-cell">Issues</th><th scope="col" className="p-3">Status</th></tr></thead>
            <tbody>{low.map(({ r, status }) => (
              <tr key={r.id} className="border-b border-gray-100">
                <th scope="row" className="p-3 font-medium"><Link href={`/stations/${r.id}`} onClick={(e) => { e.preventDefault(); onSelect(stationKeyOf(r.id)); }} className="inline-flex items-center min-h-11 hover:underline text-gray-900">{r.name}</Link></th>
                <td className="p-3"><span className="inline-flex items-center gap-2"><LineDot lineId={r.lineId} />{r.lineId[0].toUpperCase() + r.lineId.slice(1)} Line</span></td>
                <td className="p-3" style={{ fontWeight: 700, color: scoreTone(r.demo.score) }}>{r.demo.score}</td>
                <td className="p-3 hidden md:table-cell w-40"><span className="block h-1.5 rounded bg-gray-200"><span className="block h-1.5 rounded" style={{ width: `${r.demo.score}%`, background: scoreTone(r.demo.score) }} /></span></td>
                <td className="p-3 hidden lg:table-cell text-gray-800">{r.demo.issues.map((i) => ISSUE_LABELS[i] ?? i).join(" · ") || "—"}</td>
                <td className="p-3"><StatusIndicator status={toEff(status)} size="sm" /></td>
              </tr>))}</tbody>
          </table>
        </div>
        {o.verified > 0 && <p className="mt-2 text-sm text-emerald-900" data-testid="verified-note">Akard: issue independently verified resolved (synthetic demo).</p>}
      </div>

      <details className="border border-gray-200 rounded-2xl bg-white"><summary className="cursor-pointer min-h-11 px-4 py-3 text-sm font-semibold">Network map</summary><div className="p-4 pt-0"><MapPanel line={line} onSelect={onSelect} /></div></details>
    </section>
  );
}
