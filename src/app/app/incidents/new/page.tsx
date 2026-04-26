'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/app/AppHeader'
import PhotoUploadField from '@/components/app/PhotoUploadField'
import { STATIONS } from '@/lib/app/data'
import { Check } from 'lucide-react'

type Priority = 'critical' | 'high' | 'medium' | 'low'
type Category = 'safety' | 'sanitation' | 'equipment' | 'structural' | 'security'

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'border-red-500 bg-red-50 text-red-700' },
  { value: 'high',     label: 'High',     color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'medium',   label: 'Medium',   color: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
  { value: 'low',      label: 'Low',      color: 'border-gray-300 bg-white text-gray-600' },
]

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'safety',     label: 'Safety',      emoji: '🦺' },
  { value: 'sanitation', label: 'Sanitation',  emoji: '🧹' },
  { value: 'equipment',  label: 'Equipment',   emoji: '⚙️' },
  { value: 'structural', label: 'Structural',  emoji: '🏗️' },
  { value: 'security',   label: 'Security',    emoji: '🔒' },
]

export default function NewIncidentPage() {
  const router = useRouter()
  const [priority, setPriority]   = useState<Priority>('high')
  const [category, setCategory]   = useState<Category>('safety')
  const [stationId, setStationId] = useState('')
  const [title, setTitle]         = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors]       = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!title.trim())       e.title       = 'Title is required'
    if (!description.trim()) e.description = 'Description is required'
    if (!stationId)          e.stationId   = 'Select a station'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitted(true)
    setTimeout(() => router.push('/app/incidents'), 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 bg-green-100 flex items-center justify-center mb-4">
          <Check className="w-7 h-7 text-green-600" />
        </div>
        <div className="text-[18px] font-medium text-gray-900">Incident created</div>
        <div className="text-[13px] text-gray-500 mt-1">Routing to operations team…</div>
      </div>
    )
  }

  return (
    <div>
      <AppHeader title="Create incident" showBack backHref="/app/incidents" />

      <form onSubmit={handleSubmit} noValidate className="max-w-2xl md:max-w-none">
        <div className="px-4 py-4 space-y-5">

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-gray-500 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRIORITIES.map(({ value, label, color }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setPriority(value)}
                  className={`px-3 py-3 border-2 text-[13px] font-medium text-center transition-colors min-h-[44px] ${
                    priority === value ? color : 'border-gray-200 text-gray-400 bg-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-gray-500 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(({ value, label, emoji }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`px-2 py-2.5 border text-[12px] font-medium text-center transition-colors min-h-[52px] flex flex-col items-center gap-1 ${
                    category === value ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 bg-white'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Station */}
          <div>
            <label htmlFor="station" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-gray-500 mb-2">
              Station <span className="text-red-500">*</span>
            </label>
            <select
              id="station"
              value={stationId}
              onChange={e => { setStationId(e.target.value); setErrors(prev => ({ ...prev, stationId: '' })) }}
              className={`w-full border px-3 py-3 text-[14px] bg-white focus:outline-none focus:border-gray-400 min-h-[48px] appearance-none ${
                errors.stationId ? 'border-red-400' : 'border-gray-200'
              }`}
              aria-describedby={errors.stationId ? 'station-error' : undefined}
            >
              <option value="">Select a station…</option>
              {STATIONS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.stationId && <p id="station-error" className="mt-1 text-[12px] text-red-600">{errors.stationId}</p>}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-gray-500 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })) }}
              placeholder="Brief description of the issue"
              autoComplete="off"
              className={`w-full border px-3 py-3 text-[14px] focus:outline-none focus:border-gray-400 min-h-[48px] ${
                errors.title ? 'border-red-400' : 'border-gray-200'
              }`}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && <p id="title-error" className="mt-1 text-[12px] text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-gray-500 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: '' })) }}
              placeholder="What is happening? Who is affected? Any immediate safety risk?"
              rows={4}
              className={`w-full border px-3 py-3 text-[14px] focus:outline-none focus:border-gray-400 resize-none ${
                errors.description ? 'border-red-400' : 'border-gray-200'
              }`}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && <p id="description-error" className="mt-1 text-[12px] text-red-600">{errors.description}</p>}
          </div>

          {/* Photo */}
          <PhotoUploadField label="Photos (optional)" />

          {/* Submit */}
          <button
            type="submit"
            className="w-full min-h-[52px] bg-[#FF6B35] text-white text-[14px] font-medium hover:bg-[#E85A27] transition-colors"
          >
            Submit incident
          </button>

          <p className="text-[11px] text-gray-400 text-center pb-4">
            This will be routed to your operations team immediately.
          </p>
        </div>
      </form>
    </div>
  )
}
