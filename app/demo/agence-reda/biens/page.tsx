import { AGENCE_REDA_PROPERTIES } from '../../../agenceReda/data'
import BiensClient from '../../../biens/BiensClient'
import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'

const brand = getDemoBrandBySlug('agence-reda', '/demo/agence-reda')!

export default function AgenceRedaCataloguePage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <BiensClient
        properties={AGENCE_REDA_PROPERTIES}
        heroImage="/demos/immo-built/test-agency-catalogue.webp"
      />
    </DemoBrandProvider>
  )
}
