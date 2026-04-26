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

const BLUE = "#0057A8";

export default function WizardOverlay({ onClose }: WizardOverlayProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative max-w-lg w-full mx-4 shadow-2xl transition-all duration-200 border border-gray-100"
        style={{
          background: "#ffffff",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
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
                background: i === step ? BLUE : "#E5E7EB",
              }}
            />
          ))}
          <span className="ml-auto text-[10px] tracking-widest uppercase text-gray-400 font-medium">
            {step + 1} / {steps.length}
          </span>
        </div>

        {/* Content */}
        <div className="px-8 pt-8 pb-6">
          {/* Icon */}
          <div
            className="w-11 h-11 border flex items-center justify-center mb-6"
            style={{ borderColor: `${BLUE}40`, color: BLUE }}
          >
            <Icon className="w-5 h-5" />
          </div>

          {/* Label */}
          <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: BLUE }}>
            {current.label}
          </p>

          {/* Title */}
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-4">
            {current.title}
          </h2>

          {/* Body */}
          <p className="text-sm font-normal leading-relaxed text-gray-600">
            {current.body}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mx-8" />

        {/* Navigation */}
        <div className="flex items-center justify-between px-8 py-5">
          <button
            onClick={() => (step > 0 ? goTo(step - 1) : handleClose())}
            className="text-xs tracking-widest uppercase font-medium text-gray-400 hover:text-gray-700 transition-colors"
          >
            {step === 0 ? "Skip" : "Back"}
          </button>

          <button
            onClick={() => (isLast ? handleClose() : goTo(step + 1))}
            className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase font-semibold text-white transition-colors"
            style={{ background: BLUE }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#004a8f"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = BLUE; }}
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
