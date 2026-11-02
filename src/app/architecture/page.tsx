import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/landing/SiteFooter";
import ArchitectureMap from "@/components/landing/ArchitectureMap";
import { GetStartedButton } from "@/components/landing/CtaBadge";

export const metadata: Metadata = {
  title: "Architecture — KAI Station Intelligence",
  description: "How KAI turns approved station data into the right action, independently verified, with security and human oversight at every step.",
};

export default function ArchitecturePage() {
  return (
    <div className="landing-sans min-h-screen bg-white text-black">
      <Nav wide />
      <main id="main" className="bg-white pt-28 pb-20 relative overflow-hidden">
        <div aria-hidden="true" className="hidden lg:block absolute right-0 top-24 w-[300px] h-[170px] bg-[#FFD21F] [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
        <div className="relative max-w-[1480px] mx-auto px-6 lg:px-12">
          <p className="text-[11px] font-medium tracking-[0.3em] text-black uppercase">Technical architecture</p>
          <h1 style={{ fontWeight: 700 }} className="mt-3 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] leading-[1.05] text-[#0B1F33]">DART Super Intelligence</h1>
          <div aria-hidden="true" className="mt-5 h-1 w-14 rounded bg-[#FFD21F]" />
          <p className="mt-5 text-xl text-black font-normal max-w-2xl">Turn transit data into the right action, at the right time.</p>
          <div className="mt-10"><ArchitectureMap /></div>
          <div className="mt-14 flex justify-center" data-testid="arch-cta"><GetStartedButton href="/stations?guide=1" label="See KAI in action" wide /></div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
