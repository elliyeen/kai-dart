'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Bell,
  ClipboardList,
  MoreHorizontal,
} from 'lucide-react'
import { ALERTS } from '@/lib/app/data'

const NAV_ITEMS = [
  { href: '/app/overview',     label: 'Overview', Icon: LayoutDashboard },
  { href: '/app/stations',     label: 'Stations', Icon: Building2 },
  { href: '/app/alerts',       label: 'Alerts',   Icon: Bell },
  { href: '/app/tasks',        label: 'Tasks',    Icon: ClipboardList },
  { href: '/app/work-orders',  label: 'More',     Icon: MoreHorizontal },
]

export default function BottomNav() {
  const pathname = usePathname()
  const unacknowledgedCount = ALERTS.filter(a => !a.acknowledged).length

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          const isAlerts = href === '/app/alerts'
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 transition-colors ${
                active ? 'text-[#FF6B35]' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="relative">
                <Icon className="w-5 h-5" strokeWidth={active ? 2 : 1.5} />
                {isAlerts && unacknowledgedCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-red-600 text-white text-[9px] font-medium min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                    {unacknowledgedCount > 9 ? '9+' : unacknowledgedCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-medium ${active ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
