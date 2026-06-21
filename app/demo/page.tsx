import type { Property } from '../lib/properties'
import HomeClient from '../HomeClient'

const SWISS_PROPERTIES: Property[] = [
  {
    id: 'ch-1',
    title: 'Villa Vue Lac',
    location: 'Cologny, Genève',
    city: 'Genève',
    price: '4 800 000',
    priceNum: 4800000,
    type: 'Villa',
    beds: 5,
    baths: 4,
    area: '380 m²',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    ],
    badge: 'Exclusivité',
    badgeColor: 'bg-amber-500',
    description: "Villa d'exception à Cologny avec vue imprenable sur le lac Léman. Architecture contemporaine aux lignes épurées, jardin paysagé et piscine chauffée. Finitions haut de gamme, domotique complète, accès direct au lac.",
    features: ['Vue lac Léman', 'Piscine chauffée', 'Jardin paysagé 600 m²', 'Domotique complète', 'Garage triple', 'Cave à vin', 'Salle de sport'],
  },
  {
    id: 'ch-2',
    title: 'Appartement Standing',
    location: 'Ouchy, Lausanne',
    city: 'Lausanne',
    price: '1 250 000',
    priceNum: 1250000,
    type: 'Appartement',
    beds: 3,
    baths: 2,
    area: '118 m²',
    image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    ],
    badge: 'Coup de cœur',
    badgeColor: 'bg-rose-500',
    description: "Appartement de standing en bord de lac à Ouchy. Lumineux et bien agencé, avec terrasse et vue partielle sur le Léman. Résidence sécurisée, proche du métro et des commerces.",
    features: ['Terrasse 20 m²', 'Vue lac partielle', 'Parking souterrain', 'Cave privative', 'Ascenseur', 'Proche métro m2'],
  },
  {
    id: 'ch-3',
    title: 'Chalet de Prestige',
    location: 'Verbier, Valais',
    city: 'Verbier',
    price: '3 200 000',
    priceNum: 3200000,
    type: 'Chalet',
    beds: 5,
    baths: 3,
    area: '240 m²',
    image: 'https://images.unsplash.com/photo-1482192505345-5852cc5a7d08?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1482192505345-5852cc5a7d08?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=80',
    ],
    badge: 'Rare',
    badgeColor: 'bg-amber-500',
    description: "Chalet de prestige au coeur du domaine skiable de Verbier. Vue panoramique sur les 4 000 m, spa privatif, finitions bois noble. Accès ski aux pieds. Idéal résidence principale ou investissement saisonnier.",
    features: ['Ski aux pieds', 'Vue panoramique 4000 m', 'Spa & sauna privatifs', 'Cheminée pierre', 'Bois noble massif', 'Parking 3 voitures', 'Buanderie équipée'],
  },
]

export default function DemoPage() {
  return <HomeClient properties={SWISS_PROPERTIES} />
}
