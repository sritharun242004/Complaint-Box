'use client'

import Link from 'next/link'
/* eslint-disable @next/next/no-img-element */
import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'

type Props = {
  complaint: {
    id: string
    title: string
    description: string
    area: string
    category: string
    imageUrl: string | null
    upvotes: number
    adminReply: string | null
    status: string
    createdAt: Date
  }
}

export default function ComplaintCard({ complaint }: Props) {
  const { t } = useI18n()
  const areaKey = complaint.area as keyof typeof t.areas
  const categoryKey = complaint.category as keyof typeof t.categories

  function handleShare(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/complaint/${complaint.id}`
    if (navigator.share) {
      navigator.share({ title: complaint.title, url })
    } else {
      navigator.clipboard.writeText(url)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/complaint/${complaint.id}`}
        className="group block bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:border-primary/10 transition-all"
      >
        {/* Image */}
        {complaint.imageUrl && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <span className="absolute top-3 right-3 bg-gradient-to-r from-primary to-[#FF8533] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {t.categories[categoryKey] || complaint.category}
            </span>
          </div>
        )}

        {!complaint.imageUrl && (
          <div className="flex justify-end p-4 pb-0">
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
              {t.categories[categoryKey] || complaint.category}
            </span>
          </div>
        )}

        <div className="p-3 sm:p-5">
          <h3 className="font-bold text-text text-base sm:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {complaint.title}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-3 h-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="text-xs text-muted font-medium">{t.areas[areaKey] || complaint.area}</p>
          </div>
          <p className="text-sm text-muted line-clamp-2 mb-3 leading-relaxed">{complaint.description}</p>

          {complaint.adminReply && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-primary">Admin Reply</span>
              </div>
              <p className="text-xs text-muted line-clamp-2">{complaint.adminReply}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text">👍 {complaint.upvotes}</span>
              {complaint.status === 'resolved' && (
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Resolved</span>
              )}
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              {t.pugaarPetti.share}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
