import { notFound } from 'next/navigation'
import PropertyDetail from '../../../../biens/[id]/PropertyDetail'
import { DemoBrandProvider } from '../../../../demoBranding'
import { getDemoBrandBySlug } from '../../../../demoBrands'
import { IMMO_BUILT_PROPERTIES } from '../../../../immoBuilt/data'

const brand = getDemoBrandBySlug('danna-immo', '/demo/danna-immo')!

export default async function DannaImmoPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = IMMO_BUILT_PROPERTIES.find((item) => item.id === id)

  if (!property) notFound()

  const similar = IMMO_BUILT_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)

  return (
    <DemoBrandProvider initialBrand={brand}>
      <PropertyDetail property={property} similar={similar} />
    </DemoBrandProvider>
  )
}
