'use client'

import Image from 'next/image'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type DemoBrand = {
  agencyName: string
  primaryColor: string
  secondaryColor: string
  logoPath: string
}

export const DEMO_BRANDS: Record<string, DemoBrand> = {
  'test-agency.leadflowimmo.com': {
    agencyName: 'Test Agency',
    primaryColor: '#dc2626',
    secondaryColor: '#000000',
    logoPath: '/test-agency-logo.png',
  },
}

export function getDemoBrand(hostname: string): DemoBrand | null {
  return DEMO_BRANDS[hostname.trim().toLowerCase()] ?? null
}

const DemoBrandContext = createContext<DemoBrand | null>(null)

export function DemoBrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<DemoBrand | null>(null)

  useEffect(() => {
    const activeBrand = getDemoBrand(window.location.hostname)
    const root = document.documentElement

    setBrand(activeBrand)

    if (activeBrand) {
      root.dataset.demoBrand = window.location.hostname
      root.style.setProperty('--demo-primary', activeBrand.primaryColor)
      root.style.setProperty('--demo-secondary', activeBrand.secondaryColor)
    } else {
      delete root.dataset.demoBrand
      root.style.removeProperty('--demo-primary')
      root.style.removeProperty('--demo-secondary')
    }

    return () => {
      delete root.dataset.demoBrand
      root.style.removeProperty('--demo-primary')
      root.style.removeProperty('--demo-secondary')
    }
  }, [])

  return <DemoBrandContext.Provider value={brand}>{children}</DemoBrandContext.Provider>
}

export function useDemoBrand() {
  return useContext(DemoBrandContext)
}

export function DemoBrandMark({
  fallback,
  className,
  priority = false,
}: {
  fallback: ReactNode
  className: string
  priority?: boolean
}) {
  const brand = useDemoBrand()
  const [failedLogo, setFailedLogo] = useState<string | null>(null)

  if (!brand?.logoPath || failedLogo === brand.logoPath) {
    return <>{fallback}</>
  }

  return (
    <Image
      src={brand.logoPath}
      alt={`${brand.agencyName} logo`}
      width={48}
      height={48}
      className={className}
      priority={priority}
      onError={() => setFailedLogo(brand.logoPath)}
    />
  )
}
