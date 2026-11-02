"use client";
import { STAGES } from "@/lib/scenarios";

interface Props { name: string; line: string; zone: string; stage: number; color: string; blocked: boolean; tech: string; summary: string }

const ENTRANCE = { x: 62, y: 172 };
const ZONE = { x: 520, y: 70 };

/** Schematic digital twin of one station for the auto demo. The layout is illustrative (not a survey); what changes is the state of the incident zone and where the crew is. */
export default function StationTwin({ name, line, zone, stage, color, blocked, tech, summary }: Props) {
  const done = stage >= 6, working = stage === 4 || stage === 5;
  const at = stage >= 4 ? ZONE : ENTRANCE;
  const showTech = stage >= 2 && !done;
  const fill = done ? "#16A34A" : color;
  return (
    <figure className="m-0" data-testid="station-twin" data-stage={STAGES[stage]}>
      <svg viewBox="0 0 800 330" role="img" aria-label={`Digital twin of ${name}: ${summary}`} className="w-full h-auto rounded-xl bg-[#F7F9FC] border border-gray-200">
        <text x="20" y="26" fontSize="13" fontWeight="700" letterSpacing="2" fill="#000">{name.toUpperCase()} · {line.toUpperCase()}</text>
        {/* platforms and track bed */}
        <rect x="120" y="48" width="580" height="74" rx="6" fill="#E7ECF3" /><text x="136" y="68" fontSize="11" letterSpacing="1.5" fill="#000">NORTH PLATFORM</text>
        <rect x="120" y="212" width="580" height="74" rx="6" fill="#E7ECF3" /><text x="136" y="274" fontSize="11" letterSpacing="1.5" fill="#000">SOUTH PLATFORM</text>
        <rect x="120" y="136" width="580" height="62" fill="#fff" stroke="#D5DCE6" strokeDasharray="4 4" />
        <line x1="120" y1="153" x2="700" y2="153" stroke="#6B7280" strokeWidth="3" /><line x1="120" y1="181" x2="700" y2="181" stroke="#6B7280" strokeWidth="3" />
        <text x="410" y="172" fontSize="11" letterSpacing="2" textAnchor="middle" fill="#000">TRACKS</text>
        {/* street entrance */}
        <rect x="24" y="148" width="64" height="48" rx="8" fill="#fff" stroke="#0B1F33" strokeWidth="2" /><text x="56" y="215" fontSize="11" textAnchor="middle" fill="#000">Entrance</text>
        <path d="M88 172H120" stroke="#0B1F33" strokeWidth="2" strokeDasharray="3 4" />
        {/* shelter (illustrative) */}
        <rect x="236" y="80" width="96" height="30" rx="5" fill="#fff" stroke="#9CA3AF" /><text x="284" y="99" fontSize="11" textAnchor="middle" fill="#000">Shelter</text>
        {/* north platform wall = incident zone */}
        <rect x="120" y="44" width="580" height="6" rx="3" fill="#9CA3AF" />
        <rect x="400" y="40" width="240" height="14" rx="5" fill={fill} style={{ transition: "fill .6s ease" }} />
        {!done && stage < 4 && <rect x="400" y="40" width="240" height="14" rx="5" fill="none" stroke={fill} strokeWidth="2" className="twin-pulse" />}
        <text x="520" y="34" fontSize="12.5" fontWeight="700" textAnchor="middle" fill="#000">{zone}</text>
        {done && <g transform="translate(520 94)"><circle r="13" fill="#16A34A" /><path d="M-6 0l4 4 8-9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
        {/* camera and its view of the zone */}
        <path d="M340 66L400 56 L400 100Z" fill="#0057A8" opacity={stage === 0 ? 0.28 : 0.1} style={{ transition: "opacity .6s" }} />
        <circle cx="338" cy="68" r="8" fill="#0057A8" /><text x="338" y="96" fontSize="11" textAnchor="middle" fill="#000">Camera</text>
        {/* crew */}
        {showTech && (
          <g style={{ transform: `translate(${at.x}px, ${at.y}px)`, transition: "transform 1.6s cubic-bezier(.16,1,.3,1)" }}>
            <circle r="17" fill={stage === 2 ? "#fff" : "#0B1F33"} stroke={blocked ? "#7C3AED" : "#0B1F33"} strokeWidth="2.5" strokeDasharray={stage === 2 ? "4 3" : undefined} />
            <text y="4" fontSize="11" fontWeight="700" textAnchor="middle" fill={stage === 2 ? "#000" : "#fff"}>{tech.split("-").slice(-2).join("")}</text>
            <text y="34" fontSize="11" textAnchor="middle" fill="#000" fontWeight="600">{stage === 2 ? "Notified" : stage === 3 ? "Accepted" : working ? (stage === 5 ? "Work done" : blocked ? "Waiting on parts" : "Working") : ""}</text>
          </g>
        )}
        {done && (
          <g transform={`translate(${ZONE.x + 44} ${ZONE.y})`}><circle r="17" fill="#fff" stroke="#16A34A" strokeWidth="2.5" /><text y="4" fontSize="11" fontWeight="700" textAnchor="middle" fill="#000">INSP</text><text y="34" fontSize="11" textAnchor="middle" fill="#000" fontWeight="600">Verified</text></g>
        )}
      </svg>
      <figcaption className="mt-2 text-xs text-black">Illustrative layout, not a survey: positions are schematic. What changes live is the state of the highlighted zone and where the crew is. Sample data.</figcaption>
    </figure>
  );
}
