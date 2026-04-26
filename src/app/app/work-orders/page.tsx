'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AppHeader from '@/components/app/AppHeader'
import WorkOrderCard from '@/components/app/WorkOrderCard'
import MobileStickyCTA from '@/components/app/MobileStickyCTA'
import { WORK_ORDERS } from '@/lib/app/data'
import type { WorkOrder } from '@/lib/app/types'

const STATUS_FILTERS: { value: 'all' | WorkOrder['status']; label: string }[] = [
  { value: 'all',         label: 'All' },
  { value: 'pending',     label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'assigned',    label: 'Assigned' },
  { value: 'completed',   label: 'Completed' },
]

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export default function WorkOrdersPage() {
  const [filter, setFilter] = useState<'all' | WorkOrder['status']>('all')

  const filtered = useMemo(() => {
    return WORK_ORDERS
      .filter(wo => filter === 'all' || wo.status === filter)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  }, [filter])

  const openCount = WORK_ORDERS.filter(wo => wo.status !== 'completed' && wo.status !== 'cancelled').length

  return (
    <div>
      <AppHeader
        title={`Work Orders · ${openCount} open`}
        rightSlot={
          <Link href="/app/incidents/new" className="text-[12px] font-medium text-[#FF6B35]">
            + Create
          </Link>
        }
      />

      {/* Filter */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-0.5 no-scrollbar">
          {STATUS_FILTERS.map(({ value, label }) => (
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
        <div className="text-[11px] text-gray-400 mb-3">{filtered.length} work order{filtered.length !== 1 ? 's' : ''}</div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-[14px] text-gray-500">No work orders in this view</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(order => (
              <WorkOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      <MobileStickyCTA label="+ Create work order" href="/app/incidents/new" />
    </div>
  )
}
