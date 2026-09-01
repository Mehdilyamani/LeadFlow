'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react'
import type { DemoBrand } from '../demoBrands'
import { getWhatsAppUrl } from '../demoBrands'
import type { Property } from '../lib/properties'

export function ImmoBuiltLogo({ brand, light = false }: { brand: DemoBrand; light?: boolean }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <span className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
        <Image
          src={brand.logoPath}
          alt={`${brand.agencyName} logo`}
          fill
          sizes="56px"
          className="object-contain"
          priority
        />
      </span>
      <span className="min-w-0">
        <span className={`block truncate text-[13px] font-semibold tracking-[0.08em] ${light ? 'text-white' : 'text-[#0c2033]'}`}>
          {brand.agencyName}
        </span>
        <span className={`mt-1 block text-[8px] uppercase tracking-[0.26em] ${light ? 'text-white/45' : 'text-[#7f8589]'}`}>
          Immobilier · Casablanca
        </span>
      </span>
    </span>
  )
}

export function ImmoBuiltHeader({ brand, active = 'home' }: { brand: DemoBrand; active?: 'home' | 'properties' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const whatsapp = getWhatsAppUrl(brand)
  const links = [
    { label: 'Accueil', href: '/', key: 'home' },
    { label: 'Nos biens', href: '/biens', key: 'properties' },
    { label: 'Quartiers', href: '/#quartiers', key: 'areas' },
    { label: 'Accompagnement', href: '/#accompagnement', key: 'service' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#091b2c]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:h-[82px] sm:px-7 lg:px-12">
        <Link href="/" aria-label={`Accueil ${brand.agencyName}`}>
          <ImmoBuiltLogo brand={brand} light />
        </Link>

        <nav className="hidden items-center gap-8 text-[10px] font-medium uppercase tracking-[0.13em] text-white/55 lg:flex">
          {links.map((link) => (
            <Link key={link.key} href={link.href} className={`transition-colors hover:text-white ${active === link.key ? 'text-[#d7b37b]' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a href={`tel:+${brand.whatsappNumber}`} className="hidden items-center gap-2 border border-white/15 px-4 py-2.5 text-[10px] font-semibold text-white transition-colors hover:bg-white hover:text-[#0c2033] sm:inline-flex">
            <Phone className="h-3.5 w-3.5" /> {brand.displayPhone}
          </a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 bg-[#c69a62] px-4 py-2.5 text-[10px] font-semibold text-[#0c2033] transition-colors hover:bg-[#dfb77f] md:inline-flex">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center border border-white/18 lg:hidden" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="border-t border-white/10 bg-[#091b2c] px-4 pb-5 pt-3 lg:hidden">
            <nav className="mx-auto flex max-w-[1440px] flex-col">
              {links.map((link) => <Link key={link.key} href={link.href} onClick={() => setMenuOpen(false)} className="border-b border-white/8 py-3.5 text-sm text-white/72">{link.label}</Link>)}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={`tel:+${brand.whatsappNumber}`} className="flex min-h-11 items-center justify-center gap-2 border border-white/16 text-xs"><Phone className="h-4 w-4" /> Appeler</a>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center gap-2 bg-[#c69a62] text-xs font-semibold text-[#0c2033]"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function ImmoReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

export function ImmoHeading({ eyebrow, title, copy, inverse = false }: { eyebrow: string; title: string; copy?: string; inverse?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className={`mb-4 text-[9px] font-semibold uppercase tracking-[0.28em] ${inverse ? 'text-[#d7b37b]' : 'text-[#9b7446]'}`}>{eyebrow}</p>
      <h2 className={`text-[34px] font-semibold leading-[1.06] tracking-[-0.045em] sm:text-5xl lg:text-[58px] ${inverse ? 'text-white' : 'text-[#0c2033]'}`}>{title}</h2>
      {copy && <p className={`mt-5 max-w-2xl text-[15px] leading-7 ${inverse ? 'text-white/55' : 'text-[#687078]'}`}>{copy}</p>}
    </div>
  )
}

export function ImmoPropertyCard({ brand, property, priority = false }: { brand: DemoBrand; property: Property; priority?: boolean }) {
  const message = `Bonjour, je souhaite avoir plus d'informations sur ce bien : « ${property.title} ».`
  return (
    <article className="group bg-white">
      <Link href={`/biens/${property.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[#dfe2e3]">
        <Image src={property.image} alt={property.title} fill priority={priority} sizes="(max-width: 768px) 92vw, (max-width: 1100px) 47vw, 31vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
        <span className="absolute left-4 top-4 bg-[#0c2033]/88 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">Bien de démonstration</span>
      </Link>
      <div className="border-x border-b border-[#0c2033]/10 p-5 sm:p-6">
        <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9b7446]"><MapPin className="h-3 w-3" /> {property.location}</p>
        <Link href={`/biens/${property.id}`}><h3 className="mt-2.5 min-h-[52px] text-[21px] font-semibold leading-[1.18] tracking-[-0.025em] text-[#0c2033] transition-colors group-hover:text-[#9b7446]">{property.title}</h3></Link>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-y border-[#0c2033]/8 py-3 text-[10px] text-[#687078]">
          {property.beds > 0 && <span className="flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5" /> {property.beds} ch.</span>}
          {property.baths > 0 && <span className="flex items-center gap-1.5"><Bath className="h-3.5 w-3.5" /> {property.baths} sdb</span>}
          <span className="flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" /> {property.area}</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div><p className="text-[8px] uppercase tracking-[0.18em] text-[#949a9e]">Prix indicatif</p><p className="mt-1 text-[15px] font-semibold text-[#0c2033]">{property.price} MAD</p></div>
          <a href={getWhatsAppUrl(brand, message)} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 shrink-0 place-items-center bg-[#0c2033] text-white transition-colors hover:bg-[#c69a62] hover:text-[#0c2033]" aria-label={`Demander des informations sur ${property.title}`}><ArrowUpRight className="h-4 w-4" /></a>
        </div>
      </div>
    </article>
  )
}

export function ImmoBuiltFooter({ brand }: { brand: DemoBrand }) {
  return (
    <footer className="bg-[#071624] px-4 pb-24 pt-14 text-white sm:px-7 sm:pb-16 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 border-b border-white/10 pb-11 md:grid-cols-[1.35fr_.75fr_.8fr]">
          <div><ImmoBuiltLogo brand={brand} light /><p className="mt-5 max-w-md text-sm leading-6 text-white/46">Une expérience immobilière moderne pour découvrir des biens de démonstration à Casablanca et échanger simplement sur votre projet.</p></div>
          <div><p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d7b37b]">Navigation</p><div className="mt-4 flex flex-col gap-2.5 text-sm text-white/55"><Link href="/">Accueil</Link><Link href="/biens">Nos biens</Link><Link href="/#quartiers">Quartiers</Link></div></div>
          <div><p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d7b37b]">Contact</p><div className="mt-4 flex flex-col gap-2.5 text-sm text-white/55"><a href={`tel:+${brand.whatsappNumber}`}>{brand.displayPhone}</a><a href={getWhatsAppUrl(brand)} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a><span>Casablanca, Maroc</span></div></div>
        </div>
        <div className="flex flex-col gap-2 pt-6 text-[10px] tracking-[0.08em] text-white/30 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} {brand.agencyName}</span><span>Immobilier · Casablanca</span></div>
      </div>
    </footer>
  )
}
