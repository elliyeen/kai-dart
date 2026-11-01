"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Printer, Mail } from "lucide-react";

const STATION_OPTIONS = [
  { id: "park-lane", name: "Park Lane", note: "Proposed pilot station" },
  { id: "akard", name: "Akard", note: "Proposed pilot station" },
  { id: "spring-valley", name: "Spring Valley", note: "Proposed pilot station" },
  { id: "smu", name: "SMU/Mockingbird", note: "Optional, shown in the demo" },
];
const STEPS = ["Agency", "Stations", "Sign-off", "Review"];
const INCLUDED = [
  "Six-month paid pilot at the selected stations",
  "Baseline measurement before launch",
  "Independent verification of every fix",
  "Scorecards and a verified outcome report",
  "An expansion recommendation (expansion is DART's separate decision)",
];
const DOCS = ["Pilot summary", "Scope and deliverables", "Data and security overview (proposed controls)", "Draft pilot agreement", "Written quote, prepared with DART"];

const field = "mt-1.5 w-full border border-gray-300 rounded-lg px-3.5 py-3 text-base bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 min-h-[48px]";
const label = "block text-sm font-medium text-gray-900";

type Form = { org: string; name: string; role: string; email: string; stations: string[]; signName: string; signRole: string; signEmail: string; cc: string; notes: string };

