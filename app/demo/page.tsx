import { DEMO_PROPERTIES } from '../lib/demoProperties'
import HomeClient from '../HomeClient'

const AGENCY_CONTEXT =
  'Maison Atlas Immobilier est une agence immobilière résidentielle au Maroc. ' +
  'Elle accompagne ses clients à Casablanca (Anfa, Aïn Diab, CFC), Marrakech (Médina, Palmeraie, Hivernage), Rabat et Tanger. ' +
  'Types de biens : villas, appartements de standing, penthouses, riads et opportunités d’investissement. ' +
  'Les prix et budgets doivent toujours être exprimés en MAD (dirhams marocains), jamais en CHF. ' +
  'Le ton doit être celui d’un conseiller immobilier professionnel, chaleureux, direct et discret. ' +
  'Le contact via WhatsApp est naturel pour les prospects marocains. ' +
  'Ne jamais mentionner LeadFlow, une démonstration, un logiciel ou une technologie sous-jacente.'

export default function DemoPage() {
  return (
    <HomeClient
      properties={DEMO_PROPERTIES}
      agencyContext={AGENCY_CONTEXT}
    />
  )
}