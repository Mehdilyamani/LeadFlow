import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { DemoBrandProvider } from './demoBranding'
import './global.css'

const WHATSAPP_URL =
  'https://wa.me/212723037305?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20services%20immobiliers'

export const metadata: Metadata = {
  title: 'LeadFlow — Studio web au Maroc',
  description: 'Design et développement de sites web premium, rapides et pensés pour convertir.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icon.png?v=20260827" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/icon.png?v=20260827" type="image/png" />
      </head>
      <body className="antialiased">
        <Analytics />
        <SpeedInsights />
        <DemoBrandProvider>{children}</DemoBrandProvider>
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
        <a
          className="whatsapp-float"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nous contacter sur WhatsApp"
          title="Nous contacter sur WhatsApp"
        >
          <svg
            aria-hidden="true"
            width="30"
            height="30"
            viewBox="0 0 32 32"
            fill="currentColor"
            style={{ color: '#ffffff' }}
          >
            <path d="M16.04 3A12.9 12.9 0 0 0 5.13 22.77L3 29l6.45-2.07A12.96 12.96 0 1 0 16.04 3Zm0 23.72a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.83 1.23 1.25-3.72-.25-.39a10.73 10.73 0 1 1 8.67 4.6Zm5.89-8.04c-.32-.16-1.91-.94-2.21-1.05-.29-.11-.51-.16-.72.16-.22.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.33-.16-1.37-.5-2.61-1.61a9.77 9.77 0 0 1-1.81-2.25c-.19-.32-.02-.5.14-.66.15-.14.32-.38.49-.56.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.53-.54-.72-.55h-.62c-.22 0-.57.08-.87.4-.3.32-1.13 1.1-1.13 2.69s1.16 3.12 1.32 3.34c.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.48.21 2.03.13.62-.09 1.91-.78 2.18-1.53.27-.75.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z" />
          </svg>
        </a>
      </body>
    </html>
  )
}
