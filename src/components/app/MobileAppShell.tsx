'use client'

import BottomNav from './BottomNav'
import DesktopSidebar from './DesktopSidebar'
import OfflineStatusBanner from './OfflineStatusBanner'

interface Props {
  children: React.ReactNode
}

export default function MobileAppShell({ children }: Props) {
  return (
    <div className="flex h-dvh overflow-hidden bg-[#F7F7F5] font-ui">
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex md:flex-col w-60 border-r border-gray-100 bg-white flex-shrink-0">
        <DesktopSidebar />
      </aside>

      {/* Content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Offline banner (full width, above content) */}
        <OfflineStatusBanner />

        {/* Scrollable page content */}
        {/* pb-20 on mobile = room for bottom nav; md:pb-0 resets on desktop */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile bottom nav — hidden on desktop */}
        <div className="md:hidden flex-shrink-0">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
