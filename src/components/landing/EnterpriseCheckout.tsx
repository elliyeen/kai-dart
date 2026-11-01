"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, Copy, Mail, Printer } from "lucide-react";

const DEPLOYMENTS = [
  { id: "pilot3", name: "Three-station illustrative pilot", note: "Akard, Park Lane and Spring Valley. Illustrative proposals, not approved sites.", scope: "Three stations (illustrative): Akard, Park Lane, Spring Valley" },
  { id: "custom", name: "Custom or network expansion", note: "A different set of stations, or a wider network. Scope agreed together.", scope: "Custom or network expansion (scope to be agreed)" },
];
const TERMS = [
  { id: "t3", name: "Three-year initial term", note: "Begins with a six-month evaluation phase.", label: "Three-year initial term" },
  { id: "t3r", name: "Three-year initial term plus two optional one-year renewals", note: "Renewals are optional and decided at the time.", label: "Three-year initial term plus two optional one-year renewals" },
  { id: "custom", name: "Negotiated custom term", note: "Length and structure agreed in writing.", label: "Negotiated custom term" },
];
const CATEGORIES = ["Licensing", "Integration", "Support"];
const STAGES = ["Get Started", "Checkout", "Next Steps"];

const input = "mt-1.5 w-full border border-gray-300 rounded-lg px-3.5 py-3 text-base bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 min-h-[48px] aria-[invalid=true]:border-red-700";
const labelCls = "block text-sm font-medium text-gray-900";
const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
const FREE = /@(gmail|yahoo|hotmail|outlook|aol|icloud)\./i;

