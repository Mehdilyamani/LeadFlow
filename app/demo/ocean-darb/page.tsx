import type { Metadata } from 'next'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'
import { locations, properties } from './data'

const brand = getDemoBrandBySlug('ocean-darb', '/demo/ocean-darb')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function OceanDarbDemoPage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={properties}
        locations={locations}
        heroImage="/demos/immo-built/test-agency-exterior.webp"
        featureImage="/demos/immo-built/test-agency-feature.webp"
        heroEyebrow="OCEAN DARB · BOUSKOURA"
        heroTitle="Votre bien à Bouskoura,"
        heroAccent="en toute confiance."
        heroAccentStyle="sans"
        heroDescription="Appartements, villas et opportunités immobilières à découvrir à Bouskoura."
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
