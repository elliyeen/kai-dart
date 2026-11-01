"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, ArrowDown, Lock, ShieldCheck, Layers, UserCheck } from "lucide-react";

type Status = "demo" | "proposed";
type Node = { id: string; n?: number; title: string; sub: string; blurb: string; detail: string[]; status: Status; art?: ReactNode };

const NAVY = "#0B1F33", BLUE = "#0057A8", AMBER = "#FFC72C", SKY = "#DCEBFA";

const Tram = () => (
  <svg viewBox="0 0 160 110" className="w-full h-full" role="img" aria-label="Station platform with a light-rail vehicle">
    <ellipse cx="80" cy="96" rx="68" ry="9" fill="#E6EAF0" />
    <rect x="14" y="30" width="132" height="6" rx="3" fill={NAVY} /><rect x="22" y="36" width="3" height="52" fill="#9AA6B5" /><rect x="135" y="36" width="3" height="52" fill="#9AA6B5" />
    <rect x="30" y="52" width="110" height="34" rx="9" fill="#fff" stroke="#C9D2DE" /><rect x="30" y="72" width="110" height="7" fill={AMBER} /><rect x="30" y="79" width="110" height="7" rx="3" fill={NAVY} />
    {[40, 62, 84, 106].map((x) => <rect key={x} x={x} y="58" width="15" height="11" rx="2" fill={SKY} stroke="#9AB8D8" />)}
    <rect x="122" y="56" width="14" height="14" rx="3" fill={SKY} stroke="#9AB8D8" />
    <rect x="14" y="88" width="132" height="3" fill="#B7C0CC" />
  </svg>
);
const Stack = () => (
  <svg viewBox="0 0 160 110" className="w-full h-full" role="img" aria-label="Layered platform tile labelled KAI">
    <ellipse cx="80" cy="98" rx="62" ry="8" fill="#E6EAF0" />
    <path d="M80 62 L140 78 L80 96 L20 78Z" fill={NAVY} /><path d="M80 48 L140 64 L80 82 L20 64Z" fill={AMBER} /><path d="M80 12 L140 30 L80 54 L20 30Z" fill="#fff" stroke="#C9D2DE" />
    <text x="80" y="38" textAnchor="middle" fontSize="15" fontWeight="600" letterSpacing="3" fill={NAVY}>KAI</text>
  </svg>
);
const Monitor = () => (
  <svg viewBox="0 0 160 110" className="w-full h-full" role="img" aria-label="Monitor showing a network map with an alert">
    <ellipse cx="80" cy="100" rx="56" ry="7" fill="#E6EAF0" />
    <rect x="68" y="78" width="24" height="14" fill="#B7C0CC" /><rect x="52" y="90" width="56" height="5" rx="2" fill="#9AA6B5" />
    <rect x="28" y="12" width="104" height="68" rx="6" fill={NAVY} /><rect x="34" y="18" width="92" height="56" rx="3" fill="#16314D" />
    <path d="M40 60 L66 40 L92 52 L118 28" stroke={AMBER} strokeWidth="2" fill="none" /><path d="M66 40 L72 66 M92 52 L106 68" stroke="#4F7FB0" strokeWidth="1.5" />
    {[[40, 60], [66, 40], [92, 52], [118, 28], [72, 66], [106, 68]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill={AMBER} />)}
    <path d="M108 26 L122 52 L94 52Z" fill={AMBER} /><rect x="107" y="35" width="2.6" height="9" fill={NAVY} /><circle cx="108.3" cy="48" r="1.6" fill={NAVY} />
  </svg>
);
const Van = () => (
  <svg viewBox="0 0 160 110" className="w-full h-full" role="img" aria-label="Service van with a technician">
    <ellipse cx="80" cy="96" rx="64" ry="8" fill="#E6EAF0" />
    <rect x="22" y="40" width="82" height="42" rx="6" fill="#fff" stroke="#C9D2DE" /><path d="M104 52 L128 52 L136 66 L136 82 L104 82Z" fill="#fff" stroke="#C9D2DE" /><path d="M108 56 L124 56 L130 66 L108 66Z" fill={SKY} />
    <rect x="22" y="66" width="114" height="6" fill={AMBER} /><rect x="22" y="72" width="114" height="10" rx="2" fill={NAVY} />
    <circle cx="48" cy="84" r="8" fill="#2B2F36" /><circle cx="48" cy="84" r="3" fill="#C9D2DE" /><circle cx="118" cy="84" r="8" fill="#2B2F36" /><circle cx="118" cy="84" r="3" fill="#C9D2DE" />
    <rect x="58" y="34" width="14" height="6" rx="2" fill={AMBER} />
    <circle cx="146" cy="52" r="6" fill="#F2C9A5" /><rect x="140" y="58" width="13" height="22" rx="3" fill={AMBER} />
  </svg>
);
const People = () => (
  <svg viewBox="0 0 160 110" className="w-full h-full" role="img" aria-label="Riders at a clean station shelter">
    <ellipse cx="80" cy="98" rx="66" ry="8" fill="#E6EAF0" />
    <rect x="16" y="22" width="128" height="6" rx="3" fill={NAVY} /><rect x="20" y="28" width="3" height="64" fill="#9AA6B5" /><rect x="137" y="28" width="3" height="64" fill="#9AA6B5" />
    {[[48, "#8D5A3B", BLUE], [80, "#C58F6A", NAVY], [112, "#E0B48F", "#7A8CA3"]].map(([x, skin, shirt], i) => (
      <g key={i}><circle cx={Number(x)} cy="50" r="10" fill={String(skin)} /><path d={`M${Number(x) - 15} 92 Q${Number(x) - 15} 64 ${Number(x)} 64 Q${Number(x) + 15} 64 ${Number(x) + 15} 92Z`} fill={String(shirt)} /></g>
    ))}
  </svg>
);

