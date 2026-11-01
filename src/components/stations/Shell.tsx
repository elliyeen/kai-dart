"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ClipboardList, Network, PlayCircle, RotateCcw, X } from "lucide-react";
import { PERSONAS, type Role } from "@/lib/demo/roles";
import { dispatch, useDemo } from "@/lib/demo/store";
import type { Cmd } from "@/lib/demo/workflow";

const STEPS: { label: string; cta: string; role: Role; cmd?: Cmd; go?: string }[] = [
  { label: "1 · See the whole network", cta: "Start the guided demo", role: "executive", go: "/stations" },
  { label: "2 · Open Akard Station", cta: "Open Akard", role: "executive", go: "/stations/akard" },
  { label: "3 · Operations assigns the work", cta: "Assign as Operations", role: "operations", cmd: { type: "assign" } },
  { label: "4 · Contractor submits proof", cta: "Submit proof as Contractor", role: "contractor", cmd: { type: "submitProof" } },
  { label: "5 · Independent inspector verifies", cta: "Verify as Inspector", role: "inspector", cmd: { type: "verify" } },
  { label: "6 · Executive sees the result", cta: "Return to network", role: "executive", go: "/stations" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const demo = useDemo();
  const router = useRouter();
  const path = usePathname();
  const [guideOpen, setGuideOpen] = useState(false);
  const step = demo.guideStep;
  const done = step >= STEPS.length;

  const advance = () => {
    const s = STEPS[step];
    dispatch({ type: "setRole", role: s.role });
    if (s.cmd) dispatch(s.cmd);
    dispatch({ type: "guide", step: step + 1 });
    if (s.go) router.push(s.go);
  };
  const reset = () => { dispatch({ type: "reset" }); setGuideOpen(false); router.push("/stations"); };

  const nav = [
    { href: "/stations", label: "Network", Icon: Network, active: path === "/stations" || path.startsWith("/stations/") && !path.startsWith("/stations/work") },
    { href: "/stations/work", label: "Work", Icon: ClipboardList, active: path.startsWith("/stations/work") },
  ];
  const btn = "min-h-11 px-3.5 rounded-md text-sm inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]";

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20 lg:pb-0 font-[family-name:var(--font-geist)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
      <div role="note" data-testid="demo-banner" className="bg-amber-50 border-b border-amber-200 text-amber-950 text-xs sm:text-[13px] px-4 py-2 text-center">
        <strong>SYNTHETIC DEMO</strong> — an Elliyeen proposal, not a DART system. No live data, no real dispatch. Role switching is a simulation, <strong>not</strong> access control.
      </div>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 min-h-14 flex flex-wrap items-center gap-x-4 gap-y-2 py-2">
          <Link href="/" className="font-medium tracking-[0.3em] text-[15px] min-h-11 min-w-11 px-1 inline-flex items-center justify-center">KAI</Link>
          <span className="hidden md:inline text-sm text-gray-700">Station Intelligence · proposed DART pilot</span>
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 ml-4">
            {nav.map((n) => <Link key={n.href} href={n.href} aria-current={n.active ? "page" : undefined} className={`${btn} ${n.active ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>{n.label}</Link>)}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only sm:not-sr-only text-gray-700">Demo role</span>
              <select aria-label="Demo role (simulation only)" data-testid="role-select" value={demo.role} onChange={(e) => dispatch({ type: "setRole", role: e.target.value as Role })}
                className="min-h-11 border border-gray-300 rounded-md px-2 bg-white text-sm max-w-[10.5rem] sm:max-w-none">
                {PERSONAS.map((p) => <option key={p.role} value={p.role}>{p.label}</option>)}
              </select>
            </label>
            <button type="button" className={`${btn} bg-[#0057A8] text-white font-semibold hover:bg-[#004a8f]`} onClick={() => setGuideOpen((o) => !o)} aria-expanded={guideOpen} aria-controls="guide">
              <PlayCircle className="w-4 h-4" aria-hidden="true" /><span className="hidden sm:inline">Guided demo</span><span className="sm:hidden">Demo</span>
            </button>
            <button type="button" data-testid="reset-demo" className={`${btn} border border-gray-300 hover:bg-gray-50`} onClick={reset}>
              <RotateCcw className="w-4 h-4" aria-hidden="true" /><span className="hidden sm:inline">Reset demo</span><span className="sr-only sm:hidden">Reset demo</span>
            </button>
          </div>
        </div>
        {guideOpen && (
          <section id="guide" aria-label="Guided demo" data-testid="guide" className="border-t border-gray-200 bg-slate-50">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-3 flex flex-wrap items-center gap-3">
              <p className="text-sm text-gray-900 grow" aria-live="polite" data-testid="guide-step">{done ? "Demo complete — the Akard issue is verified resolved (synthetic). Reset to run it again." : STEPS[step].label}</p>
              {!done && <button type="button" data-testid="guide-next" onClick={advance} className={`${btn} bg-[#0B1F33] text-white font-semibold`}>{STEPS[step].cta}</button>}
              <button type="button" aria-label="Close guided demo" onClick={() => setGuideOpen(false)} className={`${btn} hover:bg-gray-100`}><X className="w-4 h-4" aria-hidden="true" /></button>
            </div>
          </section>
        )}
      </header>
      <main id="main" tabIndex={-1} className="max-w-[1440px] mx-auto">{children}</main>
      <nav aria-label="Primary mobile" className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 grid grid-cols-2 pb-[env(safe-area-inset-bottom)]">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} aria-current={n.active ? "page" : undefined} className={`min-h-14 flex flex-col items-center justify-center gap-0.5 text-xs ${n.active ? "text-[#0057A8] font-semibold" : "text-gray-700"}`}>
            <n.Icon className="w-5 h-5" aria-hidden="true" />{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
