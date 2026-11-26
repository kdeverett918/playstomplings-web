'use client'

import { QrCode, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SITE } from '@/lib/site'
import { PhoneFrame } from './PhoneFrame'
import { QRCode } from './QRCode'
import { StoreBadges } from './StoreBadges'

const SCREENS = [
  { id: 'map', label: 'World Map', src: '/img/shots/world-map.webp', alt: 'Curved world map with level nodes winding through Stompling worlds' },
  { id: 'mushroom', label: 'Mushroom Hollow', src: '/img/shots/lv102-mushroom.webp', alt: 'Level 102 in Mushroom Hollow: a 9×9 board with golden target rings' },
  { id: 'crystal', label: 'Crystal Caverns', src: '/img/shots/lv132-crystal.webp', alt: 'Level 132 in Crystal Caverns with gem cells on the board' },
  { id: 'village', label: 'Stompling Village', src: '/img/shots/village.webp', alt: 'Stompling Village with cozy storybook buildings to upgrade' },
  { id: 'album', label: 'Card Album', src: '/img/shots/album-48.webp', alt: 'Stomp Card Album showing 48 collectible cards' },
] as const

export function Hero() {
  const [idx, setIdx] = useState(0)
  const [auto, setAuto] = useState(true)
  const [qrOpen, setQrOpen] = useState(false)

  useEffect(() => {
    if (!auto) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setIdx((i) => (i + 1) % SCREENS.length), 4200)
    return () => window.clearInterval(t)
  }, [auto])

  useEffect(() => {
    if (!qrOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setQrOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [qrOpen])

  const screen = SCREENS[idx]

  return (
    <section id="top" aria-labelledby="hero-title" className="grain relative overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-40">
      {/* sunlit blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-gold/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] rounded-full bg-emerald/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.08fr_1fr] lg:gap-8">
        {/* Left editorial stack */}
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3.5 py-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-ink-soft">
            <span className="h-2 w-2 rounded-full bg-emerald" aria-hidden="true" />
            A block puzzle by {SITE.studio}
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[48px] font-bold leading-[0.96] tracking-[-0.02em] text-ink sm:text-[64px] lg:text-[74px]"
          >
            Clear the board.{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Make room</span>
              <span aria-hidden="true" className="absolute inset-x-[-4px] bottom-[0.08em] z-0 h-[0.32em] -rotate-1 rounded-full bg-gold/80" />
            </span>{' '}
            for the <span className="text-coral-ink">Stomp.</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-[18px] leading-relaxed text-ink-soft sm:text-[19px]">
            Clear lines, cover the golden target rings, and make room on the 9×9 board. Then watch a giant blocky Stompling drop
            in and <strong className="font-bold text-ink">STOMP</strong> every remaining block away.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <StoreBadges />
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setQrOpen((o) => !o)}
                aria-expanded={qrOpen}
                aria-controls="hero-qr"
                className="pill inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-ink/25 px-4 py-3 text-[15px] font-semibold text-ink hover:border-ink/50 hover:bg-paper"
              >
                <QrCode size={20} aria-hidden="true" /> Scan QR to Play on Phone
              </button>
              {qrOpen && (
                <div
                  id="hero-qr"
                  role="dialog"
                  aria-label="QR code to download Stomplings"
                  className="pop-in absolute left-0 top-[calc(100%+12px)] z-30 w-64 rounded-3xl border border-ink/10 bg-paper p-4 shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-lg font-semibold leading-tight text-ink">Point your phone camera here</p>
                    <button
                      type="button"
                      onClick={() => setQrOpen(false)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-cream-deep"
                      aria-label="Close QR code"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <QRCode value={SITE.downloadUrl} label="QR code linking to playstomplings.com download section" className="mt-3 w-full" />
                  <p className="mt-2 text-center font-mono text-[12px] text-ink-soft">playstomplings.com/#download</p>
                </div>
              )}
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-4">
            {[
              ['20', 'Worlds'],
              ['200', 'Levels'],
              ['48', 'Cards'],
              ['Free', 'iOS & Android'],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-[32px] font-bold leading-none text-ink">{v}</dd>
                <dd className="mt-1 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-soft">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right stage: 3-phone composition */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative h-[560px] sm:h-[640px]">
            <div aria-hidden="true" className="absolute inset-x-6 bottom-6 top-14 rounded-[3rem] bg-gradient-to-br from-sky/60 via-emerald/25 to-gold/40" />

            <div className="float-slow absolute left-0 top-20 z-0 w-[42%] opacity-95 [--r:-9deg] sm:left-[-2%]">
              <PhoneFrame src="/img/shots/atlas-20.webp" alt="" priority />
            </div>
            <div className="float-slow absolute right-0 top-24 z-0 w-[42%] opacity-95 [--r:9deg] [animation-delay:-3s] sm:right-[-2%]">
              <PhoneFrame src="/img/shots/plinko.webp" alt="" priority />
            </div>
            <div className="absolute left-1/2 top-0 z-10 w-[54%] -translate-x-1/2">
              <PhoneFrame src={screen.src} alt={screen.alt} swapKey={screen.id} priority />
            </div>

            <div className="float absolute left-[2%] top-[62%] z-20 rotate-[-6deg] [--r:-6deg] rounded-2xl bg-gold px-4 py-2.5 shadow-[0_6px_0_var(--color-gold-lip),0_16px_30px_-12px_oklch(0.4_0.1_70/0.6)]">
              <span className="block font-display text-[30px] font-bold leading-none text-ink">20</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink">Worlds</span>
            </div>
            <div className="float absolute right-[1%] top-[8%] z-20 [--r:7deg] [animation-delay:-2s] rounded-2xl bg-ink px-4 py-2.5 shadow-[0_6px_0_oklch(0.16_0.035_262),0_16px_30px_-12px_oklch(0.2_0.05_262/0.6)]">
              <span className="block font-display text-[30px] font-bold leading-none text-cream">200</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-gold">Levels</span>
            </div>
          </div>

          <div role="tablist" aria-label="Preview game screens" className="relative z-20 -mt-2 flex flex-wrap justify-center gap-2">
            {SCREENS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === idx}
                onClick={() => {
                  setIdx(i)
                  setAuto(false)
                }}
                className={`pill rounded-full px-3.5 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.06em] ${
                  i === idx
                    ? 'bg-ink text-cream shadow-[0_4px_0_oklch(0.16_0.035_262)]'
                    : 'bg-paper text-ink-soft ring-1 ring-ink/10 hover:text-ink'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
