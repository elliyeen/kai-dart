import Link from "next/link";

export const FAQ: { q: string; a: React.ReactNode }[] = [
  { q: "What problem does KAI solve for DART?", a: "Station quality is hard to see and harder to prove. KAI puts every station's condition, open issues and ownership on one screen, so leadership can see what needs attention and the field can see what to do next. Every fix ends with independent proof." },
  { q: "How does KAI work alongside Maximo and our other systems?", a: "KAI sits on top of the systems of record you already run, including work-order tools such as Maximo, and adds the station-level view and independent verification. Your teams keep their tools. KAI gives them one shared picture of each station." },
  { q: "What data does KAI use?", a: "Station and stop data from DART's public schedule feed, plus inspection results, reported issues, work orders and asset condition. Camera and sensor signals can be added as they become available. This demo runs on sample data so you can see exactly how a station looks once those are flowing." },
  { q: "How do we know a fix was actually done?", a: "Every issue follows the same path: reported, assigned by Operations, proof submitted by the crew, then approved or rejected by an independent inspector. The result appears in the executive view only after that sign-off, and the person who did the work can never be the one who verifies it." },
  { q: "How is the station readiness score calculated?", a: "It combines open issues, asset condition and recent inspection results into one 0 to 100 score per station, with the contributing factors shown beside it. The weighting is set together with DART, so the score reflects what your operations care about." },
  { q: "Who sees what?", a: "Each role gets its own view: Executive, Operations, Station Manager, Inspector, Contractor and Crew, Security and Compliance, and Admin. Switch roles in the demo to see how the same station looks to each one. A production rollout enforces access on the server, with separation of duties built in." },
  { q: "How does KAI hold contractors accountable?", a: "Each task has a named owner, a timestamp trail and photo proof, and it is only closed after an independent inspector approves it. Leadership sees status by station and line, and response times and repeat issues are tracked as pilot measures." },
  { q: "Can field crews use it on a phone or tablet?", a: "Yes. The platform is designed for desktop, iPad and phone. Crews can open their assigned work, take or attach a photo, and submit proof from the platform. Inspectors get a checklist and approve or reject on site." },
  { q: "What would a pilot look like?", a: "A focused start at Park Lane, Akard and Spring Valley stations. Success measures are agreed up front, such as time to resolution, verified-resolution rate and repeat issues, so the results are easy to review. Scope and timeline are set together with DART." },
  { q: "How do we get started?", a: <>Open the <Link className="underline" href="/stations">interactive demo</Link> and run the two-minute guided walkthrough, then <Link className="underline" href="/contact">request a demo</Link> with the team. KAI is built by Elliyeen, an independent company, and we will scope a pilot and its pricing with you.</> },
];

export default function Faq({ items = FAQ }: { items?: { q: string; a: React.ReactNode }[] }) {
  return (
    <div className="max-w-3xl divide-y divide-gray-200 border-y border-gray-200" data-testid="faq">
      {items.map(({ q, a }) => (
        <details key={q} className="group py-1">
          <summary className="flex items-center justify-between gap-4 min-h-14 py-3 cursor-pointer list-none text-lg font-normal text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] [&::-webkit-details-marker]:hidden">
            <span>{q}</span>
            <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-gray-700 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none">+</span>
          </summary>
          <p className="pb-4 pr-8 text-base text-gray-800 leading-relaxed">{a}</p>
        </details>
      ))}
    </div>
  );
}
