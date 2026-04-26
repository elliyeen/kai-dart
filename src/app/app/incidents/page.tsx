'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AppHeader from '@/components/app/AppHeader'
import PriorityBadge from '@/components/app/PriorityBadge'
import StatusPill from '@/components/app/StatusPill'
import MobileStickyCTA from '@/components/app/MobileStickyCTA'
import { INCIDENTS, formatRelativeTime } from '@/lib/app/data'
import type { Incident } from '@/lib/app/types'
import { ChevronRight, AlertCircle } from 'lucide-react'

const FILTERS: { value: 'all' | Incident['status']; label: string }[] = [
  { value: 'all',         label: 'All' },
  { value: 'open',        label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved',    label: 'Resolved' },
]

const CATEGORY_ICON: Record<Incident['category'], string> = {
  safety:     '🦺',
  sanitation: '🧹',
  equipment:  '⚙️',
  structural: '🏗️',
  security:   '🔒',
}

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export default function IncidentsPage() {
  const [filter, setFilter] = useState<'all' | Incident['status']>('open')

  const filtered = useMemo(() => {
    return INCIDENTS
      .filter(i => filter === 'all' || i.status === filter)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  }, [filter])

  const openCount = INCIDENTS.filter(i => i.status === 'open' || i.status === 'in_progress').length

  return (
    <div>
      <AppHeader
        title={`Incidents · ${openCount} active`}
        rightSlot={
          <Link href="/app/incidents/new" className="text-[12px] font-medium text-[#FF6B35]">+ New</Link>
        }
      />

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
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 max-w-2xl md:max-w-none">
        <div className="text-[11px] text-gray-400 mb-3">{filtered.length} incident{filtered.length !== 1 ? 's' : ''}</div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-[14px] text-gray-500">No incidents in this view</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(inc => (
              <Link
                key={inc.id}
                href={`/app/incidents`}
                className="block bg-white border border-gray-100 border-l-4 hover:border-gray-200 transition-colors active:bg-gray-50"
                style={{ borderLeftColor: inc.priority === 'critical' ? '#DC2626' : inc.priority === 'high' ? '#FF6B35' : '#D97706' }}
              >
                <div className="px-4 py-3.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px]">{CATEGORY_ICON[inc.category]}</span>
                    <PriorityBadge priority={inc.priority} />
                    <StatusPill status={inc.status} />
                  </div>
                  <div className="mt-1.5 text-[13px] font-medium text-gray-900 leading-snug">{inc.title}</div>
                  <p className="mt-1 text-[12px] text-gray-500 line-clamp-2">{inc.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
                    <span>{inc.stationName}</span>
                    <span className="text-gray-200">·</span>
                    <span>{inc.assignedTo ?? 'Unassigned'}</span>
                    <span className="text-gray-200">·</span>
                    <span>{formatRelativeTime(inc.createdAt)}</span>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-50 flex justify-end">
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <MobileStickyCTA label="+ Create incident" href="/app/incidents/new" variant="primary" />
    </div>
  )
}
