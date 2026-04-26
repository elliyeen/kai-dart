import AppHeader from '@/components/app/AppHeader'
import { CITY_KPIS, STATIONS, INCIDENTS, WORK_ORDERS } from '@/lib/app/data'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { KPI } from '@/lib/app/types'

function TrendChip({ kpi }: { kpi: KPI }) {
  const isGood = kpi.trend === kpi.positiveDirection || kpi.trend === 'stable'
  const goodColor = isGood ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
  if (kpi.trend === 'stable') {
    return (
      <span className="flex items-center gap-0.5 text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5">
        <Minus className="w-2.5 h-2.5" /> Stable
      </span>
    )
  }
  return (
    <span className={`flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 ${goodColor}`}>
      {kpi.trend === 'up'
        ? <TrendingUp className="w-2.5 h-2.5" />
        : <TrendingDown className="w-2.5 h-2.5" />
      }
      {kpi.trendValue}
    </span>
  )
}

function scoreColor(s: number) {
  if (s >= 90) return '#16A34A'
  if (s >= 75) return '#FF6B35'
  if (s >= 60) return '#D97706'
  return '#DC2626'
}

const avgScore = Math.round(STATIONS.reduce((s, st) => s + st.score, 0) / STATIONS.length)
const topStations = [...STATIONS].sort((a, b) => b.score - a.score).slice(0, 5)
const bottomStations = [...STATIONS].sort((a, b) => a.score - b.score).slice(0, 5)
const incidentsByCategory = INCIDENTS.reduce((acc, i) => {
  acc[i.category] = (acc[i.category] ?? 0) + 1
  return acc
}, {} as Record<string, number>)

export default function ReportsPage() {
  return (
    <div>
      <AppHeader title="Network report" />

      <div className="px-4 py-4 space-y-4 max-w-2xl md:max-w-none">

        {/* KPI grid */}
        <section>
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-2.5">Key metrics</div>
          <div className="grid grid-cols-2 gap-2">
            {CITY_KPIS.map((kpi, i) => (
              <div key={i} className="bg-white border border-gray-100 px-4 py-3.5">
                <div className="flex items-end gap-1">
                  <span className="text-[28px] font-thin leading-none text-gray-900">{kpi.value}</span>
                  {kpi.unit && <span className="text-[12px] text-gray-400 pb-0.5">{kpi.unit}</span>}
                </div>
                <div className="text-[10px] uppercase tracking-[0.05em] text-gray-400 mt-1">{kpi.label}</div>
                <div className="mt-2">
                  <TrendChip kpi={kpi} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Network average */}
        <section className="bg-white border border-gray-100 px-4 py-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-3">Network average readiness</div>
          <div className="flex items-end gap-3">
            <div className="text-[3.5rem] font-thin leading-none" style={{ color: scoreColor(avgScore) }}>
              {avgScore}
            </div>
            <div className="pb-2 text-[13px] text-gray-400">/ 100</div>
          </div>
          <div className="mt-3 h-2 bg-gray-100">
            <div className="h-full" style={{ width: `${avgScore}%`, background: scoreColor(avgScore) }} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Nominal', count: STATIONS.filter(s => s.status === 'nominal').length, color: 'text-green-600' },
              { label: 'Degraded', count: STATIONS.filter(s => s.status === 'degraded').length, color: 'text-yellow-600' },
              { label: 'Critical', count: STATIONS.filter(s => s.status === 'critical').length, color: 'text-red-600' },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div className={`text-[20px] font-thin ${color}`}>{count}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-[0.05em]">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Top / bottom stations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-50">
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">Top stations</span>
            </div>
            <div className="divide-y divide-gray-50">
              {topStations.map((s, i) => (
                <div key={s.id} className="flex items-center px-4 py-3 gap-3">
                  <span className="text-[12px] text-gray-300 w-4 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-gray-800 truncate">{s.name}</div>
                    <div className="text-[10px] text-gray-400">{s.line}</div>
                  </div>
                  <span className="text-[14px] font-medium" style={{ color: scoreColor(s.score) }}>{s.score}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-50">
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">Needs attention</span>
            </div>
            <div className="divide-y divide-gray-50">
              {bottomStations.map((s, i) => (
                <div key={s.id} className="flex items-center px-4 py-3 gap-3">
                  <span className="text-[12px] text-gray-300 w-4 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-gray-800 truncate">{s.name}</div>
                    <div className="text-[10px] text-gray-400">{s.line}</div>
                  </div>
                  <span className="text-[14px] font-medium" style={{ color: scoreColor(s.score) }}>{s.score}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Incidents by category */}
        <section className="bg-white border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-50">
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">Incidents by category</span>
          </div>
          <div className="divide-y divide-gray-50">
            {Object.entries(incidentsByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, count]) => (
                <div key={cat} className="flex items-center px-4 py-3 gap-3">
                  <div className="flex-1 text-[13px] text-gray-700 capitalize">{cat}</div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-gray-100 w-20">
                      <div
                        className="h-full bg-[#FF6B35]"
                        style={{ width: `${(count / INCIDENTS.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-medium text-gray-600 w-4 text-right">{count}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </section>

        {/* Work orders summary */}
        <section className="bg-white border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-50">
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">Work orders</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { label: 'Open',      count: WORK_ORDERS.filter(w => w.status === 'pending' || w.status === 'assigned').length, color: 'text-yellow-600' },
              { label: 'Active',    count: WORK_ORDERS.filter(w => w.status === 'in_progress').length,  color: 'text-[#FF6B35]' },
              { label: 'Completed', count: WORK_ORDERS.filter(w => w.status === 'completed').length,   color: 'text-green-600' },
            ].map(({ label, count, color }) => (
              <div key={label} className="py-4 text-center">
                <div className={`text-[22px] font-thin ${color}`}>{count}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-[0.05em] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
