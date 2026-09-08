import BiensClient from '../../../biens/BiensClient'
import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'
import { IMMO_BUILT_PROPERTIES } from '../../../immoBuilt/data'

const brand = getDemoBrandBySlug('danna-immo', '/demo/danna-immo')!

export default function DannaImmoCataloguePage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <BiensClient
        properties={IMMO_BUILT_PROPERTIES}
        heroImage="/demos/immo-built/test-agency-catalogue.webp"
        directToDetails
      />
    </DemoBrandProvider>
  )
}
