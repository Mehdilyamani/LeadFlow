import { GOOD_KECH_PROPERTIES } from '../../goodKech/data'

// Reuse the Marrakech catalogue while clearly identifying these as demonstration listings.
export const properties = GOOD_KECH_PROPERTIES.map((property) => ({
  ...property,
  badge: 'Démo',
}))

export const locations = [
  { name: 'Hivernage', subtitle: 'Appartements et résidences', image: '/demos/good-kech-immo/hivernage.webp' },
  { name: 'Guéliz', subtitle: 'Au cœur de la ville', image: '/demos/good-kech-immo/gueliz.webp' },
  { name: 'Médina', subtitle: 'Riads et maisons de caractère', image: '/demos/good-kech-immo/riad-medina.webp' },
  { name: 'Amelkis', subtitle: 'Villas et propriétés golf', image: '/demos/good-kech-immo/villa-amelkis.webp' },
  { name: 'Route de Tahanaout', subtitle: 'Terrains et projets', image: '/demos/good-kech-immo/tahanaout.webp' },
  { name: 'Route de l’Ourika', subtitle: 'Villas et jardins', image: '/demos/good-kech-immo/villa-ourika.webp' },
]
