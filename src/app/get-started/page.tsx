import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
          <p className="text-[11px] font-medium tracking-[0.3em] text-gray-600 mb-4 uppercase">Get started</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.02em] leading-[1.05] max-w-3xl">From first conversation to a verified pilot</h1>
          <p className="mt-5 text-lg text-gray-800 font-light max-w-2xl">A six-month paid pilot at three stations, in four steps. DART decides at every stage.</p>
          <ol className="mt-12 grid gap-4 md:grid-cols-2" data-testid="steps">
            {STEPS.map((s) => (
              <li key={s.n} className="border border-gray-200 rounded-xl p-6 bg-white" data-testid="step">
                <div className="flex items-center gap-3"><span aria-hidden="true" className="w-9 h-9 rounded-full bg-[#0B1F33] text-white grid place-items-center text-sm font-semibold">{s.n}</span><p className="text-xs uppercase tracking-wider text-gray-700">{s.when}</p></div>
                <h2 className="mt-4 text-2xl font-normal">{s.title}</h2>
                <p className="mt-2 text-base text-gray-800 leading-relaxed">{s.body}</p>
                <p className="mt-4 text-sm text-gray-800"><span className="font-semibold">What DART gets:</span> {s.out}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-gray-700 max-w-3xl">The pilot scope is three stations, proposed as Park Lane, Akard and Spring Valley. The interactive demo also shows SMU/Mockingbird as an illustration.</p>
          <div className="mt-10 flex flex-wrap gap-3 items-center">
            <Link href="/contact" className="cta-badge font-ui" data-variant="primary"><span className="cta-badge-text"><span className="cta-badge-caption">Start here</span> <span className="cta-badge-label">Discuss a Pilot</span></span><ArrowRight className="cta-badge-arrow w-4 h-4" aria-hidden="true" /></Link>
            <Link href="/faq" className="cta-badge font-ui" data-variant="outline"><span className="cta-badge-text"><span className="cta-badge-caption">Read the</span> <span className="cta-badge-label">14 answers</span></span></Link>
            <Link href="/stations" className="text-sm underline underline-offset-2">Try the interactive demo</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
