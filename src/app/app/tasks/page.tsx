'use client'

import { useState, useMemo } from 'react'
import AppHeader from '@/components/app/AppHeader'
import TaskDetailCard from '@/components/app/TaskDetailCard'
import { TASKS } from '@/lib/app/data'
import type { Task } from '@/lib/app/types'

const FILTERS: { value: 'all' | Task['status']; label: string }[] = [
  { value: 'all',         label: 'All' },
  { value: 'todo',        label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'blocked',     label: 'Blocked' },
  { value: 'done',        label: 'Done' },
]

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export default function TasksPage() {
  const [filter, setFilter] = useState<'all' | Task['status']>('in_progress')

  const filtered = useMemo(() => {
    return TASKS
      .filter(t => filter === 'all' || t.status === filter)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  }, [filter])

  const activeCount = TASKS.filter(t => t.status === 'in_progress' || t.status === 'todo').length

  return (
    <div>
      <AppHeader title={`Tasks · ${activeCount} active`} />

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
        <div className="text-[11px] text-gray-400 mb-3">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-[32px] mb-3">✓</div>
            <div className="text-[14px] text-gray-500">No tasks in this view</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(task => (
              <TaskDetailCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
