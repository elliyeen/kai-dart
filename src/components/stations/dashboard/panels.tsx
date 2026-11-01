"use client";
import Link from "next/link";
import { BarChart3, CheckCircle2, ClipboardCheck, Layers, ShieldCheck, Sparkles, Wrench, X, type LucideIcon } from "lucide-react";
import { AKARD_ASSETS, CLEANLINESS_STEP, assetStatus, type TwinAsset } from "@/lib/stations/geometry";
import { EFF_LABEL, type Eff } from "@/lib/stations/effective";
import { STATUS_COPY, type DemoState } from "@/lib/demo/workflow";
import { AssignmentCard, EvidencePanel, VerificationTimeline } from "../workflow-ui";
import { StatusIndicator } from "../ui";
import { scoreTone, stationAssetUptime } from "@/lib/stations/readiness";
import { ISSUE_LABELS, ISSUE_META, type Station } from "@/lib/stations";
import { PUBLIC_SOURCE } from "@/lib/stations/publicData.generated";
import { publicStopFor } from "@/lib/stations/rollout";

export function KpiTile({ Icon, label, value, sub, step, pct, tone = "#16A34A", id }: { Icon: LucideIcon; label: string; value: string; sub: string; step?: number; pct?: number; tone?: string; id: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 flex items-start gap-3" data-testid={id}>
      <span className="w-11 h-11 rounded-full bg-blue-50 text-[#0057A8] grid place-items-center shrink-0"><Icon className="w-5 h-5" aria-hidden="true" /></span>
      <div className="min-w-0 grow">
        <p className="text-sm text-gray-800">{label}</p>
        <p className="text-xl font-bold text-gray-900 leading-tight" style={{ fontWeight: 700 }}>{value}</p>
        {step !== undefined && (
          <div className="mt-2 flex gap-1" role="img" aria-label={`Step ${step} of 4`}>
            {[1, 2, 3, 4].map((n) => <span key={n} className="h-1.5 flex-1 rounded-full" style={{ background: n <= step ? tone : "#E5E7EB" }} />)}
          </div>
        )}
        {pct !== undefined && <div className="mt-2 h-1.5 rounded-full bg-gray-200" role="img" aria-label={`${pct} percent`}><div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: tone }} /></div>}
        <p className="text-xs text-gray-700 mt-1.5">{sub}</p>
      </div>
    </div>
  );
}

const CLEAN_VALUE: Record<DemoState["wo"]["status"], { v: string; tone: string }> = {
  reported: { v: "Cleaning overdue", tone: "#D97706" }, assigned: { v: "Crew assigned", tone: "#2563EB" },
  awaiting_verification: { v: "Awaiting verification", tone: "#4F46E5" }, verified: { v: "Verified clean", tone: "#16A34A" },
};

export function KpiRow({ demo, status, isDemoStation, issueCount, station }: { demo: DemoState; status: Eff; isDemoStation: boolean; issueCount: number; station: Station }) {
  const c = CLEAN_VALUE[demo.wo.status];
  const score = station.demo.score, up = stationAssetUptime(station.recordIds).uptime;
  const tone = scoreTone(score);
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3" data-testid="kpis">
      <KpiTile id="kpi-readiness" Icon={Layers} label="Station readiness" value={`${score}%`} pct={score} tone={tone} sub={`${EFF_LABEL[status]} · synthetic demo score`} />
      {isDemoStation
        ? <KpiTile id="kpi-clean" Icon={Sparkles} label="Cleanliness" value={c.v} sub="Independent verification required" step={CLEANLINESS_STEP[demo.wo.status]} tone={c.tone} />
        : <KpiTile id="kpi-clean" Icon={Sparkles} label="Open issues" value={String(issueCount)} sub="Synthetic demo issues" />}
      {up === null
        ? <KpiTile id="kpi-assets" Icon={Wrench} label="Asset health" value="Not connected" sub="No asset feed or inventory" />
        : <KpiTile id="kpi-assets" Icon={Wrench} label="Asset health" value={`${up}%`} pct={up} tone="#15803D" sub="Units up · synthetic demo counts" />}
      <KpiTile id="kpi-safety" Icon={ShieldCheck} label="Safety & accessibility" value="Not verified" sub="No inspection data connected" />
    </div>
  );
}

function Card({ title, Icon, children }: { title: string; Icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      <h3 className="flex items-center gap-2 text-[15px] text-gray-900 mb-3" style={{ fontWeight: 700 }}><Icon className="w-4 h-4 text-gray-700" aria-hidden="true" />{title}</h3>
      {children}
    </section>
  );
}

