import type { City, KPI } from '@/lib/app/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function scoreColor(score: number): string {
  if (score >= 90) return '#16A34A'
  if (score >= 75) return '#FF6B35'
  if (score >= 60) return '#D97706'
  return '#DC2626'
}

function scoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Fair'
  return 'At risk'
}

function TrendIcon({ trend, positiveDirection }: { trend: 'up' | 'down' | 'stable'; positiveDirection: 'up' | 'down' }) {
  const isGood = trend === positiveDirection || trend === 'stable'
  if (trend === 'stable') return <Minus className="w-3 h-3 text-gray-400" />
  const color = isGood ? 'text-green-600' : 'text-red-600'
  return trend === 'up'
    ? <TrendingUp className={`w-3 h-3 ${color}`} />
    : <TrendingDown className={`w-3 h-3 ${color}`} />
}

interface Props {
  city: City
  kpis: KPI[]
}

export default function CityScoreCard({ city, kpis }: Props) {
  const color = scoreColor(city.score)
  const label = scoreLabel(city.score)

  return (
    <div className="bg-white border border-gray-100">
      {/* Score header */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100">
        {/* Big score */}
        <div className="flex-shrink-0">
          <div className="text-[3.5rem] font-thin leading-none tracking-[-0.02em]" style={{ color }}>
            {city.score}
          </div>
          <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-gray-400 mt-0.5">
            {label}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[18px] font-medium text-gray-900 leading-tight">
            {city.name}, <span className="text-gray-500 font-light">{city.state}</span>
          </div>
          <div className="text-[12px] text-gray-400 mt-0.5">
            {city.stations} stations monitored
          </div>

          {/* Score bar */}
          <div className="mt-3 h-1.5 bg-gray-100 w-full overflow-hidden">
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${city.score}%`, background: color }}
            />
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
        {kpis.map((kpi, i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[19px] font-thin leading-none text-gray-900">
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="text-[11px] text-gray-400 self-end pb-0.5">{kpi.unit}</span>
              )}
              <TrendIcon trend={kpi.trend} positiveDirection={kpi.positiveDirection} />
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-[0.05em]">
              {kpi.label}
            </div>
            {kpi.trendValue && (
              <div className="text-[10px] text-gray-400">
                {kpi.trendValue}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
