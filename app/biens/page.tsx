import { getProperties } from '../lib/supabaseProperties'
import { PROPERTIES } from '../lib/properties'
import BiensClient from './BiensClient'
import GoodKechCatalogue from '../goodKech/GoodKechCatalogue'
import { GOOD_KECH_PROPERTIES } from '../goodKech/data'
import { IMMO_BUILT_PROPERTIES } from '../immoBuilt/data'
import { getRequestDemoBrand } from '../requestDemoBrand'

export default async function BiensPage() {
  const brand = await getRequestDemoBrand()

  if (brand?.experience === 'good-kech-immo') {
    return <GoodKechCatalogue brand={brand} properties={GOOD_KECH_PROPERTIES} />
  }

  if (brand?.experience === 'immo-built') {
    return <GoodKechCatalogue brand={brand} properties={IMMO_BUILT_PROPERTIES} />
  }

  const properties = await getProperties().catch(() => PROPERTIES)
  return <BiensClient properties={properties} />
}
