'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export default function OfflineStatusBanner() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const set = () => setOffline(!navigator.onLine)
    set()
    window.addEventListener('online',  set)
    window.addEventListener('offline', set)
    return () => {
      window.removeEventListener('online',  set)
      window.removeEventListener('offline', set)
    }
  }, [])

  if (!offline) return null

  return (
    <div className="bg-red-600 text-white px-4 py-2.5 flex items-center gap-2.5 text-[12px] font-medium">
      <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
      <span>No connection — data may be outdated</span>
    </div>
  )
}
