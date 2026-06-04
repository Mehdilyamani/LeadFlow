import { getFeaturedProperties } from './lib/supabaseProperties'
import { PROPERTIES } from './lib/properties'
import HomeClient from './HomeClient'

export default async function Home() {
  const properties = await getFeaturedProperties().catch(() => PROPERTIES.slice(0, 3))
  return <HomeClient properties={properties} />
}