const NODES: Node[] = [
  { id: "data", n: 1, title: "Data In", sub: "Inspections · Maintenance · Stations", blurb: "Information DART already collects.", status: "proposed", art: <Tram />,
    detail: ["KAI would begin from DART-approved sources: inspection records, maintenance records, station conditions, and optional approved sensors.", "Access starts read-only. Nothing in an existing DART system changes without DART approval.", "In this demo every record is synthetic. No DART source is connected."] },
  { id: "platform", n: 2, title: "KAI Platform", sub: "Ingest · Model · Link", blurb: "One connected picture of each station.", status: "demo", art: <Stack />,
    detail: ["Controlled ingestion keeps the source and time of every record so each finding can be traced back to where it came from.", "A shared model links the station, the issue, the work order, the evidence and the inspector.", "The demo shows this model with synthetic records."] },
  { id: "intelligence", n: 3, title: "Intelligence", sub: "Detect · Prioritize · Route", blurb: "The right issue gets the right attention.", status: "demo", art: <Monitor />,
    detail: ["Clear, explainable rules rank station issues by severity, repeat history and what is blocking the fix.", "Every recommendation shows the evidence behind it. DART staff make the final decision.", "The demo runs this prioritization on synthetic data."] },
  { id: "action", n: 4, title: "Action", sub: "Dispatch · Fix · Verify", blurb: "Work is done, then independently confirmed.", status: "demo", art: <Van />,
    detail: ["A ticket is dispatched to a technician, who acknowledges, checks in on site and confirms the work.", "An independent inspector, never the person who did the work, verifies the result.", "Every stage is timed. The demo simulates this whole path."] },
  { id: "outcomes", n: 5, title: "Outcomes", sub: "Verified · Measured · Reported", blurb: "A cleaner, safer, more reliable station.", status: "proposed", art: <People />,
    detail: ["An executive scorecard reports verified closures, time to verification and repeat findings against agreed baselines.", "After six months DART receives a three-station report and an evidence-based recommendation. Expansion is DART's separate decision.", "The demo shows a sample scorecard."] },
];
const SECURITY: Node[] = [
  { id: "sec-data", title: "Protected data", sub: "", blurb: "", status: "proposed", detail: ["Proposed: encryption in transit and at rest, and agreed retention and deletion terms.", "Production access follows DART security approval. These controls are not claimed as live."] },
  { id: "sec-access", title: "Controlled access", sub: "", blurb: "", status: "proposed", detail: ["Proposed: role-based access with least privilege, enforced on the server.", "The role switcher in the demo is a simulation, not access control."] },
  { id: "sec-audit", title: "Audit trail", sub: "", blurb: "", status: "demo", detail: ["Every sign-in, role change and ticket action is logged. The demo keeps this log in the browser and lets you export it.", "A server-side audit log is proposed for the pilot."] },
  { id: "sec-human", title: "Human oversight", sub: "", blurb: "", status: "proposed", detail: ["DART's authorized staff and qualified providers make maintenance and safety decisions, not the software.", "Independent verification is always a person."] },
];
const SEC_ICON: Record<string, ReactNode> = { "sec-data": <ShieldCheck className="w-5 h-5" aria-hidden="true" />, "sec-access": <Layers className="w-5 h-5" aria-hidden="true" />, "sec-audit": <Lock className="w-5 h-5" aria-hidden="true" />, "sec-human": <UserCheck className="w-5 h-5" aria-hidden="true" /> };
const STATUS: Record<Status, string> = { demo: "Shown in the demo (synthetic data)", proposed: "Proposed for the pilot" };

