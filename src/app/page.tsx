import Link from "next/link";
import Nav from "@/components/Nav";
import FadeUp from "@/components/FadeUp";
import ExperienceTabs from "@/components/landing/ExperienceTabs";
import RolloutSection from "@/components/landing/RolloutSection";
import ExperienceLineup from "@/components/landing/ExperienceLineup";
import { CinematicHero, HeroIntro, ProofSection, WorkflowSteps, FinalCTA } from "@/components/landing/sections";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-medium tracking-[0.3em] text-gray-600 mb-4 uppercase">{children}</p>
);

export default function Home() {
  return (
    <div className="landing-sans min-h-screen bg-white text-black">
      <Nav overlay />
      <main id="main">
        <CinematicHero />
        <HeroIntro />
        <ProofSection />

        <section id="platform" className="bg-[#F8F7F4] py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FadeUp>
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] mb-10 lg:mb-14">Clean. Safe. Intelligent.</h2>
              </div>
            </FadeUp>
            <ExperienceTabs />
            <p className="mt-10 text-center"><Link href="/stations" className="text-sm font-medium border-b border-black pb-1 hover:border-gray-400">Open the interactive demo (synthetic data)</Link></p>
          </div>
        </section>

        <RolloutSection />

        <section id="how-it-works" className="bg-[#F8F7F4] py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FadeUp>
              <Eyebrow>How It Works</Eyebrow>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] mb-10 lg:mb-14">Connect. Detect. Coordinate. Verify.</h2>
            </FadeUp>
            <WorkflowSteps />
          </div>
        </section>

        <section id="experience" className="bg-white py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FadeUp><h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] mb-10 lg:mb-14">The DART experience, upgraded.</h2></FadeUp>
            <ExperienceLineup />
          </div>
        </section>

        <section id="about" className="bg-[#F8F7F4] py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-20">
            <FadeUp>
              <Eyebrow>About KAI</Eyebrow>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-[-0.02em]">The organic improvement of the spaces we share.</h2>
            </FadeUp>
            <FadeUp delay={120}>
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                Good spaces don&apos;t happen by accident. They&apos;re built by people who care, using tools that respect their expertise. KAI gives frontline teams cleaner data and clear ownership, and leaves safety and contract decisions with the people accountable for them.
              </p>
            </FadeUp>
          </div>
        </section>

        <FinalCTA />
      </main>

      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
          <div className="text-[13px] text-gray-600">
            © {new Date().getFullYear()} KAI, an Elliyeen product. Demonstration and proposed pilot; not affiliated with or endorsed by DART.
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[13px] text-gray-700">
            <Link href="/platform" className="hover:text-black">Platform</Link>
            <Link href="/#about" className="hover:text-black">About</Link>
            <Link href="/contact" className="hover:text-black">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
