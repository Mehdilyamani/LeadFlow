import 'server-only'

import { cache } from 'react'
import { headers } from 'next/headers'
import { getDemoBrand, getHostname } from './demoBrands'

export const getRequestDemoBrand = cache(async () => {
  const requestHeaders = await headers()
  return getDemoBrand(getHostname(requestHeaders.get('host')))
})
