"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Camera, Check, ChevronDown, Minus, StickyNote, X, BookOpen } from "lucide-react";
import { STATIONS } from "@/lib/stations";
import { ALL_ITEMS, CHECK_SECTIONS, MIN_ANSWERED, TOTAL_ITEMS, type Answer, type Pri } from "@/lib/checklist";
import { runKaiLoop, type LoopResult } from "@/lib/kaiLoop";
import { logAudit } from "@/lib/audit";
import { submitTicket } from "@/lib/tickets";
import KaiLoopPanel from "./KaiLoopPanel";
import Sheet from "./Sheet";

const PRI: Record<Pri, string> = { critical: "bg-red-50 text-red-800 border-red-200", high: "bg-amber-50 text-amber-900 border-amber-200", routine: "bg-gray-100 text-gray-700 border-gray-200" };
const field = "w-full min-h-11 border border-gray-300 rounded-md px-3 bg-white text-sm focus-visible:outline-2 focus-visible:outline-[#0057A8]";
const TOUR = [
  ["Choose the station", "Pick the station and add your name (and badge ID if you have one). Both are needed to submit."],
  ["Answer each item", "Mark every item Pass, Fail or N/A. Each item shows how serious a failure would be: critical, high or routine. Add a photo or a note to any item."],
  ["Submit at 80%", `You can submit once ${MIN_ANSWERED} of ${TOTAL_ITEMS} items are answered. Sign the attestation at the bottom.`],
  ["KAI closes the loop", "On submit, KAI groups the failures into work orders by section, assigns the contract holder, schedules an independent re-check and adjusts the re-inspection interval. This is a simulation saved in this browser only."],
] as const;

/** Demo walkthrough data: Akard's recorded cleaning issue shows up as three failed items. */
const DEMO_FAILS = new Set(["st3", "tr2", "ge10"]);

