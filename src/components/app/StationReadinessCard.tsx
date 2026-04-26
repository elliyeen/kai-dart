import Link from 'next/link'
import type { AppStation } from '@/lib/app/types'
import { AlertCircle, ChevronRight } from 'lucide-react'

function scoreColor(score: number): string {
  if (score >= 90) return '#16A34A'
  if (score >= 75) return '#FF6B35'
  if (score >= 60) return '#D97706'
  return '#DC2626'
}

function statusBg(status: AppStation['status']): string {
  if (status === 'nominal')  return 'bg-green-50 text-green-700 border-green-200'
  if (status === 'degraded') return 'bg-yellow-50 text-yellow-700 border-yellow-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

interface Props {
  station: AppStation
}

export default function StationReadinessCard({ station }: Props) {
  const color = scoreColor(station.score)
  const hasCritical = station.status === 'critical'

  return (
    <Link
      href={`/app/stations/${station.id}`}
      className={`block bg-white border-l-4 border-r border-t border-b border-gray-100 transition-colors hover:border-gray-200 active:bg-gray-50 ${hasCritical ? 'border-l-red-600' : ''}`}
      style={!hasCritical ? { borderLeftColor: color } : undefined}
    >
      <div className="px-4 py-3.5">
        {/* Top row: name + score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-medium text-gray-900 truncate">{station.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: station.lineColor }}
              />
              <span className="text-[11px] text-gray-400">{station.line}</span>
              <span className="text-gray-200">·</span>
              <span className="text-[11px] text-gray-400">{station.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-[22px] font-thin leading-none" style={{ color }}>
                {station.score}
              </div>
              <div className="text-[9px] uppercase tracking-[0.08em] text-gray-400">score</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-3 h-0.5 bg-gray-100">
          <div className="h-full" style={{ width: `${station.score}%`, background: color }} />
        </div>

        {/* Bottom row: agent scores + alerts */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-3">
            {[
              { label: 'Safety', val: station.safetyScore },
              { label: 'Clean', val: station.cleanlinessScore },
              { label: 'Maint', val: station.maintenanceScore },
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <div className="text-[12px] font-medium text-gray-700">{val}</div>
                <div className="text-[9px] text-gray-400 uppercase tracking-[0.04em]">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {station.activeIncidents > 0 && (
              <span className={`flex items-center gap-1 text-[11px] border px-1.5 py-0.5 ${statusBg(station.status)}`}>
                <AlertCircle className="w-3 h-3" />
                {station.activeIncidents}
              </span>
            )}
            <span className="text-[10px] text-gray-400">{station.lastInspected}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
