'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Bell,
  ClipboardList,
  Wrench,
  AlertTriangle,
  BarChart3,
  Settings,
} from 'lucide-react'
import { ALERTS } from '@/lib/app/data'

const NAV = [
  { href: '/app/overview',    label: 'Overview',     Icon: LayoutDashboard },
  { href: '/app/stations',    label: 'Stations',     Icon: Building2 },
  { href: '/app/alerts',      label: 'Alerts',       Icon: Bell },
  { href: '/app/tasks',       label: 'Tasks',        Icon: ClipboardList },
  { href: '/app/work-orders', label: 'Work Orders',  Icon: Wrench },
  { href: '/app/incidents',   label: 'Incidents',    Icon: AlertTriangle },
  { href: '/app/reports',     label: 'Reports',      Icon: BarChart3 },
  { href: '/app/settings',    label: 'Settings',     Icon: Settings },
]

export default function DesktopSidebar() {
  const pathname = usePathname()
  const unacked = ALERTS.filter(a => !a.acknowledged).length

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-100 flex-shrink-0">
        <Link href="/app/overview" className="text-[13px] font-medium tracking-[0.3em] text-black">
          KAI
        </Link>
        <span className="ml-3 text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase">
          Operations
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href)
            const isAlerts = href === '/app/alerts'
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors min-h-[44px] ${
                    active
                      ? 'bg-[#FF6B35]/8 text-[#FF6B35]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={active ? 2 : 1.5} />
                  <span className="flex-1">{label}</span>
                  {isAlerts && unacked > 0 && (
                    <span className="bg-red-600 text-white text-[10px] font-medium px-1.5 py-0.5 min-w-[18px] text-center">
                      {unacked}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom: back to marketing site */}
      <div className="px-3 py-4 border-t border-gray-100 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Marketing site
        </Link>
      </div>
    </div>
  )
}
