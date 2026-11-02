import type { Metadata } from "next";
import { MonitorPlay } from "lucide-react";
import CtaBadge, { GetStartedButton } from "@/components/landing/CtaBadge";
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.02em] leading-[1.05]">FAQ</h1>
          <div className="mt-10"><Faq items={FAQ14} /></div>
          <div className="mt-12 flex flex-wrap gap-3">
            <GetStartedButton />
            <CtaBadge href="/stations?guide=1" caption="Try the" label="Demo" icon={<MonitorPlay className="w-[22px] h-[22px]" strokeWidth={1.75} />} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
