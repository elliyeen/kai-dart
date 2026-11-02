import Image from "next/image";
import Link from "next/link";
import { MonitorPlay } from "lucide-react";
import CtaBadge, { GetStartedButton } from "./CtaBadge";
import FadeUp from "@/components/FadeUp";
import { IMAGES, img } from "./assets";
import YtdTrips from "./YtdTrips";

const DEMO = <MonitorPlay className="w-[22px] h-[22px]" strokeWidth={1.75} />;

export function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
      <GetStartedButton />
      <CtaBadge href="/stations" caption="Try the" label="Demo" icon={DEMO} />
    </div>
  );
}

export function CinematicHero() {
  return (
    <section className="relative h-[78svh] min-h-[520px] max-h-[860px] flex flex-col justify-end overflow-hidden text-white">
      <Image src={img(IMAGES.hero.file)} alt={IMAGES.hero.alt} fill priority sizes="100vw" className="object-cover object-[62%_center]" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/30" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-10 sm:pb-14">
        <p className="hero-animate text-5xl sm:text-6xl lg:text-7xl leading-none" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", fontWeight: 800, fontStyle: "italic", letterSpacing: "-0.05em" }}>KAI</p>
        <p className="hero-animate mt-2 text-lg sm:text-xl font-medium" style={{ animationDelay: "120ms" }}>Clean Transit for North Texas</p>
        <div className="hero-animate mt-6 max-w-md sm:max-w-none" style={{ animationDelay: "240ms" }}>
          <div className="sm:flex sm:justify-start"><HeroButtons /></div>
        </div>
      </div>
    </section>
  );
}

/** The hero has a single call to action. */
function HeroButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start">
      <GetStartedButton />
    </div>
  );
}

/** Flows straight on from the hero photo: headline + subcopy on the left, the one sourced metric on the right. */
export function HeroIntro() {
  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 lg:gap-16 items-center">
        <div>
          <h1 className="text-[2.5rem] sm:text-6xl lg:text-7xl leading-[1.04] tracking-[-0.03em] text-gray-900" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", fontWeight: 500 }}>
            Super experience<br />for every ride
          </h1>
          <p className="mt-6 text-lg sm:text-xl font-light text-gray-800 max-w-xl leading-relaxed">We&rsquo;re changing public transportation to make it clean, safe and more intelligent than ever.</p>
        </div>
        <div className="lg:text-right">
          <p className="text-6xl sm:text-7xl font-light tracking-[-0.03em] leading-none text-gray-900" data-testid="hero-metric">171,000+</p>
          <p className="mt-2 text-base text-gray-800">Daily Passenger Trips</p>
          <p className="mt-1 text-xs text-gray-600">Source: <a className="underline underline-offset-2 hover:text-black" href="https://www.dart.org/about/news-and-events/newsreleases/newsrelease-detail/dallas-area-rapid-transit-releases-point-b-strategic-plan-annual-report-highlighting-major-investments-and-accomplishments" target="_blank" rel="noopener noreferrer">DART</a></p>
          <YtdTrips />
        </div>
      </div>
    </section>
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

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden text-white">
      <Image src={img(IMAGES.cta.file)} alt={IMAGES.cta.alt} fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-[#111318]/70" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-6xl font-light tracking-[-0.03em] mb-8">See KAI in action.</h2>
        <CTAButtons />
      </div>
    </section>
  );
}
