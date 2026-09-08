import { notFound } from 'next/navigation'
import { IMMOBAZ_PROPERTIES } from '../../../../immobazKimma/data'
import PropertyDetail from '../../../../biens/[id]/PropertyDetail'
import { DemoBrandProvider } from '../../../../demoBranding'
import { getDemoBrandBySlug } from '../../../../demoBrands'

const brand = getDemoBrandBySlug('immobaz-kimma', '/demo/immobaz-kimma')!

export default async function ImmobazKimmaPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = IMMOBAZ_PROPERTIES.find((item) => item.id === id)

  if (!property) notFound()

  const similar = IMMOBAZ_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)

  return (
    <DemoBrandProvider initialBrand={brand}>
      <PropertyDetail property={property} similar={similar} />
    </DemoBrandProvider>
  )
}
