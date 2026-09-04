import type { Metadata } from 'next'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import { ELADIMMO_AREAS, ELADIMMO_PROPERTIES } from '../../eladimmo/data'
import HomeClient from '../../HomeClient'

const brand = getDemoBrandBySlug('eladimmo', '/demo/eladimmo')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function EladimmoDemoPage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={ELADIMMO_PROPERTIES}
        locations={ELADIMMO_AREAS.map((area) => ({ ...area, subtitle: area.detail }))}
        heroImage="/demos/immo-built/test-agency-hero.webp"
        featureImage="/demos/immo-built/test-agency-feature.webp"
        heroEyebrow="ALADIMMO · Biens à vendre à Rabat et Témara"
        heroTitle="Votre adresse,"
        heroAccent="notre priorité."
        heroDescription="Appartements, villas et terrains à vendre à Rabat, Témara et leurs environs."
        transactionLabel="Vente immobilière"
      />
    </DemoBrandProvider>
  )
}
