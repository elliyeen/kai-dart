import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Faq from "@/components/landing/Faq";
import SiteFooter from "@/components/landing/SiteFooter";
import { FAQ14 } from "@/lib/faq14";

export const metadata: Metadata = {
  title: "FAQ — KAI Station Intelligence",
  description: "Fourteen short answers about the KAI pilot: scope, security, data ownership, cost, success measures and how to get started.",
};

export default function FaqPage() {
  return (
    <div className="landing-sans min-h-screen bg-white text-black">
      <Nav />
      <main id="main" className="bg-white pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] font-medium tracking-[0.3em] text-gray-600 mb-4 uppercase">FAQ</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.02em] leading-[1.05] max-w-3xl">Questions DART will ask, answered plainly</h1>
          <p className="mt-5 text-lg text-gray-800 font-light max-w-2xl">Fourteen short answers on the pilot, security, data and cost.</p>
          <div className="mt-10"><Faq items={FAQ14} /></div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/get-started" className="cta-badge font-ui" data-variant="primary"><span className="cta-badge-text"><span className="cta-badge-caption">See the four steps</span> <span className="cta-badge-label">Get started</span></span></Link>
            <Link href="/stations" className="cta-badge font-ui" data-variant="outline"><span className="cta-badge-text"><span className="cta-badge-caption">Open the</span> <span className="cta-badge-label">Interactive demo</span></span></Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
