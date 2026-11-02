"use client";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown, RotateCcw, ShieldCheck } from "lucide-react";
import { PERSONAS, PERSONA_BY_ROLE, type Role } from "@/lib/demo/roles";
import { dispatch, useDemo } from "@/lib/demo/store";
import { ROLE_MATRIX } from "@/lib/demo/permissions";
import { logAudit } from "@/lib/audit";

const initials = (label: string) => label.split(/[\s/]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

/** Account switcher at the bottom of the sidebar (ChatGPT-style). Switching accounts is a SIMULATION: no real sign-in or access control. */
export default function AccountMenu({ collapsed, onReset }: { collapsed: boolean; onReset: () => void }) {
  const demo = useDemo();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ left: 8, bottom: 72 });
  const p = PERSONA_BY_ROLE[demo.role];
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  const pick = (role: Role) => {
    if (role !== demo.role) {
      const n = PERSONA_BY_ROLE[role];
      logAudit({ actor: n.identity, role: n.label, action: "switch_account", entityType: "session", entityId: n.identity, input: `from=${p.label}`, output: `Switched to ${n.label} (simulated sign-in)`, owner: "Platform Admin" });
      dispatch({ type: "setRole", role });
    }
    setOpen(false);
  };
  return (
    <div ref={ref} className="relative border-t border-gray-100 p-2 shrink-0">
      {open && (
        <div role="menu" aria-label="Switch demo account" data-testid="account-menu" style={{ left: pos.left, bottom: pos.bottom }} className="fixed w-[300px] bg-white border border-gray-200 rounded-md shadow-xl py-2 z-40">
          <p className="px-4 pt-1 text-[11px] tracking-[0.18em] uppercase" style={{ fontWeight: 600 }}>Switch demo account</p>
          <ul className="mt-1">
            {PERSONAS.map((x) => (
              <li key={x.role}>
                <button type="button" role="menuitemradio" aria-checked={x.role === demo.role} data-testid={`role-option-${x.role}`} onClick={() => pick(x.role)}
                  className="w-full min-h-11 px-4 py-2 flex items-start gap-3 text-left hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0057A8]">
                  <span className="w-4 pt-0.5 shrink-0">{x.role === demo.role && <Check className="w-4 h-4" aria-hidden="true" />}</span>
                  <span className="min-w-0"><span className="block text-sm font-semibold">{x.label}</span><span className="block text-xs">{x.identity} · {ROLE_MATRIX[x.role].length} permission{ROLE_MATRIX[x.role].length === 1 ? "" : "s"}</span></span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t border-gray-100 px-4 text-xs flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" /><span>Simulation only. A production build signs in through your identity provider and enforces permissions on the server.</span></div>
          <button type="button" data-testid="account-reset" onClick={() => { setOpen(false); onReset(); }} className="mt-2 w-full min-h-11 px-4 flex items-center gap-3 text-sm hover:bg-gray-50 border-t border-gray-100">
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Reset demo
          </button>
        </div>
      )}
      <button ref={btnRef} type="button" data-testid="account-button" aria-haspopup="menu" aria-expanded={open} onClick={() => { const r = btnRef.current?.getBoundingClientRect(); if (r) setPos({ left: r.left, bottom: window.innerHeight - r.top + 8 }); setOpen((o) => !o); }} title={`${p.label} · ${p.identity}`}
        className={`w-full min-h-12 rounded-md flex items-center ${collapsed ? "justify-center" : "gap-3 px-2"} hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]`}>
        <span aria-hidden="true" className="w-8 h-8 shrink-0 rounded-full bg-[#0057A8] text-white grid place-items-center text-xs" style={{ fontWeight: 700 }}>{initials(p.label)}</span>
        <span className={collapsed ? "sr-only" : "min-w-0 flex-1 text-left"}><span data-testid="account-name" className="block text-sm font-semibold truncate">{p.label}</span><span className="block text-xs truncate">{p.identity} · demo</span></span>{!collapsed && <ChevronsUpDown className="w-4 h-4 shrink-0" aria-hidden="true" />}
      </button>
    </div>
  );
}
