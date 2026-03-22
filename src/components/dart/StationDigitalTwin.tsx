"use client";
// ─── Station Digital Twin — Tesla-style floor plan, brand-compliant ──────────

import type { StationWorldModel } from "@/lib/dart/types";

interface Props { station: StationWorldModel }

function BinDot({ x, y, level, label }: { x: number; y: number; level: number; label: string }) {
  const color = level > 85 ? "#DC2626" : level > 65 ? "#D97706" : "#16A34A";
  const pulse = level > 80;
  return (
    <g>
      {pulse && (
        <circle cx={x} cy={y} r={7} fill={color} opacity={0.15}>
          <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={x} cy={y} r={4} fill={color} />
      <rect x={x + 7} y={y - 8} width={38} height={13} rx={2} fill="white" stroke="#E5E7EB" strokeWidth={0.5} />
      <text x={x + 26} y={y + 1} textAnchor="middle" fontSize={7} fill={color} fontFamily="monospace" fontWeight="600">
        {label} {Math.round(level)}%
      </text>
    </g>
  );
}

function Camera({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <g opacity={active ? 1 : 0.3}>
      <rect x={x - 5} y={y - 4} width={10} height={8} rx={1.5} fill="none" stroke="#2563EB" strokeWidth={1} />
      <polygon points={`${x + 5},${y - 3} ${x + 9},${y - 5} ${x + 9},${y + 5} ${x + 5},${y + 3}`} fill="#2563EB" opacity={0.6} />
    </g>
  );
}

function Flag({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="#FEF2F2" stroke="#FECACA" strokeWidth={1} />
      <circle cx={x} cy={y} r={3.5} fill="#DC2626">
        <animate attributeName="r" values="3;4.5;3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x={x + 10} y={y + 3} fontSize={7} fill="#DC2626" fontFamily="monospace" fontWeight="600">FLAGGED</text>
    </g>
  );
}

export default function StationDigitalTwin({ station }: Props) {
  const { agents } = station;
  const bins = agents.cleanliness.bins;
  const elevators = agents.equipment.elevators;
  const homelessCount = agents.safety.homelessFlags;
  const parkingRate = agents.parking.occupancyRate;

  return (
    <div className="w-full bg-white border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400">Digital Twin</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-400">Live</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-gray-400">{station.shortName}</span>
      </div>

      {/* SVG floor plan */}
      <div className="p-4 bg-gray-50/50">
        <svg viewBox="0 0 420 270" className="w-full" style={{ fontFamily: "monospace" }}>
          <defs>
            <pattern id="twin-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="420" height="270" fill="url(#twin-grid)" />

          {/* Platforms */}
          <rect x={30} y={80} width={360} height={42} rx={3} fill="#FFF7ED" stroke="#FDBA74" strokeWidth={1} />
          <text x={210} y={97} textAnchor="middle" fontSize={9} fill="#9A3412">PLATFORM A</text>
          <text x={210} y={110} textAnchor="middle" fontSize={7} fill="#C2410C" opacity={0.6}>{station.line}</text>

          <rect x={30} y={142} width={360} height={42} rx={3} fill="#FFF7ED" stroke="#FDBA74" strokeWidth={1} />
          <text x={210} y={159} textAnchor="middle" fontSize={9} fill="#9A3412">PLATFORM B</text>
          <text x={210} y={172} textAnchor="middle" fontSize={7} fill="#C2410C" opacity={0.6}>Inbound</text>

          {/* Concourse */}
          <rect x={130} y={60} width={160} height={20} rx={2} fill="white" stroke="#E5E7EB" strokeWidth={0.8} />
          <text x={210} y={74} textAnchor="middle" fontSize={7} fill="#9CA3AF">CONCOURSE</text>

          {/* Entrances */}
          <rect x={30} y={20} width={60} height={40} rx={2} fill="white" stroke="#E5E7EB" strokeWidth={0.8} />
          <text x={60} y={40} textAnchor="middle" fontSize={7} fill="#6B7280">NORTH</text>
          <text x={60} y={50} textAnchor="middle" fontSize={7} fill="#6B7280">ENTRY</text>

          <rect x={330} y={20} width={60} height={40} rx={2} fill="white" stroke="#E5E7EB" strokeWidth={0.8} />
          <text x={360} y={40} textAnchor="middle" fontSize={7} fill="#6B7280">SOUTH</text>
          <text x={360} y={50} textAnchor="middle" fontSize={7} fill="#6B7280">ENTRY</text>

          {/* Parking */}
          <rect x={30} y={200} width={360} height={58} rx={2} fill="white" stroke="#E5E7EB" strokeWidth={0.8} />
          <text x={55} y={215} fontSize={7} fill="#9CA3AF">PARKING LOT</text>
          <rect x={40} y={222} width={200} height={8} rx={2} fill="#E5E7EB" />
          <rect x={40} y={222} width={Math.min(200, parkingRate * 2)} height={8} rx={2}
            fill={parkingRate > 90 ? "#DC2626" : parkingRate > 75 ? "#D97706" : "#16A34A"} opacity={0.75} />
          <text x={248} y={230} fontSize={7} fill="#6B7280">{Math.round(parkingRate)}% occupied</text>
          {[0, 1, 2].map(i => (
            <g key={i}>
              <rect x={298 + i * 26} y={218} width={20} height={26} rx={2} fill="none" stroke="#86EFAC" strokeWidth={1} />
              <text x={308 + i * 26} y={235} textAnchor="middle" fontSize={8} fill="#16A34A">⚡</text>
            </g>
          ))}

          {/* Elevators */}
          {elevators.map((el, i) => (
            <g key={el.id}>
              <rect x={i === 0 ? 98 : 308} y={62} width={22} height={18} rx={2}
                fill={el.operational ? "#F0FDF4" : "#FEF2F2"}
                stroke={el.operational ? "#86EFAC" : "#FECACA"} strokeWidth={1} />
              <text x={i === 0 ? 109 : 319} y={74} textAnchor="middle" fontSize={9}
                fill={el.operational ? "#16A34A" : "#DC2626"}>
                {el.operational ? "▲" : "✕"}
              </text>
              {el.vibrationIndex > 70 && el.operational && (
                <text x={i === 0 ? 109 : 319} y={58} textAnchor="middle" fontSize={6} fill="#D97706" fontWeight="bold">VIBE</text>
              )}
            </g>
          ))}

          {/* Cameras */}
          <Camera x={42} y={32} active={agents.safety.camerasCoverage > 80} />
          <Camera x={378} y={32} active={agents.safety.camerasCoverage > 70} />
          <Camera x={210} y={68} active={agents.safety.camerasCoverage > 60} />
          <Camera x={42} y={196} active={agents.safety.camerasCoverage > 85} />
          <Camera x={378} y={196} active={agents.safety.camerasCoverage > 65} />

          {/* Bin sensors */}
          {bins.map((bin, i) => {
            const pos = [{ x: 65, y: 58 }, { x: 110, y: 100 }, { x: 315, y: 160 }, { x: 355, y: 58 }][i] || { x: 50 + i * 80, y: 50 };
            return <BinDot key={bin.id} x={pos.x} y={pos.y} level={bin.fillLevel} label="BIN" />;
          })}

          {/* Homeless flags */}
          {homelessCount > 0 && <Flag x={58} y={96} />}
          {homelessCount > 1 && <Flag x={82} y={158} />}
          {homelessCount > 2 && <Flag x={342} y={100} />}

          {/* Train indicator */}
          <rect x={172} y={82} width={38} height={38} rx={3}
            fill="#FFF7ED" stroke="#FDBA74" strokeWidth={1.5}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </rect>
          <text x={191} y={98} textAnchor="middle" fontSize={8} fill="#9A3412">TRAIN</text>
          <text x={191} y={110} textAnchor="middle" fontSize={6.5} fill="#C2410C">IN 4 MIN</text>

          {/* Weather bar */}
          <rect x={0} y={258} width={420} height={12} fill="#F9FAFB" />
          <text x={10} y={267} fontSize={7} fill="#9CA3AF">
            {station.weather.tempF}°F · {station.weather.condition} · {station.weather.windMph}mph wind · Humidity {station.weather.humidity}%
          </text>
        </svg>
      </div>
    </div>
  );
}
