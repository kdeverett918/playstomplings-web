'use client'

import { Menu, X } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { SITE } from '@/lib/site'

const LINKS = [
  { href: '/#play', label: 'Play Demo' },
  { href: '/#worlds', label: '20 Worlds' },
  { href: '/#mechanics', label: 'Mechanics' },
  { href: '/#features', label: 'Features' },
]

/** Smart store chooser: iOS → App Store, Android → Google Play, desktop → download band. */
export function useStoreChooser() {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const iOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && typeof document !== 'undefined' && 'ontouchend' in document)
    if (iOS) {
      e.preventDefault()
      window.location.href = SITE.appStore
    } else if (/Android/i.test(ua)) {
      e.preventDefault()
      window.location.href = SITE.googlePlay
    }
  }
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const choose = useStoreChooser()

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-6">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-ink/10 bg-paper/95 py-2 pl-2.5 pr-2 shadow-[0_10px_40px_-16px_oklch(0.24_0.045_262/0.35)] backdrop-blur-md sm:gap-3"
      >
        <a href="/#top" className="flex shrink-0 items-center gap-2 rounded-full pr-1 sm:gap-2.5 sm:pr-2" aria-label="Stomplings home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/app-icon.png" alt="" width={40} height={40} className="h-9 w-9 rounded-[11px] shadow-sm sm:h-10 sm:w-10 sm:rounded-[12px]" />
          <span className="font-display text-[19px] font-bold tracking-tight text-ink sm:text-[22px]">Stomplings</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="pill whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-semibold text-ink-soft hover:bg-cream-deep hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href="/#download"
            onClick={choose}
            className="btn-tactile whitespace-nowrap px-3.5 py-2 text-[14px] sm:px-6 sm:py-2.5 sm:text-[16px]"
          >
            Get the Game
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-cream-deep sm:h-11 sm:w-11 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="pop-in mx-auto mt-2 max-w-6xl rounded-3xl border border-ink/10 bg-paper p-3 shadow-xl lg:hidden"
        >
          <ul className="grid gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 font-display text-lg font-semibold text-ink hover:bg-cream-deep"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
