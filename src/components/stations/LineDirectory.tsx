"use client";
import Link from "next/link";
import { ISSUE_LABELS, LINES, LINE_BY_ID, STATIONS, STATION_RECORDS, type LineId, type StationRecord } from "@/lib/stations";
import { recordStatus, scoreTone, type RecStatus } from "@/lib/stations/readiness";
import { useDemo } from "@/lib/demo/store";
import { StatusIndicator } from "./ui";

const NODE: Record<RecStatus, string> = { good: "#16A34A", warning: "#D97706", critical: "#DC2626", closed: "#9CA3AF", deploying: "#2563EB", assigned: "#2563EB", awaiting: "#4F46E5", verified: "#16A34A" };

/** Lines selector (dot, name, terminals, count) — the "DART Lines" list from the original app. */
export function LinePicker({ value, onChange }: { value: LineId | null; onChange: (l: LineId | null) => void }) {
  const row = "w-full text-left min-h-14 px-3 py-2 rounded-lg border flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]";
  return (
    <div role="group" aria-label="Filter by line" className="space-y-1.5" data-testid="line-picker">
      <button type="button" aria-pressed={value === null} onClick={() => onChange(null)} className={`${row} ${value === null ? "bg-[#0B1F33] text-white border-[#0B1F33]" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
        <span className="text-sm" style={{ fontWeight: 700 }}>All lines</span><span className={`ml-auto text-xs ${value === null ? "text-white/80" : "text-gray-700"}`}>{STATIONS.length} stations</span>
      </button>
      {LINES.map((l) => {
        const n = STATION_RECORDS.filter((r) => r.lineId === l.id).length, on = value === l.id;
        return (
          <button key={l.id} type="button" aria-pressed={on} onClick={() => onChange(on ? null : l.id)} className={`${row} ${on ? "bg-amber-50 border-[#0B1F33]" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
            <span aria-hidden="true" className="w-4 h-4 rounded-full shrink-0" style={{ background: l.color, boxShadow: on ? `0 0 0 4px ${l.color}33` : undefined }} />
            <span className="min-w-0"><span className="block text-[15px] text-gray-900" style={{ fontWeight: 700 }}>{l.name}</span><span className="block text-xs text-gray-700 truncate">{l.terminals}</span></span>
            <span className="ml-auto text-xs text-gray-700 shrink-0">{n}</span>
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
          <span className="block text-[15px] text-gray-900 truncate" style={{ fontWeight: 600 }}>{r.name}</span>
          <span className="block text-xs text-gray-700 truncate">{issues ? `${issues} issue${issues > 1 ? "s" : ""} · ${r.demo.issues.slice(0, 2).map((i) => ISSUE_LABELS[i] ?? i).join(", ")}` : "Clear"}</span>
        </span>
        <span className="flex items-center gap-2 shrink-0"><span className="text-sm tabular-nums" style={{ fontWeight: 700, color: scoreTone(score) }}>{r.demo.status === "closed" ? "—" : `${score}%`}</span><StatusIndicator status={st} size="sm" /></span>
      </Link>
    </li>
  );
}

/** Every line-station entry, grouped by line in the original order, as a connected timeline. */
export default function LineDirectory({ records, line }: { records: StationRecord[]; line: LineId | null }) {
  const groups = LINES.filter((l) => !line || l.id === line).map((l) => ({ l, recs: records.filter((r) => r.lineId === l.id) })).filter((g) => g.recs.length);
  return (
    <div data-testid="station-list">
      {groups.map(({ l, recs }) => (
        <section key={l.id} aria-labelledby={`grp-${l.id}`} data-testid={`group-${l.id}`}>
          <h3 id={`grp-${l.id}`} className="sticky top-0 z-10 bg-white/95 backdrop-blur flex items-center gap-2 px-4 py-2.5 border-y border-gray-200 text-sm" style={{ fontWeight: 700 }}>
            <span aria-hidden="true" className="w-3 h-3 rounded-full" style={{ background: l.color }} />{LINE_BY_ID[l.id].name}<span className="ml-auto text-xs font-normal text-gray-700">{recs.length} sta</span>
          </h3>
          <ul>{recs.map((r, i) => <Row key={r.id} r={r} first={i === 0} last={i === recs.length - 1} color={l.color} score={r.demo.score} />)}</ul>
        </section>
      ))}
      {groups.length === 0 && <p className="p-6 text-sm text-gray-800" data-testid="no-results">No stations match. Clear the search or choose another line.</p>}
    </div>
  );
}
