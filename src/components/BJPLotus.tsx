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
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ===== PETALS (Saffron #FF6B00 fill, dark #1A1A1A stroke) ===== */}

        {/* Center petal (tallest) */}
        <path
          d="M100 18 C92 40, 88 65, 92 85 C96 95, 100 98, 100 98 C100 98, 104 95, 108 85 C112 65, 108 40, 100 18Z"
          fill="#FF6B00"
          stroke="#1A1A1A"
          strokeWidth="2.5"
        />
        {/* Center petal inner line */}
        <path d="M100 30 C98 50, 97 70, 100 90" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />

        {/* Left inner petal */}
        <path
          d="M78 35 C68 55, 66 75, 75 92 C80 98, 88 100, 92 100 C88 88, 80 65, 78 35Z"
          fill="#FF6B00"
          stroke="#1A1A1A"
          strokeWidth="2.5"
        />
        <path d="M80 48 C76 65, 76 80, 84 95" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />

        {/* Right inner petal */}
        <path
          d="M122 35 C132 55, 134 75, 125 92 C120 98, 112 100, 108 100 C112 88, 120 65, 122 35Z"
          fill="#FF6B00"
          stroke="#1A1A1A"
          strokeWidth="2.5"
        />
        <path d="M120 48 C124 65, 124 80, 116 95" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />

        {/* Far left petal */}
        <path
          d="M55 55 C42 72, 42 88, 55 100 C62 105, 72 105, 80 102 C70 92, 58 75, 55 55Z"
          fill="#FF6B00"
          stroke="#1A1A1A"
          strokeWidth="2.5"
        />
        <path d="M58 66 C52 78, 54 90, 65 100" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />

        {/* Far right petal */}
        <path
          d="M145 55 C158 72, 158 88, 145 100 C138 105, 128 105, 120 102 C130 92, 142 75, 145 55Z"
          fill="#FF6B00"
          stroke="#1A1A1A"
          strokeWidth="2.5"
        />
        <path d="M142 66 C148 78, 146 90, 135 100" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />

        {/* Outermost left petal (small) */}
        <path
          d="M40 78 C30 90, 33 102, 48 108 C55 110, 62 108, 68 104 C58 98, 46 88, 40 78Z"
          fill="#FF6B00"
          stroke="#1A1A1A"
          strokeWidth="2.5"
        />

        {/* Outermost right petal (small) */}
        <path
          d="M160 78 C170 90, 167 102, 152 108 C145 110, 138 108, 132 104 C142 98, 154 88, 160 78Z"
          fill="#FF6B00"
          stroke="#1A1A1A"
          strokeWidth="2.5"
        />

        {/* ===== GREEN LEAVES AT BASE ===== */}

        {/* Left leaf */}
        <path
          d="M58 108 C48 115, 42 125, 48 135 C52 140, 62 142, 72 138 C78 135, 82 128, 85 120 C78 118, 68 112, 58 108Z"
          fill="#2E7D32"
          stroke="#1A1A1A"
          strokeWidth="2"
        />
        {/* Left leaf vein */}
        <path d="M55 115 C58 122, 64 130, 75 133" fill="none" stroke="#1A1A1A" strokeWidth="1" />

        {/* Right leaf */}
        <path
          d="M142 108 C152 115, 158 125, 152 135 C148 140, 138 142, 128 138 C122 135, 118 128, 115 120 C122 118, 132 112, 142 108Z"
          fill="#2E7D32"
          stroke="#1A1A1A"
          strokeWidth="2"
        />
        {/* Right leaf vein */}
        <path d="M145 115 C142 122, 136 130, 125 133" fill="none" stroke="#1A1A1A" strokeWidth="1" />

        {/* Center bottom leaf/base */}
        <path
          d="M82 110 C78 120, 78 132, 85 140 C92 146, 100 148, 100 148 C100 148, 108 146, 115 140 C122 132, 122 120, 118 110 C112 115, 105 118, 100 118 C95 118, 88 115, 82 110Z"
          fill="#2E7D32"
          stroke="#1A1A1A"
          strokeWidth="2"
        />
        {/* Center leaf vein */}
        <path d="M100 118 L100 145" fill="none" stroke="#1A1A1A" strokeWidth="1" />

        {/* ===== STEM ===== */}
        <path
          d="M100 148 L100 190"
          stroke="#2E7D32"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Small stem leaves */}
        <path
          d="M100 165 C92 158, 85 160, 84 168"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M100 175 C108 168, 115 170, 116 178"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  )
}

/* Small inline version for tight spaces */
export function BJPLotusInline({ size = 20 }: { size?: number }) {
  return <BJPLotus size={size} animate={false} className="inline-block" />
}
