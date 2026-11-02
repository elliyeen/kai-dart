import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/landing/SiteFooter";

export const metadata: Metadata = {
  title: "Get Started — KAI Station Intelligence",
  description: "Improve operational visibility, detect risks earlier, and make better decisions with KAI. Four steps from defining the opportunity to verified outcomes.",
};

const STEPS = [
  { n: 1, title: "Define opportunity and success metrics", body: "Agree on the goals, how success will be measured, and the stations to start with." },
  { n: 2, title: "Review solution, architecture, security and integrations", body: "Walk through the solution, the architecture, the security controls and the integrations with DART's teams." },
  { n: 3, title: "Approve agreement, scope and procurement", body: "Complete DART's procurement process and agree the scope and terms in writing." },
  { n: 4, title: "Deploy and measure verified outcomes", body: "Launch, hold regular checkpoints and report verified results against the agreed baselines." },
];

export default function GetStartedPage() {
  return (
    <div className="landing-sans min-h-screen bg-white text-black">
      <Nav />
      <main id="main" className="bg-white pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.02em] leading-[1.05] max-w-4xl">A more intelligent transit network.</h1>
          <p className="mt-5 text-lg sm:text-xl text-gray-800 font-light max-w-2xl">Improve operational visibility, detect risks earlier, and make better decisions with KAI.</p>

          <ol className="mt-14 max-w-3xl border-l border-gray-300" data-testid="steps">
            {STEPS.map((s) => (
              <li key={s.n} className="pl-8 pb-10 last:pb-0" data-testid="step">
                <p className="text-xs uppercase tracking-wider text-gray-700">Step {s.n}</p>
                <h2 className="mt-1.5 text-2xl font-normal">{s.title}</h2>
                <p className="mt-2 text-base text-gray-800 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>

          <section aria-labelledby="deploy-summary" className="mt-12 max-w-3xl border-t border-gray-200 pt-8" data-testid="deployment-summary">
            <h2 id="deploy-summary" className="text-xl font-normal">Illustrative deployment</h2>
            <p className="mt-3 text-base text-gray-800 leading-relaxed">A three-year initial agreement that begins with a six-month evaluation phase, followed by two optional one-year renewals.</p>
            <p className="mt-3 text-sm text-gray-700">These are proposed terms for discussion, not terms approved by DART. The starting stations suggested are Akard, Park Lane and Spring Valley, and they are proposals, not approved sites.</p>
          </section>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/checkout" className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-lg bg-black text-white text-base font-medium hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors">Configure your proposal</Link>
            <Link href="/contact" className="text-base underline underline-offset-4 min-h-[44px] inline-flex items-center">Talk to us first</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
