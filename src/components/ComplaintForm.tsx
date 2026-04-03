'use client'

import { useI18n } from '@/i18n/context'
import { createComplaint } from '@/lib/actions'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const AREAS = ['mylapore', 'mandaveli', 'alwarpet', 'rajaAnnamalaiPuram', 'royapettah'] as const
const CATEGORIES = ['roads', 'water', 'sanitation', 'electricity', 'safety', 'other'] as const

const inputClasses = "w-full px-4 py-4 min-h-[48px] rounded-2xl border border-[#E8DDD2] bg-[#FFFAF5] focus:border-[#138808] focus:ring-2 focus:ring-[#138808]/10 outline-none transition-all text-text placeholder:text-muted/50"
const labelClasses = "block text-sm font-semibold text-text mb-2"

export default function ComplaintForm() {
  const { t } = useI18n()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [anonymous, setAnonymous] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB. Please choose a smaller photo.')
      e.target.value = ''
      return
    }
    setError('')
    setFileName(file.name)
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function clearPhoto() {
    setPreview(null)
    setFileName(null)
    setPhotoFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  async function handleSubmit(formData: FormData) {
    setError('')
    setLoading(true)
    try {
      // Ensure photo from camera or gallery is included
      if (photoFile) {
        formData.set('photo', photoFile)
      }
      formData.set('anonymous', anonymous ? 'true' : 'false')
      const result = await createComplaint(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch (err: unknown) {
      // Next.js redirect() throws a NEXT_REDIRECT error — don't catch it as a failure
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('NEXT_REDIRECT') || message.includes('NEXT_NOT_FOUND')) {
        return // redirect is happening, let it through
      }
      // Show descriptive error based on what went wrong
      if (message.toLowerCase().includes('body exceeded') || message.toLowerCase().includes('body size') || message.toLowerCase().includes('too large')) {
        setError('Image is too large. Please upload an image under 5 MB.')
      } else if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
      console.error('Complaint submission error:', message)
      setLoading(false)
    }
  }

  return (
    <div className="relative max-w-[600px] mx-auto rounded-3xl p-[2px] overflow-hidden">
      {/* Animated border — orange & green conic gradient spinning */}
      <div
        className="absolute inset-[-50%] animate-border-spin"
        style={{
          background: 'conic-gradient(from 0deg, #FF6B00, #138808, #FF6B00, #138808, #FF6B00)',
        }}
      />

    <motion.form
      ref={formRef}
      action={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-[#FFFAF5] rounded-[22px] shadow-lg shadow-black/[0.03] p-4 sm:p-7 md:p-10"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl mb-6 border border-red-100 flex items-center gap-2"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </motion.div>
      )}

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-text">{t.pugaarPetti.fieldName}</label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs text-muted">Stranger</span>
              <button
                type="button"
                onClick={() => setAnonymous(!anonymous)}
                className={`relative w-9 h-5 rounded-full transition-colors ${anonymous ? 'bg-[#138808]' : 'bg-[#D1D5DB]'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${anonymous ? 'translate-x-4' : ''}`} />
              </button>
            </label>
          </div>
          <input name="name" type="text" required className={inputClasses} />
          {anonymous && (
            <p className="text-xs text-[#138808] mt-1.5 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Your name will only be visible to the admin
            </p>
          )}
        </div>

        <div>
          <label className={labelClasses}>{t.pugaarPetti.fieldMobile}</label>
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-[#E8DDD2] bg-surface text-muted text-sm font-semibold">
              +91
            </span>
            <input name="mobile" type="tel" required pattern="[0-9]{10}" maxLength={10} className="flex-1 px-4 py-4 min-h-[48px] rounded-r-2xl border border-[#E8DDD2] bg-[#FFFAF5] focus:border-[#138808] focus:ring-2 focus:ring-[#138808]/10 outline-none transition-all text-text" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClasses}>{t.pugaarPetti.fieldArea}</label>
            <select name="area" required className={inputClasses + ' bg-white'}>
              <option value="">{t.pugaarPetti.filterArea}</option>
              {AREAS.map(a => (
                <option key={a} value={a}>{t.areas[a]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses}>{t.pugaarPetti.fieldCategory}</label>
            <select name="category" required className={inputClasses + ' bg-white'}>
              <option value="">{t.pugaarPetti.filterCategory}</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{t.categories[c]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className={labelClasses}>Location / Landmark</label>
          <input name="location" type="text" placeholder="e.g. Near Kapaleeshwarar Temple, Mylapore" className={inputClasses} />
        </div>

        <div>
          <label className={labelClasses}>{t.pugaarPetti.fieldIssueTitle}</label>
          <input name="title" type="text" required className={inputClasses} />
        </div>

        <div>
          <label className={labelClasses}>{t.pugaarPetti.fieldDescription}</label>
          <textarea name="description" required rows={4} className={inputClasses + ' resize-none'} />
        </div>

        <div>
          <label className={labelClasses}>{t.pugaarPetti.fieldPhoto}</label>
          {/* Hidden file input for form submission */}
          <input ref={fileInputRef} name="photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          {preview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#138808]/20">
              <img src={preview} alt="preview" className="w-full max-h-52 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 bg-[#138808] rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-white font-medium truncate">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="min-h-[36px] min-w-[36px] bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              {/* Upload from gallery */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-[#E8DDD2] rounded-2xl p-5 text-center hover:border-[#138808]/30 transition-colors cursor-pointer"
              >
                <svg className="w-7 h-7 text-muted/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                </svg>
                <p className="text-sm text-muted font-medium">Upload Photo</p>
              </button>

              {/* Camera capture — visible on all devices, only triggers camera on mobile */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-[#E8DDD2] rounded-2xl p-5 text-center hover:border-[#138808]/30 transition-colors cursor-pointer sm:hidden"
              >
                <svg className="w-7 h-7 text-muted/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                <p className="text-sm text-muted font-medium">Take Photo</p>
              </button>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
            </div>
          )}
          <p className="text-xs text-muted/60 mt-2">Max file size: 5 MB</p>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-gradient-to-r from-primary to-[#FF8533] text-white font-bold py-4 rounded-full hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </span>
          ) : t.pugaarPetti.submitButton}
        </motion.button>
      </div>
    </motion.form>
    </div>
  )
}
