'use client'

import { useState } from 'react'
import { PhoneFrame } from './PhoneFrame'

/* eslint-disable @next/next/no-img-element */

interface Art {
  src: string
  alt: string
  caption: string
}
interface Feature {
  id: string
  tab: string
  kicker: string
  title: string
  body: string
  facts: string[]
  phone: { src: string; alt: string }
  art: Art[]
  tint: string
}

const FEATURES: Feature[] = [
  {
    id: 'village',
    tab: 'Stompling Village',
    kicker: '8 areas · 48 builds',
    title: 'Build a cozy storybook village.',
    body: 'Spend what you earn on puzzles to restore 8 storybook areas, one visible upgrade at a time — 48 builds in all.',
    facts: ['8 cozy areas', '48 visible upgrades', 'Mushroom, crystal, pirate & sky districts'],
    phone: { src: '/img/shots/village.webp', alt: 'Stompling Village screen with buildings to upgrade' },
    art: [
      { src: '/img/icons/village_area_5_mushroom.webp', alt: 'Mushroom village area art', caption: 'Area 5 · Mushroom' },
      { src: '/img/icons/village_area_6_crystal.webp', alt: 'Crystal village area art', caption: 'Area 6 · Crystal' },
      { src: '/img/icons/village_area_7_pirate.webp', alt: 'Pirate village area art', caption: 'Area 7 · Pirate' },
      { src: '/img/icons/village_area_8_sky.webp', alt: 'Sky village area art', caption: 'Area 8 · Sky' },
    ],
    tint: 'from-emerald/25 to-gold/25',
  },
  {
    id: 'album',
    tab: 'Card Album',
    kicker: '8 sets · 48 cards',
    title: 'Collect the Stomp Card Album.',
    body: 'Fill 8 themed sets with 48 collectible cards — and keep an eye out for the prismatic 5-star Foils.',
    facts: ['8 themed sets', '48 collectible cards', 'Prismatic 5-star Foils'],
    phone: { src: '/img/shots/album-48.webp', alt: 'Stomp Card Album showing collected cards' },
    art: [
      { src: '/img/icons/album_set_7_hollow.webp', alt: 'Album set 7 Hollow art', caption: 'Set 7 · Hollow' },
      { src: '/img/icons/album_set_8_skies.webp', alt: 'Album set 8 Skies art', caption: 'Set 8 · Skies' },
    ],
    tint: 'from-coral/20 to-gold/30',
  },
  {
    id: 'map',
    tab: 'World Map & Atlas',
    kicker: '20 worlds · 200 levels',
    title: 'Wander a curved world map.',
    body: 'Hop node to node along a winding map, then zoom out to the atlas to see all 20 worlds at a glance.',
    facts: ['Curved, scrolling world map', '20-world atlas', '200 authored levels'],
    phone: { src: '/img/shots/world-map.webp', alt: 'Curved world map with level nodes' },
    art: [{ src: '/img/shots/atlas-20.webp', alt: 'Atlas screen showing all 20 worlds', caption: 'The 20-world atlas' }],
    tint: 'from-sky/40 to-emerald/20',
  },
  {
    id: 'arcade',
    tab: 'Plinko & Events',
    kicker: 'Arcade & live events',
    title: 'Drop, compete and celebrate.',
    body: 'Bounce rewards down Stomp Drop Plinko, team up in Solo Clubs, climb the Stomp Pass and jump into seasonal holiday events.',
    facts: ['Stomp Drop Plinko', 'Solo Clubs', 'Stomp Pass', 'Seasonal holiday events'],
    phone: { src: '/img/shots/plinko.webp', alt: 'Stomp Drop Plinko board' },
    art: [
      { src: '/img/shots/harvest-feast.webp', alt: 'Harvest Feast seasonal event screen', caption: 'Harvest Feast' },
      { src: '/img/shots/black-friday.webp', alt: 'Black Friday seasonal event screen', caption: 'Black Friday' },
      { src: '/img/shots/stomp-pass.webp', alt: 'Stomp Pass reward track', caption: 'Stomp Pass' },
      { src: '/img/shots/solo-club.webp', alt: 'Solo Club screen', caption: 'Solo Clubs' },
    ],
    tint: 'from-gold/35 to-coral/20',
  },
]

export default function FeatureShowcase() {
  const [id, setId] = useState(FEATURES[0].id)
  const f = FEATURES.find((x) => x.id === id) ?? FEATURES[0]
  const isShot = (src: string) => src.includes('/shots/')

  return (
    <section id="features" aria-labelledby="feat-title" className="relative overflow-hidden bg-cream-deep/60 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-coral-ink">Beyond the board</p>
        <h2 id="feat-title" className="mt-3 max-w-3xl font-display text-[44px] font-bold leading-[0.98] tracking-[-0.015em] sm:text-[60px]">
          Way more than a block puzzle.
        </h2>

        <div role="tablist" aria-label="Game features" className="mt-10 flex gap-2 overflow-x-auto pb-3 sm:flex-wrap sm:overflow-visible">
          {FEATURES.map((x) => {
            const on = x.id === id
            return (
              <button
                key={x.id}
                id={`tab-${x.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="feature-panel"
                onClick={() => setId(x.id)}
                className={`pill shrink-0 rounded-full px-5 py-3 font-display text-[17px] font-semibold ${
                  on
                    ? 'bg-ink text-cream shadow-[0_5px_0_oklch(0.16_0.035_262)]'
                    : 'bg-paper text-ink shadow-[0_5px_0_oklch(0.85_0.03_85)] ring-1 ring-ink/10 hover:bg-cream'
                }`}
              >
                {x.tab}
              </button>
            )
          })}
        </div>

        <div
          id="feature-panel"
          role="tabpanel"
          aria-labelledby={`tab-${f.id}`}
          className={`relative mt-8 grid gap-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${f.tint} bg-paper p-6 ring-1 ring-ink/10 sm:p-10 lg:grid-cols-[0.9fr_0.7fr_1fr] lg:items-center`}
        >
          <div key={`copy-${f.id}`} className="fade-swap">
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-ink-soft">{f.kicker}</p>
            <h3 className="mt-2 font-display text-[34px] font-bold leading-[1.02] sm:text-[40px]">{f.title}</h3>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{f.body}</p>
            <ul className="mt-6 grid gap-2.5">
              {f.facts.map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15px] font-semibold">
                  <span aria-hidden="true" className="h-3.5 w-3.5 rounded-[4px] bg-gold shadow-[inset_0_-2px_0_var(--color-gold-lip)]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto w-full max-w-[250px]">
            <PhoneFrame src={f.phone.src} alt={f.phone.alt} swapKey={f.id} />
          </div>

          <div key={`art-${f.id}`} className={`grid gap-4 ${f.art.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {f.art.map((a, i) => (
              <figure
                key={a.src}
                className={`pop-in rounded-[1.5rem] bg-paper p-3 shadow-[0_6px_0_oklch(0.85_0.03_85),0_20px_30px_-20px_oklch(0.24_0.045_262/0.4)] ring-1 ring-ink/10 ${
                  i % 2 === 1 ? 'translate-y-6 rotate-[2deg]' : '-rotate-[1.5deg]'
                }`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <img
                  src={a.src}
                  alt={a.alt}
                  loading="lazy"
                  decoding="async"
                  className={`w-full rounded-[1rem] ${isShot(a.src) ? 'aspect-[9/16] object-cover object-top' : 'aspect-square object-contain'}`}
                />
                <figcaption className="mt-2 px-1 font-mono text-[12px] font-bold text-ink-soft">{a.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
