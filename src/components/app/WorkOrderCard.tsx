import Link from 'next/link'
import type { WorkOrder } from '@/lib/app/types'
import { Wrench, ChevronRight, MapPin, Clock, User } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import StatusPill from './StatusPill'
import { formatRelativeTime, formatDueTime } from '@/lib/app/data'

const CATEGORY_LABEL: Record<WorkOrder['category'], string> = {
  corrective:  'Corrective',
  preventive:  'Preventive',
  emergency:   'Emergency',
  inspection:  'Inspection',
}

interface Props {
  order: WorkOrder
}

export default function WorkOrderCard({ order }: Props) {
  const overdue = new Date(order.dueAt) < new Date() && order.status !== 'completed' && order.status !== 'cancelled'

  return (
    <Link
      href={`/app/work-orders/${order.id}`}
      className="block bg-white border border-gray-100 transition-colors hover:border-gray-200 active:bg-gray-50"
    >
      <div className="px-4 py-3.5">
        {/* Top: priority + status */}
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={order.priority} />
          <StatusPill status={order.status} />
          <span className="text-[10px] text-gray-400 uppercase tracking-[0.05em]">
            {CATEGORY_LABEL[order.category]}
          </span>
        </div>

        {/* Title */}
        <div className="mt-2 text-[14px] font-medium text-gray-900 leading-snug line-clamp-2">
          {order.title}
        </div>

        {/* Meta row */}
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {order.stationName}
          </span>
          {order.assignedTo && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <User className="w-3 h-3 flex-shrink-0" />
              {order.assignedTo}
            </span>
          )}
          <span className={`flex items-center gap-1 text-[11px] ${overdue ? 'text-red-600' : 'text-gray-400'}`}>
            <Clock className="w-3 h-3 flex-shrink-0" />
            Due {formatDueTime(order.dueAt)}
          </span>
        </div>

        {/* Notes preview */}
        {order.notes.length > 0 && (
          <div className="mt-2 text-[12px] text-gray-500 line-clamp-1">
            {order.notes[order.notes.length - 1]}
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-50 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          Created {formatRelativeTime(order.createdAt)}
          {order.estimatedHours && ` · Est. ${order.estimatedHours}h`}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </Link>
  )
}
