import type { Metadata } from 'next'
import { IMMOBAZ_AREAS, IMMOBAZ_PROPERTIES } from '../../immobazKimma/data'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'

const brand = getDemoBrandBySlug('immobaz-kimma', '/demo/immobaz-kimma')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function ImmobazKimmaDemoPage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={IMMOBAZ_PROPERTIES}
        locations={IMMOBAZ_AREAS.map((area) => ({ ...area, subtitle: area.detail }))}
        heroImage="/demos/immo-built/test-agency-exterior.webp"
        featureImage="/demos/immo-built/test-agency-feature.webp"
        heroEyebrow="IMMOBAZ-KIMMA · AGADIR"
        heroTitle="Votre bien à Agadir,"
        heroAccent="en toute confiance."
        heroAccentStyle="sans"
        heroDescription="Appartements, villas, maisons et terrains à découvrir à Agadir et ses environs."
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
