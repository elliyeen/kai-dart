"use client";
import Link from "next/link";
import { useState } from "react";
import { PRIORITY_LABEL, STATUS_LABEL, useTickets, type TicketStatus } from "@/lib/tickets";

const FILTERS: (TicketStatus | "all")[] = ["all", "open", "in_progress", "done", "cancelled"];
export default function IssuesLog() {
  const tickets = useTickets();
  const [f, setF] = useState<TicketStatus | "all">("all");
  const [q, setQ] = useState("");
  const rows = tickets.filter((t) => (f === "all" || t.status === f) && (!q || `${t.stationName} ${t.typeLabel} ${t.ref}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="p-4 lg:p-8 max-w-4xl space-y-5" data-testid="issues-log">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Issues log</h1><p className="text-sm text-gray-700">View and track submitted reports. {tickets.length} total.</p></div>
        <Link href="/stations/report" className="min-h-11 px-4 inline-flex items-center rounded-md bg-[#0057A8] text-white font-semibold">Report issue</Link>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {FILTERS.map((s) => <button key={s} type="button" aria-pressed={f === s} onClick={() => setF(s)} className={`min-h-11 px-4 rounded-full border text-sm ${f === s ? "bg-[#0B1F33] text-white border-[#0B1F33]" : "bg-white border-gray-300 hover:bg-gray-50"}`}>{s === "all" ? "All" : STATUS_LABEL[s]}</button>)}
      </div>
      <input aria-label="Search issues" placeholder="Search station, type or reference" value={q} onChange={(e) => setQ(e.target.value)} className="w-full min-h-11 border border-gray-300 rounded-md px-3 text-sm" />
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
        {rows.map((t) => (
          <li key={t.ref}><Link href={`/stations/ticket?ref=${encodeURIComponent(t.ref)}`} data-testid="issue-row" className="flex flex-wrap items-center justify-between gap-2 min-h-14 px-4 py-2.5 hover:bg-gray-50">
            <span className="min-w-0"><span className="block text-[15px] text-gray-900" style={{ fontWeight: 600 }}>{t.stationName} · {t.typeLabel}</span><span className="block text-xs text-gray-700">{t.seeded ? "Demo dataset" : "Submitted in this browser"} · {t.ref}</span></span>
            <span className="flex items-center gap-2 text-xs"><span className="border border-gray-300 rounded-full px-2 py-0.5">{PRIORITY_LABEL[t.priority]}</span><span className="border border-gray-300 rounded-full px-2 py-0.5 bg-gray-50">{STATUS_LABEL[t.status]}</span></span>
          </Link></li>
        ))}
        {rows.length === 0 && <li className="p-6 text-sm text-gray-800" data-testid="issues-empty">No issues match.</li>}
      </ul>
    </div>
  );
}
