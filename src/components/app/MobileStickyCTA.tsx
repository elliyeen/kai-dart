import Link from 'next/link'

interface Props {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'danger'
  disabled?: boolean
}

export default function MobileStickyCTA({ label, href, onClick, variant = 'primary', disabled = false }: Props) {
  const bg = variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#FF6B35] hover:bg-[#E85A27]'
  const classes = `w-full flex items-center justify-center min-h-[52px] text-[14px] font-medium text-white transition-colors ${bg} disabled:opacity-50 disabled:pointer-events-none`

  if (href && !disabled) {
    return (
      <div className="safe-bottom fixed bottom-14 md:bottom-0 left-0 right-0 z-30 px-4 pb-3 pt-2 bg-linear-to-t from-[#F7F7F5] to-transparent pointer-events-none">
        <Link href={href} className={`${classes} pointer-events-auto`}>
          {label}
        </Link>
      </div>
    )
  }

  return (
    <div className="safe-bottom fixed bottom-14 md:bottom-0 left-0 right-0 z-30 px-4 pb-3 pt-2 bg-linear-to-t from-[#F7F7F5] to-transparent pointer-events-none">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${classes} pointer-events-auto`}
      >
        {label}
      </button>
    </div>
  )
}
