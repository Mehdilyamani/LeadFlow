import type { Metadata } from 'next'
import { IMRAN_AREAS, IMRAN_PROPERTIES } from '../../agenceImran/data'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'

const brand = getDemoBrandBySlug('agence-imran', '/demo/agence-imran')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function AgenceImranDemoPage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={IMRAN_PROPERTIES}
        locations={IMRAN_AREAS.map((area) => ({ ...area, subtitle: area.detail }))}
        heroImage="/demos/immo-built/test-agency-exterior.webp"
        featureImage="/demos/immo-built/test-agency-feature.webp"
        heroEyebrow="L'AGENCE IMRAN · SAFI"
        heroTitle="Votre bien à Safi,"
        heroAccent="en toute confiance."
        heroAccentStyle="sans"
        heroDescription="Appartements, villas, maisons et terrains à découvrir à Safi et ses environs."
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
