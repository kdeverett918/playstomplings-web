export default function NotFound() {
  return (
    <main id="main" className="grain grid min-h-dvh place-items-center px-6 py-20 text-center">
      <div className="max-w-lg">
        <div aria-hidden="true" className="relative mx-auto mb-10 h-40 w-48">
          <div className="absolute inset-x-6 bottom-0 h-6 rounded-full bg-ink/10 blur-sm" />
          <div className="absolute inset-x-4 bottom-3 h-28 rounded-[26px] bg-grape shadow-[inset_0_-10px_0_oklch(0.42_0.18_300)]">
            <span className="absolute left-8 top-8 h-7 w-5 rounded-lg bg-paper">
              <span className="absolute bottom-1 left-1 h-3.5 w-3 rounded-md bg-ink" />
            </span>
            <span className="absolute right-8 top-8 h-7 w-5 rounded-lg bg-paper">
              <span className="absolute bottom-1 left-1 h-3.5 w-3 rounded-md bg-ink" />
            </span>
            <span className="absolute bottom-7 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-ink" />
          </div>
          <span className="absolute -left-1 bottom-2 h-5 w-10 rotate-[-18deg] rounded-md bg-coral" />
          <span className="absolute -right-1 bottom-1 h-5 w-8 rotate-[14deg] rounded-md bg-emerald" />
        </div>
        <p className="font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-coral-ink">Error 404</p>
        <h1 className="mt-3 font-display text-[44px] font-bold leading-[0.98] sm:text-[56px]">
          Oops! A Stompling sat on this page.
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
          It was comfy, so it stayed. Let&apos;s get you back to a board with plenty of room.
        </p>
        <a href="/" className="btn-tactile mt-8 px-7 py-3.5 text-[18px]">
          Back to Stomplings
        </a>
      </div>
    </main>
  )
}
