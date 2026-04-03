'use client'

import { useI18n } from '@/i18n/context'
import { useState, useEffect } from 'react'
import { getComplaints } from '@/lib/actions'
import ComplaintCard from './ComplaintCard'

type Complaint = {
  id: string
  name: string
  area: string
  title: string
  description: string
  hasImage: boolean
  hasAdminReplyImage: boolean
  category: string
  upvotes: number
  status: string
  adminReply: string | null
  createdAt: Date
}

const AREAS = ['mylapore', 'mandaveli', 'alwarpet', 'rajaAnnamalaiPuram', 'royapettah'] as const
const CATEGORIES = ['roads', 'water', 'sanitation', 'electricity', 'safety', 'other'] as const

export default function ComplaintFeed() {
  const { t } = useI18n()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [area, setArea] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<'recent' | 'popular'>('recent')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getComplaints({
          area: area || undefined,
          category: category || undefined,
          sort,
        })
        setComplaints(data)
      } catch {
        // silently fail
      }
      setLoading(false)
    }
    load()
  }, [area, category, sort])

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-[#FFFAF5]/95 backdrop-blur-sm border-b border-[#E8DDD2] py-4">
        <div className="layout-container flex flex-wrap items-center gap-4">
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="px-4 py-2 rounded-full border border-[#E8DDD2] text-sm bg-[#FFFAF5] text-text focus:border-[#138808] outline-none"
          >
            <option value="">{t.pugaarPetti.filterArea}</option>
            {AREAS.map(a => (
              <option key={a} value={a}>{t.areas[a]}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-full border border-[#E8DDD2] text-sm bg-[#FFFAF5] text-text focus:border-[#138808] outline-none"
          >
            <option value="">{t.pugaarPetti.filterCategory}</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{t.categories[c]}</option>
            ))}
          </select>

          <div className="flex rounded-full border border-[#E8DDD2] overflow-hidden ml-auto">
            <button
              onClick={() => setSort('recent')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                sort === 'recent' ? 'bg-[#138808] text-white' : 'bg-[#FFFAF5] text-muted hover:bg-surface'
              }`}
            >
              {t.pugaarPetti.sortRecent}
            </button>
            <button
              onClick={() => setSort('popular')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                sort === 'popular' ? 'bg-[#138808] text-white' : 'bg-[#FFFAF5] text-muted hover:bg-surface'
              }`}
            >
              {t.pugaarPetti.sortPopular}
            </button>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="layout-container py-8 md:py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">No complaints found. Be the first to raise one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {complaints.map(c => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
