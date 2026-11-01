"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, Infinity as InfinityIcon, Layers, Lock, ShieldCheck } from "lucide-react";
import IsometricRail from "./arch/IsometricRail";
import KaiLayers from "./arch/KaiLayers";
import IntelligenceDisplay from "./arch/IntelligenceDisplay";
import MaintenanceDispatch from "./arch/MaintenanceDispatch";
import PassengerOutcome from "./arch/PassengerOutcome";

type Status = "demo" | "proposed";
type Item = { id: string; title: string; sub: string; extra?: string; status: Status; detail: string[]; art?: ReactNode };

const STATUS: Record<Status, string> = { demo: "Shown in the demo with synthetic data", proposed: "Proposed for the pilot" };

const STAGES: Item[] = [
  { id: "data", title: "Data In", sub: "Vehicles · Stations · Operations", status: "proposed", art: <IsometricRail />,
    detail: ["KAI would begin from DART-approved sources such as inspection, maintenance and station-condition records, plus optional approved sensors.", "Access starts read-only. Nothing in an existing DART system changes without DART approval.", "In this demonstration every record is synthetic. No DART system is connected."] },
  { id: "kai", title: "KAI", sub: "Ingest · Model · Analyze", status: "demo", art: <KaiLayers />,
    detail: ["Each record keeps its source and time, so every finding can be traced back to where it came from.", "A shared model links the station, the issue, the work order, the evidence and the inspector.", "The demonstration shows this model with synthetic records."] },
  { id: "intelligence", title: "Intelligence", sub: "Detect · Predict · Prioritize", status: "demo", art: <IntelligenceDisplay />,
    detail: ["Clear, explainable rules rank station issues by severity, repeat history and what is blocking the fix.", "Every recommendation shows the evidence behind it. DART staff make the final decision.", "The demonstration ranks synthetic issues this way. Prediction is a proposed capability and is not shown."] },
  { id: "action", title: "Action", sub: "Dispatch · Maintain · Resolve", status: "demo", art: <MaintenanceDispatch />,
    detail: ["Authorized staff dispatch a ticket. A technician acknowledges it, checks in on site and confirms the work.", "A separate inspector verifies the result. People approve and confirm every step; nothing acts on its own.", "The demonstration simulates this full path with timing at every stage."] },
  { id: "outcomes", title: "Outcomes", sub: "Work · School · Play", extra: "A safer, cleaner, more reliable DART", status: "proposed", art: <PassengerOutcome />,
    detail: ["The goal is a station that is cleaner, safer and more reliable for the people who use it.", "Progress would be measured against agreed baselines, such as verified closures and time to verification. This is an intended goal, not a proven result.", "Expansion beyond a pilot would be DART's separate decision."] },
];

const SECURITY: Item[] = [
  { id: "sec-data", title: "Protected Data", sub: "", status: "proposed", detail: ["Proposed: encryption in transit and at rest, and agreed retention and deletion terms.", "Protection begins at the source connection, then continues through ingestion, processing and storage."] },
  { id: "sec-access", title: "Controlled Access", sub: "", status: "proposed", detail: ["Proposed: role-based access with least privilege, enforced on the server, with approval before any action.", "The role switcher in the demonstration is a simulation, not access control."] },
  { id: "sec-compliance", title: "Compliance Ready", sub: "", status: "proposed", detail: ["Design intent: controls, test results and known gaps documented for DART's security review.", "No certification, audit or regulatory approval has been achieved. Nothing here should be read as one."] },
  { id: "sec-reliable", title: "Reliable & Scalable", sub: "", status: "proposed", detail: ["Design intent: stale or missing data is flagged instead of shown as current, and the model is built to extend from three stations to more.", "No performance or uptime figures are claimed."] },
];
const SEC_ICON: Record<string, ReactNode> = { "sec-data": <ShieldCheck className="w-5 h-5" aria-hidden="true" />, "sec-access": <Layers className="w-5 h-5" aria-hidden="true" />, "sec-compliance": <ShieldCheck className="w-5 h-5" aria-hidden="true" />, "sec-reliable": <InfinityIcon className="w-5 h-5" aria-hidden="true" /> };
const RIBBON_DETAIL: Item = { id: "sec-all", title: "Built for Security", sub: "", status: "proposed", detail: ["Security is designed in from the first connection, not added after ingestion: at the source and connector, during ingestion and transport, in processing and storage, in identity and permissions, in decisions, in dispatch, and in the audit record.", "These are proposed design principles. Select an item to read more."] };

