"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useDemo } from "@/lib/demo/store";
import { lineStats, overall, recordStatus, scoreTone } from "@/lib/stations/readiness";
import { ISSUE_LABELS, ISSUE_META, STATIONS, STATION_RECORDS } from "@/lib/stations";
import { DemoBadge, StatusIndicator } from "./ui";
import { effectiveStatus } from "@/lib/stations/effective";

/** Design B — Operations focus (Act, Resolve, Verify). All figures derive from the synthetic demo records. */
export default function OperationsOverview() {
  const demo = useDemo();
  const o = overall(demo);
  const lines = lineStats(demo);
  const [tab, setTab] = useState<"stations" | "activity">("stations");
  const rows = STATIONS.map((st) => {
    const recs = STATION_RECORDS.filter((r) => st.recordIds.includes(r.id));
    const issues = [...new Set(recs.flatMap((r) => r.demo.issues))];
    const score = Math.round(recs.reduce((n, r) => n + r.demo.score, 0) / recs.length);
    return { st, score, issues, top: issues[0], worst: recs.map((r) => recordStatus(r, demo)) };
  }).sort((a, b) => a.score - b.score).slice(0, 12);
  const allIssues = STATION_RECORDS.flatMap((r) => r.demo.issues);
  const open = allIssues.filter((i) => (ISSUE_META[i]?.status ?? "open") === "open").length;
  const inProgress = allIssues.filter((i) => ISSUE_META[i]?.status === "in_progress").length + (demo.wo.status === "assigned" ? 1 : 0);
  const tile = (id: string, label: string, n: number | string, color: string) => (
    <div className="border border-gray-200 rounded-xl p-4 bg-white"><p className="text-sm">{label}</p><p className="text-4xl mt-1 leading-none" style={{ fontWeight: 800, color }} data-testid={id}>{n}</p></div>
  );
  const tabBtn = (k: "stations" | "activity", label: string) => (
    <button type="button" role="tab" aria-selected={tab === k} data-testid={`ops-tab-${k}`} onClick={() => setTab(k)} className={`min-h-11 px-4 text-sm border-b-2 ${tab === k ? "border-[#0057A8] font-semibold" : "border-transparent"}`}>{label}</button>
  );
  return (
    <section aria-labelledby="ops-h" data-testid="ops-overview" className="p-4 lg:p-8 space-y-6">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 items-end">
        <div>
          <h1 id="ops-h" className="text-4xl leading-[1.05]" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Operate a Clean, Safe DART</h1>
          <p className="mt-2">Find issues. Assign work. Verify the fix. <DemoBadge /></p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tile("ops-readiness", "Readiness (average)", `${o.avg}/100`, scoreTone(o.avg))}
          {tile("ops-open", "Open issues", open, "#B45309")}
          {tile("ops-progress", "In progress", inProgress, "#0057A8")}
          {tile("ops-verified", "Verified resolved", o.verified, "#15803D")}
        </div>
      </div>
      <div className="grid xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        <div className="border border-gray-200 rounded-xl bg-white min-w-0">
          <div role="tablist" aria-label="Operations views" className="flex border-b border-gray-200 px-2">{tabBtn("stations", "Stations")}{tabBtn("activity", "Recent activity")}</div>
          {tab === "stations" ? (
            <div className="relative overflow-x-auto" role="tabpanel" tabIndex={0} aria-label="Twelve lowest-readiness stations">
              <table className="w-full text-sm text-left" data-testid="ops-stations"><caption className="sr-only">Twelve lowest-readiness stations (synthetic demo scores)</caption>
                <thead><tr className="border-b border-gray-200 text-xs"><th scope="col" className="p-3">Station</th><th scope="col" className="p-3">Readiness</th><th scope="col" className="p-3">Open issues</th><th scope="col" className="p-3 hidden md:table-cell">Top issue</th><th scope="col" className="p-3">Status</th><th scope="col" className="p-3"><span className="sr-only">Open</span></th></tr></thead>
                <tbody>{rows.map(({ st, score, issues, top }) => (
                  <tr key={st.key} className="border-b border-gray-100" data-testid="ops-row">
                    <th scope="row" className="p-3 font-semibold">{st.name}</th>
                    <td className="p-3 whitespace-nowrap"><span style={{ fontWeight: 700, color: scoreTone(score) }}>{score}</span><span aria-hidden="true" className="inline-block ml-2 align-middle h-1.5 w-20 rounded bg-gray-200"><span className="block h-1.5 rounded" style={{ width: `${score}%`, background: scoreTone(score) }} /></span></td>
                    <td className="p-3">{issues.length}</td>
                    <td className="p-3 hidden md:table-cell">{top ? ISSUE_LABELS[top] ?? top : "None"}</td>
                    <td className="p-3"><StatusIndicator status={effectiveStatus(st, demo)} size="sm" /></td>
                    <td className="p-3"><Link href={`/stations/${st.key}`} aria-label={`Open ${st.name}`} className="inline-grid place-items-center w-11 h-11"><ChevronRight className="w-5 h-5" aria-hidden="true" /></Link></td>
                  </tr>))}</tbody>
              </table>
            </div>
          ) : (
            <div role="tabpanel" tabIndex={0} aria-label="Recent activity" className="p-4" data-testid="ops-activity">
              <ol className="space-y-3 text-sm">{[...demo.wo.events].reverse().map((e) => <li key={e.seq} className="border-b border-gray-100 pb-2"><span className="font-semibold">{e.action.replace(/_/g, " ")}</span> · {e.actor}<span className="block">{e.note}</span></li>)}
                {demo.wo.events.length === 0 && <li>No activity yet. Run the guided demo to create the first work order events (synthetic).</li>}</ol>
            </div>
          )}
          <p className="text-xs p-3">Synthetic demo values, not DART data. <Link href="/stations" className="underline inline-flex items-center min-h-11">See all stations</Link></p>
        </div>
        <div className="border border-gray-200 rounded-xl bg-white p-5" data-testid="ops-health">
          <h2 className="text-lg" style={{ fontWeight: 700 }}>Readiness by line</h2>
          <ul className="mt-4 space-y-4">{lines.map((l) => (
            <li key={l.line.id}><div className="flex justify-between text-sm"><span>{l.line.name}</span><span style={{ fontWeight: 700, color: scoreTone(l.avg) }}>{l.avg}</span></div>
              <div className="mt-1 h-2 rounded bg-gray-200"><div className="h-2 rounded" style={{ width: `${l.avg}%`, background: l.line.color }} /></div></li>))}</ul>
          <p className="text-xs mt-4">Average synthetic score per line. No trend is shown because no history is recorded.</p>
        </div>
      </div>
    </section>
  );
}
