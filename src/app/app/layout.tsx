import type { Metadata } from 'next'
import MobileAppShell from '@/components/app/MobileAppShell'

export const metadata: Metadata = {
  title: 'KAI Operations',
  description: 'KAI city operations command center',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MobileAppShell>{children}</MobileAppShell>
}
