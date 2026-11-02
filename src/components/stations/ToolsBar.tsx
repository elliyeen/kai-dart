import Link from "next/link";
import { AlertTriangle, ClipboardList, ListChecks, Sparkles, Boxes, ScrollText, PlayCircle, FlaskConical, HardHat } from "lucide-react";

/** Nine tools in three groups by what the person is trying to do, so the bar reads as three choices instead of nine. */
export const TOOL_GROUPS = [
  { label: "Field work", tools: [
    { href: "/stations/report", label: "Report issue", Icon: AlertTriangle },
    { href: "/stations/checklist", label: "Inspection checklist", Icon: ListChecks },
    { href: "/stations/issues", label: "Issues log", Icon: ClipboardList },
  ] },
  { label: "Intelligence", tools: [
    { href: "/stations/loop", label: "Auto demo", Icon: PlayCircle },
    { href: "/stations/intelligence", label: "Intelligence engine", Icon: Sparkles },
    { href: "/stations/scenarios", label: "Test scenarios", Icon: FlaskConical },
  ] },
  { label: "Operations", tools: [
    { href: "/stations/inventory", label: "Inventory", Icon: Boxes },
    { href: "/stations/contractors", label: "Contractors", Icon: HardHat },
    { href: "/stations/audit", label: "Audit log", Icon: ScrollText },
  ] },
] as const;

/** Field operations + intelligence tools, reachable from every platform page. */
export default function ToolsBar({ path }: { path: string }) {
  return (
    <nav aria-label="Field operations and intelligence" data-testid="tools-bar" className="lg:hidden border-b border-gray-200 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 flex items-stretch gap-5 overflow-x-auto no-scrollbar py-2">
        {TOOL_GROUPS.map((g, gi) => (
          <div key={g.label} role="group" aria-label={g.label} className={`shrink-0 flex items-center gap-2 ${gi > 0 ? "pl-5 border-l border-gray-200" : ""}`}>
            <span className="hidden xl:block text-[11px] tracking-[0.18em] uppercase text-black" style={{ fontWeight: 600 }}>{g.label}</span>
            <ul className="flex gap-1 rounded-md bg-gray-100 p-1">
              {g.tools.map(({ href, label, Icon }) => {
                const on = path.startsWith(href);
                return (
                  <li key={href}>
                    <Link href={href} aria-current={on ? "page" : undefined} className={`min-h-11 px-3.5 rounded text-sm inline-flex items-center gap-2 whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${on ? "bg-[#0B1F33] text-white font-semibold shadow-sm" : "text-black hover:bg-white"}`}>
                      <Icon className="w-4 h-4" aria-hidden="true" />{label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
