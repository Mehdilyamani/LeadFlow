import { IMMO_BUILT_PROPERTIES } from '../../immoBuilt/data'
import type { Property } from '../../lib/properties'

const places = [
  {
    id: 'ocean-villa-ville-verte',
    title: 'Villa contemporaine à Ville Verte',
    location: 'Ville Verte, Bouskoura',
    description: "Villa contemporaine aux volumes généreux dans l'environnement verdoyant de Ville Verte. Les espaces de réception s'ouvrent sur le jardin et la piscine, dans un cadre calme et recherché à Bouskoura.",
  },
  {
    id: 'ocean-appartement-golf-city',
    title: 'Appartement haut standing à Bouskoura Golf City',
    location: 'Bouskoura Golf City, Bouskoura',
    description: "Appartement lumineux au sein de Bouskoura Golf City, avec une distribution fluide, des finitions soignées et un environnement résidentiel proche des espaces verts et des services.",
  },
  {
    id: 'ocean-villa-green-town',
    title: 'Villa familiale à Green Town',
    location: 'Green Town, Bouskoura',
    description: "Villa familiale tournée vers le jardin à Green Town. Une adresse paisible avec des pièces de vie ouvertes, des chambres confortables et une circulation naturelle entre intérieur et extérieur.",
  },
  {
    id: 'ocean-appartement-victoria',
    title: 'Appartement avec terrasse à Victoria City',
    location: 'Victoria City, Bouskoura',
    description: "Appartement moderne avec terrasse à Victoria City, pensé pour un quotidien pratique et confortable à proximité des commerces, des écoles et des principaux accès de Bouskoura.",
  },
  {
    id: 'ocean-villa-prestigia',
    title: 'Villa premium à Prestigia Bouskoura',
    location: 'Prestigia, Bouskoura',
    description: "Villa élégante dans un environnement résidentiel premium à Prestigia Bouskoura. Les espaces lumineux, le jardin et les prestations composent une propriété adaptée à une vie familiale sereine.",
  },
  {
    id: 'ocean-appartement-centre',
    title: 'Appartement familial à Bouskoura Centre',
    location: 'Bouskoura Centre, Bouskoura',
    description: "Appartement familial bien agencé au centre de Bouskoura, avec un séjour généreux, trois chambres et un accès simple aux commerces, écoles et axes principaux.",
  },
]

export const properties: Property[] = IMMO_BUILT_PROPERTIES.map((property, index) => ({
  ...property,
  ...places[index],
  city: 'Bouskoura' as const,
}))

export const locations = [
  { name: 'Ville Verte', subtitle: 'Villas et espaces verts', image: '/demos/immo-built/test-agency-exterior.webp' },
  { name: 'Bouskoura Golf City', subtitle: 'Golf et résidences premium', image: '/demos/immo-built/test-agency-hero.webp' },
  { name: 'Green Town', subtitle: 'Calme et vie familiale', image: '/demos/immo-built/test-agency-villa-2.webp' },
  { name: 'Victoria City', subtitle: 'Résidences et proximité', image: '/demos/immo-built/test-agency-apartment.webp' },
  { name: 'Prestigia', subtitle: 'Villas et standing', image: '/demos/immo-built/test-agency-villa.webp' },
  { name: 'Bouskoura Centre', subtitle: 'Commerces et accessibilité', image: '/demos/immo-built/test-agency-feature.webp' },
]
