'use client'

import { useState, useMemo } from 'react'
import AppHeader from '@/components/app/AppHeader'
import IncidentAlertCard from '@/components/app/IncidentAlertCard'
import { ALERTS } from '@/lib/app/data'
import type { Alert } from '@/lib/app/types'

const FILTERS = [
  { value: 'all',      label: 'All' },
  { value: 'unacked',  label: 'Unacknowledged' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning',  label: 'Warning' },
] as const

type FilterVal = 'all' | 'unacked' | Alert['severity']

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterVal>('unacked')
  const [alerts, setAlerts] = useState(ALERTS)

  const filtered = useMemo(() => {
    return alerts.filter(a => {
      if (filter === 'unacked') return !a.acknowledged
      if (filter === 'all') return true
      return a.severity === filter
    })
  }, [alerts, filter])

  function acknowledge(id: string) {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, acknowledged: true, acknowledgedBy: 'You' } : a
    ))
  }

  const unackedCount = alerts.filter(a => !a.acknowledged).length

  return (
    <div>
      <AppHeader
        title={unackedCount > 0 ? `Alerts · ${unackedCount} new` : 'Alerts'}
      />

      {/* Filter bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-0.5 no-scrollbar">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex-shrink-0 text-[12px] font-medium px-3 py-1.5 border transition-colors min-h-[36px] ${
                filter === value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {label}
              {value === 'unacked' && unackedCount > 0 && (
                <span className="ml-1.5 bg-red-600 text-white text-[9px] px-1 py-0.5">{unackedCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 max-w-2xl md:max-w-none">
        <div className="text-[11px] text-gray-400 mb-3">
          {filtered.length} alert{filtered.length !== 1 ? 's' : ''}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-[32px] mb-3">✓</div>
            <div className="text-[15px] font-medium text-gray-800">All clear</div>
            <div className="text-[13px] text-gray-400 mt-1">No alerts in this view</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(alert => (
              <IncidentAlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={acknowledge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
