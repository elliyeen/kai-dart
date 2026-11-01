"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Train, Camera, Trash2, MoveVertical, Paintbrush, ShieldCheck } from "lucide-react";

const STAGES = ["Detected", "Ticket opened", "Dispatched", "In progress", "Verified"] as const;
const STAGE_AT = [0, 0.15, 0.32, 0.52, 0.78];
const SCENE_MS = 26000, SUMMARY_MS = 14000;

interface LogLine { at: number; who: string; text: string }
interface Scene {
  id: string; station: string; issue: string; Icon: typeof Camera; detail: string; owner: string; minutes: number;
  base: number; low: number; final: number; log: LogLine[];
}
const SCENES: Scene[] = [
  { id: "park-lane", station: "Park Lane", issue: "Graffiti on platform wall", Icon: Paintbrush, detail: "Camera analytics flag new marking on the north platform wall.", owner: "Cleaning crew A", minutes: 38, base: 88, low: 61, final: 90,
    log: [{ at: 0.02, who: "KAI", text: "Graffiti detected at Park Lane, north platform wall" }, { at: 0.17, who: "Operations Command", text: "Ticket opened, priority High" }, { at: 0.34, who: "Operations Command", text: "Dispatched to Cleaning crew A" }, { at: 0.54, who: "Cleaning crew A", text: "On site, work started" }, { at: 0.66, who: "Cleaning crew A", text: "Proof photo submitted" }, { at: 0.8, who: "Field Inspector", text: "Independently verified: surface clean" }] },
  { id: "spring-valley", station: "Spring Valley", issue: "Trash bin at capacity", Icon: Trash2, detail: "Fill-level check shows the platform bin is full.", owner: "Cleaning crew B", minutes: 29, base: 86, low: 64, final: 91,
    log: [{ at: 0.02, who: "KAI", text: "Bin at capacity, Spring Valley platform" }, { at: 0.17, who: "Operations Command", text: "Ticket opened, priority Routine" }, { at: 0.34, who: "Operations Command", text: "Dispatched to Cleaning crew B" }, { at: 0.54, who: "Cleaning crew B", text: "Bin emptied and liner replaced" }, { at: 0.66, who: "Cleaning crew B", text: "Proof photo submitted" }, { at: 0.8, who: "Field Inspector", text: "Independently verified: bin clear" }] },
  { id: "akard", station: "Akard", issue: "Camera offline after dark", Icon: Camera, detail: "Platform B camera stopped reporting, leaving a coverage gap.", owner: "Security Systems", minutes: 47, base: 90, low: 68, final: 92,
    log: [{ at: 0.02, who: "KAI", text: "Platform B camera offline, coverage gap flagged" }, { at: 0.17, who: "Operations Command", text: "Ticket opened, priority Critical" }, { at: 0.25, who: "Security Supervisor", text: "Approved moving an officer to Platform B" }, { at: 0.34, who: "Operations Command", text: "Dispatched to Security Systems" }, { at: 0.54, who: "Security Systems", text: "Camera restored, feed confirmed" }, { at: 0.66, who: "Security Supervisor", text: "Officer released from Platform B" }, { at: 0.8, who: "Field Inspector", text: "Independently verified: coverage restored" }] },
  { id: "smu-mockingbird", station: "SMU/Mockingbird", issue: "Elevator out of service", Icon: MoveVertical, detail: "Elevator reports a fault. Accessible route notice posted.", owner: "Facilities Maintenance", minutes: 66, base: 87, low: 58, final: 89,
    log: [{ at: 0.02, who: "KAI", text: "Elevator fault at SMU/Mockingbird" }, { at: 0.17, who: "Operations Command", text: "Ticket opened, priority Critical" }, { at: 0.2, who: "Station Manager", text: "Accessible route notice posted" }, { at: 0.34, who: "Operations Command", text: "Dispatched to Facilities Maintenance" }, { at: 0.54, who: "Facilities Maintenance", text: "Repair under way" }, { at: 0.66, who: "Facilities Maintenance", text: "Proof submitted, elevator tested" }, { at: 0.8, who: "Field Inspector", text: "Independently verified: elevator in service" }] },
];
const AVG = Math.round(SCENES.reduce((n, s) => n + s.minutes, 0) / SCENES.length);
const SLOTS = ["Work-order system (e.g. Maximo)", "Camera management", "Elevator monitoring", "Dispatch and radio"];

