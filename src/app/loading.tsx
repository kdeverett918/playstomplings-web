export default function Loading() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-cream px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <span className="h-4 w-4 animate-bounce rounded-[5px] bg-emerald shadow-[inset_0_-3px_0_var(--color-emerald-lip)]" />
          <span className="h-4 w-4 animate-bounce rounded-[5px] bg-gold shadow-[inset_0_-3px_0_var(--color-gold-lip)] [animation-delay:120ms]" />
          <span className="h-4 w-4 animate-bounce rounded-[5px] bg-coral shadow-[inset_0_-3px_0_oklch(0.45_0.16_28)] [animation-delay:240ms]" />
        </div>
        <p className="font-display text-lg font-semibold text-ink">Making room for the Stomp…</p>
      </div>
    </div>
  )
}
