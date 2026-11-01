import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeUp from "@/components/FadeUp";
import { IMAGES, img } from "./assets";

const BLUE = "#0057A8";

export function CTAButtons({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link href="/stations" className="font-ui inline-flex items-center justify-center min-h-11 px-8 text-[13px] font-bold tracking-[0.05em] text-white hover:opacity-90 transition-opacity" style={{ background: BLUE }}>
        Explore Station Intelligence
      </Link>
      <Link href="/contact" className={`font-ui inline-flex items-center justify-center gap-2 min-h-11 px-8 text-[13px] font-bold tracking-[0.05em] transition-colors ${dark ? "bg-white text-gray-900 hover:bg-white/90" : "border border-gray-300 text-gray-900 hover:bg-gray-50"}`}>
        Request Demo <ArrowRight className="w-3 h-3" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function CinematicHero() {
  return (
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-[calc(100vh-64px)] min-h-[480px] flex items-end overflow-hidden">
      <Image src={img(IMAGES.hero.file)} alt={IMAGES.hero.alt} fill priority sizes="100vw" className="object-cover object-[62%_center]" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-14 sm:pb-20 text-white">
        <h1 className="hero-animate text-[2.4rem] sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-[-0.03em] max-w-3xl mb-5">
          Every station,<br />ready for riders.
        </h1>
        <p className="hero-animate text-lg sm:text-xl font-light text-white/90 max-w-xl mb-8" style={{ animationDelay: "160ms" }}>
          KAI connects what is seen in a station to who owns it, who fixes it and who verifies it.
        </p>
        <div className="hero-animate max-w-md sm:max-w-none" style={{ animationDelay: "280ms" }}>
          <div className="sm:flex"><CTAButtons dark /></div>
        </div>
      </div>
    </section>
  );
}

export function ProofSection() {
  return (
    <section id="mission" className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        <FadeUp>
          <p className="text-[11px] font-medium tracking-[0.3em] text-gray-600 mb-6 uppercase">Mission</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-[-0.02em]">
            See it. Own it. Solve it. Verify it. Learn from it.
          </h2>
        </FadeUp>
        <FadeUp delay={120}>
          <p className="text-xl text-gray-700 leading-relaxed font-light mb-8">
            KAI is an operations and accountability layer for physical station conditions. It does not replace the systems transit teams already run. It connects them so an issue never stops at &ldquo;reported.&rdquo;
          </p>
          <EvidencePanel />
        </FadeUp>
      </div>
    </section>
  );
}

export function EvidencePanel() {
  return (
    <figure className="border border-gray-200 p-6">
      <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 mb-3">Verified public source</p>
      <blockquote className="text-lg font-light text-gray-900 leading-snug">
        DART&rsquo;s FY2026 customer survey reports record satisfaction, and still names bus reliability, safety, train cleanliness and disruption communication as areas to improve.
      </blockquote>
      <figcaption className="mt-4 text-sm text-gray-600">
        Source:{" "}
        <a className="underline underline-offset-2 hover:text-black" href="https://prod.dart.org/about/news-and-events/newsreleases/newsrelease-detail/dart-earns-record-net-promoter-score-as-rider-satisfaction-reaches-highest-level-since-2019" target="_blank" rel="noopener noreferrer">
          DART news release, FY2026 Net Promoter Score
        </a>
        . Classification: public statement by DART.
      </figcaption>
    </figure>
  );
}

const STEPS = [
  { n: "01", t: "Connect", d: "Bring in authorized inspections, reports and public station records with their sources." },
  { n: "02", t: "Detect", d: "Match each observation to a station, platform or asset and flag what needs attention." },
  { n: "03", t: "Coordinate", d: "Route the issue to a named owner through an approved workflow." },
  { n: "04", t: "Verify", d: "An authorized inspector accepts the evidence before the issue is closed." },
];

export function WorkflowSteps() {
  return (
    <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
      {STEPS.map((s) => (
        <li key={s.n} className="bg-white p-6 sm:p-8">
          <div className="text-4xl font-thin text-gray-500 mb-4" aria-hidden="true">{s.n}</div>
          <h3 className="text-xl font-light mb-2">{s.t}</h3>
          <p className="text-sm text-gray-700 leading-relaxed font-light">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

export function OperationalIntelligence() {
  const rows = [
    { m: "Station readiness", v: "Not connected", c: "Requires DART data access" },
    { m: "Cleanliness status", v: "Unknown", c: "No verified inspection feed" },
    { m: "Open issues", v: "Demo data", c: "Synthetic scenario in the live demo" },
    { m: "Last verified update", v: "None", c: "Nothing is shown as live" },
  ];
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Operational measures and their data status</caption>
          <thead>
            <tr className="border-b border-gray-300 text-[11px] tracking-[0.15em] uppercase text-gray-600">
              <th scope="col" className="py-3 pr-4 font-medium">Measure</th>
              <th scope="col" className="py-3 pr-4 font-medium">Status</th>
              <th scope="col" className="py-3 font-medium">Classification</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.m} className="border-b border-gray-200">
                <th scope="row" className="py-4 pr-4 font-light text-base">{r.m}</th>
                <td className="py-4 pr-4 text-base">{r.v}</td>
                <td className="py-4 text-gray-700 font-light">{r.c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm text-gray-600 max-w-2xl">
        KAI is an Elliyeen demonstration and proposed pilot. It is not a DART-approved or DART-operated system, and no figure here is DART performance data. Every metric in a pilot would carry its source, observation time and freshness.
      </p>
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden text-white">
      <Image src={img(IMAGES.cta.file)} alt={IMAGES.cta.alt} fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-[#111318]/70" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-6xl font-light tracking-[-0.03em] mb-8">See KAI in action.</h2>
        <CTAButtons dark />
      </div>
    </section>
  );
}
