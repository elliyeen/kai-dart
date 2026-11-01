import { CHECK_SECTIONS, type Answer, type Pri } from "./checklist";
import { PROVIDER_BY_ID } from "./vendors";

const W: Record<Pri, number> = { critical: 3, high: 2, routine: 1 };
const RANK: Record<Pri, number> = { critical: 0, high: 1, routine: 2 };
const TARGET: Record<Pri, string> = { critical: "within 2 hours", high: "within 4 hours", routine: "within 8 hours" };
const REINSPECT: Record<Pri, string> = { critical: "within 24 hours", high: "in 3 days", routine: "in 7 days" };

export interface LoopAction { sectionId: string; section: string; priority: Pri; failed: string[]; providerId: string; provider: string; technician: string; target: string }
export interface LoopResult {
  answered: number; passed: number; failed: number; na: number;
  scoreNow: number; scoreAfter: number;
  actions: LoopAction[]; reinspect: string; verifier: string; learn: string;
}
const TECH: Record<string, string> = { elv: "ELV-01", cam: "CAM-01", "cln-a": "CLN-A-01", "dart-fac": "FAC-01" };

/** KAI's loop over a submitted inspection: observe the answers, decide what each failure needs, act (open work per section), verify (independent re-inspection) and learn (re-inspection cadence). Plain rules, no machine-learning model; all values are simulated. */
export function runKaiLoop(answers: Record<string, Answer>, inspector: string): LoopResult {
  let passed = 0, failed = 0, na = 0, wp = 0, wt = 0;
  const actions: LoopAction[] = [];
  for (const s of CHECK_SECTIONS) {
    const fails: { label: string; pri: Pri }[] = [];
    for (const i of s.items) {
      const a = answers[i.id];
      if (!a) continue;
      if (a === "na") { na++; continue; }
      wt += W[i.pri];
      if (a === "pass") { passed++; wp += W[i.pri]; } else { failed++; fails.push({ label: i.label, pri: i.pri }); }
    }
    if (fails.length) {
      const priority = fails.reduce<Pri>((m, f) => (RANK[f.pri] < RANK[m] ? f.pri : m), "routine");
      const p = PROVIDER_BY_ID[s.providerId];
      actions.push({ sectionId: s.id, section: s.title, priority, failed: fails.map((f) => f.label), providerId: p.id, provider: p.name, technician: TECH[p.id] ?? "TECH-01", target: TARGET[priority] });
    }
  }
  actions.sort((a, b) => RANK[a.priority] - RANK[b.priority]);
  const top = actions[0]?.priority ?? "routine";
  const scoreNow = wt ? Math.round((wp / wt) * 100) : 100;
  return {
    answered: passed + failed + na, passed, failed, na, scoreNow, scoreAfter: failed ? Math.min(100, Math.max(scoreNow, 96)) : scoreNow, actions,
    reinspect: failed ? REINSPECT[top] : "at the regular 7-day interval",
    verifier: `Any field inspector other than ${inspector || "the submitting inspector"}`,
    learn: failed ? `KAI shortens this station's re-inspection interval for ${actions.map((a) => a.section).join(", ")} and weights those items higher next time.` : "No failures: the regular inspection interval is kept.",
  };
}
