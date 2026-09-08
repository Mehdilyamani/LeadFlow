import type { Metadata } from 'next'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'
import { IMMO_BUILT_AREAS, IMMO_BUILT_PROPERTIES } from '../../immoBuilt/data'

const brand = getDemoBrandBySlug('danna-immo', '/demo/danna-immo')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function DannaImmoDemoPage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={IMMO_BUILT_PROPERTIES}
        locations={IMMO_BUILT_AREAS.map((area) => ({ ...area, subtitle: area.detail }))}
        heroImage="/demos/immo-built/test-agency-exterior.webp"
        featureImage="/demos/immo-built/test-agency-feature.webp"
        heroEyebrow="DANNA IMMO · CASABLANCA"
        heroTitle="Votre bien à Casablanca,"
        heroAccent="en toute confiance."
        heroAccentStyle="sans"
        heroDescription="Appartements, villas et opportunités immobilières à découvrir à Casablanca."
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
