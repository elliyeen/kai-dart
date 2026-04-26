import Link from 'next/link'
import AppHeader from '@/components/app/AppHeader'
import CityScoreCard from '@/components/app/CityScoreCard'
import StationReadinessCard from '@/components/app/StationReadinessCard'
import { CITY, CITY_KPIS, STATIONS, ALERTS } from '@/lib/app/data'
import { Bell, Building2, Wrench, AlertTriangle, ChevronRight } from 'lucide-react'

const CRITICAL_STATIONS = STATIONS.filter(s => s.status === 'critical' || s.status === 'degraded').slice(0, 3)
const TOP_ALERTS = ALERTS.filter(a => !a.acknowledged && a.severity === 'critical').slice(0, 3)

export default function OverviewPage() {
  return (
    <div>
      <AppHeader title="Dallas Operations" />

      <div className="px-4 py-4 space-y-4 max-w-2xl md:max-w-none md:mx-auto">

        {/* City score */}
        <CityScoreCard city={CITY} kpis={CITY_KPIS} />

        {/* Critical alerts */}
        {TOP_ALERTS.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-red-600 flex items-center gap-1.5">
                <Bell className="w-3 h-3" />
                Critical alerts
              </span>
              <Link href="/app/alerts" className="text-[11px] text-gray-400 hover:text-gray-700 flex items-center gap-0.5">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {TOP_ALERTS.map(alert => (
                <div key={alert.id} className="bg-red-50 border border-red-100 border-l-4 border-l-red-600 px-4 py-3">
                  <div className="text-[12px] font-medium text-red-800">{alert.title}</div>
                  <div className="text-[11px] text-red-600 mt-0.5">{alert.stationName}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick actions */}
        <section>
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-2.5">
            Quick actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/app/incidents/new', Icon: AlertTriangle, label: 'Create incident', color: 'text-red-600' },
              { href: '/app/alerts',        Icon: Bell,          label: 'View alerts',     color: 'text-[#FF6B35]' },
              { href: '/app/stations',      Icon: Building2,     label: 'All stations',    color: 'text-[#2C3E50]' },
              { href: '/app/work-orders',   Icon: Wrench,        label: 'Work orders',     color: 'text-gray-600' },
            ].map(({ href, Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-3.5 hover:border-gray-200 transition-colors min-h-[56px] active:bg-gray-50"
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                <span className="text-[13px] font-medium text-gray-800">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Stations needing attention */}
        {CRITICAL_STATIONS.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 flex items-center gap-1.5">
                <Building2 className="w-3 h-3" />
                Needs attention
              </span>
              <Link href="/app/stations" className="text-[11px] text-gray-400 hover:text-gray-700 flex items-center gap-0.5">
                All stations <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {CRITICAL_STATIONS.map(station => (
                <StationReadinessCard key={station.id} station={station} />
              ))}
            </div>
          </section>
        )}

        {/* Network summary row */}
        <section className="bg-white border border-gray-100">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { value: STATIONS.filter(s => s.status === 'nominal').length, label: 'Nominal', color: 'text-green-600' },
              { value: STATIONS.filter(s => s.status === 'degraded').length, label: 'Degraded', color: 'text-yellow-600' },
              { value: STATIONS.filter(s => s.status === 'critical').length, label: 'Critical', color: 'text-red-600' },
            ].map(({ value, label, color }) => (
              <div key={label} className="py-4 text-center">
                <div className={`text-[24px] font-thin leading-none ${color}`}>{value}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-[0.06em] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