const ease = (a: number, b: number, p: number, from: number, to: number) => (p <= a ? from : p >= b ? to : from + ((to - from) * (p - a)) / (b - a));
const scoreAt = (s: Scene, p: number) => Math.round(p < 0.15 ? ease(0.06, 0.15, p, s.base, s.low) : p < 0.52 ? s.low : p < 0.78 ? ease(0.52, 0.78, p, s.low, s.low + 6) : ease(0.78, 0.92, p, s.low + 6, s.final));
const stageOf = (p: number) => STAGE_AT.reduce((n, a, i) => (p >= a ? i : n), 0);

export default function LoopDemo() {
  const [mode, setMode] = useState<string>("all");
  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);
  const last = useRef<number | null>(null);

  useEffect(() => { // deep link + reduced motion
    const h = window.location.hash.slice(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL hash and media query is only possible after mount
    if (SCENES.some((s) => s.id === h)) setMode(h);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);
  const order = useMemo(() => (mode === "all" ? SCENES : SCENES.filter((s) => s.id === mode)), [mode]);
  const total = order.length * SCENE_MS + (mode === "all" ? SUMMARY_MS : 0);
  useEffect(() => {
    if (paused) { last.current = null; return; }
    const id = window.setInterval(() => {
      const now = performance.now(); const dt = last.current == null ? 0 : now - last.current; last.current = now;
      setT((x) => (x + dt) % total);
    }, 100);
    return () => window.clearInterval(id);
  }, [paused, total]);
  const choose = (m: string) => { setMode(m); setT(0); try { history.replaceState(null, "", m === "all" ? "#" : `#${m}`); } catch { /* ignore */ } };

  const idx = Math.min(order.length, Math.floor(t / SCENE_MS));
  const summary = mode === "all" && idx >= order.length;
  const scene = order[Math.min(idx, order.length - 1)];
  const p = summary ? 1 : (t - idx * SCENE_MS) / SCENE_MS;
  const stage = stageOf(p);
  const score = scoreAt(scene, p);
  const mins = Math.round(scene.minutes * Math.min(1, Math.max(0, (p - 0.02) / 0.76)));
  const lines = scene.log.filter((l) => p >= l.at);
  const pts = Array.from({ length: 41 }, (_, i) => `${(i / 40) * 100},${40 - (scoreAt(scene, i / 40) - 50) * 0.8}`).join(" ");
  const seg = "min-h-11 px-4 rounded-full border text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]";

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-6xl" data-testid="loop">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Station operations, start to finish</h1>
          <p className="text-sm text-gray-700">From detection to independently verified, across four stations on the Red Line. Runs automatically.</p></div>
        <button type="button" data-testid="loop-toggle" onClick={() => setPaused((x) => !x)} className="min-h-11 px-4 rounded-md border border-gray-300 hover:bg-gray-50 inline-flex items-center gap-2">
          {paused ? <Play className="w-4 h-4" aria-hidden="true" /> : <Pause className="w-4 h-4" aria-hidden="true" />}{paused ? "Play" : "Pause"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Station scene">
        {[{ id: "all", label: "All stations" }, ...SCENES.map((s) => ({ id: s.id, label: s.station }))].map((o) => (
          <button key={o.id} type="button" aria-pressed={mode === o.id} onClick={() => choose(o.id)} className={`${seg} ${mode === o.id ? "bg-[#0B1F33] text-white border-[#0B1F33]" : "bg-white border-gray-300 hover:bg-gray-50"}`}>{o.label}</button>))}
      </div>

      {summary ? (
        <section aria-live="polite" data-testid="loop-summary" className="border border-gray-200 rounded-xl p-6 space-y-6">
          <h2 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{SCENES.length} of {SCENES.length} issues verified resolved</h2>
          <dl className="grid sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4"><dt className="text-xs text-gray-700 uppercase tracking-wider">Issues resolved</dt><dd className="text-4xl font-light">{SCENES.length}</dd></div>
            <div className="border border-gray-200 rounded-lg p-4"><dt className="text-xs text-gray-700 uppercase tracking-wider">Average time to verified</dt><dd className="text-4xl font-light">{AVG} min</dd></div>
            <div className="border border-gray-200 rounded-lg p-4"><dt className="text-xs text-gray-700 uppercase tracking-wider">Independent sign-off</dt><dd className="text-4xl font-light">100%</dd></div>
          </dl>
          <div><h3 className="text-lg font-semibold mb-2">Connect your systems</h3>
            <ul className="grid sm:grid-cols-2 gap-3">{SLOTS.map((s) => <li key={s} className="border border-dashed border-gray-400 rounded-lg p-4 text-sm text-gray-800 min-h-16 flex items-center justify-between gap-3"><span>{s}</span><span className="text-xs text-[#0057A8] font-semibold">Ready to connect</span></li>)}</ul></div>
        </section>
      ) : (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6" data-testid="loop-scene" data-scene={scene.id}>
          <section className="border border-gray-200 rounded-xl overflow-hidden" aria-label={`${scene.station} incident`}>
            <div className="p-5 flex gap-4 items-start border-b border-gray-200 bg-slate-50">
              <span className="w-12 h-12 rounded-lg bg-[#0B1F33] text-white grid place-items-center shrink-0"><scene.Icon className="w-6 h-6" aria-hidden="true" /></span>
              <div><p className="text-xs uppercase tracking-wider text-gray-700">Red Line · {scene.station}</p><h2 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{scene.issue}</h2><p className="text-sm text-gray-800 mt-1">{scene.detail}</p></div>
            </div>
            <div className="p-5">
              <div className="relative" role="img" aria-label={`Progress: ${STAGES[stage]}`}>
                <div className="absolute left-3 right-3 top-[15px] h-[3px] bg-gray-200" /><div className="absolute left-3 top-[15px] h-[3px] bg-[#DA291C] transition-[width] duration-700" style={{ width: `calc((100% - 24px) * ${stage / 4})` }} />
                <ol className="relative grid grid-cols-5">{STAGES.map((s, i) => (
                  <li key={s} className="flex flex-col items-center gap-2 text-center">
                    <span className={`w-[30px] h-[30px] rounded-full border-[3px] bg-white grid place-items-center transition-colors duration-500 ${i <= stage ? "border-[#DA291C]" : "border-gray-300"}`}>{i === stage ? <Train className="w-3.5 h-3.5 text-[#DA291C]" aria-hidden="true" /> : i < stage ? <ShieldCheck className="w-3.5 h-3.5 text-gray-700" aria-hidden="true" /> : null}</span>
                    <span className={`text-xs sm:text-sm ${i === stage ? "font-semibold text-gray-900" : "text-gray-700"}`}>{s}</span>
                  </li>))}</ol>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
                <div><dt className="text-xs text-gray-700 uppercase tracking-wider">Assigned to</dt><dd className="font-semibold">{stage >= 2 ? scene.owner : "Awaiting assignment"}</dd></div>
                <div><dt className="text-xs text-gray-700 uppercase tracking-wider">Open for</dt><dd className="font-semibold tabular-nums">{stage >= 4 ? `${scene.minutes} min, closed` : `${mins} min`}</dd></div>
                <div><dt className="text-xs text-gray-700 uppercase tracking-wider">Status</dt><dd className="font-semibold" data-testid="loop-stage">{STAGES[stage]}</dd></div>
              </dl>
            </div>
          </section>
          <section className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-baseline justify-between"><h3 className="text-xs uppercase tracking-wider text-gray-700">Station readiness</h3><p className="text-4xl font-light tabular-nums" data-testid="loop-score">{score}<span className="text-lg text-gray-700"> / 100</span></p></div>
              <svg viewBox="0 0 100 44" className="w-full h-16 mt-2" aria-hidden="true" preserveAspectRatio="none"><polyline points={pts} fill="none" stroke="#9CA3AF" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /><circle cx={p * 100} cy={40 - (score - 50) * 0.8} r="2.5" fill="#0057A8" /></svg>
            </div>
            <div className="border border-gray-200 rounded-xl p-5"><h3 className="text-xs uppercase tracking-wider text-gray-700 mb-2">Activity</h3>
              <ol className="space-y-2 text-sm" data-testid="loop-log" aria-live="off">{lines.slice().reverse().map((l) => <li key={l.text}><span className="font-semibold">{l.who}</span> · {l.text}</li>)}</ol></div>
          </section>
        </div>
      )}
      <p className="text-sm"><Link className="underline text-[#0057A8]" href={`/stations/scenarios#${scene.id}`}>See the test case details for {scene.station}</Link></p>
      <p className="text-xs text-gray-700">Timings, scores and the average time to verified are sample values for illustration.</p>
    </div>
  );
}
