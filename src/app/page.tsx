import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Database, Workflow, Cpu } from "lucide-react";
import WorldCupCountdown from "@/components/WorldCupCountdown";
import FadeUp from "@/components/FadeUp";
import CountUp from "@/components/CountUp";
import Nav from "@/components/Nav";
import FlipText from "@/components/FlipText";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      <Nav />

      {/* Hero */}
      <section className="h-[65vh] sm:h-[80vh] lg:h-[calc(100vh-64px)] flex flex-col items-center justify-center relative overflow-hidden">
        <Image
          src={`${basePath}/images/dart/20260314_083035.jpg`}
          alt="DART Silver Line train at station"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Lightened top overlay — enough to read, not enough to bury the image */}
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/15 to-transparent" />
        {/* Side vignettes */}
        <div className="absolute inset-0 bg-linear-to-r from-black/10 via-transparent to-black/10" />
        {/* Dark-to-light bleed — hero fades into white content below */}
        <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 60%, white 100%)" }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p
            className="hero-animate text-[10px] font-medium tracking-[0.6em] text-white/35 mb-6 uppercase"
            style={{ animationDelay: "0ms" }}
          >
            KAI
          </p>
          <h1
            className="hero-animate text-[2.2rem] sm:text-[3.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-bold leading-[1.05] tracking-[-0.03em] mb-5 sm:mb-7 text-white"
            style={{ animationDelay: "160ms" }}
          >
            Intelligent Automation<br />
            <FlipText />
          </h1>
          <p
            className="hero-animate text-xl sm:text-2xl text-white mb-8 sm:mb-10 font-light tracking-wide"
            style={{ animationDelay: "320ms" }}
          >
            Connect, update, and deploy Kai.
          </p>
          <div
            className="hero-animate flex flex-col sm:flex-row gap-3 justify-center"
            style={{ animationDelay: "400ms" }}
          >
            <Link
              href="/platform?tab=demo"
              className="font-ui px-8 py-3 text-[13px] font-bold tracking-[0.05em] text-white transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-xl active:scale-95 active:translate-y-0"
              style={{ background: "#0057A8" }}
            >
              Explore the platform
            </Link>
            <Link
              href="/contact"
              className="font-ui bg-white text-gray-900 px-8 py-3 text-[13px] font-bold tracking-[0.05em] transition-all duration-200 hover:bg-white/90 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-xl active:scale-95 active:translate-y-0 inline-flex items-center justify-center gap-2"
            >
              Request a demo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </section>

      {/* Used by Businesses and Cities — logo marquee */}
      <div className="bg-[#F8F7F4] border-b border-gray-200 py-10 overflow-hidden">
        <p className="text-center text-[10px] font-medium tracking-[0.3em] text-gray-400 uppercase mb-8">
          Used by Businesses and Cities
        </p>
        <div className="overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <div className="animate-marquee flex items-baseline whitespace-nowrap">
            {(() => {
              const logos = [
                { name: "Dallas",          cls: "font-black text-[1.85rem] tracking-tight text-black/80" },
                { name: "Carrollton",      cls: "font-thin text-[1.5rem] text-black/25" },
                { name: "Plano",           cls: "font-black text-[1.7rem] text-black/70" },
                { name: "DFW Airport",     cls: "font-thin text-[1.3rem] tracking-[0.18em] uppercase text-black/22" },
                { name: "Irving",          cls: "font-semibold text-[1.5rem] text-black/55" },
                { name: "Addison",         cls: "font-light text-[1.4rem] text-black/30" },
                { name: "University Park", cls: "font-bold text-[1.6rem] text-black/72" },
                { name: "Highland Park",   cls: "font-extralight text-[1.55rem] tracking-widest text-black/18" },
                { name: "Farmers Branch",  cls: "font-semibold text-[1.4rem] text-black/45" },
                { name: "Richardson",      cls: "font-thin text-[1.5rem] text-black/22" },
                { name: "Garland",         cls: "font-medium text-[1.5rem] text-black/50" },
              ];
              return [...logos, ...logos].map((logo, i) => (
                <span key={i} className="inline-flex items-center">
                  <span className={`${logo.cls} px-5 sm:px-10`}>
                    {logo.name}
                  </span>
                  <span className="text-gray-200 text-sm select-none">·</span>
                </span>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* The Kai Fabric */}
      <section className="py-12 sm:py-20 lg:py-36 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-end mb-10 lg:mb-20">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-600 mb-6 uppercase">How It Works</p>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-thin leading-tight tracking-[-0.02em] text-black">
                Three layers.<br />One unified truth.
              </h2>
            </FadeUp>
            <FadeUp delay={160}>
              <p className="text-xl text-gray-800 leading-relaxed font-light">
                Most organizations manage data, operations, and intelligence in silos.
                Kai dissolves those silos — connecting every source, every person,
                and every decision into a single living operating picture.
              </p>
              <Link
                href="/platform"
                className="inline-flex items-center mt-8 text-sm font-medium border-b border-black pb-1 hover:border-gray-400 transition-colors duration-200 gap-2"
              >
                See the full platform
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </FadeUp>
          </div>

          <div className="grid lg:grid-cols-3 gap-1">
            <FadeUp className="h-full">
              <Link href="/platform?tab=demo" className="block h-full group cursor-pointer">
                <div className="bg-black text-white p-6 sm:p-10 h-full relative transition-all duration-300 group-hover:bg-[#0d0d0d] group-hover:ring-1 group-hover:ring-white/20">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-8 transition-all duration-300 group-hover:border-white/50 group-hover:scale-110">
                    <Database className="w-4 h-4 text-white/40 transition-colors duration-300 group-hover:text-white/80" />
                  </div>
                  <div className="text-[10px] font-medium tracking-[0.35em] text-white/30 mb-3 uppercase transition-colors duration-300 group-hover:text-white/50">Layer 01</div>
                  <h3 className="text-xl font-light mb-4 transition-colors duration-300 group-hover:text-white">Data Fabric</h3>
                  <p className="text-sm text-white/50 leading-relaxed font-light transition-colors duration-300 group-hover:text-white/70">
                    Every sensor, system, and record unified into one operational truth.
                    IoT streams, workforce data, and inspection logs — all harmonized, all real-time.
                  </p>
                  <div className="absolute bottom-6 right-6 flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] uppercase opacity-0 translate-y-1 group-hover:opacity-50 group-hover:translate-y-0 transition-all duration-300">
                    Station Readiness <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </FadeUp>
            <FadeUp delay={120} className="h-full">
              <Link href="/platform?tab=demo" className="block h-full group cursor-pointer">
                <div className="bg-[#FF6B35] text-white p-6 sm:p-10 h-full relative transition-all duration-300 group-hover:bg-[#e85e2a] group-hover:ring-1 group-hover:ring-white/30">
                  <div className="w-10 h-10 border border-white/30 flex items-center justify-center mb-8 transition-all duration-300 group-hover:border-white/70 group-hover:scale-110">
                    <Workflow className="w-4 h-4 text-white/60 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <div className="text-[10px] font-medium tracking-[0.35em] text-white/50 mb-3 uppercase transition-colors duration-300 group-hover:text-white/80">Layer 02</div>
                  <h3 className="text-xl font-light mb-4 transition-colors duration-300 group-hover:text-white">Operations Layer</h3>
                  <p className="text-sm text-white/70 leading-relaxed font-light transition-colors duration-300 group-hover:text-white/90">
                    Real-time orchestration of people, assets, and workflows.
                    Task routing, staff deployment, incident response — all automated and accountable.
                  </p>
                  <div className="absolute bottom-6 right-6 flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] uppercase opacity-0 translate-y-1 group-hover:opacity-70 group-hover:translate-y-0 transition-all duration-300">
                    Stations View <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </FadeUp>
            <FadeUp delay={240} className="h-full">
              <div className="bg-[#2C3E50] text-white p-6 sm:p-10 h-full">
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-8">
                  <Cpu className="w-4 h-4 text-white/40" />
                </div>
                <div className="text-[10px] font-medium tracking-[0.35em] text-white/30 mb-3 uppercase">Layer 03</div>
                <h3 className="text-xl font-light mb-4">Intelligence Engine</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">
                  AI that predicts demand, routes resources, and learns from every outcome.
                  Not a tool on top of operations — the brain running through them.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Proof in Action */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#111318]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start mb-12 lg:mb-24">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/50 mb-6 uppercase">Live Deployment</p>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-thin leading-tight tracking-[-0.02em]">
                Kai is live across<br />65 DART stations<br />today.
              </h2>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="lg:pt-16">
                <p className="text-xl text-white/65 leading-relaxed mb-8 font-light">
                  The Dallas Area Rapid Transit network is our proving ground.
                  16,055 inspection points across 93 miles of light rail, and the world&apos;s
                  biggest sporting event bearing down in {Math.ceil((new Date("2026-06-11").getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days.
                </p>
                <Link
                  href="/world-cup-2026"
                  className="inline-flex items-center text-sm font-medium border-b border-white pb-1 hover:border-white/40 transition-colors duration-200 gap-2"
                >
                  FIFA 2026 deployment
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeUp>
          </div>

          {/* Stats */}
          <FadeUp>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 border-t border-white/10 pt-12 lg:pt-20">
              <div>
                <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase mb-3">DART Stations</div>
                <div className="text-[2.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={65} /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase mb-3">Inspection Points</div>
                <div className="text-[2.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={16055} /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase mb-3">AI Accuracy</div>
                <div className="text-[2.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={94.2} decimals={1} suffix="%" /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase mb-3">Alert-to-Action</div>
                <div className="text-[2.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]">&lt;30s</div>
              </div>
            </div>
          </FadeUp>

          {/* Match day data */}
          <FadeUp delay={200}>
            <div className="border-t border-white/[0.08] pt-10 mt-12 lg:pt-16 lg:mt-20 grid lg:grid-cols-2 gap-x-20">
              {[
                { label: "Normal daily ridership",  value: "35,000" },
                { label: "Match day demand",         value: "100,000+" },
                { label: "Surge capacity",           value: "+286%" },
                { label: "Staff deployment time",    value: "<5 min" },
                { label: "Report generation",        value: "<2 min" },
                { label: "Platform uptime SLA",      value: "99.9%" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline border-b border-white/10 py-5">
                  <span className="text-[12px] text-white/50 tracking-wide">{row.label}</span>
                  <span className="text-2xl font-thin tracking-[-0.01em]">{row.value}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* World Cup Countdown */}
      <WorldCupCountdown />

      {/* Platform — Image backed */}
      <section className="relative py-16 sm:py-24 lg:py-36 bg-[#111318] overflow-hidden">
        <Image
          src={`${basePath}/images/dart/20260223_191335.jpg`}
          alt="DART Platform operations"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#111318]/80 via-[#111318]/30 to-[#111318]/80" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <div className="mb-20">
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/50 mb-6 uppercase">Capabilities</p>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-thin tracking-[-0.02em]">Six modules. One platform.</h2>
            </div>
          </FadeUp>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
            {[
              { num: "01", title: "Predictive AI Engine",     stat: "94.2%", label: "Accuracy",   desc: "ML models forecast demand up to 4 hours ahead — maintenance, staffing, and resource allocation, automatically." },
              { num: "02", title: "Real-Time Command Center", stat: "<30s",  label: "Response",   desc: "Live dashboard across every asset and team member. GPS tracking, IoT sensors, and instant incident alerting." },
              { num: "03", title: "Automated Workflows",      stat: "<5min", label: "Deployment", desc: "AI-driven task routing deploys the right person to the right task — surge protocols included." },
            ].map((item, i) => (
              <FadeUp key={item.num} delay={i * 120}>
                <div className="text-[4rem] font-thin text-white/15 mb-4 leading-none tracking-[-0.02em]">{item.num}</div>
                <h3 className="text-lg font-light mb-4">{item.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed font-light">{item.desc}</p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase">{item.label}</div>
                  <div className="text-3xl font-thin mt-2 tracking-[-0.01em]">{item.stat}</div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={100}>
            <div className="mt-20 pt-16 border-t border-white/[0.08]">
              <Link
                href="/platform"
                className="inline-flex items-center text-sm font-medium border-b border-white pb-1 hover:border-white/40 transition-colors duration-200 gap-2"
              >
                View all six modules
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 sm:py-24 lg:py-36 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 mb-12 lg:mb-24">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">About Kai</p>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-thin leading-tight tracking-[-0.02em]">
                The organic<br />improvement of<br />the spaces we share.
              </h2>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="flex items-end h-full pb-1">
                <p className="text-xl text-gray-500 leading-relaxed font-light">
                  Good spaces don&apos;t happen by accident. They&apos;re built by people who care,
                  running systems that never stop learning — steadily raising the quality
                  of every environment people move through together.
                </p>
              </div>
            </FadeUp>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-16 pt-12 lg:pt-20 border-t border-gray-100">
            {[
              {
                num: "01",
                title: "The Human Experience",
                body: "We work with what's already there — the stations, routes, and infrastructure millions depend on — and we make them better, from the inside out. Every tool exists to serve the person moving through the space, not the system managing it.",
              },
              {
                num: "02",
                title: "Empowering People",
                body: "The people maintaining these spaces already know what's wrong. They need better tools, cleaner data, and systems that respect their expertise. When frontline teams have what they need, the spaces they care for reflect it.",
              },
              {
                num: "03",
                title: "Continuous Improvement",
                body: "Great spaces aren't finished — they evolve. Real-world data tells us what's working, what isn't, and where to go next. The goal isn't perfection. It's a relentless, honest pursuit of better.",
              },
            ].map((item, i) => (
              <FadeUp key={item.num} delay={i * 120}>
                <div className="text-[4rem] font-thin text-gray-100 mb-4 leading-none tracking-[-0.02em]">{item.num}</div>
                <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{item.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-28 lg:py-52 overflow-hidden">
        <Image
          src={`${basePath}/images/dart/20260227_124144.jpg`}
          alt="Park Lane DART Station"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#111318]/75" />
        <FadeUp>
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-[11px] font-medium tracking-[0.4em] text-white/50 mb-10 uppercase">Get Started</p>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl xl:text-[6rem] font-thin mb-8 leading-none tracking-[-0.03em]">
              See Kai in action.
            </h2>
            <p className="text-xl text-white/60 mb-10 sm:mb-16 max-w-2xl mx-auto leading-relaxed font-light">
              A 5-minute live demo — command center walkthrough and AI prediction
              simulation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/platform?tab=demo"
                className="font-ui px-8 py-3 text-[13px] font-bold tracking-[0.05em] text-white transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-xl active:scale-95 active:translate-y-0"
                style={{ background: "#0057A8" }}
              >
                Explore the platform
              </Link>
              <Link
                href="/contact"
                className="font-ui bg-white text-gray-900 px-8 py-3 text-[13px] font-bold tracking-[0.05em] transition-all duration-200 hover:bg-white/90 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-xl active:scale-95 active:translate-y-0 inline-flex items-center justify-center gap-2"
              >
                Request a demo <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
            <div className="text-[13px] text-white/50">
              © {new Date().getFullYear()} KAI — The Operating System for Cities and Enterprise.
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              <Link href="/platform" className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">Platform</Link>
              <Link href="/world-cup-2026" className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">FIFA 2026</Link>
              <Link href="/#about" className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">About</Link>
              <Link href="/contact" className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
