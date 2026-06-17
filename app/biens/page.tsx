import { getProperties } from '../lib/supabaseProperties'
import { PROPERTIES } from '../lib/properties'
import BiensClient from './BiensClient'

export default async function BiensPage() {
  const fetched = await getProperties().catch(() => [])
  const properties = fetched.length > 0 ? fetched : PROPERTIES
  return <BiensClient properties={properties} />
}
