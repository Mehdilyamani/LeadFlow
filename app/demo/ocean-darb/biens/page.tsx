import type { Metadata } from 'next'
import BiensClient from '../../../biens/BiensClient'
import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'
import { properties } from '../data'

const brand = getDemoBrandBySlug('ocean-darb', '/demo/ocean-darb')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function OceanDarbCataloguePage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <BiensClient
        properties={properties}
        heroImage="/demos/immo-built/test-agency-catalogue.webp"
        directToDetails
      />
    </DemoBrandProvider>
  )
}
