'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
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

export const GKI = {
  ink: '#171512',
  cream: '#f6f0e6',
  paper: '#fcfaf6',
  gold: '#b28a55',
  earth: '#9a5b44',
}

export function GoodKechLogo({ brand, light = false }: { brand: DemoBrand; light?: boolean }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-3">
      <span className={`relative h-11 w-11 shrink-0 overflow-hidden border ${light ? 'border-white/20' : 'border-black/10'} bg-black sm:h-12 sm:w-12`}>
        <Image
          src={brand.logoPath}
          alt={`${brand.agencyName} logo`}
          fill
          sizes="48px"
          className="object-contain"
          priority
        />
      </span>
      <span className="min-w-0 leading-none">
        <span className={`block truncate text-[13px] font-semibold tracking-[0.13em] sm:text-[14px] ${light ? 'text-white' : 'text-[#171512]'}`}>
          {brand.agencyName}
        </span>
        <span className={`mt-1.5 block text-[8px] font-medium uppercase tracking-[0.3em] ${light ? 'text-white/48' : 'text-[#8a7256]'}`}>
          Immobilier · Marrakech
        </span>
      </span>
    </span>
  )
}

export function GoodKechHeader({ brand, active = 'home' }: { brand: DemoBrand; active?: 'home' | 'properties' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const generalWhatsApp = getWhatsAppUrl(brand)

  const links = [
    { label: 'Accueil', href: '/', key: 'home' },
    { label: 'Nos propriétés', href: '/biens', key: 'properties' },
    { label: 'Quartiers', href: '/#quartiers', key: 'areas' },
    { label: 'Notre approche', href: '/#approche', key: 'approach' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#171512]/94 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:h-[82px] sm:px-7 lg:px-12">
        <Link href="/" aria-label={`Accueil ${brand.agencyName}`}>
          <GoodKechLogo brand={brand} light />
        </Link>

        <nav className="hidden items-center gap-8 text-[11px] font-medium tracking-[0.08em] text-white/62 lg:flex">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`transition-colors duration-200 hover:text-white ${active === link.key ? 'text-[#d7b986]' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={`tel:+${brand.whatsappNumber}`}
            className="hidden items-center gap-2 border border-white/16 px-4 py-2.5 text-[10px] font-semibold tracking-[0.05em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#171512] sm:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" /> {brand.displayPhone}
          </a>
          <a
            href={generalWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 bg-[#b28a55] px-4 py-2.5 text-[10px] font-semibold tracking-[0.05em] text-white transition-colors hover:bg-[#c19a65] md:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center border border-white/18 text-white lg:hidden"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-[#171512] px-4 pb-5 pt-3 lg:hidden"
          >
            <nav className="mx-auto flex max-w-[1440px] flex-col">
              {links.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/8 px-1 py-3.5 text-sm text-white/78"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                <a href={`tel:+${brand.whatsappNumber}`} className="flex items-center justify-center gap-2 border border-white/16 px-3 py-3 text-xs text-white">
                  <Phone className="h-4 w-4" /> Appeler
                </a>
                <a href={generalWhatsApp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#b28a55] px-3 py-3 text-xs font-semibold text-white">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, copy, inverse = false }: { eyebrow: string; title: string; copy?: string; inverse?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className={`mb-4 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.28em] ${inverse ? 'text-[#d7b986]' : 'text-[#9a7241]'}`}>
        <span className="h-px w-8 bg-current" /> {eyebrow}
      </p>
      <h2 className={`font-serif text-[34px] leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[58px] ${inverse ? 'text-white' : 'text-[#171512]'}`}>
        {title}
      </h2>
      {copy && <p className={`mt-5 max-w-2xl text-[15px] leading-7 ${inverse ? 'text-white/58' : 'text-[#665f56]'}`}>{copy}</p>}
    </div>
  )
}

export function GoodKechPropertyCard({ brand, property, priority = false }: { brand: DemoBrand; property: Property; priority?: boolean }) {
  const message = `Bonjour, je souhaite avoir plus d'informations sur le bien « ${property.title} ».`

  return (
    <article className="group min-w-0 bg-[#fcfaf6]">
      <Link href={`/biens/${property.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[#dfd7ca] sm:aspect-[5/4]">
        <Image
          src={property.image}
          alt={property.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/34 via-transparent to-black/5" />
        <span className="absolute left-4 top-4 bg-[#fcfaf6]/94 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#5f4932] backdrop-blur">
          {property.badge}
        </span>
      </Link>
      <div className="border-x border-b border-black/8 px-4 pb-5 pt-5 sm:px-5 sm:pb-6">
        <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9a7241]">
          <MapPin className="h-3 w-3" /> {property.location}
        </p>
        <Link href={`/biens/${property.id}`}>
          <h3 className="mt-2.5 min-h-[52px] font-serif text-[23px] leading-[1.12] tracking-[-0.025em] text-[#171512] transition-colors group-hover:text-[#8f693d]">
            {property.title}
          </h3>
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-black/7 py-3 text-[10px] text-[#6d665e]">
          {property.beds > 0 && <span className="flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5" /> {property.beds} ch.</span>}
          {property.baths > 0 && <span className="flex items-center gap-1.5"><Bath className="h-3.5 w-3.5" /> {property.baths} sdb</span>}
          <span className="flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" /> {property.area}</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[8px] uppercase tracking-[0.18em] text-[#958b7f]">Prix</p>
            <p className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-[#171512]">{property.price} MAD</p>
          </div>
          <a
            href={getWhatsAppUrl(brand, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-10 w-10 shrink-0 place-items-center border border-[#b28a55] text-[#9a7241] transition-colors hover:bg-[#b28a55] hover:text-white"
            aria-label={`Demander des informations sur ${property.title}`}
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  )
}

export function GoodKechFooter({ brand }: { brand: DemoBrand }) {
  return (
    <footer className="bg-[#100f0d] px-4 pb-24 pt-14 text-white sm:px-7 sm:pb-16 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <GoodKechLogo brand={brand} light />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/48">
              Villas, riads, appartements et opportunités immobilières sélectionnés à Marrakech et ses environs.
            </p>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d7b986]">Navigation</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/58">
              <Link href="/">Accueil</Link>
              <Link href="/biens">Nos propriétés</Link>
              <Link href="/#quartiers">Quartiers</Link>
            </div>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d7b986]">Contact</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/58">
              <a href={`tel:+${brand.whatsappNumber}`}>{brand.displayPhone}</a>
              <a href={getWhatsAppUrl(brand)} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
              <span>Marrakech, Maroc</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-6 text-[10px] tracking-[0.08em] text-white/32 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {brand.agencyName}</span>
          <span>Immobilier · Marrakech</span>
        </div>
      </div>
    </footer>
  )
}

export function TextArrow({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-2">{children}<ArrowRight className="h-4 w-4" /></span>
}
