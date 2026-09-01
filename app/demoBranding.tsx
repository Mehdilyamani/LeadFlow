'use client'

import Image from 'next/image'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  getDemoBrand,
  getWhatsAppUrl,
  type DemoBrand,
} from './demoBrands'

export { DEMO_BRANDS, getDemoBrand } from './demoBrands'
export type { DemoBrand } from './demoBrands'

const DemoBrandContext = createContext<DemoBrand | null>(null)

export function DemoBrandProvider({
  children,
  initialBrand = null,
}: {
  children: ReactNode
  initialBrand?: DemoBrand | null
}) {
  const [brand, setBrand] = useState<DemoBrand | null>(initialBrand)

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

export function DemoWhatsAppButton({ defaultHref }: { defaultHref: string }) {
  const brand = useDemoBrand()
  const href = brand?.whatsappNumber ? getWhatsAppUrl(brand) : defaultHref

  return (
    <a
      className="whatsapp-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Contacter ${brand?.agencyName ?? 'LeadFlow'} sur WhatsApp`}
      title="Nous contacter sur WhatsApp"
    >
      <svg
        aria-hidden="true"
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="currentColor"
        style={{ color: '#ffffff' }}
      >
        <path d="M16.04 3A12.9 12.9 0 0 0 5.13 22.77L3 29l6.45-2.07A12.96 12.96 0 1 0 16.04 3Zm0 23.72a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.83 1.23 1.25-3.72-.25-.39a10.73 10.73 0 1 1 8.67 4.6Zm5.89-8.04c-.32-.16-1.91-.94-2.21-1.05-.29-.11-.51-.16-.72.16-.22.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.33-.16-1.37-.5-2.61-1.61a9.77 9.77 0 0 1-1.81-2.25c-.19-.32-.02-.5.14-.66.15-.14.32-.38.49-.56.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.53-.54-.72-.55h-.62c-.22 0-.57.08-.87.4-.3.32-1.13 1.1-1.13 2.69s1.16 3.12 1.32 3.34c.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.48.21 2.03.13.62-.09 1.91-.78 2.18-1.53.27-.75.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z" />
      </svg>
    </a>
  )
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
