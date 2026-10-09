import type { Metadata } from 'next'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'
import { locations, properties } from './data'

const brand = getDemoBrandBySlug('achorafaa-invest', '/demo/achorafaa-invest')!

export const metadata: Metadata = {
  ...brand.metadata,
  robots: { index: false, follow: false },
}

export default function AchorafaaInvestDemoPage() {
  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={properties}
        locations={locations}
        heroImage="/demos/good-kech-immo/hero.webp"
        featureImage="/demos/good-kech-immo/villa-ourika.webp"
        heroEyebrow="ACHORAFAA INVEST · MARRAKECH"
        heroTitle="Plus de 15 850 biens immobiliers"
        heroAccent="à la vente et à la location."
        heroAccentStyle="sans"
        heroDescription="Achorafaa Invest vous accompagne dans votre recherche immobilière à Marrakech et ses environs."
        transactionLabel="Vente · Location"
        compactMobileHero
        instantHeroText
        propertyCardRevealOffset={24}
        continuousAutoSlide
        continuousSlideSpeed={21}
        autoSlideResumeDelayMs={3000}
      />
    </DemoBrandProvider>
  )
}
