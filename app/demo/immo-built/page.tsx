import type { Metadata } from 'next'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'
import { IMMO_BUILT_AREAS, IMMO_BUILT_PROPERTIES } from '../../immoBuilt/data'

const brand = getDemoBrandBySlug('immo-built', '/demo/immo-built')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function ImmoBuiltDemoPage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={IMMO_BUILT_PROPERTIES}
        locations={IMMO_BUILT_AREAS.map((area) => ({ ...area, subtitle: area.detail }))}
        heroImage="/demos/immo-built/test-agency-hero.webp"
        featureImage="/demos/immo-built/test-agency-feature.webp"
      />
    </DemoBrandProvider>
  )
}
