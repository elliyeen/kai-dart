'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface Props {
  placeholder?: string
  onSearch?: (value: string) => void
}

export default function MobileSearchBar({ placeholder = 'Search…', onSearch }: Props) {
  const [value, setValue] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    onSearch?.(e.target.value)
  }

  function handleClear() {
    setValue('')
    onSearch?.('')
  }

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none flex-shrink-0" />
      <input
        type="search"
        inputMode="search"
        autoComplete="off"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 pl-9 pr-9 py-2.5 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors min-h-[44px]"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors tap-target flex items-center justify-center"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
