'use client'

import { motion } from 'framer-motion'

interface Props {
  className?: string
  size?: number
  animate?: boolean
}

export default function BJPLotus({ className = '', size = 80, animate = true }: Props) {
  return (
    <motion.div
      className={className}
      animate={animate ? { y: [0, -4, 0] } : undefined}
      transition={animate ? { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } : undefined}
    >
      <img
        src="/BJP Logo.png"
        alt="BJP Logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain select-none"
        draggable={false}
      />
    </motion.div>
  )
}

/* Small inline version for tight spaces */
export function BJPLotusInline({ size = 20 }: { size?: number }) {
  return <BJPLotus size={size} animate={false} className="inline-block" />
}
