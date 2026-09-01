'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import type { DemoBrand } from '../demoBrands'
import { getBrandHref, getWhatsAppUrl } from '../demoBrands'

const LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos biens', href: '/biens' },
  { label: 'Quartiers', href: '/#quartiers' },
  { label: 'Accompagnement', href: '/#accompagnement' },
]

export default function ImmoBuiltMobileMenu({ brand }: { brand: DemoBrand }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const whatsapp = getWhatsAppUrl(brand)

  return (
    <>
      <button type="button" onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center border border-white/18 lg:hidden" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} aria-controls="immo-built-mobile-menu">
        {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
      {menuOpen && (
        <div id="immo-built-mobile-menu" className="demo-menu-enter absolute inset-x-0 top-full border-t border-white/10 bg-[#091b2c] px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col">
            {LINKS.map((link) => <Link key={link.href} href={getBrandHref(brand, link.href)} onClick={() => setMenuOpen(false)} className="border-b border-white/8 py-3.5 text-sm text-white/72">{link.label}</Link>)}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`tel:+${brand.whatsappNumber}`} className="flex min-h-12 items-center justify-center gap-2 border border-white/16 text-xs"><Phone className="h-4 w-4" /> Appeler</a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 bg-[#c69a62] text-xs font-semibold text-[#0c2033]"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
