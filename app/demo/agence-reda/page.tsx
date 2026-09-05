import type { Metadata } from 'next'
import { AGENCE_REDA_AREAS, AGENCE_REDA_PROPERTIES } from '../../agenceReda/data'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'

const brand = getDemoBrandBySlug('agence-reda', '/demo/agence-reda')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function AgenceRedaDemoPage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={AGENCE_REDA_PROPERTIES}
        locations={AGENCE_REDA_AREAS.map((area) => ({ ...area, subtitle: area.detail }))}
        heroImage="/demos/immo-built/test-agency-exterior.webp"
        featureImage="/demos/immo-built/test-agency-feature.webp"
        heroEyebrow="AGENCE IMMOBILIÈRE REDA · MEKNÈS"
        heroTitle="Votre bien à Meknès,"
        heroAccent="en toute confiance."
        heroDescription="Appartements, villas, maisons et terrains à découvrir à Meknès et ses environs."
        transactionLabel="Vente · Location"
        compactMobileHero
        autoSlideIntervalMs={3800}
      />
    </DemoBrandProvider>
  )
}
