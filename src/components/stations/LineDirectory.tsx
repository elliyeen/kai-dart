"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ISSUE_LABELS, LINES, LINE_BY_ID, STATIONS, STATION_RECORDS, type LineId, type StationRecord } from "@/lib/stations";
import { recordStatus, scoreTone, type RecStatus } from "@/lib/stations/readiness";
import { useDemo } from "@/lib/demo/store";
import { StatusIndicator } from "./ui";

const NODE: Record<RecStatus, string> = { good: "#16A34A", warning: "#D97706", critical: "#DC2626", closed: "#9CA3AF", deploying: "#2563EB", assigned: "#2563EB", awaiting: "#4F46E5", verified: "#16A34A" };

/** Line filter: a flat grid of cells (color mark, name, count). The grouped list below carries terminals and expand/collapse, so lines are never listed twice. */
export function LinePicker({ value, onChange }: { value: LineId | null; onChange: (l: LineId | null) => void }) {
  const cell = "min-h-11 px-3 flex items-center gap-2 text-sm text-left border-b-2 transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0057A8]";
  const on = (v: boolean) => (v ? "border-[#0B1F33] bg-gray-100 font-semibold" : "border-transparent hover:bg-gray-50");
  return (
    <div role="group" aria-label="Filter by line" className="grid grid-cols-2 border border-gray-200 rounded-md overflow-hidden divide-x divide-y divide-gray-200" data-testid="line-picker">
      <button type="button" aria-pressed={value === null} onClick={() => onChange(null)} className={`${cell} ${on(value === null)}`}>All lines <span className="ml-auto text-xs tabular-nums font-normal">{STATIONS.length}</span></button>
      {LINES.map((l) => {
        const n = STATION_RECORDS.filter((r) => r.lineId === l.id).length, sel = value === l.id;
        return (
          <button key={l.id} type="button" aria-pressed={sel} onClick={() => onChange(sel ? null : l.id)} className={`${cell} ${on(sel)}`}>
            <span aria-hidden="true" className="w-2.5 h-2.5 shrink-0" style={{ background: l.color }} />{l.name}
            <span className="ml-auto text-xs tabular-nums font-normal">{n}</span>
          </button>
        );
      })}
    </div>
  );
}

function Row({ r, first, last, color, score }: { r: StationRecord; first: boolean; last: boolean; color: string; score: number }) {
  const demo = useDemo();
  const st = recordStatus(r, demo);
  const issues = r.demo.issues.length;
  return (
    <li className="relative pl-9">
      <span aria-hidden="true" className="absolute left-[13px] w-[3px]" style={{ background: color, top: first ? "50%" : 0, bottom: last ? "50%" : 0 }} />
      <span aria-hidden="true" className="absolute left-[6px] top-1/2 -translate-y-1/2 w-[17px] h-[17px] rounded-full bg-white border-[3px]" style={{ borderColor: NODE[st] }} />
      <Link href={`/stations/${r.id}`} data-testid="station-row" data-station={r.id} className="flex items-center justify-between gap-3 min-h-14 pr-3 py-2 border-b border-gray-100 hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0057A8]">
        <span className="min-w-0">
          <span className="block text-[15px] text-black truncate" style={{ fontWeight: 600 }}>{r.name}</span>
          <span className="block text-xs text-black truncate">{issues ? `${issues} issue${issues > 1 ? "s" : ""} · ${r.demo.issues.slice(0, 2).map((i) => ISSUE_LABELS[i] ?? i).join(", ")}` : "Clear"}</span>
        </span>
        <span className="flex items-center gap-2 shrink-0"><span className="text-sm tabular-nums" style={{ fontWeight: 700, color: scoreTone(score) }}>{r.demo.status === "closed" ? "—" : `${score}%`}</span><StatusIndicator status={st} size="sm" /></span>
      </Link>
    </li>
  );
}

/** Every line-station entry, grouped by line in the original order, as a connected timeline. Each line collapses on its own. */
export default function LineDirectory({ records, line }: { records: StationRecord[]; line: LineId | null }) {
  const [collapsed, setCollapsed] = useState<ReadonlySet<LineId>>(new Set());
  const groups = LINES.filter((l) => !line || l.id === line).map((l) => ({ l, recs: records.filter((r) => r.lineId === l.id) })).filter((g) => g.recs.length);
  const toggle = (id: LineId) => setCollapsed((c) => { const n = new Set(c); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allCollapsed = groups.length > 0 && groups.every((g) => collapsed.has(g.l.id));
  return (
    <div data-testid="station-list">
      {groups.length > 1 && (
        <div className="flex justify-end px-4 py-1.5">
          <button type="button" data-testid="toggle-all-lines" onClick={() => setCollapsed(allCollapsed ? new Set() : new Set(groups.map((g) => g.l.id)))} className="min-h-11 px-2 text-xs text-[#0057A8] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]">
            {allCollapsed ? "Expand all lines" : "Collapse all lines"}
          </button>
        </div>
      )}
      {groups.map(({ l, recs }) => {
        const open = !collapsed.has(l.id);
        return (
          <section key={l.id} aria-labelledby={`grp-${l.id}`} data-testid={`group-${l.id}`}>
            <h3 id={`grp-${l.id}`} className="sticky top-0 z-10 bg-white/95 backdrop-blur border-y border-gray-200 text-sm" style={{ fontWeight: 700 }}>
              <button type="button" aria-expanded={open} aria-controls={`list-${l.id}`} data-testid={`toggle-${l.id}`} onClick={() => toggle(l.id)} className="w-full min-h-11 flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0057A8]">
                <span aria-hidden="true" className="w-3 h-3 rounded-full shrink-0" style={{ background: l.color }} />
                <span className="min-w-0"><span className="block">{LINE_BY_ID[l.id].name}</span><span className="block text-xs font-normal text-black truncate">{l.terminals}</span></span>
                <span className="ml-auto text-xs font-normal text-black shrink-0">{recs.length} stations</span>
                <ChevronDown aria-hidden="true" className={`w-4 h-4 text-black transition-transform duration-200 motion-reduce:transition-none ${open ? "" : "-rotate-90"}`} />
              </button>
            </h3>
            <ul id={`list-${l.id}`} hidden={!open}>{recs.map((r, i) => <Row key={r.id} r={r} first={i === 0} last={i === recs.length - 1} color={l.color} score={r.demo.score} />)}</ul>
          </section>
        );
      })}
      {groups.length === 0 && <p className="p-6 text-sm text-black" data-testid="no-results">No stations match. Clear the search or choose another line.</p>}
    </div>
  );
}
