import { notFound } from 'next/navigation'
import { IMRAN_PROPERTIES } from '../../../../agenceImran/data'
import PropertyDetail from '../../../../biens/[id]/PropertyDetail'
import { DemoBrandProvider } from '../../../../demoBranding'
import { getDemoBrandBySlug } from '../../../../demoBrands'

const brand = getDemoBrandBySlug('agence-imran', '/demo/agence-imran')!

export default async function AgenceImranPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = IMRAN_PROPERTIES.find((item) => item.id === id)

  if (!property) notFound()

  const similar = IMRAN_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)

  return (
    <DemoBrandProvider initialBrand={brand}>
      <PropertyDetail property={property} similar={similar} />
    </DemoBrandProvider>
  )
}
