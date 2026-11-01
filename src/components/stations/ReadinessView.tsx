"use client";
import Link from "next/link";
import { LINES, STATIONS } from "@/lib/stations";
import { effectiveStatus, EFF_LABEL, type Eff } from "@/lib/stations/effective";
import { useDemo } from "@/lib/demo/store";
import { DemoBadge, LineDot } from "./ui";

const COLS: Eff[] = ["critical", "warning", "assigned", "awaiting", "good", "verified", "closed"];

export default function ReadinessView() {
  const demo = useDemo();
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Readiness by line</h1><p className="text-gray-800">Station counts by synthetic demo status. No live readiness data is connected.</p></div><DemoBadge /></div>
      <div tabIndex={0} role="region" aria-label="Readiness table, scrollable" className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm text-left" data-testid="readiness-table"><caption className="sr-only">Stations per line by demo status</caption>
          <thead><tr className="border-b border-gray-200 text-gray-800"><th scope="col" className="p-3">Line</th><th scope="col" className="p-3">Stations</th>{COLS.map((c) => <th key={c} scope="col" className="p-3 font-medium">{EFF_LABEL[c]}</th>)}</tr></thead>
          <tbody>{LINES.map((l) => { const st = STATIONS.filter((s) => s.lineIds.includes(l.id)); return (
            <tr key={l.id} className="border-b border-gray-100"><th scope="row" className="p-3 font-medium"><Link href={`/stations?line=${l.id}`} className="inline-flex items-center gap-2 min-h-11 hover:underline"><LineDot lineId={l.id} />{l.name}</Link></th><td className="p-3">{st.length}</td>
              {COLS.map((c) => <td key={c} className="p-3">{st.filter((s) => effectiveStatus(s, demo) === c).length}</td>)}</tr>); })}</tbody></table>
      </div>
      <p className="text-sm text-gray-700">A station served by several lines is counted on each. Akard reacts to the demo workflow; every other value is a fixed synthetic example.</p>
    </div>
  );
}
