import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { StoreBadges } from '@/components/StoreBadges'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Support & FAQ',
  description: 'Help, answers and contact info for Stomplings: Make Room! by Dizzywalk.',
  alternates: { canonical: `${SITE.url}/support/` },
}

const FAQ = [
  {
    q: 'Is Stomplings: Make Room! free?',
    a: 'Yes — it’s free to play on iPhone/iPad from the App Store and on Android from Google Play.',
  },
  {
    q: 'How do I play?',
    a: 'Drag pieces onto the 9×9 board to complete rows and columns. Clear lines over the golden target rings to make room — once they’re all cleared, a giant Stompling drops in and stomps every remaining block off the board.',
  },
  {
    q: 'How many levels are there?',
    a: 'There are 20 hand-crafted worlds with 200 authored levels, plus Stompling Village (8 areas, 48 builds) and the Stomp Card Album (8 sets, 48 cards).',
  },
  {
    q: 'I found a bug or lost progress. What should I do?',
    a: `Email us at ${SITE.supportEmail} with your device model, OS version, and what happened. Screenshots help a lot!`,
  },
  {
    q: 'How is my data handled?',
    a: 'Please read our Privacy Policy (linked below) for full details on what is collected and how it’s used.',
  },
]

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="grain outline-none">
        <section className="mx-auto max-w-3xl px-5 pb-24 pt-36 sm:px-8 sm:pt-40">
          <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-coral-ink">Support</p>
          <h1 className="mt-3 font-display text-[48px] font-bold leading-[0.96] tracking-[-0.015em] sm:text-[64px]">
            How can we help?
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed text-ink-soft">
            Questions, bug reports or feedback for Stomplings: Make Room! — we read every message.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-[1.3fr_1fr]">
            <a
              href={`mailto:${SITE.supportEmail}?subject=Stomplings%20support`}
              className="group rounded-[1.75rem] bg-ink p-6 text-cream shadow-[0_8px_0_oklch(0.16_0.035_262)] transition-transform hover:-translate-y-0.5"
            >
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-gold">Email support</p>
              <p className="mt-2 break-all font-display text-[26px] font-bold">{SITE.supportEmail}</p>
              <p className="mt-2 text-[15px] text-cream/90">Include your device and OS version so we can help faster.</p>
            </a>
            <a
              href={SITE.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[1.75rem] bg-paper p-6 ring-1 ring-ink/10 shadow-[0_8px_0_oklch(0.85_0.03_85)] transition-transform hover:-translate-y-0.5"
            >
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-coral-ink">Legal</p>
              <p className="mt-2 font-display text-[26px] font-bold">Privacy Policy</p>
              <p className="mt-2 text-[15px] text-ink-soft">Opens on dizzywalk-legal.onrender.com</p>
            </a>
          </div>

          <h2 className="mt-16 font-display text-[34px] font-bold">Frequently asked</h2>
          <div className="mt-6 grid gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-[1.25rem] bg-paper p-5 ring-1 ring-ink/10 open:shadow-[0_6px_0_oklch(0.85_0.03_85)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[19px] font-semibold">
                  {f.q}
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream-deep text-[20px] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-16 rounded-[2rem] bg-gold p-7 shadow-[0_8px_0_var(--color-gold-lip)]">
            <h2 className="font-display text-[28px] font-bold text-ink">Get the game</h2>
            <StoreBadges className="mt-5" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
