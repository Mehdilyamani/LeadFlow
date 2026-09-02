import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDemoBrandBySlug } from '../../demoBrands'
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
      <GoodKechHome
        brand={brand}
        properties={IMMO_BUILT_PROPERTIES}
        locations={IMMO_BUILT_AREAS}
        heroImage="/demos/immo-built/hero-cfc.webp"
        featureImage="/demos/immo-built/office.webp"
      />
    )
  }

  notFound()
}
