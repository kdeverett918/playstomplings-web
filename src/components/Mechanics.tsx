import { PhoneFrame } from './PhoneFrame'

/* eslint-disable @next/next/no-img-element */

const DEALING = [
  { k: 'Playable hands', v: 'Smart dealing hands you pieces that have somewhere to go — no impossible bricks.' },
  { k: 'Bounce Back mercy', v: 'Stuck on a tough board? A little Bounce Back help gives you room to recover.' },
  { k: 'Shaped cutout boards', v: 'Boards come in fun cutout shapes, so every level asks you to rethink the space.' },
]

export function Mechanics() {
  return (
    <section id="mechanics" aria-labelledby="mech-title" className="grain relative py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-coral-ink">4 signature twists</p>
            <h2 id="mech-title" className="mt-3 font-display text-[44px] font-bold leading-[0.98] tracking-[-0.015em] sm:text-[60px]">
              Same 9×9 board. Brand-new trouble.
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-ink-soft lg:justify-self-end">
            Worlds mix in twist tiles that change how you plan every clear — rescue, harvest, blast and thaw your way to the
            golden rings.
          </p>
        </div>

        {/* Broken-grid bento (roomy across tablet 768px and desktop 1440px) */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {/* Mini Stompling Rescue — tall hero card (high-contrast deep emerald lip) */}
          <article className="relative overflow-hidden rounded-[2rem] bg-emerald-lip p-7 text-cream shadow-[0_8px_0_oklch(0.32_0.10_150)] md:col-span-2 lg:col-span-5 lg:row-span-3 lg:p-9">
            <div className="flex items-start gap-4">
              <img src="/img/icons/twist_mini_cage.webp" alt="" className="h-20 w-20 shrink-0 -rotate-6 object-contain drop-shadow-lg" loading="lazy" />
              <div>
                <p className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-gold">Twist 01</p>
                <h3 className="font-display text-[32px] font-bold leading-[1.02]">Mini Stompling Rescue</h3>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-[17px] font-medium leading-relaxed text-cream">
              Little Stomplings are stuck in cages on the board. Clear the lines around them to set every one free.
            </p>
            <div className="mt-8 flex justify-center lg:justify-end">
              <PhoneFrame
                src="/img/shots/lv102-mushroom.webp"
                alt="Level 102 in Mushroom Hollow, live on a phone"
                className="w-[62%] max-w-[250px] rotate-[4deg]"
              />
            </div>
          </article>

          {/* Gem Harvest — wide card with crystal phone */}
          <article className="relative overflow-hidden rounded-[2rem] bg-ink p-7 text-cream shadow-[0_8px_0_oklch(0.16_0.035_262)] md:col-span-2 lg:col-span-7 lg:p-9">
            <div className="grid grid-cols-[1fr_auto] items-start gap-4">
              <div>
                <img src="/img/icons/twist_gem_cell.webp" alt="" className="h-16 w-16 object-contain drop-shadow-lg" loading="lazy" />
                <p className="mt-3 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-gold">Twist 02</p>
                <h3 className="font-display text-[30px] font-bold leading-[1.02]">Gem Harvest</h3>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-cream/90">
                  Sparkling gem cells sit on the board. Clear lines across them to scoop up the haul.
                </p>
              </div>
              <PhoneFrame
                src="/img/shots/lv132-crystal.webp"
                alt="Level 132 in Crystal Caverns, live on a phone"
                className="w-[118px] -rotate-[5deg] sm:w-[150px]"
              />
            </div>
          </article>

          {/* Blast Kegs */}
          <article className="relative overflow-hidden rounded-[2rem] bg-coral-ink p-7 text-cream shadow-[0_8px_0_oklch(0.4_0.15_28)] md:col-span-1 lg:col-span-4 lg:-rotate-1">
            <img src="/img/icons/twist_tnt_keg.webp" alt="" className="absolute -right-3 -top-3 h-28 w-28 rotate-12 object-contain drop-shadow-xl" loading="lazy" />
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.12em]">Twist 03</p>
            <h3 className="mt-1 font-display text-[28px] font-bold leading-[1.02]">Blast Kegs</h3>
            <p className="mt-3 max-w-[15rem] text-[15px] font-medium leading-relaxed">
              Run a line through a keg and KA-BOOM, it blasts open extra room.
            </p>
          </article>

          {/* Frost Ice */}
          <article className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,oklch(0.93_0.04_230),oklch(0.85_0.07_230))] p-7 text-ink ring-1 ring-ink/10 shadow-[0_8px_0_oklch(0.7_0.08_235)] md:col-span-1 lg:col-span-3">
            <img src="/img/icons/twist_frost_ice.webp" alt="" className="h-16 w-16 object-contain drop-shadow-lg" loading="lazy" />
            <p className="mt-3 font-mono text-[12px] font-bold uppercase tracking-[0.12em]">Twist 04</p>
            <h3 className="font-display text-[26px] font-bold leading-[1.02]">Frost Ice</h3>
            <p className="mt-2 text-[15px] font-medium leading-relaxed">Frozen cells crack open when you clear lines through them.</p>
          </article>

          {/* Smart Brick-Free Dealing */}
          <article className="rounded-[2rem] border-2 border-dashed border-ink/20 bg-paper p-7 md:col-span-2 lg:col-span-7 lg:p-9">
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-coral-ink">Fair by design</p>
            <h3 className="mt-1 font-display text-[30px] font-bold leading-[1.02]">Smart brick-free dealing</h3>
            <dl className="mt-5 grid gap-4">
              {DEALING.map((d) => (
                <div key={d.k} className="grid grid-cols-[auto_1fr] gap-3">
                  <span aria-hidden="true" className="mt-1 h-4 w-4 rounded-[5px] bg-emerald shadow-[inset_0_-3px_0_var(--color-emerald-lip)]" />
                  <div>
                    <dt className="font-display text-[18px] font-semibold">{d.k}</dt>
                    <dd className="text-[15px] leading-relaxed text-ink-soft">{d.v}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </div>
    </section>
  )
}
