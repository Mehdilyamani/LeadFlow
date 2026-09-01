import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { DemoBrandProvider, DemoWhatsAppButton } from './demoBranding'
import { getDemoBrand, getHostname, getWhatsAppUrl } from './demoBrands'
import './global.css'

const WHATSAPP_URL =
  'https://wa.me/212723037305?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20services%20immobiliers'

const DEFAULT_METADATA: Metadata = {
  title: 'LeadFlow — Studio web au Maroc',
  description: 'Design et développement de sites web premium, rapides et pensés pour convertir.',
}

async function requestBrand() {
  const requestHeaders = await headers()
  return getDemoBrand(getHostname(requestHeaders.get('host')))
}

export async function generateMetadata(): Promise<Metadata> {
  const brand = await requestBrand()
  return brand?.metadata ?? DEFAULT_METADATA
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialBrand = await requestBrand()

  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icon.png?v=20260827" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/icon.png?v=20260827" type="image/png" />
      </head>
      <body className="antialiased">
        <Analytics />
        <SpeedInsights />
        <DemoBrandProvider initialBrand={initialBrand}>{children}</DemoBrandProvider>
        <style>{`
          .whatsapp-float {
            position: fixed;
            right: 24px;
            bottom: 24px;
            z-index: 9999;
            display: grid;
            width: 60px;
            height: 60px;
            place-items: center;
            border-radius: 50%;
            background: #25d366;
            box-shadow: 0 8px 24px rgba(16, 24, 40, 0.22);
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            transition: transform 180ms ease, box-shadow 180ms ease;
          }

          @media (hover: hover) {
            .whatsapp-float:hover {
              animation: whatsapp-pulse 1.25s ease-in-out infinite;
              transform: translateY(-2px) scale(1.04);
            }
          }

          .whatsapp-float:focus-visible {
            outline: 3px solid #ffffff;
            outline-offset: 3px;
          }

          @keyframes whatsapp-pulse {
            0%, 100% { box-shadow: 0 8px 24px rgba(16, 24, 40, 0.22), 0 0 0 0 rgba(37, 211, 102, 0.38); }
            50% { box-shadow: 0 10px 28px rgba(16, 24, 40, 0.26), 0 0 0 10px rgba(37, 211, 102, 0); }
          }

          @media (max-width: 640px) {
            .whatsapp-float {
              right: max(16px, env(safe-area-inset-right));
              bottom: max(16px, env(safe-area-inset-bottom));
              width: 56px;
              height: 56px;
              border: 2px solid rgba(255, 255, 255, 0.9);
              box-shadow: 0 8px 24px rgba(16, 24, 40, 0.24), 0 0 0 1px rgba(37, 211, 102, 0.18);
            }

            .whatsapp-float:active {
              transform: scale(0.94);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .whatsapp-float { transition: none; }
            .whatsapp-float:hover { animation: none; }
          }
        `}</style>
        <DemoWhatsAppButton
          defaultHref={initialBrand?.whatsappNumber ? getWhatsAppUrl(initialBrand) : WHATSAPP_URL}
        />
      </body>
    </html>
  )
}
