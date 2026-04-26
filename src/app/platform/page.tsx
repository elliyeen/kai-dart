"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Database, Cpu, Workflow, BarChart3, Smartphone, Map, BookOpen } from "lucide-react";
import CountUp from "@/components/CountUp";
import FadeUp from "@/components/FadeUp";
import DashboardDemo from "@/components/DashboardDemo";
import Nav from "@/components/Nav";
import WizardOverlay from "@/components/WizardOverlay";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function PlatformPage() {
  const [tab, setTab] = useState<"overview" | "demo">("demo");
  const [demoView, setDemoView] = useState<string>("command");
  const [wizardOpen, setWizardOpen] = useState(false);

  const switchToDemo = (view?: string) => {
    if (view) setDemoView(view);
    setTab("demo");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "demo") switchToDemo();
  }, []);

  return (
    <div className="min-h-screen bg-[#111318] text-white">

      <Nav />


      {/* Demo tab */}
      {tab === "demo" && (
        <div className="bg-[#F7F5F0] px-6 pb-6 pt-16 min-h-screen">
          {/* Tour trigger — fixed so it stays visible below the sticky tab bar */}
          <button
            onClick={() => setWizardOpen(true)}
            className="font-ui fixed top-[120px] right-6 z-50 flex items-center gap-2 text-sm font-semibold tracking-wider uppercase bg-[#0057A8] text-white px-5 py-2.5 hover:bg-[#004A94] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Take a tour
          </button>
          <DashboardDemo initialView={demoView} />
          {wizardOpen && <WizardOverlay onClose={() => setWizardOpen(false)} />}
        </div>
      )}

      {/* Overview tab content */}
      <div className={tab === "overview" ? "" : "hidden"}>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <Image
          src={`${basePath}/images/dart/20260304_135142.jpg`}
          alt="DART train on elevated track"
          fill
          className="object-cover object-[center_35%]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-black/10 via-transparent to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 60%, white 100%)" }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p
            className="hero-animate text-[10px] font-medium tracking-[0.6em] text-white/35 mb-6 uppercase"
            style={{ animationDelay: "0ms" }}
          >
            transit
          </p>
          <h1
            className="hero-animate text-[2rem] sm:text-[3.2rem] lg:text-[5rem] xl:text-[6.5rem] font-semibold leading-[1.05] tracking-[-0.03em] mb-5 sm:mb-7 text-white"
            style={{ animationDelay: "160ms" }}
          >
            Intelligent Automation<br />for your city.
          </h1>
          <p
            className="hero-animate text-base sm:text-xl lg:text-2xl text-white mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
            style={{ animationDelay: "360ms" }}
          >
            Intelligent operation and automation for your city.
          </p>
          <div
            className="hero-animate flex flex-col sm:flex-row gap-3 justify-center"
            style={{ animationDelay: "520ms" }}
          >
            <button
              onClick={() => switchToDemo()}
              className="font-ui min-w-[200px] px-8 py-3 text-[13px] font-bold tracking-[0.05em] text-white transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-xl active:scale-95 active:translate-y-0 inline-flex items-center justify-center gap-2"
              style={{ background: "#0057A8" }}
            >
              Explore the platform <ArrowRight className="w-3 h-3" />
            </button>
            <Link
              href="/contact"
              className="font-ui min-w-[200px] bg-white text-gray-900 px-8 py-3 text-[13px] font-bold tracking-[0.05em] transition-all duration-200 hover:bg-white/90 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-xl active:scale-95 active:translate-y-0 inline-flex items-center justify-center gap-2"
            >
              Request a demo
            </Link>
          </div>
        </div>
      </section>

      {/* Cities ticker */}
      <div className="bg-white border-b border-gray-100 py-6 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
        <div className="animate-marquee whitespace-nowrap">
          {[
            { name: "Dallas",          weight: "font-bold" },
            { name: "Plano",           weight: "font-light" },
            { name: "Irving",          weight: "font-semibold" },
            { name: "Garland",         weight: "font-medium" },
            { name: "Richardson",      weight: "font-thin" },
            { name: "Carrollton",      weight: "font-bold" },
            { name: "Addison",         weight: "font-light" },
            { name: "Farmers Branch",  weight: "font-semibold" },
            { name: "Glenn Heights",   weight: "font-medium" },
            { name: "Rowlett",         weight: "font-thin" },
            { name: "University Park", weight: "font-bold" },
            { name: "Highland Park",   weight: "font-light" },
            { name: "DFW Airport",     weight: "font-semibold" },
          ].concat([
            { name: "Dallas",          weight: "font-bold" },
            { name: "Plano",           weight: "font-light" },
            { name: "Irving",          weight: "font-semibold" },
            { name: "Garland",         weight: "font-medium" },
            { name: "Richardson",      weight: "font-thin" },
            { name: "Carrollton",      weight: "font-bold" },
            { name: "Addison",         weight: "font-light" },
            { name: "Farmers Branch",  weight: "font-semibold" },
            { name: "Glenn Heights",   weight: "font-medium" },
            { name: "Rowlett",         weight: "font-thin" },
            { name: "University Park", weight: "font-bold" },
            { name: "Highland Park",   weight: "font-light" },
            { name: "DFW Airport",     weight: "font-semibold" },
          ]).map((city, i) => (
            <span key={i} className="inline-flex items-center">
              <span className={`text-[1.35rem] tracking-tight ${city.weight} px-8`} style={{ color: "#0057A8" }}>{city.name}</span>
              <span className="text-lg" style={{ color: "#93B8DE" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* The Kai Fabric — Three Layers */}
      <section className="py-16 sm:py-24 lg:py-36 bg-white text-black" id="platform">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start mb-12 lg:mb-24">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">The Kai Fabric</p>
              <h2 className="text-5xl lg:text-6xl font-thin leading-tight tracking-[-0.02em]">
                Three layers.<br />One unified truth.
              </h2>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="lg:pt-16">
                <p className="text-xl text-gray-600 leading-relaxed font-light">
                  Most organizations manage data, operations, and intelligence in silos.
                  Kai dissolves those silos — connecting every data source, every person,
                  and every decision into a single, living operating picture.
                </p>
              </div>
            </FadeUp>
          </div>

          <div className="grid lg:grid-cols-3 gap-1">
            <FadeUp className="h-full">
              <button
                onClick={() => switchToDemo()}
                className="block h-full w-full text-left group cursor-pointer"
              >
                <div className="bg-black text-white p-6 sm:p-8 lg:p-12 h-full relative transition-all duration-300 group-hover:bg-[#0d0d0d] group-hover:ring-1 group-hover:ring-white/20">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8 transition-all duration-300 group-hover:border-white/50 group-hover:scale-110">
                    <Database className="w-5 h-5 text-white/50 transition-colors duration-300 group-hover:text-white/90" />
                  </div>
                  <div className="text-[10px] font-medium tracking-[0.35em] text-white/30 mb-4 uppercase transition-colors duration-300 group-hover:text-white/50">Layer 01</div>
                  <h3 className="text-2xl font-light mb-6 transition-colors duration-300 group-hover:text-white">Data Fabric</h3>
                  <p className="font-light text-white/50 leading-relaxed text-sm transition-colors duration-300 group-hover:text-white/70">
                    Every sensor, system, and record unified into one operational truth.
                    IoT streams, workforce data, inspection logs, environmental feeds —
                    all harmonized, all real-time, all in one place.
                  </p>
                  <div className="mt-10 pt-8 border-t border-white/[0.08] space-y-3">
                    {["IoT & sensor integration", "Legacy system connectors", "Real-time data pipelines", "Open API architecture"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm font-light text-white/35 transition-colors duration-300 group-hover:text-white/55">
                        <div className="w-1 h-1 bg-white/25 rounded-full shrink-0 transition-colors duration-300 group-hover:bg-white/50" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-8 right-8 flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] uppercase opacity-0 translate-y-1 group-hover:opacity-50 group-hover:translate-y-0 transition-all duration-300">
                    Station Readiness <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            </FadeUp>

            <FadeUp delay={120} className="h-full">
              <button
                onClick={() => switchToDemo()}
                className="block h-full w-full text-left group cursor-pointer"
              >
                <div className="bg-[#FF6B35] text-white p-6 sm:p-8 lg:p-12 h-full relative transition-all duration-300 group-hover:bg-[#e85e2a] group-hover:ring-1 group-hover:ring-white/30">
                  <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-8 transition-all duration-300 group-hover:border-white/70 group-hover:scale-110">
                    <Workflow className="w-5 h-5 text-white/70 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <div className="text-[10px] font-medium tracking-[0.35em] text-white/50 mb-4 uppercase transition-colors duration-300 group-hover:text-white/80">Layer 02</div>
                  <h3 className="text-2xl font-light mb-6 transition-colors duration-300 group-hover:text-white">Operations Layer</h3>
                  <p className="font-light text-white/70 leading-relaxed text-sm transition-colors duration-300 group-hover:text-white/90">
                    Real-time orchestration of people, assets, and workflows.
                    Task routing, staff deployment, incident response — all automated,
                    all traceable, all accountable.
                  </p>
                  <div className="mt-10 pt-8 border-t border-white/20 space-y-3">
                    {["Automated task routing", "GPS staff tracking", "Incident management", "Workflow automation"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm font-light text-white/60 transition-colors duration-300 group-hover:text-white/85">
                        <div className="w-1 h-1 bg-white/50 rounded-full shrink-0 transition-colors duration-300 group-hover:bg-white/80" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-8 right-8 flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] uppercase opacity-0 translate-y-1 group-hover:opacity-70 group-hover:translate-y-0 transition-all duration-300">
                    Stations View <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            </FadeUp>

            <FadeUp delay={240} className="h-full">
              <button
                onClick={() => switchToDemo("intelligence")}
                className="block h-full w-full text-left group cursor-pointer"
              >
                <div className="bg-[#2C3E50] text-white p-6 sm:p-8 lg:p-12 h-full relative transition-all duration-300 group-hover:bg-[#243342] group-hover:ring-1 group-hover:ring-white/15">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8 transition-all duration-300 group-hover:border-[#4fc3f7]/60 group-hover:scale-110">
                    <Cpu className="w-5 h-5 text-white/50 transition-colors duration-300 group-hover:text-[#4fc3f7]/90" />
                  </div>
                  <div className="text-[10px] font-medium tracking-[0.35em] text-white/30 mb-4 uppercase transition-colors duration-300 group-hover:text-[#4fc3f7]/60">Layer 03</div>
                  <h3 className="text-2xl font-light mb-6 transition-colors duration-300 group-hover:text-white">Intelligence Engine</h3>
                  <p className="font-light text-white/50 leading-relaxed text-sm transition-colors duration-300 group-hover:text-white/70">
                    AI that predicts demand, routes resources, and learns from every
                    outcome. Not a tool on top of your operations — the brain running
                    through them.
                  </p>
                  <div className="mt-10 pt-8 border-t border-white/[0.08] space-y-3">
                    {["Predictive demand modeling", "Anomaly detection", "Adaptive ML models", "Decision intelligence"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm font-light text-white/35 transition-colors duration-300 group-hover:text-white/55">
                        <div className="w-1 h-1 bg-white/25 rounded-full shrink-0 transition-colors duration-300 group-hover:bg-[#4fc3f7]/50" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-8 right-8 flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] uppercase opacity-0 translate-y-1 group-hover:opacity-50 group-hover:translate-y-0 transition-all duration-300">
                    Intelligence Engine <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#111318]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <div className="mb-10 lg:mb-20 border-b border-white/[0.08] pb-10 lg:pb-20">
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/50 mb-6 uppercase">Capabilities</p>
              <div className="grid lg:grid-cols-2 gap-12 items-end">
                <h2 className="text-5xl lg:text-6xl font-thin tracking-[-0.02em]">Six modules.<br />One platform.</h2>
                <p className="text-lg text-white/65 leading-relaxed font-light">
                  From predictive AI to field execution — each module is purpose-built
                  and works as a standalone or as part of the complete Kai stack.
                </p>
              </div>
            </div>
          </FadeUp>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
            {[
              {
                num: "01",
                icon: <Cpu className="w-4 h-4" />,
                title: "Predictive AI Engine",
                desc: "Machine learning models forecast cleaning demand, maintenance needs, and staffing requirements up to 4 hours before occurrence. Every prediction improves with each operational cycle.",
                stat: "4 hours",
                statLabel: "Forecast horizon",
              },
              {
                num: "02",
                icon: <BarChart3 className="w-4 h-4" />,
                title: "Real-Time Command Center",
                desc: "Live operational dashboard with full visibility across every asset, station, and team member. GPS tracking, IoT sensor feeds, and instant incident alerting in one unified view.",
                stat: "<30s",
                statLabel: "Alert-to-action",
              },
              {
                num: "03",
                icon: <Map className="w-4 h-4" />,
                title: "Digital Twin",
                desc: "A complete digital replica of every facility under management. 247 inspection checkpoints per station generate compliance-ready audit reports in under 2 minutes.",
                stat: "16,055",
                statLabel: "Mapped checkpoints",
              },
              {
                num: "04",
                icon: <Smartphone className="w-4 h-4" />,
                title: "Mobile Field App",
                desc: "Purpose-built for field crews. Receive tasks, complete inspections, log incidents, and scan assets via QR code — fully offline-capable, zero learning curve.",
                stat: "Offline-ready",
                statLabel: "Connectivity",
              },
              {
                num: "05",
                icon: <Workflow className="w-4 h-4" />,
                title: "Automated Workflows",
                desc: "AI-driven task routing eliminates manual dispatching. Right person, right task, right time — with surge-event protocols that deploy entire teams in under 5 minutes.",
                stat: "<5 min",
                statLabel: "Team deployment",
              },
              {
                num: "06",
                icon: <BarChart3 className="w-4 h-4" />,
                title: "Analytics & Reporting",
                desc: "Executive KPI dashboards and operational reports give leadership full accountability and real-time visibility — from a single station to an entire city network.",
                stat: "24/7",
                statLabel: "Visibility",
              },
            ].map((module, i) => (
              <FadeUp key={module.num} delay={(i % 3) * 120}>
                <div className="group hover:-translate-y-1.5 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-[3.5rem] font-thin text-white/15 leading-none tracking-[-0.02em] transition-colors duration-300 group-hover:text-[#FF6B35]/25">{module.num}</div>
                    <div className="w-9 h-9 border border-white/[0.08] flex items-center justify-center text-white/50 transition-all duration-300 group-hover:border-[#FF6B35] group-hover:text-[#FF6B35] group-hover:scale-110">
                      {module.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-light mb-4 transition-colors duration-300 group-hover:text-white">{module.title}</h3>
                  <p className="font-light text-white/65 leading-relaxed text-sm transition-colors duration-300 group-hover:text-white/80">{module.desc}</p>
                  <div className="mt-8 pt-6 border-t border-white/10 transition-colors duration-300 group-hover:border-white/25">
                    <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase transition-colors duration-300 group-hover:text-white/70">{module.statLabel}</div>
                    <div className="text-3xl font-thin mt-2 tracking-[-0.01em] transition-colors duration-300 group-hover:text-[#FF6B35]">{module.stat}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 sm:py-24 lg:py-36 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 mb-10 lg:mb-20">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">Where Kai Operates</p>
              <h2 className="text-5xl lg:text-6xl font-thin leading-tight tracking-[-0.02em]">Built for the world&apos;s most complex environments.</h2>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="flex items-end h-full pb-1">
                <p className="text-lg text-gray-500 leading-relaxed font-light">
                  Kai is deployed where operational failure is not an option — high-traffic, high-stakes,
                  high-complexity environments where real-time intelligence changes outcomes.
                </p>
              </div>
            </FadeUp>
          </div>

          <FadeUp>
            <div className="border-t border-gray-100">
              {[
                { num: "01", industry: "Transit & Cities",      desc: "Rail networks, bus systems, and urban transit — unified operational management across every station, vehicle, and crew.", proof: "65 DART stations live" },
                { num: "02", industry: "Stadiums & Events",     desc: "From daily operations to 100,000-person surge events. FIFA 2026 World Cup deployment across 9 Dallas match days.", proof: "FIFA 2026 ready" },
                { num: "03", industry: "Enterprise Facilities", desc: "Large-scale facility portfolios — corporate campuses, convention centers, mixed-use real estate — all in one operating picture.", proof: "Enterprise-grade" },
                { num: "04", industry: "Healthcare",            desc: "Hospital environments where compliance, cleanliness, and response time are mission-critical. Continuous inspection and accountability.", proof: "HIPAA-compatible" },
                { num: "05", industry: "Energy & Utilities",    desc: "Maintenance scheduling, asset inspection, and predictive failure detection for critical infrastructure.", proof: "Critical infrastructure" },
              ].map((item) => (
                <div key={item.industry} className="group border-b border-gray-100 py-8 lg:py-10 transition-all duration-200 hover:bg-gray-50/60 px-3 -mx-3">
                  {/* Mobile */}
                  <div className="lg:hidden">
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-xl font-thin text-gray-200 transition-colors duration-200 group-hover:text-gray-300">{item.num}</span>
                      <h3 className="text-xl font-light transition-colors duration-200 group-hover:text-black">{item.industry}</h3>
                    </div>
                    <p className="text-base font-light text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                    <span className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase">{item.proof}</span>
                  </div>
                  {/* Desktop */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-baseline">
                    <div className="lg:col-span-1 text-2xl font-thin text-gray-200 tracking-[-0.01em] transition-colors duration-200 group-hover:text-gray-300">{item.num}</div>
                    <div className="lg:col-span-3"><h3 className="text-xl font-light transition-colors duration-200 group-hover:text-black">{item.industry}</h3></div>
                    <div className="lg:col-span-6"><p className="text-lg font-light text-gray-500 leading-relaxed transition-colors duration-200 group-hover:text-gray-700">{item.desc}</p></div>
                    <div className="lg:col-span-2 text-right"><span className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase transition-colors duration-200 group-hover:text-black">{item.proof}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* How Kai Works */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#111318]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-24">
              <FadeUp>
                <p className="text-[11px] font-medium tracking-[0.3em] text-white/50 mb-6 uppercase">The Feedback Loop</p>
                <h2 className="text-5xl font-thin mb-8 tracking-[-0.02em]">From raw data to<br />field action in<br />&lt;30 seconds.</h2>
                <p className="text-lg text-white/65 leading-relaxed mb-12 font-light">
                  A closed-loop system that doesn&apos;t just react — it anticipates.
                  Every action feeds back into the model, making Kai sharper with
                  every event, every inspection, every deployment.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium border-b border-white pb-1 hover:border-white/40 transition-colors duration-200 gap-2"
                >
                  See a live demo
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </FadeUp>
            </div>
            <div className="space-y-0">
              {[
                {
                  step: "01",
                  title: "Ingest",
                  desc: "IoT sensors, turnstile counts, GPS positions, inspection records, workforce schedules, and third-party system feeds stream into Kai continuously — with no manual data entry required.",
                  metric: "Real-time",
                },
                {
                  step: "02",
                  title: "Analyze",
                  desc: "ML models process every incoming signal. Anomalies are detected. Demand is forecast. Patterns are identified across your entire operational footprint, not just a single location.",
                  metric: "<500ms latency",
                },
                {
                  step: "03",
                  title: "Decide",
                  desc: "The intelligence layer generates prioritized actions — dispatching the right person, escalating the right alert, triggering the right workflow — automatically, based on role, location, and priority.",
                  metric: "AI-automated",
                },
                {
                  step: "04",
                  title: "Execute",
                  desc: "Field crews receive tasks on mobile, complete inspections, and close work orders. Every action is logged, timestamped, and fed back into the model — tightening the loop with every cycle.",
                  metric: "Full audit trail",
                },
              ].map((item, i) => (
                <FadeUp key={item.step} delay={i * 100}>
                  <div className="group grid grid-cols-[40px_1fr] lg:grid-cols-[56px_1fr_auto] gap-4 lg:gap-6 items-start py-10 border-b border-white/[0.08] transition-all duration-200 hover:border-white/20">
                    <div className="text-[11px] font-medium text-white/40 tracking-[0.2em] pt-1 transition-colors duration-200 group-hover:text-[#FF6B35]">{item.step}</div>
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-2xl font-light transition-colors duration-200 group-hover:text-white">{item.title}</h3>
                        <span className="lg:hidden text-[11px] font-medium text-white/40 tracking-[0.15em] uppercase whitespace-nowrap mt-2 transition-colors duration-200 group-hover:text-white/70">{item.metric}</span>
                      </div>
                      <p className="font-light text-white/60 leading-relaxed text-sm transition-colors duration-200 group-hover:text-white/75">{item.desc}</p>
                    </div>
                    <div className="hidden lg:block text-right pt-1">
                      <span className="text-[11px] font-medium text-white/40 tracking-[0.15em] uppercase whitespace-nowrap transition-colors duration-200 group-hover:text-white/70">{item.metric}</span>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Numbers */}
      <section className="py-16 sm:py-24 lg:py-36 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <div className="mb-20">
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">Measured Outcomes</p>
              <h2 className="text-5xl font-thin tracking-[-0.02em]">Numbers that matter.</h2>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 mb-12 lg:mb-24">
              <div>
                <div className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-3">AI prediction accuracy</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={94.2} decimals={1} suffix="%" /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-3">Reduction in downtime</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={60} suffix="%" /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-3">Alert-to-action</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]">&lt;30s</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-3">Days to go-live</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={30} /></div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <div className="border-t border-gray-100 pt-16 grid lg:grid-cols-2 gap-x-20">
              {[
                { label: "Stations under management",   value: <CountUp end={65} /> },
                { label: "Total inspection points",     value: <CountUp end={16055} /> },
                { label: "Inspection points / station", value: <CountUp end={247} /> },
                { label: "Report generation time",      value: "<2 min" },
                { label: "Team deployment time",        value: "<5 min" },
                { label: "Platform uptime SLA",         value: <CountUp end={99.9} decimals={1} suffix="%" /> },
              ].map((row, i) => (
                <div key={i} className="group flex justify-between items-baseline border-b border-gray-100 py-5 transition-all duration-150 hover:border-gray-300">
                  <span className="text-[12px] text-gray-400 tracking-wide transition-colors duration-150 group-hover:text-gray-700">{row.label}</span>
                  <span className="text-2xl font-thin tracking-[-0.01em] transition-colors duration-150 group-hover:text-black">{row.value}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#111318]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/50 mb-6 uppercase">Technical Foundation</p>
              <h2 className="text-5xl font-thin mb-8 tracking-[-0.02em]">Enterprise-grade.<br />Day-one ready.</h2>
              <p className="text-xl text-white/65 leading-relaxed mb-6 font-light">
                Cloud-native open architecture. Kai integrates with your existing
                OCC, GIS, HR, ERP, and security systems — no rip-and-replace,
                no years-long implementation.
              </p>
              <p className="text-lg text-white/50 leading-relaxed mb-12 font-light">
                From contract to live operations in 30 days.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-sm font-medium border-b border-white pb-1 hover:border-white/40 transition-colors duration-200 gap-2"
              >
                Discuss your integration
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="space-y-0">
                {[
                  { label: "Deployment",    value: "Cloud-native (Azure / AWS)" },
                  { label: "Uptime SLA",    value: "99.9% guaranteed" },
                  { label: "Data latency",  value: "<500ms end-to-end" },
                  { label: "API protocol",  value: "REST & WebSocket" },
                  { label: "Mobile OS",     value: "iOS 16+ / Android 13+" },
                  { label: "Security",      value: "SOC 2 Type II · AES-256" },
                  { label: "Compliance",    value: "FTA · NIST 800-53" },
                  { label: "Go-live time",  value: "30 days" },
                ].map((row) => (
                  <div key={row.label} className="group flex justify-between items-baseline border-b border-white/10 py-5 transition-all duration-150 hover:px-2 hover:-mx-2 hover:border-white/20">
                    <span className="text-[12px] text-white/55 tracking-wide transition-colors duration-150 group-hover:text-white/80">{row.label}</span>
                    <span className="text-lg font-light transition-colors duration-150 group-hover:text-white">{row.value}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-44 bg-[#111318] border-t border-white/10">
        <FadeUp>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-[11px] font-medium tracking-[0.4em] text-white/50 mb-10 uppercase">Ready to See It</p>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl xl:text-[6rem] font-thin mb-8 leading-none tracking-[-0.03em]">
              See Kai in action.
            </h2>
            <p className="text-xl text-white/65 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
              A 5-minute live demo — command center walkthrough, AI prediction
              simulation, and a FIFA 2026 surge-event scenario.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-black px-8 sm:px-12 py-4 text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-300"
              >
                Request a live demo
              </Link>
              <Link
                href="/world-cup-2026"
                className="border border-white/20 px-8 sm:px-12 py-4 text-sm font-medium tracking-wide hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                FIFA 2026 deployment
                <ArrowRight className="w-3.5 h-3.5" />
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

      </div> {/* end overview wrapper */}

    </div>
  );
}
