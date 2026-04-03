'use client'

import { useI18n } from '@/i18n/context'
import { createComplaint } from '@/lib/actions'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const AREAS = ['mylapore', 'mandaveli', 'alwarpet', 'rajaAnnamalaiPuram', 'royapettah'] as const
const CATEGORIES = ['roads', 'water', 'sanitation', 'electricity', 'safety', 'other'] as const

const inputClasses = "w-full px-4 py-3.5 rounded-2xl border border-[#E8DDD2] bg-[#FFFAF5] focus:border-[#138808] focus:ring-2 focus:ring-[#138808]/10 outline-none transition-all text-text placeholder:text-muted/50"
const labelClasses = "block text-sm font-semibold text-text mb-2"

export default function ComplaintForm() {
  const { t } = useI18n()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(formData: FormData) {
    setError('')
    setLoading(true)
    try {
      const result = await createComplaint(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
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
          <label className={labelClasses}>{t.pugaarPetti.fieldName}</label>
          <input name="name" type="text" required className={inputClasses} />
        </div>

        <div>
          <label className={labelClasses}>{t.pugaarPetti.fieldMobile}</label>
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-[#E8DDD2] bg-surface text-muted text-sm font-semibold">
              +91
            </span>
            <input name="mobile" type="tel" required pattern="[0-9]{10}" maxLength={10} className="flex-1 px-4 py-3.5 rounded-r-2xl border border-[#E8DDD2] bg-[#FFFAF5] focus:border-[#138808] focus:ring-2 focus:ring-[#138808]/10 outline-none transition-all text-text" />
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
          <div className="border-2 border-dashed border-[#E8DDD2] rounded-2xl p-6 text-center hover:border-[#138808]/30 transition-colors cursor-pointer relative overflow-hidden">
            <input name="photo" type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            {preview ? (
              <div className="flex flex-col items-center gap-2">
                <img src={preview} alt="preview" className="max-h-40 rounded-xl object-contain" />
                <p className="text-xs text-muted truncate max-w-full">{fileName}</p>
              </div>
            ) : (
              <>
                <svg className="w-8 h-8 text-muted/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                </svg>
                <p className="text-sm text-muted">Click or drag to upload</p>
              </>
            )}
          </div>
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
