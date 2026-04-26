"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, AlertTriangle, CheckCircle2, Clock, FileText, Activity } from "lucide-react";
import Nav from "@/components/Nav";
import LiveFeed from "@/components/dart/LiveFeed";
import ReadinessGauge from "@/components/dart/ReadinessGauge";
import { useStationEngine } from "@/lib/dart/useStationEngine";
import { DART_LINES } from "@/lib/dart/lines";
import type { ReadinessLevel, ActiveAction, AgentEvent, AgentName } from "@/lib/dart/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function levelLabel(level: ReadinessLevel) {
  return level === "excellent" ? "Excellent" : level === "good" ? "Good" : level === "fair" ? "Fair" : "At Risk";
}
function levelColor(level: ReadinessLevel) {
  return level === "excellent" ? "#16A34A" : level === "good" ? "#4CAF50" : level === "fair" ? "#FF6B35" : "#DC2626";
}
function formatETA(action: ActiveAction): string {
  const remaining = action.etaMinutes - (Date.now() - new Date(action.startedAt).getTime()) / 60000;
  if (remaining <= 0) return "Overdue";
  if (remaining < 1) return "< 1 min";
  if (remaining < 60) return `~${Math.round(remaining)} min`;
  const hrs = Math.floor(remaining / 60);
  const mins = Math.round(remaining % 60);
  return mins === 0 ? `~${hrs}h` : `~${hrs}h ${mins}m`;
}
function timeAgo(date: Date): string {
  const diff = (Date.now() - new Date(date).getTime()) / 60000;
  if (diff < 1) return "just now";
  if (diff < 60) return `${Math.round(diff)}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

const SEVERITY_STYLE = {
  critical: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", label: "Critical" },
  warning:  { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", label: "Warning"  },
  info:     { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", label: "Info"     },
  resolved: { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", label: "Resolved" },
};
const STATUS_COLOR: Record<string, string> = {
  nominal: "#16A34A", active: "#FF6B35", alert: "#D97706", critical: "#DC2626",
};
const AGENT_LABEL: Record<string, string> = {
  safety: "Safety", cleanliness: "Cleanliness", equipment: "Equipment",
  revenue: "Revenue", parking: "Parking", community: "Community",
};

// ─── Line Health Card ─────────────────────────────────────────────────────────
function LineCard({ lineId, lineName, lineShort, lineColor, lineBg, lineBorder, lineRoute, stationCount, score, level, activeIssues, actionsInProgress, ridershipToday, stationNames }: {
  lineId: string; lineName: string; lineShort: string; lineColor: string; lineBg: string; lineBorder: string;
  lineRoute: string; stationCount: number; score: number; level: ReadinessLevel;
  activeIssues: number; actionsInProgress: number; ridershipToday: number; stationNames: string[];
}) {
  return (
    <Link href={`/dart/line/${lineId}`}>
      <div className="group bg-white border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer overflow-hidden rounded-sm">
        <div className="h-1 w-full" style={{ background: lineColor }} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-semibold tracking-[0.3em] uppercase px-2 py-0.5 rounded-full"
                  style={{ color: lineColor, background: lineBg, border: `1px solid ${lineBorder}` }}>
                  {lineShort} Line
                </span>
                {activeIssues > 0 && (
                  <span className="flex items-center gap-1 text-[9px] font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                    {activeIssues} issue{activeIssues !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <h3 className="text-[16px] font-medium text-gray-900 group-hover:text-black leading-tight">{lineName}</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{lineRoute}</p>
            </div>
            <ReadinessGauge score={score} level={level} size="sm" showLabel={false} />
          </div>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
            <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: levelColor(level) }} />
            </div>
            <span className="text-[12px] font-mono font-semibold flex-shrink-0" style={{ color: levelColor(level) }}>
              {score} — {levelLabel(level)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Stations", val: stationCount.toString() },
              { label: "Riders",   val: ridershipToday.toLocaleString() },
              { label: "Actions",  val: actionsInProgress > 0 ? `${actionsInProgress} active` : "Clear",
                color: actionsInProgress > 0 ? "#D97706" : "#16A34A" },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-[15px] font-mono text-gray-800 mt-0.5" style={color ? { color } : {}}>{val}</p>
              </div>
            ))}
          </div>
          {stationNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {stationNames.map(name => (
                <span key={name} className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 rounded-sm">{name}</span>
              ))}
            </div>
          )}
          <div className="pt-3 border-t border-gray-100">
            <span className="flex items-center justify-center gap-1.5 w-full py-2 text-[12px] font-semibold tracking-wide rounded-sm transition-colors duration-150"
              style={{ color: lineColor, background: lineBg, border: `1px solid ${lineBorder}` }}>
              Open {lineName} <span className="text-[10px]">→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Issues Tab ───────────────────────────────────────────────────────────────
type IssueRow = AgentEvent & { stationName: string; stationId: string; stationLine: string; lineColor: string; };
type SeverityFilter = "all" | "critical" | "warning" | "info";

function IssuesTab({ stations }: { stations: ReturnType<typeof useStationEngine>["stations"] }) {
  const [filter, setFilter] = useState<SeverityFilter>("all");
  const [search, setSearch] = useState("");

  const issues: IssueRow[] = useMemo(() => {
    const rows: IssueRow[] = [];
    for (const station of stations) {
      const primaryLine = DART_LINES.find(l => station.lineIds.includes(l.id));
      for (const event of station.events) {
        if (!event.resolved) {
          rows.push({
            ...event,
            stationName: station.shortName,
            stationId: station.id,
            stationLine: primaryLine?.name ?? station.line,
            lineColor: primaryLine?.color ?? "#6B7280",
          });
        }
      }
    }
    return rows.sort((a, b) => {
      const sev = { critical: 0, warning: 1, info: 2, resolved: 3 };
      const sd = sev[a.severity] - sev[b.severity];
      if (sd !== 0) return sd;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [stations]);

  const filtered = useMemo(() => {
    let rows = filter === "all" ? issues : issues.filter(r => r.severity === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.stationName.toLowerCase().includes(q) ||
        AGENT_LABEL[r.agentName]?.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [issues, filter, search]);

  const counts = useMemo(() => ({
    critical: issues.filter(r => r.severity === "critical").length,
    warning:  issues.filter(r => r.severity === "warning").length,
    info:     issues.filter(r => r.severity === "info").length,
  }), [issues]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          {(["all", "critical", "warning", "info"] as SeverityFilter[]).map(f => {
            const active = filter === f;
            const count = f === "all" ? issues.length : counts[f as keyof typeof counts];
            const col = f === "critical" ? "#DC2626" : f === "warning" ? "#D97706" : f === "info" ? "#2563EB" : "#374151";
            return (
              <button key={f} onClick={() => setFilter(f)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-sm transition-all capitalize flex items-center gap-1.5"
                style={active
                  ? { color: "#fff", background: col, border: `1px solid ${col}` }
                  : { color: col, background: "white", border: `1px solid #E5E7EB` }}>
                {f === "all" ? "All Issues" : f}
                <span className="font-mono">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search issues…"
            className="pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-sm bg-white text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-400 w-52"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No open issues{filter !== "all" ? ` matching "${filter}"` : ""}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {["Severity", "Station", "Agent", "Issue", "Opened", "ETA"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(row => {
                  const sev = SEVERITY_STYLE[row.severity];
                  const eta = row.etaMinutes != null
                    ? (() => {
                        const elapsed = (Date.now() - new Date(row.timestamp).getTime()) / 60000;
                        const rem = (row.etaMinutes ?? 0) - elapsed;
                        if (rem <= 0) return "Overdue";
                        if (rem < 1) return "< 1 min";
                        if (rem < 60) return `~${Math.round(rem)} min`;
                        const h = Math.floor(rem / 60), m = Math.round(rem % 60);
                        return m === 0 ? `~${h}h` : `~${h}h ${m}m`;
                      })()
                    : "—";
                  return (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm whitespace-nowrap"
                          style={{ color: sev.color, background: sev.bg, border: `1px solid ${sev.border}` }}>
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/dart/station/${row.stationId}`}
                          className="text-[13px] font-medium text-gray-800 hover:text-black transition-colors whitespace-nowrap flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: row.lineColor }} />
                          {row.stationName}
                        </Link>
                        <p className="text-[10px] text-gray-400 mt-0.5 ml-3">{row.stationLine}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[12px] text-gray-600 whitespace-nowrap">{AGENT_LABEL[row.agentName] ?? row.agentName}</span>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="text-[13px] font-medium text-gray-800 leading-tight">{row.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-1">{row.detail}</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[12px] font-mono text-gray-500">{timeAgo(row.timestamp)}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[12px] font-mono font-semibold"
                          style={{ color: eta === "Overdue" ? "#DC2626" : eta === "—" ? "#9CA3AF" : "#D97706" }}>
                          {eta}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-[11px] text-gray-400 mt-3">
        {filtered.length} open issue{filtered.length !== 1 ? "s" : ""} · Updates every 3 seconds
      </p>
    </div>
  );
}

// ─── Report Tab ───────────────────────────────────────────────────────────────
function ReportTab({ stations }: { stations: ReturnType<typeof useStationEngine>["stations"] }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    station: "",
    agent: "",
    severity: "warning",
    title: "",
    detail: "",
    reporter: "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const valid = form.station && form.agent && form.title.trim().length > 4;

  const handleSubmit = () => {
    if (!valid) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 border border-green-200 mb-5">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <h2 className="text-xl font-light text-gray-900 mb-2">Report Submitted</h2>
        <p className="text-sm text-gray-500 mb-1">
          Ticket logged for <strong className="text-gray-700">{stations.find(s => s.id === form.station)?.name}</strong> — <strong className="text-gray-700">{AGENT_LABEL[form.agent]}</strong> agent.
        </p>
        <p className="text-[12px] text-gray-400 mb-8">The assigned agent will triage and respond within SLA window.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSubmitted(false); setForm({ station: "", agent: "", severity: "warning", title: "", detail: "", reporter: "" }); }}
            className="text-[12px] font-medium px-5 py-2 border border-gray-200 text-gray-600 hover:border-gray-400 rounded-sm transition-colors">
            File Another Report
          </button>
          <Link href="/dart?tab=issues"
            className="text-[12px] font-medium px-5 py-2 bg-gray-900 text-white hover:bg-black rounded-sm transition-colors">
            View Issues Board →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">File Station Report</p>
              <span className="text-[10px] font-mono text-gray-300">KAI · Network Operations</span>
            </div>
            <div className="p-6 space-y-5">
              {/* Row 1: Station + Agent */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Station *</label>
                  <select value={form.station} onChange={e => set("station", e.target.value)}
                    className="w-full text-[13px] border border-gray-200 rounded-sm px-3 py-2.5 bg-white text-gray-700 outline-none focus:border-gray-400 transition-colors">
                    <option value="">Select station…</option>
                    {stations.map(s => (
                      <option key={s.id} value={s.id}>{s.name} — {s.line}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                  <select value={form.agent} onChange={e => set("agent", e.target.value)}
                    className="w-full text-[13px] border border-gray-200 rounded-sm px-3 py-2.5 bg-white text-gray-700 outline-none focus:border-gray-400 transition-colors">
                    <option value="">Select category…</option>
                    {Object.entries(AGENT_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Severity</label>
                <div className="flex gap-2">
                  {(["critical", "warning", "info"] as const).map(s => {
                    const col = SEVERITY_STYLE[s];
                    const active = form.severity === s;
                    return (
                      <button key={s} onClick={() => set("severity", s)}
                        className="text-[11px] font-semibold px-4 py-2 rounded-sm capitalize transition-all"
                        style={active
                          ? { color: "#fff", background: col.color, border: `1px solid ${col.color}` }
                          : { color: col.color, background: col.bg, border: `1px solid ${col.border}` }}>
                        {col.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Issue Title *</label>
                <input value={form.title} onChange={e => set("title", e.target.value)}
                  placeholder="Brief description of the issue…"
                  className="w-full text-[13px] border border-gray-200 rounded-sm px-3 py-2.5 bg-white text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors" />
              </div>

              {/* Detail */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Details</label>
                <textarea value={form.detail} onChange={e => set("detail", e.target.value)}
                  placeholder="Provide context, location, or additional observations…"
                  rows={4}
                  className="w-full text-[13px] border border-gray-200 rounded-sm px-3 py-2.5 bg-white text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors resize-none" />
              </div>

              {/* Reporter */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Reported By</label>
                <input value={form.reporter} onChange={e => set("reporter", e.target.value)}
                  placeholder="Name or badge ID (optional)"
                  className="w-full text-[13px] border border-gray-200 rounded-sm px-3 py-2.5 bg-white text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors" />
              </div>

              {/* Submit */}
              <div className="pt-2 flex items-center gap-3">
                <button onClick={handleSubmit}
                  disabled={!valid}
                  className="text-[13px] font-semibold px-6 py-2.5 rounded-sm transition-all"
                  style={valid
                    ? { background: "#111827", color: "#fff", cursor: "pointer" }
                    : { background: "#F3F4F6", color: "#9CA3AF", cursor: "not-allowed" }}>
                  Submit Report
                </button>
                {!valid && (
                  <p className="text-[11px] text-gray-400">Station, category, and title required</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-xs">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-4">Reporting Guidelines</p>
            <div className="space-y-3">
              {[
                { icon: "🔴", label: "Critical", desc: "Immediate safety or ADA risk, equipment failure, active incident" },
                { icon: "🟡", label: "Warning", desc: "Degraded service, bin overflow, minor equipment anomaly" },
                { icon: "🔵", label: "Info", desc: "Observation, improvement suggestion, non-urgent item" },
              ].map(item => (
                <div key={item.label} className="flex gap-2.5">
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-[12px] font-semibold text-gray-700">{item.label}</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-xs">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-4">SLA Response Times</p>
            <div className="space-y-2.5">
              {[
                { level: "Critical", time: "< 15 min", color: "#DC2626" },
                { level: "Warning",  time: "< 2 hours", color: "#D97706" },
                { level: "Info",     time: "< 24 hours", color: "#2563EB" },
              ].map(({ level, time, color }) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-600" style={{ color }}>{level}</span>
                  <span className="text-[12px] font-mono text-gray-700">{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Reports are automatically routed to the responsible station agent and operations team. Critical reports also page on-call staff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
type Tab = "inspect" | "issues" | "report";

export default function DartPage() {
  const [activeTab, setActiveTab] = useState<Tab>("inspect");
  const { stations, isLive, toggle, tickCount } = useStationEngine(3000);

  const allEvents = useMemo(
    () => stations
      .flatMap(s => s.events.map(e => ({ ...e, _stationId: s.id })))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 24),
    [stations]
  );

  // Network KPIs
  const networkScore = stations.length > 0
    ? Math.round(stations.reduce((s, st) => s + st.readinessScore, 0) / stations.length) : 0;
  const networkLevel: ReadinessLevel = networkScore >= 90 ? "excellent" : networkScore >= 75 ? "good" : networkScore >= 60 ? "fair" : "at-risk";
  const totalRidership = stations.reduce((s, st) => s + st.ridership.today, 0);
  const totalRevenue   = stations.reduce((s, st) => s + st.agents.revenue.dailyRevenue, 0);
  const openIssueCount = useMemo(
    () => stations.flatMap(s => s.events).filter(e => !e.resolved).length,
    [stations]
  );
  const votingStations = stations.filter(s => s.politicalStatus === "voting").length;

  // Per-line stats
  const lineStats = useMemo(() => DART_LINES.map(line => {
    const ls = stations.filter(s => s.lineIds.includes(line.id));
    const score = ls.length > 0 ? Math.round(ls.reduce((s, st) => s + st.readinessScore, 0) / ls.length) : 0;
    const level: ReadinessLevel = score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 60 ? "fair" : "at-risk";
    const activeIssues = ls.reduce((s, st) => s + Object.values(st.agents).filter(a => a.status === "critical" || a.status === "alert").length, 0);
    const actionsInProgress = ls.reduce((s, st) => s + Object.values(st.agents).filter(a => !!a.activeAction).length, 0);
    const ridershipToday = ls.reduce((s, st) => s + st.ridership.today, 0);
    return { line, ls, score, level, activeIssues, actionsInProgress, ridershipToday };
  }), [stations]);

  // Network-wide active actions
  const networkActions = useMemo(() => {
    const out: { stationName: string; stationId: string; agentLabel: string; action: ActiveAction; status: string; }[] = [];
    for (const station of stations) {
      for (const agent of Object.values(station.agents)) {
        if (agent.activeAction) out.push({ stationName: station.shortName, stationId: station.id, agentLabel: agent.label, action: agent.activeAction, status: agent.status });
      }
    }
    return out;
  }, [stations]);

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "inspect", label: "Inspect",  icon: <Activity className="w-3.5 h-3.5" /> },
    { id: "issues",  label: "Issues",   icon: <AlertTriangle className="w-3.5 h-3.5" />, badge: openIssueCount },
    { id: "report",  label: "Report",   icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F5" }}>
      <Nav />

      {/* ── Page header ── */}
      <div className="pt-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <Link href="/platform?tab=demo"
            className="inline-flex items-center gap-2 text-[11px] font-medium text-gray-400 hover:text-gray-700 transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" /> Command Center
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-medium tracking-[0.3em] text-gray-400 uppercase block mb-1">KAI · DART Rail Network</span>
              <h1 className="text-2xl font-light tracking-tight text-gray-900">Network Intelligence</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: isLive ? "#27AE60" : "#9CA3AF" }} />
                <span className="text-[12px] text-gray-500">{isLive ? "Live" : "Paused"} · update {tickCount}</span>
              </div>
              <button onClick={toggle}
                className="text-[11px] font-medium px-3 py-1.5 border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all rounded-sm">
                {isLive ? "Pause" : "Resume"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-0">
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-3.5 text-[12px] font-semibold tracking-wide transition-all duration-150 border-b-2 ${
                    active
                      ? "text-gray-900 border-gray-900"
                      : "text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300"
                  }`}>
                  {tab.icon}
                  {tab.label}
                  {tab.badge != null && tab.badge > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                      style={{
                        background: active ? "#111827" : "#FEF2F2",
                        color: active ? "#fff" : "#DC2626",
                      }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Political alert ── */}
      {votingStations > 0 && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2.5 flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <p className="text-[12px] text-red-700">
              <span className="font-semibold">May 2, 2026 — </span>
              Addison, Highland Park &amp; University Park proceeding to DART withdrawal vote.
            </p>
          </div>
        </div>
      )}

      {/* ── Tab: Inspect ── */}
      {activeTab === "inspect" && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">
          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-sm p-5 flex items-center gap-4 shadow-xs">
              <ReadinessGauge score={networkScore} level={networkLevel} size="sm" showLabel={false} />
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Network Score</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5 capitalize">{networkLevel}</p>
              </div>
            </div>
            {[
              { label: "Riders Today",  value: totalRidership.toLocaleString() },
              { label: "Revenue Today", value: `$${totalRevenue.toLocaleString()}` },
              { label: "Open Issues",   value: openIssueCount.toString(),
                color: openIssueCount > 4 ? "#DC2626" : openIssueCount > 2 ? "#D97706" : "#16A34A" },
            ].map(stat => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-sm p-5 shadow-xs">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-light mt-2 text-gray-900" style={(stat as { color?: string }).color ? { color: (stat as { color?: string }).color } : {}}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Line cards */}
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-gray-400 uppercase mb-3">Lines — {DART_LINES.length} Monitored</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {lineStats.map(({ line, ls, score, level, activeIssues, actionsInProgress, ridershipToday }) => (
                    <LineCard key={line.id}
                      lineId={line.id} lineName={line.name} lineShort={line.shortName}
                      lineColor={line.color} lineBg={line.bgColor} lineBorder={line.borderColor}
                      lineRoute={line.route} stationCount={ls.length} score={score} level={level}
                      activeIssues={activeIssues} actionsInProgress={actionsInProgress}
                      ridershipToday={ridershipToday} stationNames={ls.map(s => s.shortName)} />
                  ))}
                </div>
              </div>

              {/* Active actions table */}
              {networkActions.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-medium tracking-[0.2em] text-gray-400 uppercase flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Agent Actions In Progress
                    </p>
                    <span className="text-[11px] font-mono text-gray-400">{networkActions.length} active · network-wide</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {networkActions.map((item, i) => {
                      const eta = formatETA(item.action);
                      const color = STATUS_COLOR[item.status] ?? "#6B7280";
                      return (
                        <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                            <div className="absolute inset-0 rounded-full animate-ping" style={{ background: color, opacity: 0.3 }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Link href={`/dart/station/${item.stationId}`}
                                className="text-[12px] font-semibold text-gray-700 hover:text-black transition-colors">
                                {item.stationName}
                              </Link>
                              <span className="text-[10px] text-gray-400">{item.agentLabel}</span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-snug truncate">{item.action.description}</p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">ETA</p>
                            <span className="text-[12px] font-mono font-semibold"
                              style={{ color: eta === "Overdue" ? "#DC2626" : color }}>{eta}</span>
                          </div>
                          <Link href={`/dart/station/${item.stationId}`}
                            className="flex-shrink-0 text-[10px] text-gray-300 hover:text-gray-600 transition-colors">→</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Context strip */}
              <div className="grid sm:grid-cols-3 gap-8 pt-6 border-t border-gray-200">
                {[
                  { title: "Agent Architecture", body: "Each station runs 6 autonomous sub-agents — Safety, Cleanliness, Equipment, Revenue, Parking, and Community — each perceiving sensor data and dispatching actions every 3 seconds." },
                  { title: "Data Sources", body: "IoT bin sensors, elevator vibration, camera coverage, ridership feeds, real-time parking occupancy, revenue streams, and live Dallas weather — fused into a unified station world model." },
                  { title: "Political Context", body: "Addison, Highland Park and University Park proceed to the May 2, 2026 DART withdrawal vote. KAI gives cities and DART transparent, real-time evidence of station performance." },
                ].map(item => (
                  <div key={item.title}>
                    <p className="text-xs font-semibold tracking-[0.18em] text-gray-400 uppercase mb-3">{item.title}</p>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: live feed */}
            <div className="lg:col-span-1">
              <p className="text-xs font-medium tracking-[0.2em] text-gray-400 uppercase mb-3">Agent Activity — Live</p>
              <div className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden" style={{ height: 640 }}>
                <LiveFeed events={allEvents} maxItems={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Issues ── */}
      {activeTab === "issues" && <IssuesTab stations={stations} />}

      {/* ── Tab: Report ── */}
      {activeTab === "report" && <ReportTab stations={stations} />}
    </div>
  );
}
