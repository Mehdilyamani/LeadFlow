import { getFeaturedProperties } from './lib/supabaseProperties'
import { PROPERTIES } from './lib/properties'
import HomeClient from './HomeClient'

export default async function Home() {
  const fetched = await getFeaturedProperties().catch(() => [])
  const properties = fetched.length > 0 ? fetched : PROPERTIES.slice(0, 3)
  return <HomeClient properties={properties} />
}
