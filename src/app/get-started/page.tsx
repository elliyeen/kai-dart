import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/landing/SiteFooter";

export const metadata: Metadata = {
  title: "Get Started — KAI Station Intelligence",
  description: "Four steps from first conversation to a six-month paid pilot at three stations and an expansion decision.",
};

const STEPS = [
  { n: 1, title: "Discovery", when: "First conversations", body: "Agree on the goal, the success measures and three candidate stations.", out: "A one-page problem statement and a shortlist of three stations." },
  { n: 2, title: "Technical and security review", when: "Before any live access", body: "Review the approved data, privacy, architecture, risks and pricing together with DART's teams.", out: "Control documentation, test results, known gaps and a written quote for DART to evaluate." },
  { n: 3, title: "Procurement and pilot agreement", when: "Following DART's process", body: "Complete DART's procurement and supplier requirements and sign the six-month paid pilot agreement.", out: "A signed agreement with scope, integrations, support and data terms." },
  { n: 4, title: "Baseline, launch and report", when: "Six months", body: "Measure the baseline, launch at three stations, hold checkpoints, then deliver a verified outcome report and an expansion recommendation.", out: "Scorecards, verified outcomes and a recommendation. Expansion is DART's separate decision." },
];

export default function GetStartedPage() {
  return (
    <div className="landing-sans min-h-screen bg-white text-black">
      <Nav />
      <main id="main" className="bg-white pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.02em] leading-[1.05]">Getting started</h1>
          <ol className="mt-12 max-w-3xl border-l border-gray-300" data-testid="steps">
            {STEPS.map((s) => (
              <li key={s.n} className="relative pl-8 pb-10 last:pb-0" data-testid="step">
                <h2 className="text-2xl font-normal">{s.title}</h2>
                <p className="mt-2 text-base text-gray-800 leading-relaxed">{s.body}</p>
                <p className="mt-3 text-sm text-gray-800"><span className="font-semibold">What DART gets:</span> {s.out}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-gray-700 max-w-3xl">The pilot scope is three stations, proposed as Park Lane, Akard and Spring Valley. The interactive demo also shows SMU/Mockingbird as an illustration.</p>
          <div className="mt-10"><Link href="/get-started/checkout" className="cta-badge font-ui" data-variant="primary"><span className="cta-badge-label" style={{ marginTop: 0 }}>Start checkout</span></Link></div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
