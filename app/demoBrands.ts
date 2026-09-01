export type DemoBrand = {
  agencyName: string
  primaryColor: string
  secondaryColor: string
  logoPath: string
  experience?: 'good-kech-immo'
  city?: string
  whatsappNumber?: string
  displayPhone?: string
  whatsappMessage?: string
  metadata?: {
    title: string
    description: string
  }
}

export const DEMO_BRANDS: Record<string, DemoBrand> = {
  'test-agency.leadflowimmo.com': {
    agencyName: 'Test Agency',
    primaryColor: '#dc2626',
    secondaryColor: '#000000',
    logoPath: '/test-agency-logo.png',
  },
  'good-kech-immo.leadflowimmo.com': {
    agencyName: 'Good Kech Immo',
    primaryColor: '#b28a55',
    secondaryColor: '#171512',
    logoPath: '/448984470_2194698364229742_4357827263505008078_n.jpg',
    experience: 'good-kech-immo',
    city: 'Marrakech',
    whatsappNumber: '212675633077',
    displayPhone: '+212 6 75 63 30 77',
    whatsappMessage:
      "Bonjour, je souhaite avoir plus d'informations auprès de Good Kech Immo.",
    metadata: {
      title: 'Good Kech Immo | Immobilier à Marrakech',
      description:
        'Découvrez une sélection de villas, riads, appartements et opportunités immobilières à Marrakech avec Good Kech Immo.',
    },
  },
}

export function getDemoBrand(hostname: string): DemoBrand | null {
  return DEMO_BRANDS[hostname.trim().toLowerCase()] ?? null
}

export function getHostname(hostHeader: string | null): string {
  return (hostHeader ?? '').split(':')[0].trim().toLowerCase()
}

export function getWhatsAppUrl(brand: DemoBrand, message?: string): string {
  if (!brand.whatsappNumber) return '#'

  const text = message ?? brand.whatsappMessage
  return `https://wa.me/${brand.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
