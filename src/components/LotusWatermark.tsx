/**
 * Large faint BJP lotus behind content — same asset; sized to stay fully visible (object-contain, no clipping).
 */
export default function LotusWatermark({
  variant = 'on-light',
  className = '',
}: {
  variant?: 'on-light' | 'on-dark'
  className?: string
}) {
  const isDark = variant === 'on-dark'
  const opacity = isDark
    ? 'opacity-[0.11] sm:opacity-[0.13] md:opacity-[0.15]'
    : 'opacity-[0.04] sm:opacity-[0.055]'

  /* Footer: fill the block’s height/width so the whole logo fits (no cropped petals). Hero: cap by viewport. */
  const imgClass = isDark
    ? `max-h-full max-w-full object-contain object-center p-6 sm:p-8 md:p-10 ${opacity}`
    : `max-h-[min(42vh,24rem)] w-[min(92vw,28rem)] sm:max-h-[min(48vh,30rem)] sm:w-[min(88vw,32rem)] object-contain ${opacity}`

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex min-h-0 items-center justify-center ${className}`}
      aria-hidden
    >
      <img
        src="/BJP Logo.png"
        alt=""
        width={820}
        height={820}
        draggable={false}
        className={`select-none ${imgClass}`}
      />
    </div>
  )
}