export default function EnterpriseCheckout() {
  const [stage, setStage] = useState<1 | 2>(1); // 1 = Checkout, 2 = Next Steps
  const [orgInput, setOrg] = useState<string | null>(null);
  // Prepopulate the organization only when arriving from the DART demonstration (?demo=dart).
  const fromDemo = useSyncExternalStore(() => () => {}, () => new URLSearchParams(window.location.search).get("demo") === "dart", () => false);
  const org = orgInput ?? (fromDemo ? "Dallas Area Rapid Transit" : "");
  const [email, setEmail] = useState("");
  const [signName, setSignName] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [deployment, setDeployment] = useState("pilot3");
  const [term, setTerm] = useState("t3r");
  const [ack, setAck] = useState(false);
  const [tried, setTried] = useState(false);
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headRef.current?.focus(); }, [stage]);

  const dep = DEPLOYMENTS.find((d) => d.id === deployment)!;
  const trm = TERMS.find((t) => t.id === term)!;
  const errors = {
    org: org.trim() ? "" : "Enter your organization.",
    email: !email.trim() ? "Enter your business email." : !emailOk(email) ? "Enter a valid email address." : FREE.test(email) ? "Use a business email address." : "",
    signEmail: signEmail.trim() && !emailOk(signEmail) ? "Enter a valid email address." : "",
    ack: ack ? "" : "Confirm that this is not a binding purchase.",
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const shown = (k: keyof typeof errors) => (tried ? errors[k] : "");

  const summary = [
    "KAI proposal request (non-binding draft)",
    `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    `Organization: ${org}`,
    `Contact: ${email}`,
    signName || signEmail ? `Procurement or sign-off contact: ${[signName, signEmail].filter(Boolean).join(", ")}` : "",
    "Platform: KAI Station Intelligence",
    `Station scope: ${dep.scope}`,
    "Evaluation period: six months (proposed phase)",
    `Term: ${trm.label} (proposed)`,
    `Licensing, integration and support: custom pricing, pending an approved quote`,
    "Amount due today: $0.00. No payment collected.",
    "This is not a binding purchase and has not been submitted.",
  ].filter(Boolean).join("\n");

  const mailto = `mailto:${encodeURIComponent(signEmail.trim())}?subject=${encodeURIComponent(`KAI proposal request: ${org}`)}&body=${encodeURIComponent(summary)}`;

  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopied("ok"); } catch { setCopied("fail"); }
  }

  const Order = (
    <aside aria-label="Order summary" className="border border-gray-200 rounded-2xl bg-white p-6 lg:sticky lg:top-24" data-testid="order-summary">
      <h2 className="text-xl font-normal">Order summary</h2>
      <dl className="mt-4 divide-y divide-gray-200 text-sm">
        <div className="py-3 flex justify-between gap-4"><dt className="text-gray-700">Platform</dt><dd className="text-right font-medium">KAI Station Intelligence</dd></div>
        <div className="py-3 flex justify-between gap-4"><dt className="text-gray-700">Station scope</dt><dd className="text-right font-medium">{dep.name}</dd></div>
        <div className="py-3 flex justify-between gap-4"><dt className="text-gray-700">Evaluation period</dt><dd className="text-right font-medium">Six months (proposed)</dd></div>
        <div className="py-3 flex justify-between gap-4"><dt className="text-gray-700">Term</dt><dd className="text-right font-medium">{trm.name}</dd></div>
        {CATEGORIES.map((c) => (
          <div key={c} className="py-3 flex justify-between gap-4"><dt className="text-gray-700">{c}</dt><dd className="text-right font-medium">Custom pricing / pending approved quote</dd></div>
        ))}
      </dl>
      <div className="mt-4 pt-4 border-t border-gray-300">
        <div className="flex justify-between items-baseline"><span className="text-base font-medium">Amount due today</span><span className="text-xl font-semibold">$0.00</span></div>
        <p className="mt-1 text-sm text-gray-700">No payment collected. This is a non-binding proposal request.</p>
      </div>
    </aside>
  );

  return (
    <div>
      <nav aria-label="Progress" className="print:hidden">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {STAGES.map((s, i) => {
            const current = i === stage;
            const el = i === 0 ? <Link href="/get-started" className="underline underline-offset-4 min-h-[44px] inline-flex items-center">{s}</Link>
              : i === 1 && stage === 2 ? <button type="button" onClick={() => setStage(1)} className="underline underline-offset-4 min-h-[44px]">{s}</button>
              : <span className={current ? "font-semibold text-black" : "text-gray-600"}>{s}</span>;
            return (<li key={s} aria-current={current ? "step" : undefined} className="flex items-center gap-3">{el}{i < STAGES.length - 1 && <span aria-hidden="true" className="text-gray-400">/</span>}</li>);
          })}
        </ol>
      </nav>

      {stage === 1 ? (
        <>
          <h1 ref={headRef} tabIndex={-1} className="mt-4 text-4xl sm:text-5xl font-light tracking-[-0.02em] leading-[1.05] outline-none scroll-mt-28">Configure your proposal</h1>
          <p className="mt-3 text-base text-gray-800 max-w-2xl">Choose a scope and term. Nothing is purchased and no payment is collected.</p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] items-start">
            <form noValidate onSubmit={(e) => { e.preventDefault(); setTried(true); if (!hasErrors) setStage(2); }} className="space-y-10">
              <fieldset className="space-y-5"><legend className="text-xl font-normal">Your organization</legend>
                <div><label className={labelCls} htmlFor="org">Organization</label>
                  <input id="org" className={input} value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" aria-invalid={!!shown("org")} aria-describedby="org-err" />
                  <p id="org-err" role="alert" className="mt-1 text-sm text-red-700 min-h-0">{shown("org")}</p></div>
                <div><label className={labelCls} htmlFor="email">Business email</label>
                  <input id="email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!shown("email")} aria-describedby="email-err" />
                  <p id="email-err" role="alert" className="mt-1 text-sm text-red-700">{shown("email")}</p></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label className={labelCls} htmlFor="signName">Procurement or sign-off contact (optional)</label><input id="signName" className={input} value={signName} onChange={(e) => setSignName(e.target.value)} /></div>
                  <div><label className={labelCls} htmlFor="signEmail">Their email (optional)</label>
                    <input id="signEmail" type="email" className={input} value={signEmail} onChange={(e) => setSignEmail(e.target.value)} aria-invalid={!!shown("signEmail")} aria-describedby="sign-err" />
                    <p id="sign-err" role="alert" className="mt-1 text-sm text-red-700">{shown("signEmail")}</p></div>
                </div>
              </fieldset>

              <fieldset><legend className="text-xl font-normal">Deployment</legend>
                <p className="mt-1 text-sm text-gray-700">Stations are proposals, not approved sites.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Deployment">
                  {DEPLOYMENTS.map((d) => (
                    <label key={d.id} className={`flex gap-3 border rounded-xl p-4 cursor-pointer min-h-[88px] focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 ${deployment === d.id ? "border-black bg-gray-50" : "border-gray-300"}`}>
                      <input type="radio" name="deployment" className="mt-1 w-5 h-5 accent-black" checked={deployment === d.id} onChange={() => setDeployment(d.id)} />
                      <span><span className="block text-base font-medium">{d.name}</span><span className="block text-sm text-gray-700 mt-0.5">{d.note}</span></span>
                    </label>))}
                </div>
              </fieldset>

              <fieldset><legend className="text-xl font-normal">Term</legend>
                <p className="mt-1 text-sm text-gray-700">The six-month evaluation is a proposed phase, not a contractual promise. Terms are proposals for discussion, not approved by DART.</p>
                <div className="mt-4 grid gap-3" role="radiogroup" aria-label="Term">
                  {TERMS.map((t) => (
                    <label key={t.id} className={`flex gap-3 border rounded-xl p-4 cursor-pointer min-h-[72px] focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 ${term === t.id ? "border-black bg-gray-50" : "border-gray-300"}`}>
                      <input type="radio" name="term" className="mt-1 w-5 h-5 accent-black" checked={term === t.id} onChange={() => setTerm(t.id)} />
                      <span><span className="block text-base font-medium">{t.name}</span><span className="block text-sm text-gray-700 mt-0.5">{t.note}</span></span>
                    </label>))}
                </div>
              </fieldset>

              <div>
                <label className="flex gap-3 items-start cursor-pointer min-h-[44px]">
                  <input type="checkbox" className="mt-1 w-5 h-5 accent-black" checked={ack} onChange={(e) => setAck(e.target.checked)} aria-describedby="ack-err" />
                  <span className="text-base text-gray-900">I understand this is a request for a proposal. It is not a binding purchase, and no payment is collected.</span>
                </label>
                <p id="ack-err" role="alert" className="mt-1 text-sm text-red-700">{shown("ack")}</p>
              </div>
              <button type="submit" className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-lg bg-black text-white text-base font-medium hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Review proposal</button>
            </form>
            {Order}
          </div>
        </>
      ) : (
        <div data-testid="next-steps">
          <h1 ref={headRef} tabIndex={-1} className="mt-4 text-4xl sm:text-5xl font-light tracking-[-0.02em] leading-[1.05] outline-none scroll-mt-28">Next steps</h1>
          <p className="mt-3 text-base text-gray-800 max-w-2xl" role="status">This proposal request has not been submitted or sent anywhere, and no payment was collected. Copy the summary below to share it, or go back to change anything.</p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] items-start">
            <section className="border border-gray-200 rounded-2xl bg-white p-6 sm:p-8">
              <p className="text-sm text-gray-700">Non-binding draft</p>
              <h2 className="mt-2 text-2xl font-normal">{org}</h2>
              <pre className="mt-5 whitespace-pre-wrap font-sans text-sm text-gray-900 leading-relaxed" data-testid="proposal-summary">{summary}</pre>
              <ul className="mt-6 space-y-1.5 text-sm text-gray-800">
                {["Licensing, integration and support pricing comes from an approved quote.", "DART's procurement and legal review would apply before any agreement.", "Nothing here is approved by DART."].map((t) => <li key={t} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 flex-none" aria-hidden="true" />{t}</li>)}
              </ul>
            </section>
            <div className="space-y-3 print:hidden">
              <button type="button" onClick={copy} className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-lg bg-black text-white text-base font-medium hover:bg-gray-800"><Copy className="w-4 h-4" aria-hidden="true" />Copy proposal summary</button>
              <p role="status" className="text-sm text-gray-800 min-h-[20px]">{copied === "ok" ? "Copied to your clipboard." : copied === "fail" ? "Copy was blocked by the browser. Select the text and copy it manually." : ""}</p>
              <a href={mailto} className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-lg border border-gray-400 text-base font-medium hover:bg-gray-50"><Mail className="w-4 h-4" aria-hidden="true" />Open in email</a>
              <button type="button" onClick={() => window.print()} className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-lg border border-gray-400 text-base font-medium hover:bg-gray-50"><Printer className="w-4 h-4" aria-hidden="true" />Save as PDF</button>
              <button type="button" onClick={() => setStage(1)} className="w-full text-sm underline underline-offset-4 min-h-[44px]">Edit configuration</button>
              <p className="text-sm text-gray-700">To talk to Elliyeen directly, use the <Link href="/contact" className="underline underline-offset-2">contact page</Link>.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
