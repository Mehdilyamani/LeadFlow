import { notFound } from 'next/navigation'
import { ASMAE_PROPERTIES } from '../../../../asmaeImmobiliere/data'
import PropertyDetail from '../../../../biens/[id]/PropertyDetail'
import { DemoBrandProvider } from '../../../../demoBranding'
import { getDemoBrandBySlug } from '../../../../demoBrands'

const ASMAE_SLUG = 'asmae-immobilière'
const brand = getDemoBrandBySlug(ASMAE_SLUG, `/demo/${ASMAE_SLUG}`)!

function isAsmaeSlug(slug: string) {
  try {
    return decodeURIComponent(slug).normalize('NFC') === ASMAE_SLUG
  } catch {
    return false
  }
}

export default async function PersonalizedPropertyPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  if (!isAsmaeSlug(slug)) notFound()

  const property = ASMAE_PROPERTIES.find((item) => item.id === id)
  if (!property) notFound()

  const similar = ASMAE_PROPERTIES.filter((item) => item.id !== id).slice(0, 3)

  return (
    <DemoBrandProvider initialBrand={brand}>
      <PropertyDetail property={property} similar={similar} />
    </DemoBrandProvider>
  )
}
