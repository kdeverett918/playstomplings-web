import { SITE } from '@/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/app-icon.png" alt="" width={44} height={44} className="h-11 w-11 rounded-[12px]" loading="lazy" />
          <div>
            <p className="font-display text-[20px] font-bold leading-none">Stomplings: Make Room!</p>
            <p className="mt-1 text-[14px] text-ink-soft">
              © {new Date().getFullYear()} {SITE.studio}. All rights reserved.
            </p>
          </div>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[15px] font-semibold text-ink-soft">
            <li>
              <a className="hover:text-ink" href="/support/">
                Support &amp; FAQ
              </a>
            </li>
            <li>
              <a className="hover:text-ink" href={SITE.privacy} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="hover:text-ink" href={`mailto:${SITE.supportEmail}`}>
                {SITE.supportEmail}
              </a>
            </li>
            <li>
              <a className="hover:text-ink" href={SITE.appStore} target="_blank" rel="noopener noreferrer">
                App Store
              </a>
            </li>
            <li>
              <a className="hover:text-ink" href={SITE.googlePlay} target="_blank" rel="noopener noreferrer">
                Google Play
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
