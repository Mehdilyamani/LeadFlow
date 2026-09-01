'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import type { DemoBrand } from '../demoBrands'
import { getBrandHref, getWhatsAppUrl } from '../demoBrands'

const LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos propriétés', href: '/biens' },
  { label: 'Quartiers', href: '/#quartiers' },
  { label: 'Notre approche', href: '/#approche' },
]

export default function GoodKechMobileMenu({ brand }: { brand: DemoBrand }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const generalWhatsApp = getWhatsAppUrl(brand)

  return (
    <>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="grid h-10 w-10 place-items-center border border-white/18 text-white lg:hidden"
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOpen}
        aria-controls="good-kech-mobile-menu"
      >
        {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {menuOpen && (
        <div
          id="good-kech-mobile-menu"
          className="gki-menu-enter absolute inset-x-0 top-full border-t border-white/10 bg-[#171512] px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl lg:hidden"
        >
          <nav className="mx-auto flex max-w-[1440px] flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={getBrandHref(brand, link.href)}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/8 px-1 py-3.5 text-sm text-white/78"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
              <a href={`tel:+${brand.whatsappNumber}`} className="flex min-h-12 items-center justify-center gap-2 border border-white/16 px-3 text-xs text-white">
                <Phone className="h-4 w-4" /> Appeler
              </a>
              <a href={generalWhatsApp} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 bg-[#b28a55] px-3 text-xs font-semibold text-white">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
