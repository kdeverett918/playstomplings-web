import DownloadBanner from '@/components/DownloadBanner'
import FeatureShowcase from '@/components/FeatureShowcase'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Mechanics } from '@/components/Mechanics'
import { Navbar } from '@/components/Navbar'
import StompMiniToy from '@/components/StompMiniToy'
import WorldExplorer from '@/components/WorldExplorer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <StompMiniToy />
        <WorldExplorer />
        <Mechanics />
        <FeatureShowcase />
        <DownloadBanner />
      </main>
      <Footer />
    </>
  )
}
