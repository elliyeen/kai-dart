"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PRIORITY_LABEL, STATUS_LABEL, setTicketStatus, useTickets, type TicketStatus } from "@/lib/tickets";

const ORDER: TicketStatus[] = ["open", "in_progress", "done", "cancelled"];
function Inner() {
  const ref = useSearchParams().get("ref") ?? "";
  const t = useTickets().find((x) => x.ref === ref);
  if (!t) return <div className="p-4 lg:p-8"><p data-testid="ticket-missing">Ticket not found. Tickets submitted in another browser are not available here.</p><Link className="underline" href="/stations/issues">Back to issues log</Link></div>;
  const closed = t.status === "done" || t.status === "cancelled";
  return (
    <div className="p-4 lg:p-8 max-w-2xl space-y-5" data-testid="ticket">
      <Link href="/stations/issues" className="text-sm underline">← Back to issues log</Link>
      <p className="text-sm tracking-widest text-[#0057A8] font-semibold">{closed ? "CLOSED TICKET" : "OPEN TICKET"}</p>
      <h1 className="text-2xl text-gray-900" style={{ fontWeight: 800 }}>REF# {t.ref}</h1>
      <p className="text-sm text-gray-700">{new Date(t.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}{t.seeded ? " · demo dataset record" : ""}</p>
      <dl className="grid grid-cols-2 gap-4 border-y border-gray-200 py-4 text-sm">
        <div><dt className="text-xs text-gray-700">STATION</dt><dd className="text-lg">{t.stationName}</dd></div>
        <div className="text-right"><dt className="text-xs text-gray-700">ISSUE TYPE</dt><dd className="text-lg">{t.typeLabel}</dd></div>
        <div><dt className="text-xs text-gray-700">PRIORITY</dt><dd>{PRIORITY_LABEL[t.priority]}</dd></div>
        <div className="text-right"><dt className="text-xs text-gray-700">REPORTED BY</dt><dd>{t.reportedBy ?? "—"}{t.contact ? ` · ${t.contact}` : ""}</dd></div>
      </dl>
      <div><h2 className="text-xs text-gray-700 mb-1">ISSUE NOTES</h2><p className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">{t.notes}</p>{t.photoName && <p className="mt-1 text-xs text-gray-700">Photo: {t.photoName}</p>}</div>
      <div><h2 className="text-xs text-gray-700 mb-2">TRACK STATUS</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Ticket status">
          {ORDER.map((s) => <button key={s} type="button" data-testid={`status-${s}`} aria-pressed={t.status === s} onClick={() => setTicketStatus(t.ref, s)} className={`min-h-11 px-4 rounded-md border text-sm ${t.status === s ? "bg-blue-100 border-[#0057A8] text-[#0057A8] font-semibold" : "bg-white border-gray-300 hover:bg-gray-50"}`}>{STATUS_LABEL[s]}</button>)}
        </div>
        <p className="mt-2 text-sm" data-testid="ticket-current">Current: {STATUS_LABEL[t.status]}</p>
        <p className="mt-1 text-xs text-gray-700">Status changes are a simulation stored in this browser; they do not reach any DART system.</p></div>
    </div>
  );
}
export default function TicketView() { return <Suspense fallback={<div className="p-8">Loading…</div>}><Inner /></Suspense>; }
