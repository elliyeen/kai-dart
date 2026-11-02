"use client";
import Link from "next/link";
import { AlertOctagon, AlertTriangle, Ban, CheckCircle2, Clock, ShieldCheck, Truck, UserCheck, type LucideIcon } from "lucide-react";
import { LINES, LINE_BY_ID, type LineId, type Station } from "@/lib/stations";
import { EFF_LABEL, type Eff } from "@/lib/stations/effective";

const EFF_STYLE: Record<Eff, { Icon: LucideIcon; cls: string }> = {
  critical:  { Icon: AlertOctagon,  cls: "bg-red-50 text-red-900 border-red-200" },
  closed:    { Icon: Ban,           cls: "bg-gray-100 text-black border-gray-300" },
  deploying: { Icon: Truck,         cls: "bg-amber-50 text-amber-900 border-amber-200" },
  warning:   { Icon: AlertTriangle, cls: "bg-amber-50 text-amber-900 border-amber-200" },
  good:      { Icon: CheckCircle2,  cls: "bg-slate-50 text-slate-800 border-slate-200" },
  assigned:  { Icon: Truck,         cls: "bg-blue-50 text-blue-900 border-blue-200" },
  awaiting:  { Icon: Clock,         cls: "bg-indigo-50 text-indigo-900 border-indigo-200" },
  verified:  { Icon: ShieldCheck,   cls: "bg-emerald-50 text-emerald-900 border-emerald-200" },
  unknown:   { Icon: Clock,         cls: "bg-gray-50 text-black border-gray-300" },
};

/** Status is always icon + text, never color alone. */
export function StatusIndicator({ status, size = "md" }: { status: Eff; size?: "sm" | "md" }) {
  const { Icon, cls } = EFF_STYLE[status];
  const tone = cls.split(" ").find((c) => c.startsWith("text-")) ?? "text-black";
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium whitespace-nowrap text-black ${size === "sm" ? "text-xs" : "text-sm"}`}>
      <Icon className={`${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} ${tone}`} aria-hidden="true" />
      {EFF_LABEL[status]}
    </span>
  );
}

export function LineDot({ lineId, className = "" }: { lineId: LineId; className?: string }) {
  return <span aria-hidden="true" className={`inline-block w-3 h-3 rounded-full shrink-0 ${className}`} style={{ background: LINE_BY_ID[lineId].color }} />;
}

export function LineChips({ lineIds }: { lineIds: LineId[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Lines served">
      {lineIds.map((l) => (
        <li key={l} className="inline-flex items-center gap-1.5 text-sm text-black">
          <LineDot lineId={l} /> {LINE_BY_ID[l].short}
        </li>
      ))}
    </ul>
  );
}

export function LineFilter({ value, onChange }: { value: LineId | null; onChange: (l: LineId | null) => void }) {
  const base = "min-h-11 px-3.5 rounded-md border text-sm inline-flex items-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]";
  return (
    <div role="group" aria-label="Filter by line" className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={value === null} onClick={() => onChange(null)}
        className={`${base} ${value === null ? "bg-[#0B1F33] text-white border-[#0B1F33]" : "bg-white text-black border-gray-300 hover:bg-gray-50"}`}>All lines</button>
      {LINES.map((l) => (
        <button key={l.id} type="button" aria-pressed={value === l.id} onClick={() => onChange(value === l.id ? null : l.id)}
          className={`${base} ${value === l.id ? "bg-[#0B1F33] text-white border-[#0B1F33]" : "bg-white text-black border-gray-300 hover:bg-gray-50"}`}>
          <LineDot lineId={l.id} className={value === l.id ? "ring-2 ring-white" : ""} /> {l.short}
        </button>
      ))}
    </div>
  );
}

export function StationRow({ station, status, selected, href, onSelect }: {
  station: Station; status: Eff; selected?: boolean; href: string; onSelect?: () => void;
}) {
  return (
    <Link
      href={href}
      data-testid="station-row"
      data-station={station.key}
      aria-current={selected ? "true" : undefined}
      onClick={(e) => {
        if (onSelect && typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) { e.preventDefault(); onSelect(); }
      }}
      className={`flex items-center justify-between gap-3 min-h-14 px-4 py-2.5 border-b border-gray-100 hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0057A8] ${selected ? "bg-blue-50/60" : ""}`}
    >
      <span className="min-w-0">
        <span className="block text-[15px] text-black truncate">{station.name}</span>
        <span className="flex items-center gap-1 mt-0.5">
          {station.lineIds.map((l) => <LineDot key={l} lineId={l} className="!w-2.5 !h-2.5" />)}
          <span className="text-xs text-black ml-1 truncate">{station.city} · {station.demo.issues.length ? `${station.demo.issues.length} issue${station.demo.issues.length > 1 ? "s" : ""}` : "Clear"}</span>
        </span>
      </span>
      <span className="flex items-center gap-2 shrink-0"><span className="text-sm tabular-nums" style={{ fontWeight: 700, color: station.demo.score >= 85 ? "#15803D" : station.demo.score >= 70 ? "#B45309" : "#B91C1C" }} aria-label={`Synthetic readiness ${station.demo.score} percent`}>{station.demo.score}%</span><StatusIndicator status={status} size="sm" /></span>
    </Link>
  );
}

/** Intentionally renders nothing: the on-page "SYNTHETIC DEMO" labels were removed at the owner's request. Disclosure lives in the FAQ and data-sources card. */
export function DemoBadge(_props: { children?: string }) {
  return null;
}

export function ProvenanceNote({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-black leading-relaxed">{children}</p>;
}

export { UserCheck };
