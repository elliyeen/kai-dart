"use client";
import { useEffect, useState } from "react";
import { Check, Eye, GraduationCap, Repeat, ShieldCheck, Truck, Brain } from "lucide-react";
import type { LoopResult } from "@/lib/kaiLoop";

const STAGES = [
  { id: "observe", label: "Observe", Icon: Eye },
  { id: "decide", label: "Decide", Icon: Brain },
  { id: "act", label: "Act", Icon: Truck },
  { id: "verify", label: "Verify", Icon: ShieldCheck },
  { id: "learn", label: "Learn", Icon: GraduationCap },
] as const;

/** KAI's loop, revealed one stage at a time after an inspection is submitted. */
export default function KaiLoopPanel({ result, station, refs }: { result: LoopResult; station: string; refs: string[] }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { const id = window.setTimeout(() => setShown(STAGES.length), 0); return () => window.clearTimeout(id); }
    const id = window.setInterval(() => setShown((n) => { if (n >= STAGES.length) { window.clearInterval(id); return n; } return n + 1; }), 700);
    return () => window.clearInterval(id);
  }, []);
  const body: Record<string, React.ReactNode> = {
    observe: <>Read {result.answered} answers at {station}: {result.passed} pass, {result.failed} fail, {result.na} not applicable. Readiness from this inspection: <strong>{result.scoreNow}</strong> / 100 (critical items count 3×, high 2×).</>,
    decide: result.failed ? <>Grouped {result.failed} failed item{result.failed > 1 ? "s" : ""} into {result.actions.length} work order{result.actions.length > 1 ? "s" : ""} by section; priority follows the most serious failed item.</> : <>No failed items, so no work is needed.</>,
    act: result.actions.length ? (
      <ul className="space-y-1.5 mt-1" data-testid="kai-actions">{result.actions.map((a, i) => <li key={a.sectionId}><strong>{a.section}</strong> · {a.priority} · {a.failed.length} item{a.failed.length > 1 ? "s" : ""} ({a.failed.slice(0, 2).join(", ")}{a.failed.length > 2 ? "…" : ""}) → {a.provider}, technician {a.technician}, {a.target}{refs[i] ? <> · <span className="tabular-nums">{refs[i]}</span></> : null}</li>)}</ul>
    ) : <>Nothing to dispatch.</>,
    verify: <>{result.verifier} re-checks every failed item before a ticket closes. Re-inspection {result.reinspect}. Expected readiness once verified: <strong>{result.scoreAfter}</strong> / 100.</>,
    learn: <>{result.learn}</>,
  };
  return (
    <section aria-labelledby="kai-loop-h" data-testid="kai-loop" className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="kai-loop-h" className="text-2xl text-gray-900 inline-flex items-center gap-2" style={{ fontWeight: 700 }}><Repeat className="w-5 h-5" aria-hidden="true" />KAI loop</h2><span className="text-xs rounded-full border border-gray-300 px-2.5 py-1 text-gray-800">Simulation · rules, no ML model connected</span></div>
      <ol className="space-y-3">
        {STAGES.map(({ id, label, Icon }, i) => {
          const on = i < shown;
          return (
            <li key={id} data-testid={`kai-stage-${id}`} data-on={on ? "true" : "false"} className={`flex gap-3 transition-opacity duration-500 motion-reduce:transition-none ${on ? "opacity-100" : "opacity-30"}`}>
              <span className={`w-9 h-9 rounded-full grid place-items-center shrink-0 ${on ? "bg-[#0B1F33] text-white" : "bg-gray-100 text-gray-600"}`}>{on && i < shown - 1 ? <Check className="w-4 h-4" aria-hidden="true" /> : <Icon className="w-4 h-4" aria-hidden="true" />}</span>
              <div className="min-w-0"><h3 className="text-sm font-semibold text-gray-900">{i + 1} · {label}</h3><div className="text-sm text-gray-800">{on ? body[id] : null}</div></div>
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-gray-700">Work orders are saved in this browser only; nothing is sent to DART, to a crew or to any dispatch system.</p>
    </section>
  );
}