export default function ArchitectureMap() {
  const [sel, setSel] = useState<string>("sec-all");
  const cur = [...STAGES, ...SECURITY, RIBBON_DETAIL].find((n) => n.id === sel)!;
  return (
    <div>
      <ol className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] md:items-start" data-testid="arch-flow">
        {STAGES.map((s, i) => (
          <li key={s.id} className="contents">
            <button type="button" onClick={() => setSel(s.id)} aria-pressed={sel === s.id} data-testid="arch-node"
              className="group min-w-0 text-center rounded-xl px-2 pt-2 pb-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]">
              <div className="mx-auto max-w-[210px] md:max-w-[280px] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">{s.art}</div>
              <span className="mt-3 block text-2xl font-semibold text-[#0B1F33] leading-tight">{s.title}</span>
              <span className="mt-1.5 block text-base text-gray-700">{s.sub}</span>
              {s.extra && <span className="mt-1 block text-base text-gray-700">{s.extra}</span>}
              <span aria-hidden="true" className={`mx-auto mt-3 block h-[3px] rounded-full bg-[#FFD21F] transition-all duration-300 ${sel === s.id ? "w-10" : "w-0 group-hover:w-6"}`} />
            </button>
            {i < STAGES.length - 1 && (
              <span aria-hidden="true" className="flex items-center justify-center text-[#0B1F33] md:mt-[100px] md:self-start">
                <svg viewBox="0 0 48 12" className="hidden md:block w-9 h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h42M38 1l6 5-6 5" /></svg>
                <ArrowDown className="md:hidden w-5 h-5" strokeWidth={1.6} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col md:flex-row md:items-stretch rounded-2xl md:rounded-full overflow-hidden bg-[#F1F4F8]" data-testid="arch-security">
        <button type="button" onClick={() => setSel("sec-all")} aria-pressed={sel === "sec-all"}
          className="flex items-center gap-3 bg-[#0B1F33] text-white px-7 py-4 md:pr-14 md:[clip-path:polygon(0_0,100%_0,calc(100%-26px)_100%,0_100%)] min-h-[56px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#FFD21F]">
          <Lock className="w-5 h-5" aria-hidden="true" /><span className="text-lg font-semibold">Built for Security</span>
        </button>
        <span aria-hidden="true" className="hidden md:block w-[38px] -ml-[26px] flex-none bg-[#FFD21F] [clip-path:polygon(26px_0,38px_0,12px_100%,0_100%)]" />
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 md:-ml-6">
          {SECURITY.map((s) => (
            <button key={s.id} type="button" onClick={() => setSel(s.id)} aria-pressed={sel === s.id} data-testid="arch-sec"
              className={`flex items-center justify-center gap-2 px-3 py-4 min-h-[56px] text-base font-medium text-[#0B1F33] border-t md:border-t-0 md:border-l border-[#D5DCE6] first:border-t-0 hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0057A8] ${sel === s.id ? "bg-white shadow-[inset_0_-3px_0_#FFD21F]" : ""}`}>
              {SEC_ICON[s.id]}{s.title}
            </button>
          ))}
        </div>
      </div>

      <section aria-live="polite" aria-labelledby="arch-detail-title" className="mt-8 max-w-3xl border-l-[3px] border-[#FFD21F] pl-5" data-testid="arch-detail">
        <p className="text-xs uppercase tracking-wider text-gray-700">{STATUS[cur.status]}</p>
        <h2 id="arch-detail-title" style={{ fontWeight: 600 }} className="mt-1 text-2xl font-semibold text-[#0B1F33]">{cur.title}</h2>
        <div className="mt-2 space-y-2">{cur.detail.map((d) => <p key={d} className="text-base text-gray-800 leading-relaxed">{d}</p>)}</div>
      </section>

      <details className="mt-8 border-t border-gray-200 pt-3" data-testid="arch-text">
        <summary className="cursor-pointer text-sm text-gray-700 py-2">Read this diagram as text</summary>
        <ol className="mt-3 space-y-3 text-sm text-gray-800 list-decimal pl-5">
          {STAGES.map((n) => <li key={n.id}><span className="font-semibold">{n.title}</span> ({STATUS[n.status]}): {n.detail[0]}</li>)}
        </ol>
        <p className="mt-4 text-sm font-semibold">Built for Security</p>
        <ul className="mt-2 space-y-2 text-sm text-gray-800 list-disc pl-5">{SECURITY.map((s) => <li key={s.id}><span className="font-semibold">{s.title}</span> ({STATUS[s.status]}): {s.detail[0]}</li>)}</ul>
      </details>
    </div>
  );
}
