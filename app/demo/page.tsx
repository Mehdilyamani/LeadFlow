import type { Property } from '../lib/properties'
import HomeClient from '../HomeClient'
import Script from 'next/script'

const SWISS_PROPERTIES: Property[] = [
  {
    id: 'ma-1',
    title: 'Villa d\'Époque Anfa',
    location: 'Anfa, Casablanca',
    city: 'Casablanca',
    price: '8 500 000',
    priceNum: 8500000,
    type: 'Villa',
    beds: 5,
    baths: 4,
    area: '450 m²',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    ],
    badge: 'Exclusivité',
    badgeColor: 'bg-amber-500',
    description: "Villa de prestige à Anfa avec vue dégagée sur l'océan. Architecture marocaine traditionnelle revisitée, patio avec fontaine, jardin climatisé et piscine. Finitions haut de gamme, domotique complète, accès direct aux commerces de prestige.",
    features: ['Vue océan', 'Piscine chauffée', 'Patio traditionnel', 'Domotique complète', 'Garage double', 'Salon marocain', 'Hammam privatif'],
  },
  {
    id: 'ma-2',
    title: 'Penthouse Vue Mer',
    location: 'Aïn Diab, Casablanca',
    city: 'Casablanca',
    price: '4 200 000',
    priceNum: 4200000,
    type: 'Appartement',
    beds: 3,
    baths: 2,
    area: '220 m²',
    image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    ],
    badge: 'Coup de cœur',
    badgeColor: 'bg-rose-500',
    description: "Penthouse de standing en bord de mer à Aïn Diab. Lumineux et raffiné, avec terrasse panoramique et vue spectaculaire sur l'océan Atlantique. Résidence sécurisée 24h/24, proche des restaurants haut de gamme et clubs privés.",
    features: ['Terrasse 40 m²', 'Vue océan', 'Parking couvert', 'Cave climatisée', 'Ascenseur privé', 'Accès plage'],
  },
  {
    id: 'ma-3',
    title: 'Riad de Luxe Medina',
    location: 'Medina, Marrakech',
    city: 'Marrakech',
    price: '6 800 000',
    priceNum: 6800000,
    type: 'Riad',
    beds: 6,
    baths: 4,
    area: '380 m²',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80',
      'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&q=80',
    ],
    badge: 'Rare',
    badgeColor: 'bg-amber-500',
    description: "Riad d'exception au cœur de la Médina de Marrakech. Authentique architecture marocaine avec patio central à ciel ouvert, fontaines et zellige. Entièrement rénové, équipements modernes, spa privatif. Idéal résidence principale ou investissement touristique.",
    features: ['Patio traditionnel', 'Terrasse Kasbah', 'Spa et hammam', 'Fontaines', 'Zellige artisanal', 'Cuisine marocaine équipée', 'Bibliothèque orientale'],
  },
]

const AGENCY_CONTEXT =
  "Agence immobilière de prestige au Maroc. " +
  "Spécialisée dans les villes de Casablanca (Anfa, Aïn Diab), Marrakech (Medina, Palmeraie), Rabat et Tanger. " +
  "Types de biens : villas de prestige, penthouses vue océan, riads de luxe, apartements de standing. " +
  "Prix en MAD (dirhams marocains). Clientèle marocaine et internationale. " +
  "Pour le budget, utilise MAD (pas CHF ni EUR). Contact via WhatsApp naturel pour les prospects marocains."

export default function DemoPage() {
  return (
    <>
      <HomeClient properties={SWISS_PROPERTIES} agencyContext={AGENCY_CONTEXT} />
      <Script
        src="/leadflow-widget.js"
        strategy="lazyOnload"
        data-agency="Agence de Prestige Maroc"
        data-client-id="leadflow"
        data-agency-context={AGENCY_CONTEXT}
        async
      />
    </>
  )
}
