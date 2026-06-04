import { getProperties } from '../lib/supabaseProperties'
import { PROPERTIES } from '../lib/properties'
import BiensClient from './BiensClient'

export default async function BiensPage() {
  const properties = await getProperties().catch(() => PROPERTIES)
  return <BiensClient properties={properties} />
}
