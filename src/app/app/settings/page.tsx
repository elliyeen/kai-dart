import AppHeader from '@/components/app/AppHeader'
import Link from 'next/link'
import { User, Bell, Building2, Shield, ChevronRight, ExternalLink } from 'lucide-react'

const SECTIONS = [
  {
    label: 'Account',
    items: [
      { label: 'Profile', sub: 'Ops Manager · Dallas', Icon: User },
      { label: 'Notifications', sub: 'Critical alerts, work orders', Icon: Bell },
      { label: 'Station assignment', sub: '65 stations', Icon: Building2 },
    ],
  },
  {
    label: 'Security',
    items: [
      { label: 'Access & permissions', sub: 'Supervisor role', Icon: Shield },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div>
      <AppHeader title="Settings" />

      <div className="max-w-2xl md:max-w-none">
        {/* Profile card */}
        <div className="bg-white border-b border-gray-100 px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2C3E50] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[16px] font-medium">OM</span>
            </div>
            <div>
              <div className="text-[15px] font-medium text-gray-900">Ops Manager</div>
              <div className="text-[12px] text-gray-500">Dallas Transit Authority</div>
              <div className="text-[11px] text-[#FF6B35] mt-0.5">Supervisor · Field access</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-5">
          {SECTIONS.map(section => (
            <div key={section.label}>
              <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-2">
                {section.label}
              </div>
              <div className="bg-white border border-gray-100 divide-y divide-gray-50">
                {section.items.map(({ label, sub, Icon }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors min-h-[56px]"
                  >
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-gray-900">{label}</div>
                      <div className="text-[11px] text-gray-400">{sub}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* App info */}
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-2">About</div>
            <div className="bg-white border border-gray-100 divide-y divide-gray-50">
              <div className="px-4 py-3.5 flex items-center justify-between min-h-[48px]">
                <span className="text-[13px] text-gray-600">Version</span>
                <span className="text-[12px] text-gray-400">KAI Operations 1.0</span>
              </div>
              <div className="px-4 py-3.5 flex items-center justify-between min-h-[48px]">
                <span className="text-[13px] text-gray-600">Network</span>
                <span className="text-[12px] text-green-600">65 stations live</span>
              </div>
              <Link
                href="/"
                className="w-full flex items-center gap-2 px-4 py-3.5 hover:bg-gray-50 transition-colors min-h-[48px]"
              >
                <span className="text-[13px] text-gray-600 flex-1">KAI website</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
              </Link>
            </div>
          </div>

          {/* Sign out */}
          <button className="w-full border border-gray-200 px-4 py-3.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors min-h-[48px]">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
