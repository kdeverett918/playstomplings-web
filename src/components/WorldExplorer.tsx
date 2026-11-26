'use client'

import { useState } from 'react'
import { MECHANIC_ICON, WORLDS, levelRange } from '@/lib/site'
import { PhoneFrame } from './PhoneFrame'

const FEATURED = WORLDS.filter((w) => w.bg)

export default function WorldExplorer() {
  const [active, setActive] = useState(FEATURED[0].n)
  const world = FEATURED.find((w) => w.n === active) ?? FEATURED[0]

  return (
    <section
      id="worlds"
      aria-labelledby="worlds-title"
      className="relative isolate overflow-hidden bg-stage py-24 text-cream lg:py-32"
    >
      {/* Crossfading painted backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={world.bg}
          src={world.bg}
          alt=""
          className="bg-crossfade absolute inset-0 h-full w-full object-cover opacity-60"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,oklch(0.21_0.04_268/0.55)_45%,oklch(0.21_0.04_268/0.97)_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-stage via-stage/85 to-stage/10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-stage to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-gold">20 worlds · 200 levels</p>
            <h2 id="worlds-title" className="mt-3 max-w-xl font-display text-[44px] font-bold leading-[0.98] tracking-[-0.015em] sm:text-[60px]">
              A storybook map, world after world.
            </h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-cream/90">
              Every world is hand-painted with its own boards and 10 authored levels. Explore the ten worlds of the second half of
              the map:
            </p>

            <div role="tablist" aria-label="Featured worlds" className="mt-8 flex flex-wrap gap-2">
              {FEATURED.map((w) => {
                const on = w.n === active
                return (
                  <button
                    key={w.n}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="world-panel"
                    onClick={() => setActive(w.n)}
                    className={`pill inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-semibold ${
                      on ? 'bg-cream text-ink shadow-[0_4px_0_oklch(0.75_0.03_85)]' : 'bg-cream/10 text-cream ring-1 ring-cream/20 hover:bg-cream/20'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: w.accent }} aria-hidden="true" />
                    {w.name}
                  </button>
                )
              })}
            </div>

            <div
              id="world-panel"
              role="tabpanel"
              aria-live="polite"
              key={world.n}
              className="fade-swap mt-8 max-w-xl rounded-[1.75rem] bg-stage-raised/80 p-6 ring-1 ring-cream/10 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full px-3 py-1 font-mono text-[12px] font-bold text-ink" style={{ background: world.accent }}>
                  WORLD {world.n}
                </span>
                <span className="rounded-full bg-cream/10 px-3 py-1 font-mono text-[12px] font-bold text-cream">{levelRange(world.n)}</span>
              </div>
              <h3 className="mt-4 font-display text-[34px] font-bold leading-none">{world.name}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-cream/90">{world.blurb}</p>
              {world.mechanic && (
                <div className="mt-5 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={MECHANIC_ICON[world.mechanic]} alt="" className="h-12 w-12 object-contain" loading="lazy" />
                  <div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-gold">Spotlight twist</p>
                    <p className="font-display text-[19px] font-semibold">{world.mechanic}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[300px]">
            {world.shot ? (
              <>
                <PhoneFrame src={world.shot} alt={`${world.name} gameplay — ${world.shotLabel}`} swapKey={world.shot} className="rotate-[3deg]" />
                <p className="mt-5 text-center font-mono text-[12px] text-cream/85">{world.shotLabel}</p>
              </>
            ) : (
              <div key={world.n} className="fade-swap relative overflow-hidden rounded-[2.4rem] ring-4 ring-cream/15 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={world.bg} alt={`Painted backdrop of ${world.name}`} className="aspect-[9/16] w-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stage/95 to-transparent p-5 pt-16">
                  <p className="font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-gold">Painted world backdrop</p>
                  <p className="font-display text-[24px] font-bold">{world.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compact 20-world index */}
        <div className="mt-20">
          <div className="flex items-end justify-between gap-4 border-b border-cream/15 pb-4">
            <h3 className="font-display text-[26px] font-bold">The full atlas</h3>
            <p className="font-mono text-[12px] font-bold text-cream/85">LV 1–200</p>
          </div>
          <ol className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4 lg:grid-cols-5">
            {WORLDS.map((w) => {
              const featured = Boolean(w.bg)
              return (
                <li key={w.n}>
                  {featured ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActive(w.n)
                        document.getElementById('worlds-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className={`group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-cream/10 ${
                        w.n === active ? 'bg-cream/10' : ''
                      }`}
                    >
                      <AtlasRow n={w.n} name={w.name} accent={w.accent} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 px-2 py-2.5">
                      <AtlasRow n={w.n} name={w.name} accent={w.accent} />
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

function AtlasRow({ n, name, accent }: { n: number; name: string; accent: string }) {
  return (
    <>
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-mono text-[13px] font-bold text-ink"
        style={{ background: accent }}
      >
        {String(n).padStart(2, '0')}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[14px] font-semibold text-cream">{name}</span>
        <span className="block font-mono text-[11px] text-cream/80">{levelRange(n)}</span>
      </span>
    </>
  )
}
