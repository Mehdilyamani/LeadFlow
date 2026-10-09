import type { Metadata } from 'next'
import BiensClient from '../../../biens/BiensClient'
import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'
import { properties } from '../data'

const brand = getDemoBrandBySlug('achorafaa-invest', '/demo/achorafaa-invest')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function AchorafaaInvestCataloguePage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <BiensClient
        properties={properties}
        heroImage="/demos/good-kech-immo/marrakech-architecture.webp"
        directToDetails
      />
    </DemoBrandProvider>
  )
}
