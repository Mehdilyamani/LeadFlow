import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getDemoBrand, getHostname } from '../demoBrands'
import { DEMO_PROPERTIES } from '../lib/demoProperties'
import HomeClient from '../HomeClient'

const DEFAULT_METADATA: Metadata = {
  title: 'Maison Atlas Immobilier — Propriétés au Maroc',
  description: 'Découvrez une sélection de propriétés à Casablanca, Marrakech, Rabat et Tanger.',
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers()
  const brand = getDemoBrand(getHostname(requestHeaders.get('host')))
  return brand?.metadata ?? DEFAULT_METADATA
}

export default function DemoPage() {
  return <HomeClient properties={DEMO_PROPERTIES} />
}
