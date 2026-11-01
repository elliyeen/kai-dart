"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Train, Camera, Trash2, MoveVertical, Paintbrush, Check, Hourglass } from "lucide-react";
import { BLOCKED_COLOR, SCENARIOS, STAGES, STAGE_COLOR, STATUS_LEGEND, blockedWindow, stageStarts, type Scenario } from "@/lib/scenarios";
import { PROVIDER_BY_ID } from "@/lib/vendors";

const SCENE_MS = 30000, SUMMARY_MS = 14000, HOLD = 0.88; // scene clock reaches "Verified" at 88% of the scene, then holds
const ICON: Record<string, typeof Camera> = { "park-lane": Paintbrush, "spring-valley": Trash2, akard: Camera, "smu-mockingbird": MoveVertical };
const SLOTS = ["Work-order system (e.g. Maximo)", "Camera management", "Elevator monitoring", "Dispatch and radio"];
const AVG = Math.round(SCENARIOS.reduce((n, s) => n + s.totalMin, 0) / SCENARIOS.length);

const lerp = (a: number, b: number, x: number, from: number, to: number) => (x <= a ? from : x >= b ? to : from + ((to - from) * (x - a)) / (b - a));
function scoreAt(s: Scenario, m: number) {
  const st = stageStarts(s);
  if (m < st.Completed) return Math.round(lerp(0, 3, m, s.base, s.low));
  if (m < st.Verified) return Math.round(lerp(st.Completed, st.Verified, m, s.low, s.low + 8));
  return Math.round(lerp(st.Verified, st.Verified + 3, m, s.low + 8, s.final));
}
const stageIndex = (s: Scenario, m: number) => { const st = stageStarts(s); return STAGES.reduce((n, g, i) => (m >= st[g] ? i : n), 0); };
const fmt = (n: number) => (n >= 60 ? `${Math.floor(n / 60)}h ${n % 60}m` : `${n}m`);

