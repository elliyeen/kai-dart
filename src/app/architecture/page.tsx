import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/landing/SiteFooter";
import ArchitectureMap from "@/components/landing/ArchitectureMap";

export const metadata: Metadata = {
  title: "Architecture — KAI Station Intelligence",
  description: "How KAI turns approved station data into the right action, independently verified, with security and human oversight at every step.",
};

export default function ArchitecturePage() {
  return (
    <div className="landing-sans min-h-screen bg-white text-black">
      <Nav />
      <main id="main" className="bg-white pt-28 pb-20 relative overflow-hidden">
        <div aria-hidden="true" className="hidden lg:block absolute right-0 top-24 w-[320px] h-[180px] bg-[#FFC72C]/90 [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] font-medium tracking-[0.3em] text-gray-700 uppercase">Technical architecture</p>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] leading-[1.05] text-[#0B1F33]">KAI Super Intelligence</h1>
          <div aria-hidden="true" className="mt-5 h-1 w-14 rounded bg-[#FFC72C]" />
          <p className="mt-5 text-xl text-gray-700 font-light max-w-2xl">Turn station data into the right action, at the right time.</p>
          <div className="mt-10"><ArchitectureMap /></div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
