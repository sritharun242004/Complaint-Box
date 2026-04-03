'use client'

import { useState, useEffect } from 'react'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import ShareSheet from '@/components/ShareSheet'
import { quickUpvote, quickDownvote } from '@/lib/actions'

type Props = {
  complaint: {
    id: string
    name: string
    mobile: string
    area: string
    title: string
    description: string
    hasImage: boolean
    hasAdminReplyImage: boolean
    category: string
    location: string | null
    upvotes: number
    status: string
    adminReply: string | null
    repliedAt: string | null
    createdAt: string
    updatedAt: string
  }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
}

export default function ComplaintDetail({ complaint }: Props) {
  const { t } = useI18n()
  const [showShare, setShowShare] = useState(false)
  const [upvotes, setUpvotes] = useState(complaint.upvotes)
  const [voted, setVoted] = useState(false)
  const [upvoting, setUpvoting] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(`voted_${complaint.id}`)) setVoted(true)
  }, [complaint.id])

  async function handleUpvote() {
    if (upvoting) return
    setUpvoting(true)
    const key = `voted_${complaint.id}`
    if (voted) {
      setUpvotes(prev => prev - 1)
      setVoted(false)
      localStorage.removeItem(key)
      await quickDownvote(complaint.id)
    } else {
      setUpvotes(prev => prev + 1)
      setVoted(true)
      localStorage.setItem(key, '1')
      await quickUpvote(complaint.id)
    }
    setUpvoting(false)
  }

  const areaKey = complaint.area as keyof typeof t.areas
  const categoryKey = complaint.category as keyof typeof t.categories
  const date = new Date(complaint.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 md:px-10 md:py-12">
        {/* Back button */}
        <Link
          href="/pugaar-petti"
          className="inline-flex items-center gap-2 text-muted hover:text-text transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {t.complaint.back}
        </Link>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          {/* Image served via API route */}
          {complaint.hasImage && (
            <div className="relative aspect-video w-full">
              <img
                src={`/api/image/${complaint.id}`}
                alt={complaint.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4 sm:p-6 md:p-8">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                {t.categories[categoryKey] || complaint.category}
              </span>
              <span className="bg-surface text-muted text-xs font-medium px-3 py-1 rounded-full">
                {t.areas[areaKey] || complaint.area}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[complaint.status] || statusColors.pending}`}>
                {t.complaint.status}: {complaint.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading mb-2 text-2xl tracking-tight text-text md:text-3xl">
              {complaint.title}
            </h1>

            {/* Date */}
            <p className="text-sm text-muted mb-6">
              {t.complaint.postedOn} {date}
            </p>

            {/* Location */}
            {complaint.location && (
              <div className="flex items-center gap-2 text-sm text-muted mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {complaint.location}
              </div>
            )}

            {/* Description */}
            <p className="text-text leading-relaxed whitespace-pre-wrap mb-6">
              {complaint.description}
            </p>

            {/* Admin Reply */}
            {complaint.adminReply && (
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-primary">{t.complaint.adminReplyHeading}</span>
                </div>
                <p className="text-sm text-text leading-relaxed">{complaint.adminReply}</p>
                {complaint.hasAdminReplyImage && (
                  <img src={`/api/reply-image/${complaint.id}`} alt="Resolution proof" className="mt-3 w-full rounded-xl object-cover max-h-64" />
                )}
                {complaint.repliedAt && (
                  <p className="text-xs text-muted mt-3">
                    Responded on {new Date(complaint.repliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
              <button
                onClick={handleUpvote}
                disabled={upvoting}
                className={`flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-full transition-all ${
                  voted
                    ? 'bg-primary/20 text-primary hover:bg-primary/30 active:scale-[0.98]'
                    : 'bg-primary text-white hover:bg-primary-dark hover:scale-[1.02]'
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-all ${voted ? 'fill-primary' : 'fill-none'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={voted ? 0 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                <span>{upvotes} {t.complaint.supports}</span>
              </button>
              <button
                onClick={() => setShowShare(true)}
                className="flex items-center justify-center gap-2 border-2 border-border text-text font-bold px-6 py-3 rounded-full hover:bg-surface transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                {t.complaint.shareTitle}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Sheet */}
      {showShare && (
        <ShareSheet
          complaintId={complaint.id}
          title={complaint.title}
          description={complaint.description}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
