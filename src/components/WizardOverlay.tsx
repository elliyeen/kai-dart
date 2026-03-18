"use client";

import { useState, useEffect } from "react";
import { X, Layers, LayoutDashboard, Map, ClipboardCheck, ArrowRight } from "lucide-react";

interface WizardOverlayProps {
  onClose: () => void;
}

const steps = [
  {
    icon: Layers,
    label: "Welcome",
    title: "Welcome to Kai",
    body: "Kai is the operating system for cities and enterprise — a unified platform that connects every asset, crew member, and inspection into a single living operational picture. Built for transit networks, stadiums, and critical infrastructure.",
  },
  {
    icon: LayoutDashboard,
    label: "Command Center",
    title: "Command Center",
    body: "The network overview shows real-time station health across all 65 DART stations. Spark charts surface ridership trends at a glance. Alerts surface in under 30 seconds — so the right action reaches the right person before small issues become big problems.",
  },
  {
    icon: Map,
    label: "Stations & Assets",
    title: "Stations & Assets",
    body: "Drill into any station to see its full asset inventory — elevators, escalators, cameras, stairwells, and restrooms — each with live status and inspection history. Transit lines let you compare health across your entire network in one view.",
  },
  {
    icon: ClipboardCheck,
    label: "Inspections",
    title: "Inspections",
    body: "A structured 48-item checklist covers every critical checkpoint in a station. Field crews log findings directly from mobile, attach photos, and submit reports in minutes. Every entry is timestamped, auditable, and fed back into the AI model.",
  },
  {
    icon: ArrowRight,
    label: "Get Started",
    title: "You're Ready",
    body: "You now know the essentials. Click through the tabs — Command Center, Stations & Assets, and Inspections — to explore the live data. Use the top-right filters to drill into specific lines or stations.",
  },
];

export default function WizardOverlay({ onClose }: WizardOverlayProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  // Trigger entrance animation after mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const isLast = step === steps.length - 1;
  const current = steps[step];
  const Icon = current.icon;

  function goTo(next: number) {
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setVisible(true);
    }, 180);
  }

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative max-w-lg w-full mx-4 border border-white/10 shadow-2xl transition-all duration-200"
        style={{
          background: "#111318",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-white/30 hover:text-white/70 transition-colors"
          aria-label="Close tour"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-2 px-8 pt-8 pb-0">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to step ${i + 1}`}
              className="transition-all duration-200"
              style={{
                width: i === step ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === step ? "#FF6B35" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
          <span className="ml-auto text-[10px] tracking-widest uppercase text-white/25 font-medium">
            {step + 1} / {steps.length}
          </span>
        </div>

        {/* Content */}
        <div className="px-8 pt-8 pb-6">
          {/* Icon */}
          <div
            className="w-11 h-11 border flex items-center justify-center mb-6"
            style={{ borderColor: "rgba(255,107,53,0.4)", color: "#FF6B35" }}
          >
            <Icon className="w-5 h-5" />
          </div>

          {/* Label */}
          <p className="text-[10px] font-medium tracking-widest uppercase mb-2" style={{ color: "#FF6B35" }}>
            {current.label}
          </p>

          {/* Title */}
          <h2 className="text-2xl font-light tracking-tight text-white mb-4">
            {current.title}
          </h2>

          {/* Body */}
          <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {current.body}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mx-8" />

        {/* Navigation */}
        <div className="flex items-center justify-between px-8 py-5">
          <button
            onClick={() => (step > 0 ? goTo(step - 1) : handleClose())}
            className="text-xs tracking-widest uppercase font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
          >
            {step === 0 ? "Skip" : "Back"}
          </button>

          <button
            onClick={() => (isLast ? handleClose() : goTo(step + 1))}
            className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase font-medium transition-colors"
            style={{ background: isLast ? "#FF6B35" : "rgba(255,255,255,0.06)", color: isLast ? "#fff" : "rgba(255,255,255,0.85)" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = isLast ? "#e85d2a" : "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = isLast ? "#FF6B35" : "rgba(255,255,255,0.06)";
            }}
          >
            {isLast ? (
              <>Start Exploring <ArrowRight className="w-3 h-3" /></>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
