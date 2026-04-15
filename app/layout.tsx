import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './global.css'

export const metadata: Metadata = {
  title: 'Prestige Immobilier — Biens d\'Exception au Maroc',
  description: 'Votre agence immobilière premium à Casablanca, Marrakech et Rabat. Villas, appartements de standing et opportunités d\'investissement.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  )
}
