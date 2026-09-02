import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoBrandProvider } from '../../demoBranding'
import { getDemoBrandBySlug } from '../../demoBrands'
import HomeClient from '../../HomeClient'
import GoodKechHome from '../../goodKech/GoodKechHome'
import { IMMO_BUILT_AREAS, IMMO_BUILT_PROPERTIES } from '../../immoBuilt/data'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const brand = getDemoBrandBySlug(slug)

  if (!brand?.experience) return {}

  return {
    ...brand.metadata,
    robots: { index: false, follow: false },
  }
}

export default async function DemoPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const brand = getDemoBrandBySlug(slug)

  if (brand?.experience === 'good-kech-immo') {
    return <GoodKechHome brand={brand} />
  }

  if (brand?.experience === 'immo-built') {
    return (
      <DemoBrandProvider initialBrand={brand}>
        <HomeClient
          properties={IMMO_BUILT_PROPERTIES}
          locations={IMMO_BUILT_AREAS.map((area) => ({ ...area, subtitle: area.detail }))}
          heroImage="/demos/immo-built/hero-cfc.webp"
          featureImage="/demos/immo-built/office.webp"
        />
      </DemoBrandProvider>
    )
  }

  notFound()
}
