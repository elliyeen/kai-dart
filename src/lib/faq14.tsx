import Link from "next/link";

/** The 14 short answers for /faq. Security and compliance answers are proposals, not claims of implemented controls. */
export const FAQ14: { q: string; a: React.ReactNode }[] = [
  { q: "Why KAI if DART already has systems?", a: "KAI brings approved information together to prioritize station issues and verify completed work, without replacing the tools DART already uses." },
  { q: "What will DART receive after six months?", a: "A three-station pilot, measured scorecards, verified outcomes and an evidence-based recommendation on whether and how to expand." },
  { q: "How is data protected?", a: "We propose encryption, restricted access and audit logs. Production access follows DART security approval, and each control is verified before it is described as in place." },
  { q: "Can KAI pass security review?", a: "We will present control documentation, test results and any known gaps for DART to evaluate before live access. Approval is DART's decision and is not guaranteed." },
  { q: "Can recommendations be trusted?", a: "Every finding shows the evidence behind it. DART personnel verify closures and retain authority over decisions." },
  { q: "Will operations be disrupted?", a: "No. The pilot starts with approved read-only data access, and nothing in an operational system changes without DART approval." },
  { q: "Does KAI identify riders or replace staff?", a: "No. The pilot focuses on station conditions, not rider identification, and it supports the teams DART already has." },
  { q: "What does it cost?", a: "We provide a written six-month paid-pilot quote that spells out scope, integrations, support and hardware exclusions. The quote is prepared with DART, so there is no list price." },
  { q: "How is success measured?", a: "By comparing verified closures, time to verification, repeat findings and reporting effort against baselines agreed with DART at the start." },
  { q: "Who owns the data after the pilot?", a: "We propose that DART owns its data, with export rights and retention and deletion terms defined in the contract. Final terms are agreed in writing." },
  { q: "How are operational and cybersecurity risks managed?", a: "Through documented risk assessments, human approvals, access controls, monitoring and incident procedures. DART can review each one before live access." },
  { q: "How do we get started?", a: <>Agree on the problem and three stations, review security and scope, obtain approval, then launch and measure. The steps are on the <Link className="underline" href="/get-started">Get Started page</Link>.</> },
  { q: "How can DART purchase KAI?", a: "Through DART's procurement and supplier requirements. We provide the proposal and disclosures procurement asks for." },
  { q: "What if the pilot misses its targets?", a: "DART receives the results as they are, with lessons learned and a recommendation. Expansion is a separate decision for DART to make." },
];
