import Link from 'next/link'
import type { Alert } from '@/lib/app/types'
import { AlertTriangle, Info, CheckCircle, ChevronRight } from 'lucide-react'
import { formatRelativeTime } from '@/lib/app/data'

const SEVERITY_CONFIG = {
  critical: {
    border: 'border-l-red-600',
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    bg: 'bg-red-50',
    textColor: 'text-red-700',
    label: 'Critical',
  },
  warning: {
    border: 'border-l-[#FF6B35]',
    icon: AlertTriangle,
    iconColor: 'text-[#FF6B35]',
    bg: 'bg-orange-50',
    textColor: 'text-orange-700',
    label: 'Warning',
  },
  info: {
    border: 'border-l-blue-500',
    icon: Info,
    iconColor: 'text-blue-500',
    bg: 'bg-blue-50',
    textColor: 'text-blue-700',
    label: 'Info',
  },
}

interface Props {
  alert: Alert
  onAcknowledge?: (id: string) => void
}

export default function IncidentAlertCard({ alert, onAcknowledge }: Props) {
  const cfg = SEVERITY_CONFIG[alert.severity]
  const Icon = cfg.icon

  return (
    <div className={`bg-white border border-gray-100 border-l-4 ${cfg.border}`}>
      <div className="px-4 py-3.5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className={`flex-shrink-0 mt-0.5 ${cfg.iconColor}`}>
            <Icon className="w-4 h-4" />
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`inline-block text-[10px] font-medium uppercase tracking-[0.08em] ${cfg.textColor} mb-1`}>
                  {cfg.label} · {alert.category}
                </span>
                <div className="text-[13px] font-medium text-gray-900 leading-snug">{alert.title}</div>
              </div>
            </div>

            <p className="text-[12px] text-gray-500 mt-1 leading-snug">{alert.message}</p>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] text-gray-400">{alert.stationName}</span>
              <span className="text-gray-200">·</span>
              <span className="text-[11px] text-gray-400">{formatRelativeTime(alert.createdAt)}</span>
              {alert.acknowledged && (
                <>
                  <span className="text-gray-200">·</span>
                  <span className="flex items-center gap-1 text-[11px] text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    Acked
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!alert.acknowledged && onAcknowledge && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="text-[12px] font-medium text-gray-900 border border-gray-300 px-3 py-1.5 hover:bg-gray-50 transition-colors min-h-[36px]"
            >
              Acknowledge
            </button>
            <Link
              href={`/app/incidents`}
              className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-700 transition-colors"
            >
              View incident <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
