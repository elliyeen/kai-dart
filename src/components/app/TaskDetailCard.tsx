import Link from 'next/link'
import type { Task } from '@/lib/app/types'
import { Camera, ChevronRight, MapPin, Clock, User, Check } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import StatusPill from './StatusPill'
import { formatDueTime, formatRelativeTime } from '@/lib/app/data'

interface Props {
  task: Task
  compact?: boolean
}

export default function TaskDetailCard({ task, compact = false }: Props) {
  const overdue = new Date(task.dueAt) < new Date() && task.status !== 'done'
  const isDone = task.status === 'done'

  return (
    <Link
      href={`/app/tasks/${task.id}`}
      className={`block bg-white border border-gray-100 transition-colors hover:border-gray-200 active:bg-gray-50 ${isDone ? 'opacity-60' : ''}`}
    >
      <div className="px-4 py-3.5">
        {/* Status line */}
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <StatusPill status={task.status} />
          {task.photoRequired && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5">
              <Camera className="w-2.5 h-2.5" />
              Photo req.
            </span>
          )}
        </div>

        {/* Title */}
        <div className={`mt-2 text-[14px] font-medium leading-snug ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </div>

        {!compact && (
          <p className="mt-1 text-[12px] text-gray-500 line-clamp-2 leading-snug">
            {task.description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <User className="w-3 h-3 flex-shrink-0" />
            {task.assignedTo}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {task.stationName}
          </span>
          <span className={`flex items-center gap-1 text-[11px] ${overdue ? 'text-red-600' : 'text-gray-400'}`}>
            <Clock className="w-3 h-3 flex-shrink-0" />
            {isDone && task.completedAt
              ? `Done ${formatRelativeTime(task.completedAt)}`
              : formatDueTime(task.dueAt)
            }
          </span>
        </div>

        {task.notes && !compact && (
          <div className="mt-2 text-[12px] text-gray-500 line-clamp-1 italic">
            &ldquo;{task.notes}&rdquo;
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-50 flex items-center justify-between">
        {isDone ? (
          <span className="flex items-center gap-1 text-[11px] text-green-600">
            <Check className="w-3 h-3" />
            Completed
          </span>
        ) : (
          <span className="text-[11px] text-gray-400">
            {task.workOrderId ? `WO: ${task.workOrderId}` : task.incidentId ? `INC: ${task.incidentId}` : 'Standalone task'}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </Link>
  )
}
