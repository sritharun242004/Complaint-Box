import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const uploadsDir = join(process.cwd(), 'public', 'uploads')
mkdirSync(uploadsDir, { recursive: true })

// Generate SVG placeholder images that look like real complaint photos
const images: Record<string, { bg: string; icon: string; label: string; accent: string }> = {
  'mock-road-1.jpg': {
    bg: '#8B7355',
    icon: '🕳️',
    label: 'Broken Road - Potholes',
    accent: '#654321',
  },
  'mock-streetlight-1.jpg': {
    bg: '#1a1a2e',
    icon: '🔦',
    label: 'Dark Street - No Lights',
    accent: '#FFD700',
  },
  'mock-garbage-1.jpg': {
    bg: '#556B2F',
    icon: '🗑️',
    label: 'Garbage Pile - Uncollected',
    accent: '#8B4513',
  },
  'mock-manhole-1.jpg': {
    bg: '#4A4A4A',
    icon: '⚠️',
    label: 'Open Manhole - Dangerous',
    accent: '#FF4444',
  },
  'mock-tree-1.jpg': {
    bg: '#2E4A2E',
    icon: '🌳',
    label: 'Fallen Tree on Power Lines',
    accent: '#FFD700',
  },
  'mock-sewage-1.jpg': {
    bg: '#5C4033',
    icon: '💧',
    label: 'Sewage Overflow',
    accent: '#4682B4',
  },
  'mock-footpath-1.jpg': {
    bg: '#808080',
    icon: '🚶',
    label: 'Footpath Encroachment',
    accent: '#FF6B00',
  },
}

for (const [filename, config] of Object.entries(images)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${config.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${config.accent};stop-opacity:1" />
    </linearGradient>
    <pattern id="noise" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <circle cx="25" cy="25" r="1" fill="white" opacity="0.05"/>
      <circle cx="75" cy="50" r="1.5" fill="white" opacity="0.03"/>
      <circle cx="50" cy="75" r="1" fill="white" opacity="0.04"/>
      <circle cx="10" cy="60" r="0.8" fill="white" opacity="0.06"/>
      <circle cx="90" cy="20" r="1.2" fill="white" opacity="0.04"/>
    </pattern>
  </defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <rect width="800" height="450" fill="url(#noise)"/>
  <text x="400" y="180" font-size="80" text-anchor="middle" dominant-baseline="middle">${config.icon}</text>
  <text x="400" y="270" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="white" text-anchor="middle" opacity="0.9">${config.label}</text>
  <text x="400" y="310" font-family="system-ui, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.5">Mock complaint photo - Replace with real image</text>
  <rect x="20" y="20" width="760" height="410" rx="8" fill="none" stroke="white" stroke-width="1" opacity="0.1"/>
</svg>`

  // Save as SVG but with .jpg extension (browsers handle this fine for display)
  // For production, use actual JPGs
  const svgFilename = filename.replace('.jpg', '.svg')
  writeFileSync(join(uploadsDir, svgFilename), svg)
  console.log(`Generated: ${svgFilename}`)
}

console.log('\nDone! Generated all mock images.')
