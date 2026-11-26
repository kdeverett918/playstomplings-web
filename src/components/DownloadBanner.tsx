'use client'

import { useState, type CSSProperties } from 'react'
import { SITE } from '@/lib/site'
import { QRCode } from './QRCode'
import { StoreBadges } from './StoreBadges'

const QR_OPTIONS = [
  { id: 'site', label: 'Both', value: SITE.downloadUrl, caption: 'playstomplings.com/#download' },
  { id: 'ios', label: 'iPhone', value: SITE.appStore, caption: 'App Store' },
  { id: 'android', label: 'Android', value: SITE.googlePlay, caption: 'Google Play' },
] as const

export default function DownloadBanner() {
  const [qr, setQr] = useState<(typeof QR_OPTIONS)[number]['id']>('site')
  const opt = QR_OPTIONS.find((o) => o.id === qr) ?? QR_OPTIONS[0]

  return (
    <section id="download" aria-labelledby="dl-title" className="relative px-4 py-24 sm:px-8 lg:py-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.75rem] bg-gold p-7 shadow-[0_10px_0_var(--color-gold-lip),0_50px_90px_-40px_oklch(0.5_0.12_70/0.7)] sm:p-12 lg:p-16">
        {/* toy-box confetti blocks kept strictly clear of QR & badges */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[
            ['5%', '10%', 'bg-emerald', '-12deg', 'h-10 w-10'],
            ['70%', '8%', 'bg-coral', '14deg', 'h-11 w-11'],
            ['3%', '80%', 'bg-cream', '9deg', 'h-11 w-11'],
          ].map(([l, t, bg, r, s], i) => (
            <span
              key={i}
              className={`float absolute rounded-[28%] opacity-80 shadow-[inset_0_-5px_0_oklch(0.2_0.05_262/0.25)] ${bg} ${s}`}
              style={{ left: l, top: t, '--r': r, animationDelay: `${-i * 1.3}s` } as CSSProperties}
            />
          ))}
        </div>

        <div className="relative grid gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/app-icon.png"
            alt="Stomplings: Make Room! app icon"
            width={144}
            height={144}
            className="h-28 w-28 rotate-[-6deg] rounded-[28%] shadow-[0_8px_0_var(--color-gold-lip),0_24px_40px_-16px_oklch(0.3_0.08_60/0.7)] sm:h-36 sm:w-36"
            loading="lazy"
          />

          <div>
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-ink">Free to play · iOS &amp; Android</p>
            <h2 id="dl-title" className="mt-2 font-display text-[44px] font-bold leading-[0.96] tracking-[-0.015em] text-ink sm:text-[64px]">
              Make room for the Stomp.
            </h2>
            <p className="mt-4 max-w-lg text-[17px] font-medium leading-relaxed text-ink">
              20 worlds, 200 levels, a village to build and 48 cards to collect. Your first Stompling is waiting.
            </p>
            <StoreBadges className="mt-7" />
          </div>

          <div className="mx-auto w-full max-w-[240px] rounded-[2rem] bg-paper p-4 shadow-[0_8px_0_var(--color-gold-lip)] lg:mx-0">
            <div role="group" aria-label="Choose QR code destination" className="grid grid-cols-3 gap-1 rounded-full bg-cream-deep p-1">
              {QR_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={qr === o.id}
                  onClick={() => setQr(o.id)}
                  className={`whitespace-nowrap rounded-full px-2 py-1.5 text-[12px] font-bold ${qr === o.id ? 'bg-ink text-cream' : 'text-ink hover:bg-paper'}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <QRCode key={opt.id} value={opt.value} label={`QR code linking to ${opt.caption}`} className="pop-in mt-3 w-full" />
            <p className="mt-1 text-center font-display text-[16px] font-semibold text-ink">Scan to play</p>
            <p className="text-center font-mono text-[11px] text-ink-soft">{opt.caption}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
