import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ASMAE_AREAS, ASMAE_PROPERTIES } from '../../asmaeImmobiliere/data'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'

const ASMAE_SLUG = 'asmae-immobilière'
const brand = getDemoBrandBySlug(ASMAE_SLUG, `/demo/${ASMAE_SLUG}`)!

function isAsmaeSlug(slug: string) {
  try {
    return decodeURIComponent(slug).normalize('NFC') === ASMAE_SLUG
  } catch {
    return false
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!isAsmaeSlug(slug)) return {}

  return {
    ...brand.metadata,
    robots: { index: false, follow: false },
  }
}

export default async function PersonalizedDemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!isAsmaeSlug(slug)) notFound()

  return (
    <DemoBrandProvider initialBrand={brand}>
      <HomeClient
        properties={ASMAE_PROPERTIES}
        locations={ASMAE_AREAS.map((area) => ({ ...area, subtitle: area.detail }))}
        heroImage="/demos/immo-built/test-agency-exterior.webp"
        featureImage="/demos/immo-built/test-agency-feature.webp"
        heroEyebrow="ASMAE IMMOBILIÈRE · NADOR"
        heroTitle="Votre bien à Nador,"
        heroAccent="en toute confiance."
        heroAccentStyle="sans"
        heroDescription="Appartements, villas, maisons et terrains à découvrir à Nador et ses environs."
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
