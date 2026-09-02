import type { Metadata } from 'next'
import { DEMO_PROPERTIES } from '../lib/demoProperties'
import HomeClient from '../HomeClient'
import GoodKechHome from '../goodKech/GoodKechHome'
import { IMMO_BUILT_AREAS, IMMO_BUILT_PROPERTIES } from '../immoBuilt/data'
import { getRequestDemoBrand } from '../requestDemoBrand'

const DEFAULT_METADATA: Metadata = {
  title: 'Maison Atlas Immobilier — Propriétés au Maroc',
  description: 'Découvrez une sélection de propriétés à Casablanca, Marrakech, Rabat et Tanger.',
}

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getRequestDemoBrand()
  return brand?.metadata ?? DEFAULT_METADATA
}

export default async function DemoPage() {
  const brand = await getRequestDemoBrand()

  if (brand?.experience === 'good-kech-immo') {
    return <GoodKechHome brand={brand} />
  }

  if (brand?.experience === 'immo-built') {
    return (
      <HomeClient
        properties={IMMO_BUILT_PROPERTIES}
        locations={IMMO_BUILT_AREAS.map((area) => ({ ...area, subtitle: area.detail }))}
        heroImage="/demos/immo-built/test-agency-hero.webp"
        featureImage="/demos/immo-built/test-agency-feature.webp"
      />
    )
  }

  return <HomeClient properties={DEMO_PROPERTIES} />
}
