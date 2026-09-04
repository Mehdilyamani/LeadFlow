import { notFound } from 'next/navigation'
import PropertyDetail from '../../../../biens/[id]/PropertyDetail'
import { DemoBrandProvider } from '../../../../demoBranding'
import { getDemoBrandBySlug } from '../../../../demoBrands'
import { ELADIMMO_PROPERTIES } from '../../../../eladimmo/data'

const brand = getDemoBrandBySlug('eladimmo', '/demo/eladimmo')!

export default async function EladimmoPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = ELADIMMO_PROPERTIES.find((item) => item.id === id)

  if (!property) notFound()

  const similar = ELADIMMO_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)

  return (
    <DemoBrandProvider initialBrand={brand}>
      <PropertyDetail property={property} similar={similar} />
    </DemoBrandProvider>
  )
}
