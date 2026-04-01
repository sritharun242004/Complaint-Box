'use client'

import { useState } from 'react'
import { upvoteComplaint } from '@/lib/actions'

type Props = {
  complaintId: string
  onClose: () => void
  onSuccess: () => void
}

export default function OtpModal({ complaintId, onClose, onSuccess }: Props) {
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSupport() {
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number')
      return
    }
    setError('')
    setLoading(true)
    const result = await upvoteComplaint(complaintId, mobile)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-4 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-text mb-1">Support this complaint</h3>
        <p className="text-sm text-muted mb-6">Enter your mobile number to show your support</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-border bg-surface text-muted text-sm font-medium">
              +91
            </span>
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit mobile number"
              className="flex-1 px-4 py-3 rounded-r-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text"
              onKeyDown={e => e.key === 'Enter' && handleSupport()}
            />
          </div>
          <button
            onClick={handleSupport}
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-full hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Give Support'}
          </button>
        </div>
      </div>
    </div>
  )
}
