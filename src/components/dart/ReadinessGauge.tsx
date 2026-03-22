"use client";
// ─── Readiness Gauge — circular score ring, brand-compliant ──────────────────

import type { ReadinessLevel } from "@/lib/dart/types";

interface Props {
  score: number;
  level: ReadinessLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const LEVEL_COLORS: Record<ReadinessLevel, { stroke: string; label: string; text: string }> = {
  excellent: { stroke: "#27AE60", label: "EXCELLENT", text: "#27AE60" },
  good:      { stroke: "#4CAF50", label: "GOOD",      text: "#4CAF50" },
  fair:      { stroke: "#FF6B35", label: "FAIR",      text: "#FF6B35" },
  "at-risk": { stroke: "#DC2626", label: "AT RISK",   text: "#DC2626" },
};

const SIZES = {
  sm: { svgSize: 68, cx: 34, r: 28, strokeWidth: 3.5, fontSize: "text-lg",   labelSize: "text-[8px]" },
  md: { svgSize: 96, cx: 48, r: 40, strokeWidth: 4,   fontSize: "text-2xl",  labelSize: "text-[9px]" },
  lg: { svgSize: 132,cx: 66, r: 56, strokeWidth: 5.5, fontSize: "text-4xl",  labelSize: "text-[11px]" },
};

export default function ReadinessGauge({ score, level, size = "md", showLabel = true }: Props) {
  const { svgSize, cx, r, strokeWidth, fontSize, labelSize } = SIZES[size];
  const { stroke, label, text } = LEVEL_COLORS[level];
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * 0.75;
  const fillLength = (score / 100) * arcLength;
  const dashOffset = arcLength - fillLength;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {/* Track */}
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round"
          transform={`rotate(-225 ${cx} ${cx})`} />
        {/* Fill */}
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={stroke} strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`} strokeDashoffset={dashOffset}
          strokeLinecap="round" transform={`rotate(-225 ${cx} ${cx})`}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${fontSize} font-mono font-bold leading-none`} style={{ color: text }}>
          {Math.round(score)}
        </span>
        {showLabel && (
          <span className={`${labelSize} font-mono tracking-widest mt-0.5 uppercase`} style={{ color: text, opacity: 0.75 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
