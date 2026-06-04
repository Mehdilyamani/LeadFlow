import { notFound } from 'next/navigation'
import { getProperty, getSimilarProperties } from '../../lib/supabaseProperties'
import { PROPERTIES } from '../../lib/properties'
import PropertyDetail from './PropertyDetail'

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let property = await getProperty(id).catch(() => null)
  // Static fallback if DB unreachable
  if (!property) property = PROPERTIES.find(p => p.id === id) ?? null
  if (!property) notFound()

  const similar = await getSimilarProperties(id, property.type).catch(
    () => PROPERTIES.filter(p => p.id !== id && p.type === property!.type).slice(0, 3)
  )

  return <PropertyDetail property={property} similar={similar} />
}
