import type { IncidentStatus, WorkOrderStatus, TaskStatus } from '@/lib/app/types'

type AnyStatus = IncidentStatus | WorkOrderStatus | TaskStatus

const CONFIG: Record<string, { label: string; dot: string; border: string; text: string }> = {
  open:        { label: 'Open',        dot: 'bg-gray-400',      border: 'border-gray-300',   text: 'text-gray-600' },
  todo:        { label: 'To do',       dot: 'bg-gray-400',      border: 'border-gray-300',   text: 'text-gray-600' },
  pending:     { label: 'Pending',     dot: 'bg-yellow-400',    border: 'border-yellow-300', text: 'text-yellow-700' },
  assigned:    { label: 'Assigned',    dot: 'bg-blue-500',      border: 'border-blue-200',   text: 'text-blue-700' },
  in_progress: { label: 'In progress', dot: 'bg-[#FF6B35]',     border: 'border-orange-200', text: 'text-orange-700' },
  blocked:     { label: 'Blocked',     dot: 'bg-red-500',       border: 'border-red-200',    text: 'text-red-700' },
  done:        { label: 'Done',        dot: 'bg-green-500',     border: 'border-green-200',  text: 'text-green-700' },
  resolved:    { label: 'Resolved',    dot: 'bg-green-500',     border: 'border-green-200',  text: 'text-green-700' },
  completed:   { label: 'Completed',   dot: 'bg-green-500',     border: 'border-green-200',  text: 'text-green-700' },
  closed:      { label: 'Closed',      dot: 'bg-gray-300',      border: 'border-gray-200',   text: 'text-gray-500' },
  cancelled:   { label: 'Cancelled',   dot: 'bg-gray-300',      border: 'border-gray-200',   text: 'text-gray-400' },
}

interface Props {
  status: AnyStatus
}

export default function StatusPill({ status }: Props) {
  const cfg = CONFIG[status] ?? CONFIG['open']
  return (
    <span className={`inline-flex items-center gap-1.5 border ${cfg.border} ${cfg.text} px-2 py-0.5 text-[11px] font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
