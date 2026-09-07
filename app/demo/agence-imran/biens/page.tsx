import { IMRAN_PROPERTIES } from '../../../agenceImran/data'
import BiensClient from '../../../biens/BiensClient'
import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'

const brand = getDemoBrandBySlug('agence-imran', '/demo/agence-imran')!

export default function AgenceImranCataloguePage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <BiensClient
        properties={IMRAN_PROPERTIES}
        heroImage="/demos/immo-built/test-agency-catalogue.webp"
        directToDetails
      />
    </DemoBrandProvider>
  )
}
