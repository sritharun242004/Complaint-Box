'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'

export default function NotificationBar() {
  const { t } = useI18n()

  return (
    <div className="bg-gradient-to-r from-primary via-[#FF8533] to-primary text-white py-2.5 px-4 relative overflow-hidden">
      {/* Subtle animated shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
      />
      <div className="max-w-container mx-auto flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <p className="text-sm font-medium truncate">{t.notificationBar.text}</p>
        </div>
        <Link
          href="/pugaar-petti"
          className="shrink-0 bg-white text-primary text-xs font-bold px-5 py-1.5 rounded-full hover:bg-white/90 hover:scale-105 transition-all shadow-sm"
        >
          {t.notificationBar.button}
        </Link>
      </div>
    </div>
  )
}
