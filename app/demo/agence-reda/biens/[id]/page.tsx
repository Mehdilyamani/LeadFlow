import { notFound } from 'next/navigation'
import { AGENCE_REDA_PROPERTIES } from '../../../../agenceReda/data'
import PropertyDetail from '../../../../biens/[id]/PropertyDetail'
import { DemoBrandProvider } from '../../../../demoBranding'
import { getDemoBrandBySlug } from '../../../../demoBrands'

const brand = getDemoBrandBySlug('agence-reda', '/demo/agence-reda')!

export default async function AgenceRedaPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = AGENCE_REDA_PROPERTIES.find((item) => item.id === id)

  if (!property) notFound()

  const similar = AGENCE_REDA_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)

  return (
    <DemoBrandProvider initialBrand={brand}>
      <PropertyDetail property={property} similar={similar} />
    </DemoBrandProvider>
  )
}
