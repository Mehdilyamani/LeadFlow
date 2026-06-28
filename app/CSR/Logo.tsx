'use client'
// app/CSR/Logo.tsx — LeadFlow Immo brand mark (the L IS the mark).
// Drop-in. Usage:  <Logo />            (navy, for light backgrounds)
//                  <Logo variant="dark" />   (white, for dark backgrounds)
//                  <Logo markOnly size={28} />  (just the icon)

type Props = {
  variant?: 'light' | 'dark'
  markOnly?: boolean
  size?: number          // mark height in px (default 28)
  className?: string
}

export default function Logo({ variant = 'light', markOnly = false, size = 28, className = '' }: Props) {
  const markColor = variant === 'dark' ? '#ffffff' : '#0f172a'
  const subColor = variant === 'dark' ? 'rgba(255,255,255,0.45)' : '#94a3b8'

  const Mark = (
    <svg viewBox="0 0 52 52" width={size} height={size} fill="none" aria-hidden="true"
         className="shrink-0" style={{ marginBottom: -1 }}>
      <path d="M12,2 L21.5,2 L21.5,33 L38,33 L33,42 L12,42 Z" fill={markColor} />
      <polygon points="38,33 47,33 42,42 33,42" fill="#c9a84c" />
    </svg>
  )

  if (markOnly) return <span className={className}>{Mark}</span>

  return (
    <span className={`inline-flex items-end gap-px ${className}`}>
      {Mark}
      <span className="font-semibold text-lg tracking-tight" style={{ color: markColor, transform: 'translateY(-2px)' }}>
        eadFlow{' '}
        <span className="font-light text-base" style={{ color: subColor }}>Immo</span>
      </span>
    </span>
  )
}
