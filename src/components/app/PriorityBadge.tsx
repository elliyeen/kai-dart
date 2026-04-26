import type { Priority } from '@/lib/app/types'

const CONFIG: Record<Priority, { label: string; bg: string; text: string }> = {
  critical: { label: 'Critical', bg: 'bg-red-600',     text: 'text-white' },
  high:     { label: 'High',     bg: 'bg-[#FF6B35]',   text: 'text-white' },
  medium:   { label: 'Medium',   bg: 'bg-yellow-400',  text: 'text-gray-900' },
  low:      { label: 'Low',      bg: 'bg-gray-200',    text: 'text-gray-600' },
}

interface Props {
  priority: Priority
  size?: 'sm' | 'md'
}

export default function PriorityBadge({ priority, size = 'sm' }: Props) {
  const { label, bg, text } = CONFIG[priority]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
  return (
    <span className={`inline-flex items-center font-medium tracking-[0.04em] uppercase ${bg} ${text} ${padding}`}>
      {label}
    </span>
  )
}
