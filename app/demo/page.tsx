import type { Metadata } from 'next'
import { DEMO_PROPERTIES } from '../lib/demoProperties'
import HomeClient from '../HomeClient'

export const metadata: Metadata = {
  title: 'Maison Atlas Immobilier — Propriétés au Maroc',
  description: 'Découvrez une sélection de propriétés à Casablanca, Marrakech, Rabat et Tanger.',
}

export default function DemoPage() {
  return <HomeClient properties={DEMO_PROPERTIES} />
}
