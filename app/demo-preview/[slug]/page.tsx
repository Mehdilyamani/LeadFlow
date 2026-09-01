import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDemoBrandBySlug } from '../../demoBrands'
import GoodKechHome from '../../goodKech/GoodKechHome'
import ImmoBuiltHome from '../../immoBuilt/ImmoBuiltHome'

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
    return <ImmoBuiltHome brand={brand} />
  }

  notFound()
}
