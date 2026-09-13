import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PropertyDetail from '../../../../biens/[id]/PropertyDetail'
import { DemoBrandProvider } from '../../../../demoBranding'
import { getDemoBrandBySlug } from '../../../../demoBrands'
import { properties } from '../../data'

const brand = getDemoBrandBySlug('good-kesh-immo', '/demo/good-kesh-immo')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default async function GoodKechPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = properties.find((item) => item.id === id)
  if (!property) notFound()

  const similar = properties.filter((item) => item.id !== id).slice(0, 3)
  return (
    <DemoBrandProvider initialBrand={brand}>
      <PropertyDetail property={property} similar={similar} />
    </DemoBrandProvider>
  )
}
