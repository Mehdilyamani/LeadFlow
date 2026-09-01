import type { Metadata } from 'next'
import { DEMO_PROPERTIES } from '../lib/demoProperties'
import HomeClient from '../HomeClient'
import GoodKechHome from '../goodKech/GoodKechHome'
import ImmoBuiltHome from '../immoBuilt/ImmoBuiltHome'
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
    return <ImmoBuiltHome brand={brand} />
  }

  return <HomeClient properties={DEMO_PROPERTIES} />
}
