import { notFound } from 'next/navigation'
import {
  getProperty,
  getSimilarProperties,
} from '../../lib/supabaseProperties'
import { PROPERTIES } from '../../lib/properties'
import { DEMO_PROPERTIES } from '../../lib/demoProperties'
import { GOOD_KECH_PROPERTIES } from '../../goodKech/data'
import { IMMO_BUILT_PROPERTIES } from '../../immoBuilt/data'
import PropertyDetail from './PropertyDetail'

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const goodKechProperty = GOOD_KECH_PROPERTIES.find((item) => item.id === id) ?? null
  const immoBuiltProperty = IMMO_BUILT_PROPERTIES.find((item) => item.id === id) ?? null
  let property = goodKechProperty ?? immoBuiltProperty ?? await getProperty(id).catch(() => null)

  // Normal static fallback
  if (!property) {
    property = PROPERTIES.find((p) => p.id === id) ?? null
  }

  // Demo-property fallback
  if (!property) {
    property = DEMO_PROPERTIES.find((p) => p.id === id) ?? null
  }

  if (!property) {
    notFound()
  }

  const similar = goodKechProperty
    ? GOOD_KECH_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)
    : immoBuiltProperty
      ? IMMO_BUILT_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)
    : await getSimilarProperties(id, property.type).catch(() => {
    const allFallbackProperties = [...PROPERTIES, ...DEMO_PROPERTIES]

    return allFallbackProperties
      .filter((p) => p.id !== id && p.type === property!.type)
      .slice(0, 3)
      })

  return <PropertyDetail property={property} similar={similar} />
}