export function LowerStrip({ demo, isDemoStation, issues, station }: { demo: DemoState; isDemoStation: boolean; issues: string[]; station: Station }) {
  const open = isDemoStation ? (demo.wo.status === "verified" ? 0 : 1) : issues.length;
  const A = stationAssetUptime(station.recordIds);
  const pct = (...k: ("elevators" | "cameras" | "stairwells" | "trash_cans" | "bus_covers")[]) => { const t = k.reduce((n, x) => n + A.byType[x].total, 0), o = k.reduce((n, x) => n + A.byType[x].ok, 0); return t ? Math.round((o / t) * 100) : null; };
  const areas: { area: string; pct: number | null; note: string }[] = [
    { area: "Platforms", pct: station.demo.score, note: "Station score" },
    { area: "Public areas", pct: pct("trash_cans", "bus_covers"), note: "Trash cans + bus covers" },
    { area: "Vertical transport", pct: pct("elevators", "stairwells"), note: "Elevators + stairwells" },
  ];
  const steps = demo.wo.events.length;
  return (
    <div className="grid lg:grid-cols-3 gap-3">
      <Card title="Readiness by area" Icon={BarChart3}>
        <ul className="space-y-3" data-testid="areas">{areas.map((r) => (
          <li key={r.area} className="text-sm text-gray-900"><div className="flex items-center justify-between"><span>{r.area}</span><span style={{ fontWeight: 700 }}>{r.pct === null ? "Not connected" : `${r.pct}%`}</span></div>
            {r.pct !== null && <div className="mt-1 h-1.5 rounded-full bg-gray-200"><div className="h-1.5 rounded-full" style={{ width: `${r.pct}%`, background: scoreTone(r.pct) }} /></div>}
            <p className="text-[11px] text-gray-700">{r.note}</p></li>))}</ul>
        <p className="text-xs text-gray-700 mt-3">Synthetic demo values from the original app. No inventory is verified.</p>
      </Card>
      <Card title="Open work orders" Icon={ClipboardCheck}>
        <p className="text-3xl text-gray-900" style={{ fontWeight: 300 }} data-testid="open-wo">{open}</p>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-900">
          <li className="flex items-center gap-2"><span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-red-600" />{isDemoStation && open ? 1 : 0} High</li>
          <li className="flex items-center gap-2"><span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-amber-500" />0 Medium</li>
          <li className="flex items-center gap-2"><span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-green-600" />0 Routine</li>
        </ul>
        <p className="text-xs text-gray-700 mt-3">Synthetic demo work order; no real dispatch.</p>
      </Card>
      <Card title="Inspection activity" Icon={CheckCircle2}>
        <p className="text-3xl text-gray-900" style={{ fontWeight: 300 }}>{isDemoStation ? steps : 0}</p>
        <p className="text-sm text-gray-800">{isDemoStation ? "audit events in this demo session" : "No inspections connected"}</p>
        {isDemoStation && <div className="mt-3 flex items-end gap-1.5 h-10" role="img" aria-label={`${steps} of 4 workflow events recorded`}>{[1, 2, 3, 4].map((n) => <span key={n} className="flex-1 rounded-t" style={{ height: `${n * 25}%`, background: n <= steps ? "#16A34A" : "#E5E7EB" }} />)}</div>}
        <p className="text-xs text-gray-700 mt-3">Real inspection history requires an authorized data connection.</p>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-100 text-sm"><dt className="text-gray-700">{k}</dt><dd className="text-gray-900 text-right" style={{ fontWeight: 500 }}>{v}</dd></div>;
}

export function AssetDrawer({ demo, assetId, onClose }: { demo: DemoState; assetId: TwinAsset["id"]; onClose?: () => void }) {
  const a = AKARD_ASSETS.find((x) => x.id === assetId)!;
  const st = assetStatus(assetId, demo);
  const hasWo = assetId === "platform-b";
  return (
    <aside aria-labelledby="drawer-h" data-testid="asset-drawer" data-asset={assetId} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div><h2 id="drawer-h" className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{a.name}</h2><p className="text-sm text-gray-700">{a.location}</p></div>
        {onClose && <button type="button" onClick={onClose} aria-label="Close asset details" className="min-h-11 min-w-11 grid place-items-center rounded-full hover:bg-gray-100"><X className="w-5 h-5" aria-hidden="true" /></button>}
      </div>
      <StatusIndicator status={st} />
      <p className="text-sm text-gray-800">Last inspected: <strong>Not connected</strong></p>
      {hasWo && <EvidencePanel kind={demo.wo.status === "awaiting_verification" || demo.wo.status === "verified" ? "proof" : "reported"} caption={demo.wo.status === "awaiting_verification" || demo.wo.status === "verified" ? "Completion proof — synthetic placeholder" : "Reported condition — synthetic placeholder"} />}
      <dl>
        <Row k="Condition" v={EFF_LABEL[st]} />
        <Row k="Cleanliness" v={hasWo ? (demo.wo.status === "verified" ? "Verified clean (demo)" : "Overdue (demo)") : "Not inspected"} />
        <Row k="Accessibility" v="Not verified" />
        <Row k="Last cleaning" v="Not connected" />
        <Row k="Next service" v="Not connected" />
        <Row k="Work order" v={hasWo ? <span>{demo.wo.id} <span className="text-gray-700">({STATUS_COPY[demo.wo.status]})</span></span> : "None"} />
      </dl>
      {hasWo && <><AssignmentCard demo={demo} /><details className="rounded-lg border border-gray-200"><summary className="cursor-pointer min-h-11 px-3 py-2.5 text-sm font-semibold">Timeline and audit trail</summary><div className="p-3"><VerificationTimeline events={demo.wo.events} /></div></details></>}
      <p className="text-xs text-gray-700">Linked from the demo only. <Link href="/stations/inspections" className="underline text-[#0057A8]">Open inspections</Link></p>
    </aside>
  );
}

export function DataSources({ stationKey }: { stationKey: string }) {
  const stop = publicStopFor(stationKey);
  return (
    <section aria-labelledby="ds-h" className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4" data-testid="data-sources">
      <h3 id="ds-h" className="flex items-center gap-2 text-[15px] text-gray-900 mb-3" style={{ fontWeight: 700 }}><Layers className="w-4 h-4 text-gray-700" aria-hidden="true" />Data sources</h3>
      <ul className="divide-y divide-gray-100 text-sm">
        <li className="py-2.5 flex flex-wrap items-start justify-between gap-2" data-testid="ds-public">
          <span><strong>Official schedule data (public)</strong><br /><span className="text-gray-700">{PUBLIC_SOURCE.name} · feed {PUBLIC_SOURCE.feedVersion} · retrieved {PUBLIC_SOURCE.retrieved}</span>
            {stop && <><br /><span className="text-gray-700">Matched official stop {stop.stopId} “{stop.officialName}” · official lines: {stop.officialLines.join(", ")}{stop.lineConfirmed ? "" : " (a listed line is unconfirmed)"}</span></>}
            {stop?.note && <><br /><span className="text-amber-900">{stop.note}</span></>}</span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded-full px-2.5 py-0.5 ${stop ? "bg-cyan-50 text-cyan-900 border-cyan-200" : "bg-gray-50 text-gray-800 border-gray-300"}`}>{stop ? "Connected" : "No match"}</span>
        </li>
        <li className="py-2.5 flex items-center justify-between gap-2"><span><strong>Live condition and inspection feed</strong><br /><span className="text-gray-700">Requires written DART authorization</span></span><span className="text-xs font-medium border rounded-full px-2.5 py-0.5 bg-gray-50 text-gray-800 border-gray-300">Not connected</span></li>
        <li className="py-2.5 flex items-center justify-between gap-2"><span><strong>Asset inventory (e.g. Maximo export)</strong><br /><span className="text-gray-700">Requires written DART authorization</span></span><span className="text-xs font-medium border rounded-full px-2.5 py-0.5 bg-gray-50 text-gray-800 border-gray-300">Not connected</span></li>
      </ul>
    </section>
  );
}

const PRIO: Record<string, string> = { critical: "bg-red-50 text-red-900 border-red-200", high: "bg-amber-50 text-amber-900 border-amber-200", routine: "bg-green-50 text-green-900 border-green-200" };
const ISTAT: Record<string, { label: string; cls: string }> = { open: { label: "Open", cls: "bg-amber-50 text-amber-900" }, in_progress: { label: "In progress", cls: "bg-blue-50 text-blue-900" }, hold: { label: "On hold", cls: "bg-gray-100 text-gray-800" } };

/** Right-hand drawer for stations without a workflow demo: the station's open (synthetic) issues. */
export function IssuesDrawer({ station }: { station: Station }) {
  return (
    <aside aria-labelledby="iss-h" data-testid="issues-drawer" className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-4">
      <div><h2 id="iss-h" className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Open issues</h2><p className="text-sm text-gray-700">Synthetic demo issues for {station.name}</p></div>
      {station.demo.issues.length === 0 ? <p className="text-sm text-gray-800 border border-green-200 bg-green-50 rounded-lg p-3">No open issue recorded in the demo data.</p> : (
        <ul className="divide-y divide-gray-100">{station.demo.issues.map((i) => { const m = ISSUE_META[i] ?? { priority: "routine", status: "open" }; return (
          <li key={i} className="py-3 flex items-start justify-between gap-3"><span><span className="block text-sm text-gray-900" style={{ fontWeight: 600 }}>{ISSUE_LABELS[i] ?? i}</span><span className={`inline-block mt-1 text-[11px] rounded px-2 py-0.5 ${ISTAT[m.status].cls}`}>{ISTAT[m.status].label}</span></span><span className={`text-[11px] uppercase tracking-wide border rounded px-2 py-0.5 ${PRIO[m.priority]}`}>{m.priority}</span></li>); })}</ul>)}
      <div><h3 className="text-xs tracking-[0.2em] uppercase text-gray-700 mb-1">Deployed staff</h3><p className="text-sm text-gray-800">No staff currently assigned (no live crew data is connected).</p></div>
      <p className="text-xs text-gray-700">The independent-verification workflow is demonstrated at <Link href="/stations/akard" className="underline text-[#0057A8]">Akard</Link>.</p>
    </aside>
  );
}
