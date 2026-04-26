'use client'

import { Camera, X, Image as ImageIcon } from 'lucide-react'
import { useRef, useState } from 'react'

interface Props {
  label?: string
  required?: boolean
  onChange?: (files: File[]) => void
}

export default function PhotoUploadField({ label = 'Attach photos', required = false, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([])

  function handleFiles(files: FileList | null) {
    if (!files) return
    const arr = Array.from(files)
    const newPreviews = arr.map(f => ({ url: URL.createObjectURL(f), name: f.name }))
    setPreviews(prev => [...prev, ...newPreviews])
    onChange?.(arr)
  }

  function remove(index: number) {
    setPreviews(prev => {
      const next = [...prev]
      URL.revokeObjectURL(next[index].url)
      next.splice(index, 1)
      return next
    })
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[12px] font-medium text-gray-700 uppercase tracking-[0.05em]">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((p, i) => (
            <div key={i} className="relative w-20 h-20 border border-gray-200 overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
              <button
                onClick={() => remove(i)}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white p-0.5 hover:bg-black transition-colors"
                aria-label={`Remove ${p.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2.5 w-full border border-dashed border-gray-300 px-4 py-3.5 text-[13px] text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors min-h-[52px]"
      >
        {previews.length === 0 ? (
          <Camera className="w-4 h-4 flex-shrink-0" />
        ) : (
          <ImageIcon className="w-4 h-4 flex-shrink-0" />
        )}
        <span>{previews.length === 0 ? 'Take photo or upload' : 'Add another photo'}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="sr-only"
        aria-hidden="true"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}
