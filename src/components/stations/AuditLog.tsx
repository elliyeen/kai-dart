"use client";
import { useState } from "react";
import { auditToCsv, clearAudit, useAudit } from "@/lib/audit";

export default function AuditLog() {
  const rows = useAudit();
  const [action, setAction] = useState("all");
  const actions = ["all", ...Array.from(new Set(rows.map((r) => r.action)))];
  const shown = rows.filter((r) => action === "all" || r.action === action);
  const logins = rows.filter((r) => r.action === "sign_in").length;
  const download = () => {
    const url = URL.createObjectURL(new Blob([auditToCsv(shown)], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "kai-audit-log.csv"; a.click(); URL.revokeObjectURL(url);
  };
  const th = "text-left text-xs uppercase tracking-wider text-black font-semibold px-3 py-2", td = "px-3 py-2 text-sm align-top";
  return (
    <div className="p-4 lg:p-8 space-y-5" data-testid="audit">
      <div><h1 className="text-4xl text-black" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Audit log</h1>
        <p className="text-sm text-black max-w-3xl">Every sign-in and every action is recorded with who did it, the input, the output and the owning team. {rows.length} events · {logins} sign-ins this browser.</p></div>
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-sm flex items-center gap-2">Action<select data-testid="audit-filter" value={action} onChange={(e) => setAction(e.target.value)} className="min-h-11 border border-gray-300 rounded-md px-3 bg-white">{actions.map((a) => <option key={a} value={a}>{a === "all" ? "All actions" : a}</option>)}</select></label>
        <button type="button" onClick={download} disabled={!shown.length} className="min-h-11 px-4 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50">Export CSV</button>
        <button type="button" onClick={clearAudit} className="min-h-11 px-4 rounded-md border border-gray-300 hover:bg-gray-50">Clear this browser&rsquo;s log</button>
      </div>
      <div tabIndex={0} role="region" aria-label="Audit events table" className="overflow-x-auto border border-gray-200 rounded-lg focus-visible:outline-2 focus-visible:outline-[#0057A8]">
        <table className="w-full min-w-[900px]" data-testid="audit-table"><caption className="sr-only">Audit events, newest first</caption>
          <thead className="bg-gray-50"><tr><th className={th}>Time</th><th className={th}>Actor</th><th className={th}>Action</th><th className={th}>Record</th><th className={th}>Input</th><th className={th}>Output</th><th className={th}>Owner</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {shown.map((r) => <tr key={r.id} data-testid="audit-row"><td className={`${td} whitespace-nowrap`}>{new Date(r.at).toLocaleString("en-US", { dateStyle: "short", timeStyle: "medium" })}</td><td className={td}>{r.actor}<span className="block text-xs text-black">{r.role}</span></td><td className={`${td} font-mono text-xs`}>{r.action}</td><td className={td}>{r.entityType}<span className="block text-xs text-black font-mono">{r.entityId}</span></td><td className={td}>{r.input}</td><td className={td}>{r.output}</td><td className={td}>{r.owner}</td></tr>)}
            {shown.length === 0 && <tr><td colSpan={7} className="p-6 text-sm text-black" data-testid="audit-empty">No events yet. Switch roles or run the guided demo to see entries appear.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
