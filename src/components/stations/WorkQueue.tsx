"use client";
import Link from "next/link";
import { MANAGER_SCOPE, ROLE_MATRIX, can } from "@/lib/demo/permissions";
import { PERSONAS, PERSONA_BY_ROLE } from "@/lib/demo/roles";
import { useDemo } from "@/lib/demo/store";
import { STATUS_COPY } from "@/lib/demo/workflow";
import { STATIONS } from "@/lib/stations";
import { DemoBadge } from "./ui";
import { AssignmentCard, VerificationTimeline } from "./workflow-ui";

export default function WorkQueue() {
  const demo = useDemo();
  const { role, wo } = demo;
  const persona = PERSONA_BY_ROLE[role];
  const station = STATIONS.find((s) => s.key === wo.stationKey)!;
  const ctx = { stationKey: wo.stationKey, actorId: persona.identity, assignedTo: wo.assignedTo };
  const canSee = can(role, "view_work_order", ctx);

  return (
    <div className="p-4 lg:p-8 max-w-3xl space-y-6" data-testid="work-queue">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-4xl text-black" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Inspections</h1><p className="text-sm text-black">Viewing as {persona.label} · primary action: {persona.primaryAction}</p></div>
        <DemoBadge />
      </div>

      {role === "security" && (
        <section aria-labelledby="aud-h"><h2 id="aud-h" className="text-lg font-semibold mb-2">Audit log (simulated)</h2>
          <VerificationTimeline events={wo.events} />
          <p className="text-xs text-black mt-3">Production would require an append-only, tamper-evident log enforced server-side.</p></section>
      )}

      {role === "admin" && (
        <section aria-labelledby="acc-h"><h2 id="acc-h" className="text-lg font-semibold mb-2">Roles and scopes (read-only simulation)</h2>
          <div className="overflow-x-auto"><table className="w-full text-sm text-left"><caption className="sr-only">Permissions per demo role</caption>
            <thead><tr className="border-b border-gray-300"><th scope="col" className="py-2 pr-3">Role</th><th scope="col" className="py-2">Permitted actions</th></tr></thead>
            <tbody>{PERSONAS.map((p) => <tr key={p.role} className="border-b border-gray-100 align-top"><th scope="row" className="py-2 pr-3 font-medium">{p.label}</th><td className="py-2 text-black">{ROLE_MATRIX[p.role].join(", ")}</td></tr>)}</tbody></table></div>
          <p className="text-sm text-black mt-3">Administrators manage access but have no authority to verify or sign off work.</p></section>
      )}

      {role === "stationManager" && (
        <section aria-labelledby="sc-h"><h2 id="sc-h" className="text-lg font-semibold mb-2">Your stations (synthetic scope)</h2>
          <ul className="list-disc pl-5 text-sm">{MANAGER_SCOPE.map((k) => <li key={k}><Link className="underline text-[#0057A8]" href={`/stations/${k}`}>{STATIONS.find((s) => s.key === k)?.name ?? k}</Link></li>)}</ul></section>
      )}

      {canSee && (
        <section aria-labelledby="wq-h" className="space-y-4">
          <h2 id="wq-h" className="text-lg font-semibold">Work orders</h2>
          <p className="text-sm text-black">{wo.id} · <Link className="underline text-[#0057A8]" href={`/stations/${station.key}`}>{station.name}</Link> · {STATUS_COPY[wo.status]}</p>
          <AssignmentCard demo={demo} />
        </section>
      )}
      {role === "contractor" && !canSee && (
        <p className="border border-gray-200 rounded-lg p-4 text-sm text-black" data-testid="contractor-empty">No work orders are assigned to you. Contractors only see work explicitly assigned to them.</p>
      )}
      {role === "executive" && <p className="text-sm text-black">Executives have read-only access: no assignment, proof or verification actions are offered.</p>}
    </div>
  );
}
