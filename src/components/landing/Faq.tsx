import Link from "next/link";

export const FAQ: { q: string; a: React.ReactNode }[] = [
  { q: "What is KAI?", a: "KAI is station intelligence for transit: a single view of station condition, who owns each fix, and whether the fix was independently verified. It focuses on cleanliness, safety and contractor accountability." },
  { q: "Is KAI a DART system, and does DART endorse it?", a: "No. KAI is an Elliyeen proposal and demonstration. It is not affiliated with or endorsed by DART, and DART has not integrated or approved it." },
  { q: "Is the data live?", a: "No. Station condition scores, issues and asset counts in the demo are illustrative values, not DART data, and no station is connected to live feeds. The official station list and addresses come from DART's published schedule data and station pages. Nothing is dispatched to real crews." },
  { q: "Where does the 171,000 daily trips figure come from, and how is the year-to-date number calculated?", a: <>It is DART&rsquo;s published &ldquo;more than 171,000 passengers daily&rdquo; figure. The year-to-date number multiplies it by the days completed so far this year. That is an estimate from a rounded average, not a DART-reported total, and other DART publications give different figures.</> },
  { q: "How many stations are covered?", a: "The directory keeps all 115 original line-station entries, which are 76 unique station names. DART's published schedule data lists 75 stations, and the directory reconciles to it. Some stations serve several lines, and each line view shows its own entry." },
  { q: "What is the pilot?", a: "A proposed pilot for Park Lane, Akard and Spring Valley stations. It has not been deployed, and none of the three is shown as live." },
  { q: "How does independent verification work?", a: "An issue is reported, Operations assigns it, the contractor submits proof, and a separate inspector approves or rejects it. Only then does the executive view show it as verified resolved. The person who does the work cannot be the person who signs it off." },
  { q: "Do the demo roles control who can see or do what?", a: "In the demo, switching roles is a simulation, not access control. A real deployment would enforce deny-by-default permissions on the server, with scopes per role and separation of duties." },
  { q: "Does KAI replace Maximo or other DART systems?", a: "No. It is meant to complement existing systems of record, including work-order and inspection tools such as Maximo, by adding station-level visibility and independent verification on top." },
  { q: "How can I try it or start a conversation about a pilot?", a: <>Open the <Link className="underline" href="/stations">interactive demo</Link> and start the guided two-minute walkthrough, or <Link className="underline" href="/contact">request a demo</Link>. No pricing is published.</> },
];

export default function Faq() {
  return (
    <div className="max-w-3xl divide-y divide-gray-200 border-y border-gray-200" data-testid="faq">
      {FAQ.map(({ q, a }) => (
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
