"use client";
import Link from "next/link";
import { useState } from "react";
import { STATIONS } from "@/lib/stations";
import { PRIORITY_LABEL, REPORTERS, REPORT_TYPES, submitTicket, type Priority, type Ticket } from "@/lib/tickets";

const chip = (on: boolean) => `min-h-11 px-4 rounded-md border text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${on ? "bg-[#0B1F33] text-white border-[#0B1F33]" : "bg-white border-gray-300 hover:bg-gray-50"}`;
const field = "w-full min-h-11 border border-gray-300 rounded-md px-3 bg-white text-sm focus-visible:outline-2 focus-visible:outline-[#0057A8]";

/** `stationKey` pre-selects the station; `embedded` drops the page padding and uses a section heading (for the station-page sheet). */
export default function ReportForm({ stationKey, embedded = false }: { stationKey?: string; embedded?: boolean } = {}) {
  const sorted = [...STATIONS].sort((a, b) => a.name.localeCompare(b.name));
  const [station, setStation] = useState(stationKey && sorted.some((s) => s.key === stationKey) ? stationKey : sorted[0].key);
  const [type, setType] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState("");
  const [by, setBy] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [done, setDone] = useState<Ticket | null>(null);

  if (done) return (
    <div className={embedded ? "" : "p-4 lg:p-8 max-w-2xl"} data-testid="report-done">
      <h2 className="text-3xl text-gray-900" style={{ fontWeight: 800 }}>Report submitted</h2>
      <p className="mt-3 text-gray-900">Reference <strong data-testid="report-ref">{done.ref}</strong> · {done.stationName} · {done.typeLabel} · {PRIORITY_LABEL[done.priority]}</p>
      <p className="mt-2 text-sm text-gray-700">Saved in this browser only. In this demo it is not sent to DART or any dispatch system.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/stations/ticket?ref=${encodeURIComponent(done.ref)}`} className="min-h-11 px-4 inline-flex items-center rounded-md bg-[#0057A8] text-white font-semibold">Track this ticket</Link>
        <Link href="/stations/issues" className="min-h-11 px-4 inline-flex items-center rounded-md border border-gray-300">View issues log</Link>
      </div>
    </div>
  );

  const pick = (id: string) => { setType(id); setPriority(REPORT_TYPES.find((t) => t.id === id)!.priority); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !priority) return;
    const st = STATIONS.find((s) => s.key === station)!, ty = REPORT_TYPES.find((t) => t.id === type)!;
    setDone(submitTicket({ stationKey: st.key, stationName: st.name, typeLabel: ty.label, priority, notes: notes.trim() || "No notes provided.", reportedBy: by ?? undefined, contact: [name, contact].filter(Boolean).join(" · ") || undefined, photoName: photo || undefined }));
  };

  return (
    <form onSubmit={submit} className={embedded ? "space-y-6" : "p-4 lg:p-8 max-w-2xl space-y-6"} data-testid="report-form">
      {embedded ? <p className="text-sm text-gray-700">Safety, vandalism, equipment, cleaning and more.</p> : <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Report an issue</h1><p className="text-sm text-gray-700">Safety, vandalism, equipment, cleaning and more.</p></div>}
      <label className="block"><span className="block text-sm font-semibold mb-1.5">Station <span aria-hidden="true" className="text-red-700">*</span></span>
        <select className={field} value={station} onChange={(e) => setStation(e.target.value)} data-testid="report-station">{sorted.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}</select></label>
      <fieldset><legend className="text-sm font-semibold mb-1.5">Issue type <span aria-hidden="true" className="text-red-700">*</span></legend>
        <div className="flex flex-wrap gap-2">{REPORT_TYPES.map((t) => <button key={t.id} type="button" aria-pressed={type === t.id} data-testid={`type-${t.id}`} className={chip(type === t.id)} onClick={() => pick(t.id)}>{t.label}</button>)}</div></fieldset>
      <fieldset><legend className="text-sm font-semibold mb-1.5">Priority</legend>
        <div className="flex flex-wrap gap-2">{(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => <button key={p} type="button" aria-pressed={priority === p} data-testid={`priority-${p}`} className={chip(priority === p)} onClick={() => setPriority(p)}>{PRIORITY_LABEL[p]}</button>)}</div>
        <p className="mt-1.5 text-xs text-gray-700">Set automatically when an issue type is chosen. Override if needed.</p></fieldset>
      <label className="block"><span className="block text-sm font-semibold mb-1.5">Notes</span>
        <textarea rows={4} className={`${field} py-2`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the issue and its exact location…" /></label>
      <div><span className="block text-sm font-semibold mb-1.5">Photo</span>
        <input type="file" accept="image/*" aria-label="Add photo" onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? "")} className="text-sm w-full max-w-full min-w-0" />
        <p className="mt-1 text-xs text-gray-700">{photo ? `Attached: ${photo} (kept on this device, not uploaded)` : "No file selected. Photos are not uploaded in this demo."}</p></div>
      <fieldset><legend className="text-sm font-semibold mb-1.5">Reported by <span className="font-normal text-gray-700">(optional)</span></legend>
        <div className="flex flex-wrap gap-2">{REPORTERS.map((r) => <button key={r} type="button" aria-pressed={by === r} className={chip(by === r)} onClick={() => setBy(by === r ? null : r)}>{r}</button>)}</div>
        <div className="mt-3 grid sm:grid-cols-2 gap-3"><input aria-label="Full name" placeholder="Full name" className={field} value={name} onChange={(e) => setName(e.target.value)} /><input aria-label="ID or contact" placeholder="ID / Contact" className={field} value={contact} onChange={(e) => setContact(e.target.value)} /></div></fieldset>
      <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-700">{type ? "Ready to submit." : "Issue type required."}</p>
        <button type="submit" disabled={!type} data-testid="report-submit" className="min-h-11 px-6 rounded-md bg-[#0057A8] text-white font-semibold disabled:bg-gray-200 disabled:text-gray-700">Submit report</button>
      </div>
    </form>
  );
}
