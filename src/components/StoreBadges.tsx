import { SITE } from '@/lib/site'

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="currentColor">
      <path d="M16.37 12.6c-.02-2.28 1.86-3.38 1.95-3.43-1.06-1.55-2.71-1.76-3.3-1.78-1.4-.14-2.74.83-3.45.83-.71 0-1.81-.81-2.97-.79-1.53.02-2.94.89-3.73 2.26-1.59 2.76-.41 6.85 1.14 9.09.76 1.1 1.66 2.33 2.85 2.29 1.14-.05 1.57-.74 2.95-.74 1.38 0 1.77.74 2.97.71 1.23-.02 2-1.11 2.75-2.22.87-1.27 1.22-2.5 1.24-2.57-.03-.01-2.38-.91-2.4-3.65ZM14.1 5.9c.63-.76 1.05-1.82.94-2.88-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.75-.95 2.79 1 .08 2.03-.51 2.66-1.27Z" />
    </svg>
  )
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path d="M3.6 2.3 13.7 12 3.6 21.7c-.36-.2-.6-.6-.6-1.07V3.37c0-.47.24-.87.6-1.07Z" fill="oklch(0.78 0.14 220)" />
      <path d="m16.9 8.8-3.2 3.2-10.1-9.7c.06-.03.12-.06.19-.08.38-.12.8-.08 1.17.13L16.9 8.8Z" fill="oklch(0.78 0.17 150)" />
      <path d="M16.9 15.2 4.96 21.65c-.37.2-.79.25-1.17.13l-.19-.08L13.7 12l3.2 3.2Z" fill="oklch(0.68 0.2 28)" />
      <path d="m20.4 10.6-3.5-1.8-3.2 3.2 3.2 3.2 3.5-1.8c.86-.47.86-2.33 0-2.8Z" fill="oklch(0.85 0.16 85)" />
    </svg>
  )
}

export function AppStoreBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href={SITE.appStore}
      target="_blank"
      rel="noopener noreferrer"
      className={`store-badge ${className}`}
      aria-label="Download Stomplings: Make Room! on the App Store"
    >
      <AppleGlyph />
      <span className="flex flex-col leading-none">
        <span className="text-[11px] font-medium tracking-wide opacity-90">Download on the</span>
        <span className="mt-0.5 font-display text-[20px] font-semibold tracking-tight">App Store</span>
      </span>
    </a>
  )
}

export function GooglePlayBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href={SITE.googlePlay}
      target="_blank"
      rel="noopener noreferrer"
      className={`store-badge ${className}`}
      aria-label="Get Stomplings: Make Room! on Google Play"
    >
      <PlayGlyph />
      <span className="flex flex-col leading-none">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] opacity-90">Get it on</span>
        <span className="mt-0.5 font-display text-[20px] font-semibold tracking-tight">Google Play</span>
      </span>
    </a>
  )
}

export function StoreBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <AppStoreBadge />
      <GooglePlayBadge />
    </div>
  )
}
