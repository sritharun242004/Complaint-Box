'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminReply, updateComplaintStatus, deleteComplaint } from '@/lib/actions'
import { adminLogout } from '@/lib/admin-auth'

type Complaint = {
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
  voteCount: number
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  removed: 'bg-red-100 text-red-800',
}

const statusOptions = ['pending', 'reviewed', 'resolved', 'removed'] as const

export default function AdminDashboard({ complaints: initial }: { complaints: Complaint[] }) {
  const [complaints, setComplaints] = useState(initial)
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [reply, setReply] = useState('')
  const [replyImageFile, setReplyImageFile] = useState<File | null>(null)
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null)
  const [removeExistingImage, setRemoveExistingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [areaFilter, setAreaFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortVotes, setSortVotes] = useState<'none' | 'asc' | 'desc'>('none')
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const router = useRouter()

  const areas = [...new Set(complaints.map(c => c.area))].sort()
  const categories = [...new Set(complaints.map(c => c.category))].sort()

  function handleReplyImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB')
      return
    }
    setReplyImageFile(file)
    const url = URL.createObjectURL(file)
    setReplyImagePreview(url)
  }

  async function handleLogout() {
    await adminLogout()
    router.refresh()
  }

  async function handleDelete(id: string) {
    await deleteComplaint(id)
    setComplaints(prev => prev.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
    setDeleteConfirm(null)
  }

  const filtered = complaints
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => areaFilter === 'all' || c.area === areaFilter)
    .filter(c => categoryFilter === 'all' || c.category === categoryFilter)
    .filter(c => {
      if (!search) return true
      const q = search.toLowerCase()
      return c.title.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.mobile.includes(q) || c.area.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortVotes === 'desc') return b.upvotes - a.upvotes
      if (sortVotes === 'asc') return a.upvotes - b.upvotes
      return 0
    })

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    reviewed: complaints.filter(c => c.status === 'reviewed').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    removed: complaints.filter(c => c.status === 'removed').length,
  }

  async function handleReply() {
    if (!selected || !reply.trim()) return
    setLoading(true)
    const formData = new FormData()
    formData.set('complaintId', selected.id)
    formData.set('reply', reply)
    if (replyImageFile) {
      formData.set('photo', replyImageFile)
    }
    if (removeExistingImage && !replyImageFile) {
      formData.set('removeImage', 'true')
    }
    const result = await adminReply(formData)
    if (result.success) {
      const hasReplyImg = replyImageFile
        ? true
        : removeExistingImage
          ? false
          : selected.hasAdminReplyImage
      setComplaints(prev => prev.map(c =>
        c.id === selected.id ? { ...c, adminReply: reply, repliedAt: new Date().toISOString(), status: 'reviewed', hasAdminReplyImage: hasReplyImg } : c
      ))
      setSelected(prev => prev ? { ...prev, adminReply: reply, repliedAt: new Date().toISOString(), status: 'reviewed', hasAdminReplyImage: hasReplyImg } : null)
      setReplyImageFile(null)
      setReplyImagePreview(null)
      setRemoveExistingImage(false)
    } else if (result.error) {
      alert(result.error)
    }
    setLoading(false)
  }

  async function handleStatusChange(id: string, status: 'pending' | 'reviewed' | 'resolved' | 'removed') {
    await updateComplaintStatus(id, status)
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-[#111827] truncate">Pugaar Petti — Admin</h1>
            <p className="text-xs text-[#6B7280] hidden sm:block">Manage complaints, reply, and update status</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a href="/" className="min-h-[44px] flex items-center text-sm text-primary font-medium hover:underline">&larr; Site</a>
            <button
              onClick={handleLogout}
              className="min-h-[44px] text-sm text-[#6B7280] hover:text-red-600 font-medium transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 sm:py-8 md:px-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'Total', count: stats.total, bg: 'bg-white', text: 'text-[#111827]' },
            { label: 'Pending', count: stats.pending, bg: 'bg-yellow-50', text: 'text-yellow-700' },
            { label: 'Reviewed', count: stats.reviewed, bg: 'bg-blue-50', text: 'text-blue-700' },
            { label: 'Resolved', count: stats.resolved, bg: 'bg-green-50', text: 'text-green-700' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl border border-[#E5E7EB] p-3 sm:p-4`}>
              <p className={`text-xl sm:text-2xl font-bold ${s.text}`}>{s.count}</p>
              <p className="text-xs text-[#6B7280]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar: status filters */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {['all', ...statusOptions].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3.5 py-2.5 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                    filter === s ? 'bg-[#111827] text-white' : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, mobile, area, title..."
              className="w-full sm:w-72 px-3.5 py-2.5 min-h-[44px] rounded-lg border border-[#E5E7EB] text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white"
            />
          </div>

          {/* Area, Category, Vote sort filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={areaFilter}
              onChange={e => setAreaFilter(e.target.value)}
              className="px-3 py-2 min-h-[40px] rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#374151] bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
            >
              <option value="all">All Areas</option>
              {areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 min-h-[40px] rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#374151] bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>

            <button
              onClick={() => setSortVotes(prev => prev === 'none' ? 'desc' : prev === 'desc' ? 'asc' : 'none')}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-colors ${
                sortVotes !== 'none'
                  ? 'bg-[#111827] text-white'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {sortVotes === 'asc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                )}
              </svg>
              Votes {sortVotes === 'desc' ? '↓' : sortVotes === 'asc' ? '↑' : ''}
            </button>

            {(areaFilter !== 'all' || categoryFilter !== 'all' || sortVotes !== 'none') && (
              <button
                onClick={() => { setAreaFilter('all'); setCategoryFilter('all'); setSortVotes('none') }}
                className="px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* ====== TABLE ====== */}
          <div className={`${selected ? 'w-full md:w-3/5' : 'w-full'} transition-all`}>
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
              {/* Table header — hidden on mobile */}
              <div className="hidden md:grid grid-cols-[1fr_120px_100px_90px_70px_80px] gap-2 px-5 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                <span>Complaint</span>
                <span>Submitted By</span>
                <span>Area</span>
                <span>Category</span>
                <span className="text-center">Votes</span>
                <span className="text-center">Status</span>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-[#F3F4F6] max-h-[calc(100vh-280px)] overflow-y-auto">
                {filtered.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelected(c); setReply(c.adminReply || ''); setReplyImageFile(null); setReplyImagePreview(null); setRemoveExistingImage(false) }}
                    className={`w-full text-left min-h-[44px] px-4 py-3.5 sm:px-5 hover:bg-[#F9FAFB] transition-colors ${
                      selected?.id === c.id ? 'bg-primary/[0.03] border-l-2 border-l-primary' : ''
                    }`}
                  >
                    {/* Desktop: grid layout */}
                    <div className="hidden md:grid grid-cols-[1fr_120px_100px_90px_70px_80px] gap-2 items-center">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#111827] truncate">{c.title}</p>
                          {c.adminReply && (
                            <span className="shrink-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center" title="Replied">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{c.description}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#374151] truncate">{c.name}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{c.mobile}</p>
                      </div>
                      <span className="text-xs text-[#6B7280] truncate">{c.area}</span>
                      <span className="text-xs text-[#6B7280] capitalize truncate">{c.category}</span>
                      <span className="text-xs font-semibold text-[#374151] text-center">{c.upvotes}</span>
                      <div className="flex justify-center">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[c.status]}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>

                    {/* Mobile: card layout */}
                    <div className="md:hidden">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#111827] truncate">{c.title}</p>
                            {c.adminReply && (
                              <span className="shrink-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center" title="Replied">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#9CA3AF] line-clamp-1 mt-0.5">{c.description}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[c.status]}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#9CA3AF] mt-2">
                        <span className="font-medium text-[#374151]">{c.name}</span>
                        <span>{c.area}</span>
                        <span className="capitalize">{c.category}</span>
                        <span>{c.upvotes} votes</span>
                      </div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="py-16 text-center text-sm text-[#9CA3AF]">No complaints found</div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 sm:px-5 bg-[#F9FAFB] border-t border-[#E5E7EB] text-xs text-[#9CA3AF]">
                Showing {filtered.length} of {complaints.length} complaints
              </div>
            </div>
          </div>

          {/* ====== DETAIL PANEL ====== */}
          {selected && (
            <div className="fixed inset-0 z-50 bg-white overflow-y-auto md:static md:z-auto md:w-2/5 md:rounded-xl md:border md:border-[#E5E7EB] md:sticky md:top-6 md:max-h-[calc(100vh-120px)] md:overflow-y-auto">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-[#E5E7EB] sticky top-0 bg-white z-10">
                {/* Mobile back button */}
                <button
                  onClick={() => setSelected(null)}
                  className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-[#6B7280] hover:text-[#111827]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                </button>
                <h3 className="text-sm font-bold text-[#111827]">Complaint Details</h3>
                {/* Desktop close button */}
                <button onClick={() => setSelected(null)} className="hidden md:flex min-h-[44px] min-w-[44px] items-center justify-center text-[#9CA3AF] hover:text-[#374151]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Spacer for mobile to center title */}
                <div className="w-[44px] md:hidden" />
              </div>

              <div className="p-4 sm:p-5 space-y-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                {/* Status controls */}
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected.id, s)}
                      className={`text-[10px] font-bold px-3 py-2 min-h-[44px] rounded-full transition-colors ${
                        selected.status === s ? statusColors[s] : 'bg-[#F3F4F6] text-[#9CA3AF] hover:bg-[#E5E7EB]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-lg font-bold text-[#111827] mb-1">{selected.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                    <span className="capitalize">{selected.category}</span>
                    <span>&middot;</span>
                    <span>{selected.area}</span>
                    <span>&middot;</span>
                    <span>{new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>

                {/* Image */}
                {selected.hasImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`/api/image/${selected.id}`} alt="" className="w-full aspect-video object-cover rounded-xl" />
                )}

                {/* Description */}
                <p className="text-sm text-[#374151] leading-relaxed">{selected.description}</p>

                {/* Location */}
                {selected.location && (
                  <div className="flex items-start gap-2 text-sm text-[#6B7280] bg-[#F9FAFB] rounded-lg p-3">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {selected.location}
                  </div>
                )}

                {/* Contact card */}
                <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-2.5">
                  <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Contact</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Name</span>
                    <span className="font-medium text-[#111827]">{selected.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Mobile</span>
                    <a href={`tel:+91${selected.mobile}`} className="font-medium text-primary hover:underline">
                      +91 {selected.mobile}
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">WhatsApp</span>
                    <a
                      href={`https://wa.me/91${selected.mobile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-green-600 hover:underline"
                    >
                      Message
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Supports</span>
                    <span className="font-medium text-[#111827]">{selected.upvotes} people</span>
                  </div>
                </div>

                {/* Reply section */}
                <div className="border-t border-[#E5E7EB] pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-[#111827]">Admin Reply</h4>
                    {selected.repliedAt && (
                      <span className="text-[10px] text-[#9CA3AF]">
                        Last updated {new Date(selected.repliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type your reply... (visible publicly on the complaint)"
                    rows={3}
                    className="w-full px-3.5 py-3 min-h-[44px] rounded-xl border border-[#E5E7EB] focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm resize-none mb-3"
                  />

                  {/* Image attachment area */}
                  <div className="mb-3">
                    {/* New image preview (replacing or adding) */}
                    {replyImagePreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-[#E5E7EB]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={replyImagePreview} alt="Preview" className="w-full max-h-48 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
                          <span className="text-xs text-white font-medium">New image</span>
                          <button
                            onClick={() => { setReplyImageFile(null); setReplyImagePreview(null) }}
                            className="min-h-[36px] min-w-[36px] bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : selected.hasAdminReplyImage && !removeExistingImage ? (
                      /* Existing reply image with edit controls */
                      <div className="relative rounded-xl overflow-hidden border border-[#E5E7EB]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/api/reply-image/${selected.id}`} alt="Current reply image" className="w-full max-h-48 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
                          <span className="text-xs text-white font-medium">Current image</span>
                          <div className="flex gap-2">
                            <label className="min-h-[36px] min-w-[36px] bg-black/50 hover:bg-primary text-white rounded-full flex items-center justify-center transition-colors cursor-pointer">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                              </svg>
                              <input type="file" accept="image/*" onChange={handleReplyImageChange} className="hidden" />
                            </label>
                            <button
                              onClick={() => setRemoveExistingImage(true)}
                              className="min-h-[36px] min-w-[36px] bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* No image — show upload buttons */
                      <div>
                        {removeExistingImage && (
                          <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5 mb-2">
                            <span className="text-xs text-red-600 font-medium">Image will be removed on save</span>
                            <button
                              onClick={() => setRemoveExistingImage(false)}
                              className="text-xs text-red-500 hover:text-red-700 font-semibold underline"
                            >
                              Undo
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 min-h-[44px] px-3 py-2.5 rounded-xl border border-dashed border-[#E5E7EB] text-xs text-[#6B7280] cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/[0.02] transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                            </svg>
                            {removeExistingImage ? 'Replace with new photo' : 'Attach photo'}
                            <input type="file" accept="image/*" onChange={handleReplyImageChange} className="hidden" />
                          </label>
                          <label className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2.5 rounded-xl border border-dashed border-[#E5E7EB] text-xs text-[#6B7280] cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/[0.02] transition-colors md:hidden">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                            </svg>
                            Camera
                            <input type="file" accept="image/*" capture="environment" onChange={handleReplyImageChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleReply}
                    disabled={loading || !reply.trim()}
                    className="w-full bg-primary text-white font-bold py-3 min-h-[44px] rounded-xl text-sm hover:bg-primary-dark transition-colors disabled:opacity-40"
                  >
                    {loading ? 'Sending...' : selected.adminReply ? 'Update Reply' : 'Send Reply'}
                  </button>
                </div>

                {/* Delete section */}
                <div className="border-t border-[#E5E7EB] pt-5 mt-5">
                  {deleteConfirm === selected.id ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-red-800 mb-3">Delete this complaint permanently?</p>
                      <p className="text-xs text-red-600 mb-4">This will remove the complaint, all votes, and cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(selected.id)}
                          className="flex-1 bg-red-600 text-white font-bold py-2.5 min-h-[44px] rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 bg-white text-[#374151] font-bold py-2.5 min-h-[44px] rounded-lg text-sm border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(selected.id)}
                      className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 font-medium py-2.5 min-h-[44px] rounded-xl transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Remove this complaint
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
