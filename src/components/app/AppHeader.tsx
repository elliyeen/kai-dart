'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface Props {
  title: string
  showBack?: boolean
  backHref?: string
  rightSlot?: React.ReactNode
}

export default function AppHeader({ title, showBack = false, backHref, rightSlot }: Props) {
  const router = useRouter()

  function handleBack() {
    if (backHref) router.push(backHref)
    else router.back()
  }

  return (
    <header className="safe-top bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center h-14 px-4 gap-2">
        {showBack && (
          <button
            onClick={handleBack}
            className="tap-target flex items-center justify-center -ml-1 text-gray-700 hover:text-black transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <h1 className="flex-1 text-[15px] font-medium text-gray-900 font-ui truncate">
          {title}
        </h1>

        {rightSlot && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  )
}
