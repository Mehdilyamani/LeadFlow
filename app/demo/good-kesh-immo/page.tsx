import type { Metadata } from 'next'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'
import { properties, locations } from './data'

const brand = getDemoBrandBySlug('good-kesh-immo', '/demo/good-kesh-immo')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function GoodKechDemoPage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={properties}
        locations={locations}
        heroImage="/demos/good-kech-immo/hero.webp"
        featureImage="/demos/good-kech-immo/villa-ourika.webp"
        heroEyebrow="GOOD KECH IMMO · MARRAKECH"
        heroTitle="Votre bien à Marrakech,"
        heroAccent="en toute confiance."
        heroAccentStyle="sans"
        heroDescription="Villas, riads, appartements et terrains à découvrir à Marrakech et ses environs."
        transactionLabel="Vente · Location"
        compactMobileHero
        instantHeroText
        propertyCardRevealOffset={24}
        continuousAutoSlide
        continuousSlideSpeed={21}
        autoSlideResumeDelayMs={3000}
      />
    </DemoBrandProvider>
  )
}
