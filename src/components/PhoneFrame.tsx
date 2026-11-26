interface Props {
  src: string
  alt: string
  className?: string
  priority?: boolean
  /** Changing this key replays the screen fade-swap animation. */
  swapKey?: string
}

export function PhoneFrame({ src, alt, className = '', priority = false, swapKey }: Props) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <span className="phone-notch" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={swapKey ?? src}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="fade-swap absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    </div>
  )
}
