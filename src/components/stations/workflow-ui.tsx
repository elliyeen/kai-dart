"use client";
import { useState } from "react";
import { Camera, CheckCircle2, ClipboardCheck, Send, UserCog, XCircle } from "lucide-react";
import { authorize } from "@/lib/demo/permissions";
import { PERSONA_BY_ROLE } from "@/lib/demo/roles";
import { STATUS_COPY, type AuditEvent, type DemoState } from "@/lib/demo/workflow";
import { dispatch } from "@/lib/demo/store";
import { DemoBadge } from "./ui";

export function EvidencePanel({ kind, caption }: { kind: "reported" | "proof"; caption: string }) {
  return (
    <figure className="m-0">
      <svg viewBox="0 0 320 180" role="img" aria-label={`${caption} — placeholder image, not a real photograph`} className="w-full h-auto rounded-lg border border-gray-200 bg-slate-100">
        <rect width="320" height="180" fill={kind === "proof" ? "#E8F1EA" : "#EEF0F3"} />
        <path d="M0 130 L320 120 L320 180 L0 180Z" fill={kind === "proof" ? "#C9DCCD" : "#D5D9DF"} />
        {kind === "reported" && <><circle cx="90" cy="118" r="9" fill="#9AA3AE" /><rect x="150" y="105" width="60" height="9" rx="3" fill="#9AA3AE" /><rect x="225" y="112" width="34" height="7" rx="3" fill="#9AA3AE" /></>}
        <Camera x="136" y="52" width="48" height="48" color="#6B7480" aria-hidden="true" />
        <text x="160" y="150" textAnchor="middle" fontSize="12" fill="#1F2937" fontWeight="600">SYNTHETIC PLACEHOLDER</text>
      </svg>
      <figcaption className="mt-1.5 text-xs text-gray-600">{caption}</figcaption>
    </figure>
  );
}

export function VerificationTimeline({ events }: { events: AuditEvent[] }) {
  const label: Record<string, string> = { reported: "Reported", assigned: "Assigned", proof_submitted: "Completion proof submitted", verified: "Independently verified", rejected: "Rejected by inspector" };
  return (
    <ol aria-label="Issue timeline" className="space-y-3 border-l-2 border-gray-200 ml-1.5 pl-4" data-testid="timeline">
      {events.map((e) => (
        <li key={e.seq} className="relative">
          <span aria-hidden="true" className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${e.action === "verified" ? "bg-emerald-600" : e.action === "rejected" ? "bg-red-600" : "bg-[#0057A8]"}`} />
          <p className="text-sm font-medium text-gray-900">{label[e.action] ?? e.action}</p>
          <p className="text-xs text-gray-600">{e.actor} · demo clock {e.at.slice(11, 16)}Z</p>
          <p className="text-sm text-gray-800">{e.note}</p>
        </li>
      ))}
    </ol>
  );
}

/** Role-aware action area. Buttons shown are only those the permission model allows (DEMO ONLY: not a security boundary). */
export function AssignmentCard({ demo }: { demo: DemoState }) {
  const [msg, setMsg] = useState<string | null>(null);
  const { role, wo } = demo;
  const persona = PERSONA_BY_ROLE[role];
  const ctx = { stationKey: wo.stationKey, actorId: persona.identity, assignedTo: wo.assignedTo, submittedBy: wo.submittedBy };
  const run = (type: "assign" | "submitProof" | "verify" | "reject") => setMsg(dispatch({ type }));
  const btn = "min-h-11 px-5 rounded-md text-sm font-semibold inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]";
  const primary = `${btn} bg-[#0057A8] text-white hover:bg-[#004a8f]`;
  const secondary = `${btn} border border-gray-300 bg-white text-gray-900 hover:bg-gray-50`;

  const actions: React.ReactNode[] = [];
  if (wo.status === "reported" && authorize(role, "assign_work", ctx).allowed)
    actions.push(<button key="a" className={primary} onClick={() => run("assign")}><UserCog className="w-4 h-4" aria-hidden="true" />Assign Work</button>);
  if (wo.status === "assigned" && authorize(role, "submit_proof", ctx).allowed)
    actions.push(<button key="s" className={primary} onClick={() => run("submitProof")}><Send className="w-4 h-4" aria-hidden="true" />Submit Proof</button>);
  if (wo.status === "awaiting_verification" && authorize(role, "verify_work", ctx).allowed)
    actions.push(
      <button key="v" className={primary} onClick={() => run("verify")}><CheckCircle2 className="w-4 h-4" aria-hidden="true" />Verify</button>,
      <button key="r" className={secondary} onClick={() => run("reject")}><XCircle className="w-4 h-4" aria-hidden="true" />Reject</button>,
    );

  const why =
    actions.length === 0 && wo.status !== "verified"
      ? role === "contractor" && wo.status === "awaiting_verification"
        ? "Submitted. Only an independent inspector can verify this work."
        : `As ${persona.label}, there is no action available on this work order right now.`
      : null;

  return (
    <section aria-labelledby="wo-h" className="border border-gray-200 rounded-xl p-5 bg-white" data-testid="work-order" data-status={wo.status}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h3 id="wo-h" className="text-base font-semibold text-gray-900">{wo.id} · {wo.title}</h3>
        <DemoBadge />
      </div>
      <p className="text-sm text-gray-800 mb-1" data-testid="wo-status">{STATUS_COPY[wo.status]}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm mb-4">
        <dt className="text-gray-600">Owner</dt><dd className="text-gray-900">{wo.assignedTo ?? "Unassigned"}</dd>
        <dt className="text-gray-600">Proof submitted by</dt><dd className="text-gray-900">{wo.submittedBy ?? "—"}</dd>
        <dt className="text-gray-600">Verified by</dt><dd className="text-gray-900">{wo.verifiedBy ?? "Not yet verified"}</dd>
      </dl>
      <div className="flex flex-wrap gap-2" data-testid="wo-actions">{actions}</div>
      {why && <p className="text-sm text-gray-700 mt-2" data-testid="wo-why"><ClipboardCheck className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />{why}</p>}
      <p role="alert" className="text-sm text-red-800 mt-2 empty:hidden">{msg}</p>
    </section>
  );
}