export default function Checklist() {
  const sp = useSearchParams();
  const sorted = useMemo(() => [...STATIONS].sort((a, b) => a.name.localeCompare(b.name)), []);
  const initial = sp.get("station");
  const demo = sp.get("demo") === "1";
  const [station, setStation] = useState(initial && sorted.some((s) => s.key === initial) ? initial : "");
  const [inspector, setInspector] = useState(demo ? "Field Inspector (demo)" : "");
  const [badge, setBadge] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer>>(() => demo ? Object.fromEntries(ALL_ITEMS.map((i) => [i.id, DEMO_FAILS.has(i.id) ? "fail" : "pass"])) as Record<string, Answer> : {});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [noteOpen, setNoteOpen] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [attest, setAttest] = useState(false);
  const [result, setResult] = useState<{ r: LoopResult; refs: string[]; at: string } | null>(null);
  const [tour, setTour] = useState<number | null>(null);
  const [stamp, setStamp] = useState("");
  const ran = useRef(false);

  useEffect(() => { const id = window.setTimeout(() => setStamp(new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })), 0); return () => window.clearTimeout(id); }, []);
  const answered = Object.keys(answers).length;
  const c = (a: Answer) => Object.values(answers).filter((x) => x === a).length;
  const need = Math.max(0, MIN_ANSWERED - answered);
  const stName = sorted.find((s) => s.key === station)?.name ?? "";
  const missing = !station ? "Station name required" : !inspector.trim() ? "Inspector name required" : need > 0 ? `${need} more to enable` : !attest ? "Sign the attestation" : "";

  const submit = useCallback(() => {
    const st = sorted.find((s) => s.key === station)!;
    const r = runKaiLoop(answers, inspector.trim());
    const refs = r.actions.map((a) => {
      const t = submitTicket({ stationKey: st.key, stationName: st.name, typeLabel: `Inspection: ${a.section} (${a.failed.length} failed)`, priority: a.priority, notes: `Failed: ${a.failed.join("; ")}. Assigned to ${a.provider}, technician ${a.technician}, ${a.target}.`, reportedBy: "Field inspector", contact: inspector.trim() });
      return t.ref;
    });
    logAudit({ actor: inspector.trim(), role: "Field Inspector", action: "submit_inspection", entityType: "inspection", entityId: st.key, input: `${r.answered}/${TOTAL_ITEMS} answered · ${r.failed} failed`, output: `KAI loop: ${r.actions.length} work order(s) opened (simulation)`, owner: "Operations Command" });
    setResult({ r, refs, at: new Date().toISOString() });
  }, [answers, inspector, sorted, station]);

  useEffect(() => { // guided demo: run the inspection once on arrival
    if (sp.get("run") === "1" && demo && station && !ran.current) { ran.current = true; const id = window.setTimeout(submit, 0); return () => window.clearTimeout(id); }
  }, [sp, demo, station, submit]);

  const set = (id: string, a: Answer) => setAnswers((x) => (x[id] === a ? Object.fromEntries(Object.entries(x).filter(([k]) => k !== id)) as Record<string, Answer> : { ...x, [id]: a }));
  const seg = (on: boolean, kind: Answer) => `w-11 h-11 rounded-lg border grid place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] transition-colors duration-150 motion-reduce:transition-none ${on ? (kind === "pass" ? "bg-green-700 border-green-700 text-white" : kind === "fail" ? "bg-red-700 border-red-700 text-white" : "bg-gray-700 border-gray-700 text-white") : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"}`;

  if (result) return (
    <div className="p-4 lg:p-8 max-w-3xl space-y-6" data-testid="checklist-done">
      <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Inspection submitted</h1>
        <p className="text-sm text-gray-700 mt-1">{stName} · {inspector.trim()} · {result.r.answered}/{TOTAL_ITEMS} items · {result.r.failed} failed. Saved in this browser only; not sent to DART.</p></div>
      <KaiLoopPanel result={result.r} station={stName} refs={result.refs} />
      <div className="flex flex-wrap gap-3"><Link href="/stations/issues" className="min-h-11 px-4 inline-flex items-center rounded-md bg-[#0057A8] text-white font-semibold">View issues log</Link>
        <button type="button" onClick={() => { setResult(null); setAnswers({}); setAttest(false); ran.current = true; }} className="min-h-11 px-4 rounded-md border border-gray-300 hover:bg-gray-50">Start another inspection</button></div>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[300px_1fr] lg:items-start" data-testid="checklist">
      <aside aria-label="Inspection details" className="lg:sticky lg:top-[var(--chrome,7.5rem)] lg:h-[calc(100dvh-var(--chrome,7.5rem))] lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200 bg-white">
        <div className="p-4 space-y-3 border-b border-gray-200">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gray-700" style={{ fontWeight: 600 }}>Inspection details</p>
          <label className="block"><span className="block text-xs font-semibold mb-1">Station <span aria-hidden="true" className="text-red-700">*</span></span>
            <select className={field} value={station} onChange={(e) => setStation(e.target.value)} data-testid="checklist-station"><option value="">Select station…</option>{sorted.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}</select></label>
          <label className="block"><span className="block text-xs font-semibold mb-1">Inspector <span aria-hidden="true" className="text-red-700">*</span></span><input className={field} placeholder="Full name" value={inspector} onChange={(e) => setInspector(e.target.value)} data-testid="checklist-inspector" /></label>
          <label className="block"><span className="block text-xs font-semibold mb-1">Crew / badge ID</span><input className={field} placeholder="Optional" value={badge} onChange={(e) => setBadge(e.target.value)} /></label>
        </div>
        <nav aria-label="Sections" className="p-4"><p className="text-[11px] tracking-[0.2em] uppercase text-gray-700 mb-2" style={{ fontWeight: 600 }}>Sections</p>
          <ul>{CHECK_SECTIONS.map((s) => { const n = s.items.filter((i) => answers[i.id]).length; return (
            <li key={s.id}><a href={`#sec-${s.id}`} className="block min-h-11 py-2 rounded-md hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-[#0057A8]"><span className="block text-sm text-gray-900" style={{ fontWeight: 600 }}>{s.title}</span><span className="block text-xs text-gray-700">{n}/{s.items.length} answered</span></a></li>); })}</ul></nav>
      </aside>

      <div className="min-w-0 p-4 lg:p-8 space-y-5 pb-44 lg:pb-28">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[11px] tracking-[0.2em] uppercase text-gray-700" style={{ fontWeight: 600 }}>KAI facilities management · DART rail network</p>
            <h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Station inspection checklist</h1></div>
          <button type="button" data-testid="checklist-tour" onClick={() => setTour(0)} className="min-h-11 px-5 rounded-full bg-[#0B1F33] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]"><BookOpen className="w-4 h-4" aria-hidden="true" />Take a tour</button>
        </div>

        {CHECK_SECTIONS.map((s) => { const n = s.items.filter((i) => answers[i.id]).length, open = !collapsed[s.id]; return (
          <section key={s.id} id={`sec-${s.id}`} aria-labelledby={`h-${s.id}`} className="scroll-mt-32 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <h2 id={`h-${s.id}`} className="text-lg text-gray-900" style={{ fontWeight: 700 }}>
              <button type="button" aria-expanded={open} onClick={() => setCollapsed((x) => ({ ...x, [s.id]: open }))} className="w-full min-h-14 px-4 flex items-center gap-2 text-left bg-gray-50 hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0057A8]">
                <ChevronDown aria-hidden="true" className={`w-4 h-4 transition-transform motion-reduce:transition-none ${open ? "" : "-rotate-90"}`} />{s.title}<span className="ml-auto text-xs font-normal text-gray-700 tabular-nums">{n}/{s.items.length}</span></button></h2>
            <ul hidden={!open} className="divide-y divide-gray-100">
              {s.items.map((i) => (
                <li key={i.id} data-testid="check-item" className="px-4 py-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0"><p className="text-[15px] text-gray-900" style={{ fontWeight: 600 }}>{i.label} <span className={`ml-1 align-middle text-[10px] uppercase tracking-wider border rounded px-1.5 py-0.5 ${PRI[i.pri]}`}>{i.pri}</span></p><p className="text-xs text-gray-700">{i.hint}</p>
                    {noteOpen[i.id] && <textarea aria-label={`Note for ${i.label}`} rows={2} className={`${field} py-2 mt-2`} value={notes[i.id] ?? ""} onChange={(e) => setNotes((x) => ({ ...x, [i.id]: e.target.value }))} placeholder="Add a note" />}
                    {photos[i.id] && <p className="text-xs text-gray-700 mt-1">Photo: {photos[i.id]} (kept on this device)</p>}</div>
                  <div className="flex items-center gap-1.5" role="group" aria-label={`${i.label} answer`}>
                    <button type="button" aria-label={`${i.label}: pass`} aria-pressed={answers[i.id] === "pass"} data-testid="ans-pass" onClick={() => set(i.id, "pass")} className={seg(answers[i.id] === "pass", "pass")}><Check className="w-4 h-4" aria-hidden="true" /></button>
                    <button type="button" aria-label={`${i.label}: fail`} aria-pressed={answers[i.id] === "fail"} data-testid="ans-fail" onClick={() => set(i.id, "fail")} className={seg(answers[i.id] === "fail", "fail")}><X className="w-4 h-4" aria-hidden="true" /></button>
                    <button type="button" aria-label={`${i.label}: not applicable`} aria-pressed={answers[i.id] === "na"} onClick={() => set(i.id, "na")} className={seg(answers[i.id] === "na", "na")}><Minus className="w-4 h-4" aria-hidden="true" /></button>
                    <label className="w-11 h-11 rounded-lg border border-dashed border-gray-400 grid place-items-center cursor-pointer hover:bg-gray-50 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#0057A8]"><Camera className="w-4 h-4" aria-hidden="true" /><span className="sr-only">Add photo for {i.label}</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => setPhotos((x) => ({ ...x, [i.id]: e.target.files?.[0]?.name ?? "" }))} /></label>
                    <button type="button" aria-label={`Add note for ${i.label}`} aria-pressed={!!noteOpen[i.id]} onClick={() => setNoteOpen((x) => ({ ...x, [i.id]: !x[i.id] }))} className="w-11 h-11 rounded-lg border border-gray-300 grid place-items-center hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]"><StickyNote className="w-4 h-4" aria-hidden="true" /></button>
                  </div>
                </li>))}
            </ul>
          </section>); })}

        <section aria-labelledby="att-h" className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-3">
          <h2 id="att-h" className="text-[11px] tracking-[0.2em] uppercase text-gray-700" style={{ fontWeight: 600 }}>Inspector attestation</h2>
          <label className="flex items-start gap-3 text-sm text-gray-900 min-h-11"><input type="checkbox" data-testid="checklist-attest" className="w-5 h-5 mt-0.5" checked={attest} onChange={(e) => setAttest(e.target.checked)} />I certify that I personally conducted this inspection and that all entries accurately reflect the conditions observed at the time of inspection.</label>
          <dl className="grid sm:grid-cols-3 gap-4 text-sm"><div><dt className="text-xs text-gray-700 uppercase tracking-wider">Inspector</dt><dd className="border-b border-gray-300 py-1">{inspector.trim() || "—"}</dd></div><div><dt className="text-xs text-gray-700 uppercase tracking-wider">Station</dt><dd className="border-b border-gray-300 py-1">{stName || "—"}</dd></div><div><dt className="text-xs text-gray-700 uppercase tracking-wider">Date / time</dt><dd className="border-b border-gray-300 py-1 tabular-nums">{stamp || "—"}</dd></div></dl>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] lg:bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur lg:left-auto">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="min-w-[180px] grow" role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={TOTAL_ITEMS} aria-valuenow={answered}>
            <p className="text-xs text-gray-800 tabular-nums" data-testid="checklist-count">{answered} of {TOTAL_ITEMS} items answered · <span className="text-green-800">{c("pass")} pass</span> · <span className="text-red-800">{c("fail")} fail</span> · {c("na")} N/A</p>
            <div className="h-1.5 mt-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-[#0B1F33] rounded-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(answered / TOTAL_ITEMS) * 100}%` }} /></div></div>
          {missing && <p className="text-xs text-red-800" data-testid="checklist-missing">{missing}</p>}
          <button type="button" data-testid="checklist-submit" disabled={!!missing} onClick={submit} className="min-h-11 px-6 rounded-full bg-[#0057A8] text-white font-semibold disabled:bg-gray-200 disabled:text-gray-700">{need > 0 ? `${need} more to enable` : "Submit inspection"}</button>
        </div>
      </div>

      <Sheet open={tour !== null} onClose={() => setTour(null)} title={tour !== null ? `Tour · ${tour + 1} of ${TOUR.length}` : "Tour"} testId="sheet-tour">
        {tour !== null && <div className="space-y-4"><h3 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>{TOUR[tour][0]}</h3><p className="text-gray-800">{TOUR[tour][1]}</p>
          <div className="flex justify-between"><button type="button" disabled={tour === 0} onClick={() => setTour(tour - 1)} className="min-h-11 px-4 rounded-md border border-gray-300 disabled:opacity-40">Back</button>
            <button type="button" data-testid="tour-next" onClick={() => setTour(tour === TOUR.length - 1 ? null : tour + 1)} className="min-h-11 px-5 rounded-md bg-[#0B1F33] text-white font-semibold">{tour === TOUR.length - 1 ? "Done" : "Next"}</button></div></div>}
      </Sheet>
    </div>
  );
}