export default function ArchitectureMap() {
  const [sel, setSel] = useState<string>("data");
  const all = [...NODES, ...SECURITY];
  const cur = all.find((n) => n.id === sel)!;
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-stretch gap-3" data-testid="arch-flow">
        {NODES.map((n, i) => (
          <div key={n.id} className="contents">
            <button type="button" onClick={() => setSel(n.id)} aria-pressed={sel === n.id} data-testid="arch-node"
              className={`group flex flex-col justify-start flex-1 basis-0 min-w-0 text-left rounded-2xl border p-4 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${sel === n.id ? "border-[#0057A8] shadow-md ring-2 ring-[#0057A8]/15" : "border-gray-200"}`}>
              <div className="aspect-[16/11] rounded-xl bg-gradient-to-b from-[#F5F8FC] to-white overflow-hidden">{n.art}</div>
              <div className="mt-4 flex items-center gap-2.5">
                <span aria-hidden="true" className="w-7 h-7 flex-none rounded-full bg-[#FFF1BF] text-[#0B1F33] grid place-items-center text-sm font-semibold">{n.n}</span>
                <span className="text-lg font-medium leading-tight">{n.title}</span>
              </div>
              <p className="mt-2 text-sm text-gray-800">{n.sub}</p>
              <p className="mt-1 text-sm text-gray-700">{n.blurb}</p>
            </button>
            {i < NODES.length - 1 && (
              <div aria-hidden="true" className="flex-none self-center text-[#0B1F33]">
                <ArrowRight className="hidden md:block w-5 h-5" /><ArrowDown className="md:hidden w-5 h-5 mx-auto" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#0B1F33] via-[#0B1F33] to-[#16314D] text-white md:rounded-full overflow-hidden flex flex-col md:flex-row md:items-center" data-testid="arch-security">
        <div className="flex items-center gap-3 px-6 py-4 md:py-5 md:pr-10 md:[clip-path:polygon(0_0,100%_0,calc(100%-24px)_100%,0_100%)] bg-[#0B1F33]">
          <Lock className="w-6 h-6" aria-hidden="true" /><span className="text-lg font-medium">Built for security</span>
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 bg-[#F3F6FA] text-[#0B1F33]">
          {SECURITY.map((s) => (
            <button key={s.id} type="button" onClick={() => setSel(s.id)} aria-pressed={sel === s.id} data-testid="arch-sec"
              className={`flex items-center justify-center gap-2 px-3 py-4 min-h-[56px] text-sm font-medium border-l border-gray-200 first:border-l-0 hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0057A8] ${sel === s.id ? "bg-white" : ""}`}>
              {SEC_ICON[s.id]}{s.title}
            </button>
          ))}
        </div>
      </div>

      <section aria-live="polite" aria-labelledby="arch-detail-title" className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8" data-testid="arch-detail">
        <p className={`inline-block text-xs font-medium rounded-full px-3 py-1 ${cur.status === "demo" ? "bg-[#E8F3EA] text-[#14532D]" : "bg-[#EAF1FA] text-[#0B3A6B]"}`}>{STATUS[cur.status]}</p>
        <h2 id="arch-detail-title" className="mt-3 text-2xl font-normal">{cur.title}</h2>
        <div className="mt-3 space-y-2 max-w-3xl">{cur.detail.map((d) => <p key={d} className="text-base text-gray-800 leading-relaxed">{d}</p>)}</div>
      </section>

      <p className="mt-4 text-sm text-gray-700">Select any step or security control to read about it. Everything marked &ldquo;Shown in the demo&rdquo; runs on synthetic data. Everything marked &ldquo;Proposed&rdquo; is not yet in place.</p>

      <details className="mt-6 border-t border-gray-200 pt-4" data-testid="arch-text">
        <summary className="cursor-pointer text-sm font-medium py-2">Read the same diagram as text</summary>
        <ol className="mt-3 space-y-3 text-sm text-gray-800">
          {NODES.map((n) => <li key={n.id}><span className="font-semibold">{n.n}. {n.title}</span> ({STATUS[n.status]}): {n.detail[0]}</li>)}
        </ol>
        <p className="mt-4 text-sm font-semibold">Across every step</p>
        <ul className="mt-2 space-y-2 text-sm text-gray-800">{SECURITY.map((s) => <li key={s.id}><span className="font-semibold">{s.title}</span> ({STATUS[s.status]}): {s.detail[0]}</li>)}</ul>
      </details>
    </div>
  );
}
