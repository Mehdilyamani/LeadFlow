-- Properties table for LeadFlow real estate application

CREATE TABLE IF NOT EXISTS properties (
  id            text        PRIMARY KEY,
  title         text        NOT NULL,
  location      text        NOT NULL,
  city          text        NOT NULL CHECK (city IN ('Casablanca', 'Marrakech', 'Rabat', 'Tanger')),
  price         text        NOT NULL,
  price_num     integer     NOT NULL,
  type          text        NOT NULL CHECK (type IN ('Villa', 'Appartement', 'Penthouse', 'Riad')),
  beds          smallint    NOT NULL,
  baths         smallint    NOT NULL,
  area          text        NOT NULL,
  image         text        NOT NULL,
  images        text[]      NOT NULL DEFAULT '{}',
  badge         text        NOT NULL,
  badge_color   text        NOT NULL,
  description   text        NOT NULL,
  features      text[]      NOT NULL DEFAULT '{}',
  is_featured   boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON properties FOR SELECT USING (true);

-- -----------------------------------------------------------------------
-- Seed data — 9 properties
-- -----------------------------------------------------------------------

INSERT INTO properties (
  id, title, location, city, price, price_num, type,
  beds, baths, area, image, images,
  badge, badge_color, description, features, is_featured
) VALUES

-- 1 -----------------------------------------------------------------------
(
  '1',
  'Villa Contemporaine',
  'Anfa, Casablanca',
  'Casablanca',
  '8 500 000',
  8500000,
  'Villa',
  5, 4,
  '450 m²',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80'
  ],
  'Exclusivité',
  'bg-amber-500',
  'Villa contemporaine d''exception nichée dans le quartier prisé d''Anfa. Architecture moderne aux lignes épurées, baignée de lumière naturelle. Espaces de vie généreux ouverts sur un jardin paysagé avec piscine à débordement. Finitions haut de gamme sélectionnées par un architecte d''intérieur de renom.',
  ARRAY[
    'Piscine à débordement',
    'Jardin paysagé 800 m²',
    'Cuisine Bulthaup équipée',
    'Garage double',
    'Domotique complète',
    'Cave à vin',
    'Salle de sport',
    'Conciergerie 24h/24'
  ],
  true
),

-- 2 -----------------------------------------------------------------------
(
  '2',
  'Penthouse Vue Mer',
  'Aïn Diab, Casablanca',
  'Casablanca',
  '4 200 000',
  4200000,
  'Penthouse',
  3, 2,
  '220 m²',
  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80'
  ],
  'Nouveau',
  'bg-emerald-500',
  'Penthouse d''exception en dernier étage avec vue panoramique sur l''Atlantique. Grande terrasse de 80 m² aménagée, parfaite pour recevoir. Intérieur contemporain avec des matériaux nobles. Résidence sécurisée avec gardien et parking souterrain.',
  ARRAY[
    'Terrasse 80 m²',
    'Vue mer panoramique',
    'Parking 2 places',
    'Gardien 24h/24',
    'Ascenseur privatif',
    'Climatisation centralisée',
    'Parquet chêne massif'
  ],
  true
),

-- 3 -----------------------------------------------------------------------
(
  '3',
  'Villa de Prestige',
  'Palmeraie, Marrakech',
  'Marrakech',
  '12 000 000',
  12000000,
  'Villa',
  6, 5,
  '680 m²',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80',
    'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1200&q=80'
  ],
  'Coup de cœur',
  'bg-rose-500',
  'Villa majestueuse au cœur de la Palmeraie de Marrakech. Architecture alliant le charme marocain traditionnel et le confort contemporain. Immense terrain planté de palmiers centenaires, avec piscine et pool-house. Un refuge de luxe absolu à 10 minutes de la Médina.',
  ARRAY[
    'Domaine 3 500 m²',
    'Piscine & pool-house',
    'Palmiers centenaires',
    'Hammam privatif',
    'Salon marocain d''apparat',
    'Personnel de maison',
    'Héliport possible',
    'Système d''irrigation automatique'
  ],
  true
),

-- 4 -----------------------------------------------------------------------
(
  '4',
  'Appartement Moderne',
  'Maarif, Casablanca',
  'Casablanca',
  '1 800 000',
  1800000,
  'Appartement',
  2, 1,
  '110 m²',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
    'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80',
    'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=1200&q=80'
  ],
  'Nouveau',
  'bg-emerald-500',
  'Bel appartement moderne dans un immeuble de standing au cœur du Maarif. Lumineux et bien agencé, avec des prestations de qualité. Idéal pour une première acquisition ou un investissement locatif rentable dans l''un des quartiers les plus dynamiques de Casablanca.',
  ARRAY[
    'Balcon 15 m²',
    'Cuisine aménagée',
    'Parking sous-sol',
    'Gardien résidence',
    'Double vitrage',
    'Parquet flottant',
    'Proche commerces & transports'
  ],
  false
),

