import Link from "next/link";
import { AlertTriangle, ClipboardList, ListChecks, Sparkles, Boxes, ScrollText, PlayCircle } from "lucide-react";

const TOOLS = [
  { href: "/stations/report", label: "Report issue", Icon: AlertTriangle },
  { href: "/stations/issues", label: "Issues log", Icon: ClipboardList },
  { href: "/stations/checklist", label: "Inspection checklist", Icon: ListChecks },
  { href: "/stations/intelligence", label: "Intelligence engine", Icon: Sparkles },
  { href: "/stations/inventory", label: "Inventory", Icon: Boxes },
  { href: "/stations/audit", label: "Audit log", Icon: ScrollText },
  { href: "/stations/loop", label: "Auto demo", Icon: PlayCircle },
];

/** Field operations + intelligence tools from the original app, reachable from every platform page. */
export default function ToolsBar({ path }: { path: string }) {
  return (
    <nav aria-label="Field operations and intelligence" data-testid="tools-bar" className="border-b border-gray-200 bg-slate-50">
      <ul className="max-w-[1600px] mx-auto px-4 lg:px-6 flex gap-2 overflow-x-auto no-scrollbar py-1.5">
        {TOOLS.map(({ href, label, Icon }) => {
          const on = path.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link href={href} aria-current={on ? "page" : undefined} className={`min-h-11 px-3 rounded-full text-sm inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${on ? "bg-blue-100 text-[#0057A8] font-semibold" : "text-gray-900 hover:bg-gray-100"}`}>
                <Icon className="w-4 h-4" aria-hidden="true" />{label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
