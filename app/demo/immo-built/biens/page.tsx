import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'
import BiensClient from '../../../biens/BiensClient'
import { IMMO_BUILT_PROPERTIES } from '../../../immoBuilt/data'

const brand = getDemoBrandBySlug('immo-built', '/demo/immo-built')!

export default function ImmoBuiltCataloguePage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <BiensClient
        properties={IMMO_BUILT_PROPERTIES}
        heroImage="/demos/immo-built/test-agency-catalogue.webp"
      />
    </DemoBrandProvider>
  )
}