/** `scene` pins the demo to one station (embedded on a station page); without it the page cycles the four Red Line scenes. */
export default function LoopDemo({ scene: fixed }: { scene?: Scenario } = {}) {
  const [mode, setMode] = useState<string>("all");
  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);
  const last = useRef<number | null>(null);

  useEffect(() => { // deep link + reduced motion: only readable after mount
    const h = fixed ? "" : window.location.hash.slice(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL hash and media query is only possible after mount
    if (SCENARIOS.some((s) => s.id === h)) setMode(h);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);
  const order = useMemo(() => (fixed ? [fixed] : mode === "all" ? SCENARIOS : SCENARIOS.filter((s) => s.id === mode)), [mode, fixed]);
  const total = order.length * SCENE_MS + (!fixed && mode === "all" ? SUMMARY_MS : 0);
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
  const summary = !fixed && mode === "all" && idx >= order.length;
  const scene = order[Math.min(idx, order.length - 1)];
  const p = summary ? 1 : (t - idx * SCENE_MS) / SCENE_MS;
  const m = Math.min(1, p / HOLD) * scene.totalMin;            // simulated minutes since detection
  const si = stageIndex(scene, m);
  const stage = STAGES[si];
  const bw = blockedWindow(scene);
  const blocked = !!bw && m >= bw[0] && m < bw[1];
  const color = blocked ? BLOCKED_COLOR : STAGE_COLOR[stage];
  const label = blocked ? "Waiting on parts" : stage;
  const starts = stageStarts(scene);
  const provider = PROVIDER_BY_ID[scene.providerId];
  const score = scoreAt(scene, m);
  const lines = scene.steps.filter((x) => m >= x.atMin);
  const pts = Array.from({ length: 41 }, (_, i) => `${(i / 40) * 100},${44 - (scoreAt(scene, (i / 40) * scene.totalMin) - 50) * 0.8}`).join(" ");
  const within = scene.totalMin <= scene.slaResolveMin;
  const seg = "min-h-11 px-4 rounded-full border text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]";
  const Icon = ICON[scene.id] ?? Camera;

  return (
    <div className={fixed ? "space-y-4" : "p-4 lg:p-8 space-y-6 max-w-6xl"} data-testid={fixed ? "station-loop" : "loop"}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        {fixed ? <p className="text-sm text-gray-700">From detection to independently verified at {fixed.station}. Every stage is timed. Runs automatically.</p> : <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Station operations, start to finish</h1>
          <p className="text-sm text-gray-700">From detection to independently verified, across four stations on the Red Line. Every stage is timed. Runs automatically.</p></div>}
        <button type="button" data-testid="loop-toggle" onClick={() => setPaused((x) => !x)} className="min-h-11 px-4 rounded-md border border-gray-300 hover:bg-gray-50 inline-flex items-center gap-2">
          {paused ? <Play className="w-4 h-4" aria-hidden="true" /> : <Pause className="w-4 h-4" aria-hidden="true" />}{paused ? "Play" : "Pause"}
        </button>
      </div>
      {!fixed && <div className="flex flex-wrap gap-2" role="group" aria-label="Station scene">
        {[{ id: "all", label: "All stations" }, ...SCENARIOS.map((s) => ({ id: s.id, label: s.station }))].map((o) => (
          <button key={o.id} type="button" aria-pressed={mode === o.id} onClick={() => choose(o.id)} className={`${seg} ${mode === o.id ? "bg-[#0B1F33] text-white border-[#0B1F33]" : "bg-white border-gray-300 hover:bg-gray-50"}`}>{o.label}</button>))}
      </div>}

      {summary ? (
        <section aria-live="polite" data-testid="loop-summary" className="border border-gray-200 rounded-xl p-6 space-y-6">
          <h2 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{SCENARIOS.length} of {SCENARIOS.length} issues verified resolved</h2>
          <dl className="grid sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4"><dt className="text-xs text-gray-700 uppercase tracking-wider">Issues resolved</dt><dd className="text-4xl font-light">{SCENARIOS.length}</dd></div>
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
              <span className="w-12 h-12 rounded-lg bg-[#0B1F33] text-white grid place-items-center shrink-0"><Icon className="w-6 h-6" aria-hidden="true" /></span>
              <div><p className="text-xs uppercase tracking-wider text-gray-700">{scene.line} · {scene.station} · {scene.priority} priority</p><h2 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{scene.title}</h2><p className="text-sm text-gray-800 mt-1">{scene.detail}</p></div>
            </div>
            <div className="p-5">
              <div className="relative" role="img" aria-label={`Progress: ${label}`}>
                <div className="absolute top-[15px] left-[calc(100%/14)] right-[calc(100%/14)] flex h-[4px] gap-0">
                  {STAGES.slice(0, -1).map((g, i) => <span key={g} className="flex-1 transition-colors duration-500" style={{ background: i < si ? STAGE_COLOR[g] : "#E5E7EB" }} />)}
                </div>
                <ol className="relative grid grid-cols-7">{STAGES.map((g, i) => { const on = i <= si, cur = i === si, c = cur ? color : STAGE_COLOR[g]; return (
                  <li key={g} className="flex flex-col items-center gap-1.5 text-center px-0.5">
                    <span className="w-[30px] h-[30px] rounded-full border-[3px] bg-white grid place-items-center transition-colors duration-500" style={{ borderColor: on ? c : "#D1D5DB" }}>
                      {cur ? (blocked ? <Hourglass className="w-3.5 h-3.5" style={{ color }} aria-hidden="true" /> : i === 6 ? <Check className="w-3.5 h-3.5" style={{ color }} aria-hidden="true" /> : <Train className="w-3.5 h-3.5" style={{ color }} aria-hidden="true" />) : on ? <Check className="w-3.5 h-3.5 text-gray-600" aria-hidden="true" /> : null}
                    </span>
                    <span className={`text-[10px] sm:text-xs leading-tight break-words max-w-full ${cur ? "font-semibold text-gray-900" : "text-gray-700"}`}>{g}</span>
                    <span className="text-[10px] text-gray-600 tabular-nums">{on ? fmt(starts[g]) : ""}</span>
                  </li>); })}</ol>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-800" aria-label="Status colors">
                {STATUS_LEGEND.map((l) => <span key={l.label} className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />{l.label}</span>)}
              </div>
              <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><dt className="text-xs text-gray-700 uppercase tracking-wider">Status</dt><dd className="font-semibold inline-flex items-center gap-2" data-testid="loop-stage"><span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />{label}</dd></div>
                <div><dt className="text-xs text-gray-700 uppercase tracking-wider">Open for</dt><dd className="font-semibold tabular-nums">{si >= 6 ? `${fmt(scene.totalMin)}, closed` : fmt(Math.round(m))}</dd></div>
                <div><dt className="text-xs text-gray-700 uppercase tracking-wider">Target</dt><dd className="font-semibold">{fmt(scene.slaResolveMin)} {si >= 6 ? (within ? "· met" : "· missed") : ""}</dd></div>
                <div><dt className="text-xs text-gray-700 uppercase tracking-wider">Waiting on parts</dt><dd className="font-semibold tabular-nums">{bw ? (m < bw[0] ? "None yet" : fmt(Math.round(Math.min(m, bw[1]) - bw[0]))) : "None"}</dd></div>
              </dl>
              <div className="mt-4 border border-gray-200 rounded-lg p-3 text-sm" data-testid="loop-owner">
                <p className="text-xs text-gray-700 uppercase tracking-wider mb-1">Responsible party</p>
                {si >= 2 ? (<>
                  <p className="font-semibold">{provider.name} <span className="font-normal text-gray-700">· {provider.kind === "Contractor" ? `Contract ${provider.contractRef}` : "DART in-house"}</span></p>
                  <p className="text-gray-800">Technician {scene.technician}: {si >= 4 ? "on site, checked in" : si >= 3 ? "acknowledged the ticket on their device" : "notified on their device, awaiting acknowledgment"}</p>
                </>) : <p className="text-gray-800">Awaiting assignment. Contract holder for this scope: {provider.name}.</p>}
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-baseline justify-between"><h3 className="text-xs uppercase tracking-wider text-gray-700">Station readiness</h3><p className="text-4xl font-light tabular-nums" data-testid="loop-score">{score}<span className="text-lg text-gray-700"> / 100</span></p></div>
              <svg viewBox="0 0 100 48" className="w-full h-16 mt-2" aria-hidden="true" preserveAspectRatio="none"><polyline points={pts} fill="none" stroke="#9CA3AF" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /><circle cx={(m / scene.totalMin) * 100} cy={44 - (score - 50) * 0.8} r="2.5" fill={color} /></svg>
            </div>
            <div className="border border-gray-200 rounded-xl p-5"><h3 className="text-xs uppercase tracking-wider text-gray-700 mb-2">Activity</h3>
              <ol className="space-y-2 text-sm" data-testid="loop-log" aria-live="off">{lines.slice().reverse().map((l) => <li key={`${l.atMin}-${l.output}`}><span className="text-gray-600 tabular-nums">{fmt(l.atMin)}</span> · <span className="font-semibold">{l.actor}</span> · {l.output}</li>)}</ol></div>
          </section>
        </div>
      )}
      <p className="text-sm">{SCENARIOS.some((x) => x.id === scene.id) && <><Link className="underline text-[#0057A8]" href={`/stations/scenarios#${scene.id}`}>See the test case details for {scene.station}</Link> · </>}<Link className="underline text-[#0057A8]" href="/stations/contractors">Contractors and personnel</Link></p>
      <p className="text-xs text-gray-700">Timings, targets, scores, contract references and technician IDs are sample values for illustration.</p>
    </div>
  );
}