export default function PilotCheckout() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [f, setF] = useState<Form>({ org: "", name: "", role: "", email: "", stations: ["park-lane", "akard", "spring-valley"], signName: "", signRole: "", signEmail: "", cc: "", notes: "" });
  const set = (k: keyof Form, v: string) => setF((p) => ({ ...p, [k]: v }));
  const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  const valid = [
    f.org.trim() && f.name.trim() && emailOk(f.email),
    f.stations.length > 0,
    f.signName.trim() && emailOk(f.signEmail) && (!f.cc.trim() || f.cc.split(/[,;\s]+/).filter(Boolean).every(emailOk)),
    true,
  ];
  const stationNames = STATION_OPTIONS.filter((s) => f.stations.includes(s.id)).map((s) => s.name);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const toggle = (id: string) => setF((p) => ({ ...p, stations: p.stations.includes(id) ? p.stations.filter((x) => x !== id) : [...p.stations, id] }));

  const summaryText = [
    "KAI Station Intelligence: pilot summary (draft)",
    `Date: ${today}`,
    `Agency: ${f.org}`,
    `Requested by: ${f.name}${f.role ? `, ${f.role}` : ""} (${f.email})`,
    `Stations: ${stationNames.join(", ")}`,
    `Sign-off: ${f.signName}${f.signRole ? `, ${f.signRole}` : ""} (${f.signEmail})`,
    "Term: six-month paid pilot",
    "Quote: prepared with DART",
    "",
    "Included:", ...INCLUDED.map((i) => `- ${i}`),
    "", "Documents:", ...DOCS.map((d) => `- ${d}`),
  ].join("\n");
  const mailto = `mailto:${encodeURIComponent(f.signEmail)}?${f.cc.trim() ? `cc=${encodeURIComponent(f.cc.split(/[,;\s]+/).filter(Boolean).join(","))}&` : ""}subject=${encodeURIComponent(`KAI pilot summary: ${f.org}`)}&body=${encodeURIComponent(summaryText)}`;

  const Summary = (
    <aside aria-label="Pilot summary" className="border border-gray-200 rounded-2xl bg-white p-6 lg:sticky lg:top-24" data-testid="pilot-summary">
      <p className="text-xs uppercase tracking-wider text-gray-700">Pilot summary</p>
      <h2 className="mt-2 text-2xl font-normal">Six-month paid pilot</h2>
      <dl className="mt-5 divide-y divide-gray-200 text-sm">
        <div className="py-3 flex justify-between gap-4"><dt className="text-gray-700">Agency</dt><dd className="text-right font-medium">{f.org || "Not entered yet"}</dd></div>
        <div className="py-3 flex justify-between gap-4"><dt className="text-gray-700">Stations</dt><dd className="text-right font-medium">{stationNames.length ? stationNames.join(", ") : "None selected"}</dd></div>
        <div className="py-3 flex justify-between gap-4"><dt className="text-gray-700">Sign-off</dt><dd className="text-right font-medium">{f.signName || "Not entered yet"}</dd></div>
        <div className="py-3 flex justify-between gap-4"><dt className="text-gray-700">Quote</dt><dd className="text-right font-medium">Prepared with DART</dd></div>
      </dl>
      <ul className="mt-4 space-y-2 text-sm text-gray-800">
        {INCLUDED.map((i) => (<li key={i} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 flex-none text-[#0057A8]" aria-hidden="true" />{i}</li>))}
      </ul>
    </aside>
  );

  if (done) {
    return (
      <div data-testid="checkout-done">
        <h1 className="text-4xl sm:text-5xl font-light tracking-[-0.02em] leading-[1.05]">Pilot summary</h1>
        <p className="mt-3 text-base text-gray-800 max-w-2xl">Your summary is ready. It has not been sent anywhere yet. Save it as a PDF or open it in your email to send to {f.signName || "your sign-off contact"}.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="border border-gray-200 rounded-2xl bg-white p-6 sm:p-8">
            <div className="flex justify-between gap-4 text-sm text-gray-700"><span>Draft summary</span><span>{today}</span></div>
            <h2 className="mt-4 text-2xl font-normal">{f.org}</h2>
            <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 text-sm">
              <div><dt className="text-gray-700">Requested by</dt><dd className="font-medium">{f.name}{f.role ? `, ${f.role}` : ""}<br />{f.email}</dd></div>
              <div><dt className="text-gray-700">Sign-off</dt><dd className="font-medium">{f.signName}{f.signRole ? `, ${f.signRole}` : ""}<br />{f.signEmail}</dd></div>
              <div><dt className="text-gray-700">Stations</dt><dd className="font-medium">{stationNames.join(", ")}</dd></div>
              <div><dt className="text-gray-700">Term and quote</dt><dd className="font-medium">Six months. Quote prepared with DART.</dd></div>
            </dl>
            {f.notes.trim() && <p className="mt-5 text-sm text-gray-800"><span className="font-semibold">Notes:</span> {f.notes}</p>}
            <h3 className="mt-8 text-base font-semibold">Included</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-800">{INCLUDED.map((i) => <li key={i}>• {i}</li>)}</ul>
            <h3 className="mt-6 text-base font-semibold">Documentation pack</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-800">{DOCS.map((d) => <li key={d}>• {d}</li>)}</ul>
          </section>
          <div className="print:hidden space-y-3 lg:sticky lg:top-24 self-start">
            <button type="button" onClick={() => window.print()} className="cta-badge font-ui w-full justify-center" data-variant="primary"><Printer className="w-4 h-4" aria-hidden="true" /><span className="cta-badge-label" style={{ marginTop: 0 }}>Save as PDF</span></button>
            <a href={mailto} className="cta-badge font-ui w-full justify-center" data-variant="outline"><Mail className="w-4 h-4" aria-hidden="true" /><span className="cta-badge-label" style={{ marginTop: 0 }}>Open in email</span></a>
            <button type="button" onClick={() => { setDone(false); setStep(3); }} className="w-full text-sm underline underline-offset-2 py-2">Edit details</button>
            <p className="text-xs text-gray-700">Opening in email prepares a draft addressed to your sign-off contact. Nothing is sent until you send it.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl sm:text-5xl font-light tracking-[-0.02em] leading-[1.05]">Checkout</h1>
      <nav aria-label="Progress" className="mt-8 print:hidden">
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined}>
              <div className={`h-1 rounded-full ${i <= step ? "bg-[#0057A8]" : "bg-gray-200"}`} />
              <p className={`mt-2 text-sm ${i === step ? "text-black font-medium" : "text-gray-700"}`}>{s}</p>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] items-start">
        <form onSubmit={(e) => { e.preventDefault(); if (!valid[step]) return; if (step < 3) setStep(step + 1); else setDone(true); }} className="border border-gray-200 rounded-2xl bg-white p-6 sm:p-8" noValidate>
          {step === 0 && (
            <fieldset className="space-y-5"><legend className="text-2xl font-normal">Your agency</legend>
              <div><label className={label} htmlFor="org">Organization</label><input id="org" className={field} value={f.org} onChange={(e) => set("org", e.target.value)} autoComplete="organization" /></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className={label} htmlFor="name">Your name</label><input id="name" className={field} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" /></div>
                <div><label className={label} htmlFor="role">Role</label><input id="role" className={field} value={f.role} onChange={(e) => set("role", e.target.value)} autoComplete="organization-title" /></div>
              </div>
              <div><label className={label} htmlFor="email">Work email</label><input id="email" type="email" className={field} value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></div>
            </fieldset>
          )}
          {step === 1 && (
            <fieldset><legend className="text-2xl font-normal">Choose stations</legend>
              <p className="mt-2 text-sm text-gray-700">The pilot covers three stations. The three proposed ones are selected.</p>
              <div className="mt-5 grid gap-3">
                {STATION_OPTIONS.map((s) => { const on = f.stations.includes(s.id); return (
                  <label key={s.id} className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer min-h-[64px] ${on ? "border-[#0057A8] bg-[#0057A8]/5" : "border-gray-300"}`}>
                    <input type="checkbox" className="w-5 h-5 accent-[#0057A8]" checked={on} onChange={() => toggle(s.id)} />
                    <span><span className="block text-base font-medium">{s.name}</span><span className="block text-sm text-gray-700">{s.note}</span></span>
                  </label>); })}
              </div>
            </fieldset>
          )}
          {step === 2 && (
            <fieldset className="space-y-5"><legend className="text-2xl font-normal">Who signs off</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className={label} htmlFor="signName">Procurement or sign-off contact</label><input id="signName" className={field} value={f.signName} onChange={(e) => set("signName", e.target.value)} /></div>
                <div><label className={label} htmlFor="signRole">Role</label><input id="signRole" className={field} value={f.signRole} onChange={(e) => set("signRole", e.target.value)} /></div>
              </div>
              <div><label className={label} htmlFor="signEmail">Their email</label><input id="signEmail" type="email" className={field} value={f.signEmail} onChange={(e) => set("signEmail", e.target.value)} /></div>
              <div><label className={label} htmlFor="cc">Others who should receive it (optional)</label><input id="cc" className={field} value={f.cc} onChange={(e) => set("cc", e.target.value)} placeholder="Separate emails with commas" /></div>
              <div><label className={label} htmlFor="notes">Notes (optional)</label><textarea id="notes" rows={3} className={field} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></div>
            </fieldset>
          )}
          {step === 3 && (
            <div><h2 className="text-2xl font-normal">Review</h2>
              <p className="mt-2 text-sm text-gray-700">Check the summary on the right. The quote is prepared with DART, so no amount is shown.</p>
              <h3 className="mt-6 text-base font-semibold">Documentation pack</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-800">{DOCS.map((d) => <li key={d} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 flex-none text-[#0057A8]" aria-hidden="true" />{d}</li>)}</ul>
            </div>
          )}
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? <button type="button" onClick={() => setStep(step - 1)} className="text-sm underline underline-offset-2 min-h-[44px] px-2">Back</button> : <Link href="/get-started" className="text-sm underline underline-offset-2 min-h-[44px] px-2 inline-flex items-center">Back</Link>}
            <button type="submit" disabled={!valid[step]} className="cta-badge font-ui disabled:opacity-40 disabled:pointer-events-none" data-variant="primary"><span className="cta-badge-label" style={{ marginTop: 0 }}>{step < 3 ? "Continue" : "Create summary"}</span></button>
          </div>
        </form>
        {Summary}
      </div>
    </div>
  );
}
