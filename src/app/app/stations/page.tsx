'use client'

import { useState, useMemo } from 'react'
import AppHeader from '@/components/app/AppHeader'
import MobileSearchBar from '@/components/app/MobileSearchBar'
import StationReadinessCard from '@/components/app/StationReadinessCard'
import { STATIONS } from '@/lib/app/data'
import type { AppStation } from '@/lib/app/types'

const STATUS_FILTERS = [
  { value: 'all',      label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'degraded', label: 'Degraded' },
  { value: 'nominal',  label: 'Nominal' },
] as const

type FilterValue = 'all' | AppStation['status']

export default function StationsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')

  const filtered = useMemo(() => {
    return STATIONS.filter(s => {
      const matchesQuery =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.location.toLowerCase().includes(query.toLowerCase()) ||
        s.line.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'all' || s.status === filter
      return matchesQuery && matchesFilter
    }).sort((a, b) => a.score - b.score) // worst first
  }, [query, filter])

  return (
    <div>
      <AppHeader title="Stations" />

      <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-100 space-y-3">
        <MobileSearchBar placeholder="Search stations…" onSearch={setQuery} />

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 -mx-4 px-4 no-scrollbar">
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
        <div className="text-[11px] text-gray-400 mb-3">
          {filtered.length} station{filtered.length !== 1 ? 's' : ''}
          {filter !== 'all' && ` — ${filter}`}
          {query && ` matching "${query}"`}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-[14px] text-gray-500">No stations match your search</div>
              <button
                onClick={() => { setQuery(''); setFilter('all') }}
                className="mt-3 text-[13px] text-[#FF6B35] underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map(station => (
              <StationReadinessCard key={station.id} station={station} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
