// Desktop shell — wraps content with sidebar on md+ screens.
// Used internally by MobileAppShell; exported for completeness.
import DesktopSidebar from './DesktopSidebar'

interface Props {
  children: React.ReactNode
}

export default function DesktopAppShell({ children }: Props) {
  return (
    <div className="flex h-dvh overflow-hidden bg-[#F7F7F5] font-ui">
      <aside className="flex flex-col w-60 border-r border-gray-100 bg-white flex-shrink-0">
        <DesktopSidebar />
      </aside>
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
