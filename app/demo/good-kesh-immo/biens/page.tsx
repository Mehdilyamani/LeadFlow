import type { Metadata } from 'next'
import BiensClient from '../../../biens/BiensClient'
import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'
import { properties } from '../data'

const brand = getDemoBrandBySlug('good-kesh-immo', '/demo/good-kesh-immo')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function GoodKechCataloguePage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <BiensClient
        properties={properties}
        heroImage="/demos/good-kech-immo/villa-amelkis.webp"
        directToDetails
      />
    </DemoBrandProvider>
  )
}
