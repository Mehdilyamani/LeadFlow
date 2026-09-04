import BiensClient from '../../../biens/BiensClient'
import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'
import { ELADIMMO_PROPERTIES } from '../../../eladimmo/data'

const brand = getDemoBrandBySlug('eladimmo', '/demo/eladimmo')!

export default function EladimmoCataloguePage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <BiensClient
        properties={ELADIMMO_PROPERTIES}
        heroImage="/demos/immo-built/test-agency-catalogue.webp"
      />
    </DemoBrandProvider>
  )
}