-- 5 -----------------------------------------------------------------------
(
  '5',
  'Riad de Luxe',
  'Médina, Marrakech',
  'Marrakech',
  '3 500 000',
  3500000,
  'Riad',
  4, 3,
  '320 m²',
  'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=80'
  ],
  'Exclusivité',
  'bg-amber-500',
  'Riad d''exception entièrement rénové dans la Médina de Marrakech. Zellige artisanal, mosaïques, stucs sculptés — l''artisanat marocain à son apogée. Patio central avec fontaine traditionnelle, terrasse avec vue sur les toits et la Koutoubia. Parfait pour résidence principale ou hébergement de charme.',
  ARRAY[
    'Patio central fontaine',
    'Terrasse vue Koutoubia',
    'Zellige & stucs artisanaux',
    'Hammam intégré',
    'Rénové à neuf 2023',
    'Titre foncier propre',
    'Potentiel maison d''hôtes'
  ],
  false
),

-- 6 -----------------------------------------------------------------------
(
  '6',
  'Villa Bord de Mer',
  'Souissi, Rabat',
  'Rabat',
  '6 200 000',
  6200000,
  'Villa',
  4, 3,
  '380 m²',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'
  ],
  'Coup de cœur',
  'bg-rose-500',
  'Superbe villa contemporaine dans le quartier résidentiel de Souissi, à deux pas des ambassades et des institutions. Jardin arborisé avec piscine, double salon, bureaux et suite parentale avec dressing. Sécurité renforcée dans une rue privée.',
  ARRAY[
    'Rue privée sécurisée',
    'Jardin & piscine',
    'Double salon',
    'Bureau indépendant',
    'Suite parentale dressing',
    'Garage 3 voitures',
    'Proche quartier diplomatique'
  ],
  false
),

-- 7 -----------------------------------------------------------------------
(
  '7',
  'Penthouse Panoramique',
  'Gauthier, Casablanca',
  'Casablanca',
  '5 800 000',
  5800000,
  'Penthouse',
  3, 3,
  '280 m²',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80'
  ],
  'Exclusivité',
  'bg-amber-500',
  'Penthouse d''architecte au sommet d''un immeuble emblématique du quartier Gauthier. Double terrasse de 120 m² avec jacuzzi extérieur et vue à 360° sur Casablanca. Matériaux nobles, domotique avancée, prestations cinq étoiles. Un bien rare sur le marché.',
  ARRAY[
    'Double terrasse 120 m²',
    'Jacuzzi extérieur',
    'Vue 360° sur la ville',
    'Domotique Crestron',
    'Ascenseur privatif',
    'Cave à vin climatisée',
    '3 suites parentales'
  ],
  false
),

-- 8 -----------------------------------------------------------------------
(
  '8',
  'Appartement Standing',
  'Agdal, Rabat',
  'Rabat',
  '2 200 000',
  2200000,
  'Appartement',
  3, 2,
  '145 m²',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80',
    'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=1200&q=80'
  ],
  'Nouveau',
  'bg-emerald-500',
  'Grand appartement de standing dans une résidence récente de l''Agdal. Très bien agencé avec triple exposition, lumineux et calme. Finitions soignées, cuisine ouverte haut de gamme. À proximité des grandes écoles, des ministères et du tramway.',
  ARRAY[
    'Triple exposition',
    'Grande terrasse 25 m²',
    'Cuisine ouverte équipée',
    'Parking 2 places',
    'Cave privative',
    'Proche tramway & écoles',
    'Résidence récente 2022'
  ],
  false
),

-- 9 -----------------------------------------------------------------------
(
  '9',
  'Villa Océan',
  'Malabata, Tanger',
  'Tanger',
  '18 000 000',
  18000000,
  'Villa',
  7, 6,
  '850 m²',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80'
  ],
  'Exclusivité',
  'bg-amber-500',
  'Propriété d''exception face au détroit de Gibraltar à Malabata. Cette villa somptueuse de 850 m² trône sur un terrain de 5 000 m² avec vue imprenable sur l''Atlantique et la Méditerranée. Architecture contemporaine signée par un cabinet international, piscine à débordement, spa complet et héliport. Un bien unique au Maroc.',
  ARRAY[
    'Vue détroit de Gibraltar',
    'Terrain 5 000 m²',
    'Piscine à débordement',
    'Spa & hammam privatifs',
    'Héliport homologué',
    'Cinéma privé',
    'Salle de sport équipée',
    'Personnel de maison logé',
    'Garage 6 voitures'
  ],
  false
)

ON CONFLICT (id) DO NOTHING;
