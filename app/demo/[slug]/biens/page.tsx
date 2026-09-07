import { notFound } from 'next/navigation'
import { ASMAE_PROPERTIES } from '../../../asmaeImmobiliere/data'
import BiensClient from '../../../biens/BiensClient'
import { DemoBrandProvider } from '../../../demoBranding'
import { getDemoBrandBySlug } from '../../../demoBrands'

const ASMAE_SLUG = 'asmae-immobilière'
const brand = getDemoBrandBySlug(ASMAE_SLUG, `/demo/${ASMAE_SLUG}`)!

function isAsmaeSlug(slug: string) {
  try {
    return decodeURIComponent(slug).normalize('NFC') === ASMAE_SLUG
  } catch {
    return false
  }
}

export default async function PersonalizedCataloguePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!isAsmaeSlug(slug)) notFound()

  return (
    <DemoBrandProvider initialBrand={brand}>
      <BiensClient
        properties={ASMAE_PROPERTIES}
        heroImage="/demos/immo-built/test-agency-catalogue.webp"
        directToDetails
      />
    </DemoBrandProvider>
  )
}
