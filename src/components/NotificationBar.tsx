'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/context'

export default function NotificationBar() {
  const { t } = useI18n()

  return (
    <div className="bg-primary text-white pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="max-w-container mx-auto px-4 sm:px-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 py-2">
        <div className="flex items-start sm:items-center gap-2 min-w-0">
          <span className="w-1 h-1 mt-1.5 sm:mt-0 shrink-0 rounded-full bg-white/90" aria-hidden />
          <p className="text-[11px] sm:text-xs font-medium leading-snug uppercase tracking-wide">{t.notificationBar.text}</p>
        </div>
        <Link
          href="/pugaar-petti"
          className="shrink-0 inline-flex items-center justify-center min-h-[40px] sm:min-h-0 px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-primary bg-white rounded-md sm:rounded sm:self-center touch-manipulation active:opacity-90"
        >
          {t.notificationBar.button} →
        </Link>
      </div>
    </div>
  )
}
