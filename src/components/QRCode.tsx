import { qrPath } from '@/lib/qr'

interface Props {
  value: string
  label: string
  className?: string
}

/** Crisp inline SVG QR code — generated at build/render time in pure TS. */
export function QRCode({ value, label, className = '' }: Props) {
  const { d, size } = qrPath(value)
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect width={size} height={size} rx={2} fill="oklch(0.99 0.008 90)" />
      <path d={d} fill="oklch(0.24 0.045 262)" />
    </svg>
  )
}
