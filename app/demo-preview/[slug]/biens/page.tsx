import { notFound } from 'next/navigation'
import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'
import BiensClient from '../../../biens/BiensClient'
import GoodKechCatalogue from '../../../goodKech/GoodKechCatalogue'
import { GOOD_KECH_PROPERTIES } from '../../../goodKech/data'
import { IMMO_BUILT_PROPERTIES } from '../../../immoBuilt/data'

export default async function DemoPreviewCatalogue({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const brand = getDemoBrandBySlug(slug)

  if (brand?.experience === 'good-kech-immo') {
    return <GoodKechCatalogue brand={brand} properties={GOOD_KECH_PROPERTIES} />
  }

  if (brand?.experience === 'immo-built') {
    return (
      <DemoBrandProvider initialBrand={brand}>
        <BiensClient properties={IMMO_BUILT_PROPERTIES} heroImage="/demos/immo-built/test-agency-catalogue.webp" />
      </DemoBrandProvider>
    )
  }

  notFound()
}
