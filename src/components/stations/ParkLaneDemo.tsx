"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Check, Maximize2, Pause, Play, RotateCcw } from "lucide-react";
import {
  DEMO_DURATION_MS, DISCLOSURE, END_NOTE, ISSUES, advance, buildTimeline, nextStepTime, prevStepTime, stateAt,
  type IssueKey, type Status,
} from "@/lib/parkLaneDemo";

const STATUS_LABEL: Record<Status, string> = { none: "Not raised", new: "New", assigned: "Assigned", in_progress: "In progress", fix_claimed: "Fix claimed — awaiting inspector", rejected: "Rejected — rework", verified: "Verified" };
const STATUS_COLOR: Record<Status, string> = { none: "#9CA3AF", new: "#DC2626", assigned: "#D97706", in_progress: "#2563EB", fix_claimed: "#0D9488", rejected: "#7C3AED", verified: "#16A34A" };
const KEYS: IssueKey[] = ["clean", "elev", "kiosk"];
const mmss = (ms: number) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

/** Park Lane guided demo. Time-driven, deterministic, demo-local: no network, no storage, no autoplay on load. */
export default function ParkLaneDemo() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rework, setRework] = useState(false);
  const [muted, setMuted] = useState(true);
  const last = useRef<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => { // media query is only readable after mount
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(q.matches);
    set(); q.addEventListener("change", set);
    return () => q.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (!playing) { last.current = null; return; }
    const tick = () => {
      if (document.hidden) { last.current = null; return; } // pause progress while the tab is hidden
      const now = performance.now(); const dt = last.current == null ? 0 : now - last.current; last.current = now;
      setT((x) => { const r = advance(x, dt); if (r.ended) setPlaying(false); return r.t; });
    };
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [playing]);

  const st = stateAt(t, rework);
  const { steps } = buildTimeline(rework);
  const ended = t >= DEMO_DURATION_MS;
  const play = useCallback(() => { if (t >= DEMO_DURATION_MS) setT(0); setPlaying(true); }, [t]);
  const restart = useCallback(() => { setT(0); setPlaying(false); last.current = null; }, []);
  const seek = (v: number) => { setT(v); last.current = null; };
  const fullscreen = () => { const el = root.current; if (el?.requestFullscreen) void el.requestFullscreen().catch(() => { /* fallback: stay in page */ }); };

  const onKey = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "BUTTON" || tag === "A") return; // native handling for focused controls
    if (e.key === " ") { e.preventDefault(); if (playing) setPlaying(false); else play(); }
    else if (e.key === "ArrowRight") seek(nextStepTime(t, rework));
    else if (e.key === "ArrowLeft") seek(prevStepTime(t, rework));
    else if (e.key.toLowerCase() === "r") restart();
    else if (e.key.toLowerCase() === "m") setMuted((m) => !m);
    else if (e.key.toLowerCase() === "f") fullscreen();
  };

  const btn = "min-h-11 min-w-11 px-4 rounded-md inline-flex items-center justify-center gap-2 text-sm font-semibold border border-gray-300 bg-white text-black hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] disabled:opacity-40 disabled:cursor-not-allowed";
  const primary = "min-h-11 px-5 rounded-md inline-flex items-center gap-2 text-sm font-semibold bg-[#0057A8] text-white hover:bg-[#004a8f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F33]";
  const started = t > 0;
  const motion = reduced ? "" : "transition-colors duration-500";

  return (
    <div ref={root} tabIndex={-1} onKeyDown={onKey} data-testid="pl-demo" data-t={t} data-step={st.step.id} data-playing={playing ? "1" : "0"} className="bg-white p-4 lg:p-8 space-y-4 max-w-6xl outline-none">
      <div role="note" data-testid="pl-disclosure" className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs sm:text-sm font-semibold text-black tracking-wide">{DISCLOSURE}</div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-black" style={{ fontWeight: 600 }}><Link className="underline text-[#0057A8]" href="/stations">Stations</Link> / Red Line / Park Lane</p>
          <h1 className="text-3xl sm:text-4xl text-black" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Park Lane — guided demo</h1>
          <p className="text-sm text-black">About 90 seconds. Three synthetic incidents, each closed only by an independent inspector.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Demo controls">
          {!playing && !started && <button type="button" data-testid="pl-play" onClick={play} className={primary}><Play className="w-4 h-4" aria-hidden="true" />Play Park Lane Demo</button>}
          {!playing && started && <button type="button" data-testid="pl-play" onClick={play} className={primary}><Play className="w-4 h-4" aria-hidden="true" />{ended ? "Play again" : "Resume"}</button>}
          {playing && <button type="button" data-testid="pl-pause" onClick={() => setPlaying(false)} className={btn}><Pause className="w-4 h-4" aria-hidden="true" />Pause</button>}
          <button type="button" data-testid="pl-back" onClick={() => seek(prevStepTime(t, rework))} className={btn} aria-label="Previous step"><ChevronLeft className="w-4 h-4" aria-hidden="true" />Back</button>
          <button type="button" data-testid="pl-next" onClick={() => seek(nextStepTime(t, rework))} className={btn} aria-label="Next step">Next<ChevronRight className="w-4 h-4" aria-hidden="true" /></button>
          <button type="button" data-testid="pl-restart" onClick={restart} className={btn}><RotateCcw className="w-4 h-4" aria-hidden="true" />Restart</button>
          <button type="button" data-testid="pl-mute" aria-pressed={muted} onClick={() => setMuted((m) => !m)} className={btn}>{muted ? "Unmute" : "Mute"}</button>
          <button type="button" data-testid="pl-fullscreen" onClick={fullscreen} className={btn} aria-label="Presentation mode (fullscreen)"><Maximize2 className="w-4 h-4" aria-hidden="true" /></button>
        </div>
      </div>

      {/* progress rail */}
      <div>
        <label className="sr-only" htmlFor="pl-scrub">Demo progress</label>
        <input id="pl-scrub" data-testid="pl-scrub" type="range" min={0} max={DEMO_DURATION_MS} step={100} value={t} onChange={(e) => seek(Number(e.target.value))} className="w-full accent-[#0057A8]" aria-valuetext={`${mmss(t)} of ${mmss(DEMO_DURATION_MS)}, ${st.step.label}`} />
        <ol className="grid grid-cols-3 sm:grid-cols-6 gap-1 mt-1" aria-label="Demo steps">
          {steps.map((x, i) => (
            <li key={x.id} aria-current={i === st.stepIndex ? "step" : undefined} className={`text-[11px] sm:text-xs text-center rounded px-1 py-1 ${i === st.stepIndex ? "bg-[#0B1F33] text-white font-semibold" : i < st.stepIndex ? "bg-gray-100 text-black" : "text-black"}`}>{x.label}</li>
          ))}
        </ol>
        <p className="text-xs tabular-nums text-black mt-1" data-testid="pl-time">{mmss(t)} / {mmss(DEMO_DURATION_MS)}</p>
      </div>

      {/* caption / narration */}
      <div className="rounded-xl border border-gray-200 p-4" aria-live="polite" data-testid="pl-caption">
        <p className="text-xs uppercase tracking-wider text-black">{st.step.label}</p>
        <p className="mt-1 text-lg sm:text-xl text-black leading-snug" style={{ fontWeight: 600 }}>{st.last?.text ?? st.step.caption}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4">
        {/* left: station context */}
        <section className="rounded-xl border border-gray-200 p-5 space-y-4" aria-label="Park Lane station context">
          <div className="flex items-baseline justify-between">
            <div><p className="text-xs uppercase tracking-wider text-black">Red Line · Dallas</p><h2 className="text-xl text-black" style={{ fontWeight: 700 }}>Park Lane</h2></div>
            <div className="text-right"><p className="text-xs uppercase tracking-wider text-black">Station readiness (demo rule)</p><p className="text-4xl font-light tabular-nums" data-testid="pl-score">{st.readiness}<span className="text-lg text-black"> / 100</span></p></div>
          </div>
          <ul className="space-y-2">
            {KEYS.map((k) => { const is = st.issues[k]; const c = STATUS_COLOR[is.status]; return (
              <li key={k} data-testid={`pl-issue-${k}`} data-status={is.status} className={`rounded-lg border p-3 ${st.focus === k ? "border-[#0057A8] bg-slate-50" : "border-gray-200"}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-black">{ISSUES[k].ref}{ISSUES[k].hypothetical && <span className="ml-2 text-[11px] font-normal border border-gray-300 rounded px-1.5 py-0.5">Hypothetical asset</span>}</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-black rounded border px-2 py-1 ${motion}`} style={{ borderColor: c }}>
                    <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{STATUS_LABEL[is.status]}{is.status === "verified" && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                  </span>
                </div>
                {is.status !== "none" && <p className="text-xs text-black mt-1">{ISSUES[k].id} · {ISSUES[k].title}</p>}
              </li>); })}
          </ul>
          <p className="text-xs text-black">Layout is illustrative, not a survey. Readiness is a demo-only rule (88 minus open-issue penalties); it recovers only after an inspector verifies.</p>
        </section>

        {/* right: active issue + audit */}
        <section className="rounded-xl border border-gray-200 p-5 space-y-4" aria-label="Active issue and audit timeline">
          {st.focus ? (() => { const k = st.focus; const is = st.issues[k]; return (
            <div data-testid="pl-active" data-issue={k}>
              <p className="text-xs uppercase tracking-wider text-black">{is.status === "none" ? "Waiting for first signal" : ISSUES[k].id}</p>
              <h2 className="text-xl text-black" style={{ fontWeight: 700 }}>{ISSUES[k].title}</h2>
              <p className="text-sm text-black mt-1">Status: <strong>{STATUS_LABEL[is.status]}</strong> · Responsible: {is.owner}</p>
              {is.evidence.length > 0 && <ul className="mt-2 flex flex-wrap gap-2">{is.evidence.map((e) => <li key={e} className="text-xs border border-dashed border-gray-400 rounded px-2 py-1 text-black">{e} · <em>illustrative, not a real photo</em></li>)}</ul>}
              {is.status === "fix_claimed" && <p className="mt-2 text-sm text-black" data-testid="pl-awaiting">Contractor claim only. Not Verified until a separate inspector confirms.</p>}
            </div>); })() : (
            <div data-testid="pl-active" data-issue="none"><p className="text-xs uppercase tracking-wider text-black">{st.step.label}</p><p className="text-sm text-black mt-1" data-testid="pl-active-note">{st.stepIndex >= 4 ? `${st.verifiedCount} of 3 incidents independently verified.` : started ? "Next incident arrives shortly." : "Press Play to begin."}</p></div>
          )}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-black mb-2">Audit timeline (demo-local)</h3>
            <ol tabIndex={0} aria-label="Audit timeline entries, newest first" className="space-y-1.5 text-sm max-h-64 overflow-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]" data-testid="pl-log">
              {st.log.slice().reverse().map((e) => <li key={`${e.at}-${e.text}`}><span className="tabular-nums text-black">{mmss(e.at)}</span> · <span className="font-semibold">{e.actor.label}</span> · {e.text}</li>)}
            </ol>
          </div>
        </section>
      </div>

      {st.step.id === "cta" && (
        <div className="rounded-xl border border-[#0057A8] p-5" data-testid="pl-cta">
          <h2 className="text-xl text-black" style={{ fontWeight: 700 }}>Discuss a six-month, four-station paid pilot</h2>
          <p className="text-sm text-black mt-1" data-testid="pl-end-note">{END_NOTE}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/get-started" className={primary}>Get started</Link>
            <Link href="/architecture" className={btn}>Capabilities</Link>
            <Link href="/stations/park-lane" className={btn}>Park Lane station page</Link>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm text-black">
        <label className="inline-flex items-center gap-2 min-h-11"><input type="checkbox" data-testid="pl-rework" checked={rework} onChange={(e) => { setRework(e.target.checked); restart(); }} />Optional scenario: inspector rejects the elevator fix (rework path)</label>
        <span className="text-xs">Keys: Space play/pause · ←/→ step · R restart · M mute · F fullscreen. No audio is used.</span>
      </div>
      <p className="text-xs text-black">Synthetic demonstration. Elevator and kiosk are hypothetical assets; Park Lane&apos;s real inventory is unverified. Role separation here is a local simulation, not authorization. Nothing is sent to DART or any server. Not DART-branded or endorsed.</p>
    </div>
  );
}
