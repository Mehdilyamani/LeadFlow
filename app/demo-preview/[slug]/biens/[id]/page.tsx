import { notFound } from 'next/navigation'
import { getDemoBrandBySlug } from '../../../../demoBrands'
import GoodKechPropertyDetail from '../../../../goodKech/GoodKechPropertyDetail'
import { GOOD_KECH_PROPERTIES } from '../../../../goodKech/data'
import { IMMO_BUILT_PROPERTIES } from '../../../../immoBuilt/data'

export default async function DemoPreviewProperty({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  const brand = getDemoBrandBySlug(slug)

  if (brand?.experience === 'good-kech-immo') {
    const property = GOOD_KECH_PROPERTIES.find((item) => item.id === id)
    if (!property) notFound()
    const similar = GOOD_KECH_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)
    return <GoodKechPropertyDetail brand={brand} property={property} similar={similar} />
  }

  if (brand?.experience === 'immo-built') {
    const property = IMMO_BUILT_PROPERTIES.find((item) => item.id === id)
    if (!property) notFound()
    const similar = IMMO_BUILT_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)
    return <GoodKechPropertyDetail brand={brand} property={property} similar={similar} />
  }

  notFound()
}
