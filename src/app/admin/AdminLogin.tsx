'use client'

import { useState } from 'react'
import { adminLogin } from '@/lib/admin-auth'
import { useRouter } from 'next/navigation'
import BJPLotus from '@/components/BJPLotus'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await adminLogin(username, password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo + branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BJPLotus size={56} animate={false} />
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Admin Panel</h1>
          <p className="text-sm text-[#6B7280] mt-1">Pugaar Petti Management</p>
        </div>

        {/* Login card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-5 border border-red-100 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111827] text-white font-bold py-3 rounded-xl hover:bg-[#1F2937] transition-colors disabled:opacity-50 text-sm mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          <a href="/" className="hover:text-primary transition-colors">&larr; Back to website</a>
        </p>
      </div>
    </div>
  )
}
