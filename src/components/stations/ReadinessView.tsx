"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LINES, LINE_BY_ID, ISSUE_LABELS, type LineId } from "@/lib/stations";
import { PUBLIC_STOPS } from "@/lib/stations/publicData.generated";
import { lineStats, scoreTone } from "@/lib/stations/readiness";
import { useDemo } from "@/lib/demo/store";
import { DemoBadge, LineFilter, StatusIndicator } from "./ui";

export default function ReadinessView() {
  const demo = useDemo(), sp = useSearchParams(), router = useRouter();
  const p = sp.get("line");
  const line = (LINES.some((l) => l.id === p) ? p : "red") as LineId;
  const ls = lineStats(demo).find((l) => l.line.id === line)!;
  const confirmed = ls.records.filter((r) => PUBLIC_STOPS[r.id]?.lineConfirmed).length;
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs tracking-[0.2em] uppercase text-gray-700">Line readiness</p><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>{LINE_BY_ID[line].name}</h1><p className="text-gray-800">{LINE_BY_ID[line].terminals} · {ls.count} stations in order · average readiness {ls.avg} (synthetic)</p></div>
        <DemoBadge />
      </div>
      <LineFilter value={line} onChange={(l) => router.replace(`/stations/readiness?line=${l ?? "red"}`, { scroll: false })} />
      <p className="text-sm text-gray-800" data-testid="line-verify">Official check: <strong>{confirmed} of {ls.count}</strong> stations on this line are confirmed against DART&apos;s public schedule feed (stop ID shown).{confirmed < ls.count ? " Unconfirmed entries are flagged below." : ""}</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm" tabIndex={0} role="region" aria-label={`${LINE_BY_ID[line].name} stations, scrollable`}>
        <table className="w-full text-sm text-left" data-testid="readiness-table"><caption className="sr-only">Every station on the {LINE_BY_ID[line].name} in line order, with synthetic readiness and official feed match</caption>
          <thead><tr className="text-[11px] uppercase tracking-wider text-gray-700 border-b"><th scope="col" className="p-3">#</th><th scope="col" className="p-3">Station</th><th scope="col" className="p-3">Score</th><th scope="col" className="p-3">Status</th><th scope="col" className="p-3 hidden lg:table-cell">Issues</th><th scope="col" className="p-3">Official stop</th></tr></thead>
          <tbody>{ls.records.map((r, i) => { const o = PUBLIC_STOPS[r.id]; return (
            <tr key={r.id} className="border-b border-gray-100 align-top" data-testid="readiness-row">
              <td className="p-3 text-gray-700">{i + 1}</td>
              <th scope="row" className="p-3 font-medium"><Link href={`/stations/${r.id}`} className="inline-flex items-center min-h-11 hover:underline">{r.name}</Link><span className="block text-xs font-normal text-gray-700">{r.city}</span></th>
              <td className="p-3" style={{ fontWeight: 700, color: scoreTone(r.demo.score) }}>{r.demo.score}</td>
              <td className="p-3"><StatusIndicator status={ls.statuses[i]} size="sm" /></td>
              <td className="p-3 hidden lg:table-cell text-gray-800">{r.demo.issues.map((x) => ISSUE_LABELS[x] ?? x).join(" · ") || "—"}</td>
              <td className="p-3 text-xs">{o ? <><span className="block">{o.stopId} · {o.officialName}</span><span className={o.lineConfirmed ? "text-green-900" : "text-amber-900"}>{o.lineConfirmed ? "Line confirmed" : "Line unconfirmed"}</span></> : "No match"}</td>
            </tr>); })}</tbody></table>
      </div>
      <p className="text-sm text-gray-700">Scores, statuses and issues are synthetic demo values. Station order, names and coordinates come from the original app and match DART&apos;s public schedule feed ({PUBLIC_STOPS[ls.records[0].id] ? "stop IDs shown" : ""}).</p>
    </div>
  );
}
