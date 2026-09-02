'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Check,
  ChevronRight,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { DemoBrandMark, useDemoBrand } from '../demoBranding'
import { getBrandHref, getWhatsAppUrl } from '../demoBrands'
import type { Property, PropertyType } from '../lib/properties'

const DEFAULT_WHATSAPP_URL = 'https://wa.me/212723037305'

const FILTERS: { label: string; value: 'Tous' | PropertyType }[] = [
  { label: 'Tous les biens', value: 'Tous' },
  { label: 'Villas', value: 'Villa' },
  { label: 'Appartements', value: 'Appartement' },
  { label: 'Penthouses', value: 'Penthouse' },
  { label: 'Riads', value: 'Riad' },
]

function AgencyLogo({ light = false }: { light?: boolean }) {
  const demoBrand = useDemoBrand()

  return (
    <span className="inline-flex items-center gap-3">
      <DemoBrandMark
        className="h-10 w-10 rounded-full object-contain"
        fallback={
          <span
            className={`grid h-10 w-10 place-items-center rounded-full border text-[11px] font-semibold tracking-[0.16em] ${
              light
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-[#c8b28d]/60 bg-[#f7f1e7] text-[#7a5c2f]'
            }`}
          >
            MA
          </span>
        }
      />
      <span className="leading-none">
        <span
          className={`block text-[13px] font-semibold tracking-[0.17em] ${
            light ? 'text-white' : 'text-[#17221f]'
          }`}
        >
          {demoBrand?.agencyName.toUpperCase() ?? 'MAISON ATLAS'}
        </span>
        <span
          className={`mt-1 block text-[8px] font-medium uppercase tracking-[0.31em] ${
            light ? 'text-white/45' : 'text-[#8a7660]'
          }`}
        >
          Immobilier
        </span>
      </span>
    </span>
  )
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function BiensClient({
  properties,
  heroImage = 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1800&q=88',
}: {
  properties: Property[]
  heroImage?: string
}) {
  const [activeFilter, setActiveFilter] = useState<'Tous' | PropertyType>('Tous')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const demoBrand = useDemoBrand()
  const immoBuiltBrand = demoBrand?.experience === 'immo-built' ? demoBrand : null
  const agencyName = demoBrand?.agencyName ?? 'Maison Atlas Immobilier'
  const city = immoBuiltBrand?.city
  const displayPhone = immoBuiltBrand?.displayPhone ?? '+212 723-037305'
  const phoneNumber = immoBuiltBrand?.whatsappNumber ?? '212723037305'
  const phoneHref = `tel:+${phoneNumber}`
  const whatsappUrl = immoBuiltBrand ? getWhatsAppUrl(immoBuiltBrand) : DEFAULT_WHATSAPP_URL
  const homeHref = immoBuiltBrand ? getBrandHref(immoBuiltBrand, '/') : '/demo'
  const propertiesHref = immoBuiltBrand ? getBrandHref(immoBuiltBrand, '/biens') : '/biens'
  const expertiseHref = immoBuiltBrand ? getBrandHref(immoBuiltBrand, '/#expertise') : '/demo#expertise'
  const locationsHref = immoBuiltBrand ? getBrandHref(immoBuiltBrand, '/#villes') : '/demo#villes'
  const contactHref = immoBuiltBrand ? getBrandHref(immoBuiltBrand, '/#contact') : '/demo#contact'

  const filtered =
    activeFilter === 'Tous'
      ? properties
      : properties.filter((property) => property.type === activeFilter)

  const openWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="brand-secondary-text min-h-screen overflow-x-hidden bg-[#f7f5f0] text-[#17221f] selection:bg-[#b9945f] selection:text-white">
      {/* NAVIGATION */}
      <header className="brand-secondary-bg fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#101916]/90 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1380px] items-center justify-between px-4 sm:h-[76px] sm:px-8 lg:px-10">
          <Link href={homeHref} aria-label={`Accueil ${agencyName}`}>
            <AgencyLogo light />
          </Link>

          <nav className="hidden items-center gap-8 text-[12px] font-medium tracking-wide text-white/65 md:flex">
            <Link href={homeHref} className="transition-colors hover:text-white">
              Accueil
            </Link>
            <Link href={propertiesHref} className="text-[#d7b57c]">
              Nos biens
            </Link>
            <Link href={expertiseHref} className="transition-colors hover:text-white">
              Expertise
            </Link>
            <Link href={locationsHref} className="transition-colors hover:text-white">
              Villes
            </Link>
            <Link href={contactHref} className="transition-colors hover:text-white">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={phoneHref}
              className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-[11px] font-semibold text-white transition-all hover:bg-white hover:text-[#17221f] sm:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" /> {displayPhone}
            </a>
            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/8 md:hidden"
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
              transition={{ duration: 0.22 }}
              className="border-t border-white/10 bg-[#101916] px-5 py-5 md:hidden"
            >
              <div className="mx-auto flex max-w-[1380px] flex-col gap-1 text-sm text-white/85">
                <Link href={homeHref} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white/5">
                  Accueil
                </Link>
                <Link href={propertiesHref} onClick={() => setMenuOpen(false)} className="rounded-xl bg-white/5 px-3 py-3 text-[#d7b57c]">
                  Nos biens
                </Link>
                <Link href={expertiseHref} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white/5">
                  Expertise
                </Link>
                <Link href={locationsHref} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white/5">
                  Villes
                </Link>
                <a href={phoneHref} className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-3">
                  <Phone className="h-4 w-4" /> {displayPhone}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="brand-secondary-bg relative overflow-hidden bg-[#101916] pt-[68px] text-white sm:pt-[76px]">
        <motion.div
          initial={{ scale: 1.05, opacity: 0.72 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage}
            alt="Architecture résidentielle contemporaine"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,20,17,.94)_0%,rgba(12,20,17,.76)_48%,rgba(12,20,17,.30)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101916]/80 via-transparent to-[#101916]/25" />

        <div className="relative mx-auto flex min-h-[450px] max-w-[1380px] items-end px-4 pb-12 pt-20 sm:min-h-[520px] sm:px-8 sm:pb-20 sm:pt-24 lg:px-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d7b57c]"
            >
              <span className="h-px w-9 bg-[#d7b57c]/70" /> Notre collection
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.35rem,11.5vw,2.6875rem)] font-medium leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-[72px]"
            >
              Des propriétés choisies,
              <br />
              <span className="brand-primary-text font-serif font-normal italic text-[#d7b57c]">pas simplement listées.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="mt-6 max-w-2xl text-[15px] leading-7 text-white/62 sm:text-base sm:leading-8"
            >
              {city
                ? `Villas et appartements sélectionnés à ${city} pour leur emplacement, leur architecture et leur potentiel.`
                : 'Villas, appartements de standing, penthouses et riads sélectionnés à Casablanca, Marrakech, Rabat et Tanger pour leur emplacement, leur architecture et leur potentiel.'}
            </motion.p>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-[68px] z-30 border-b border-[#17221f]/8 bg-[#f7f5f0]/94 backdrop-blur-xl sm:top-[76px]">
        <div className="mx-auto flex max-w-[1380px] items-center gap-2.5 overflow-x-auto px-4 py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3 sm:px-8 sm:py-4 lg:px-10">
          <span className="mr-1 inline-flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#857763]">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filtrer
          </span>

          {FILTERS.map((filter) => {
            const count =
              filter.value === 'Tous'
                ? properties.length
                : properties.filter((property) => property.type === filter.value).length

            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'border-[#17221f] bg-[#17221f] text-white shadow-lg shadow-[#17221f]/10'
                    : 'border-[#17221f]/10 bg-white/65 text-[#5f685f] hover:border-[#b9945f]/50 hover:bg-white hover:text-[#17221f]'
                }`}
              >
                {filter.label}
                <span className={`ml-1.5 ${activeFilter === filter.value ? 'text-white/45' : 'text-[#a39a8d]'}`}>
                  {count}
                </span>
              </button>
            )
          })}

          <span className="ml-auto hidden shrink-0 text-[11px] font-medium text-[#8a8175] sm:block">
            {filtered.length} propriété{filtered.length > 1 ? 's' : ''}
          </span>
        </div>
      </section>

      {/* PROPERTY GRID */}
      <section className="mx-auto max-w-[1380px] px-4 py-12 sm:px-8 sm:py-16 md:py-24 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:gap-5 md:flex-row md:items-end">
          <Reveal>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9b7949]">
                Sélection actuelle
              </p>
              <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#17221f] sm:text-[40px]">
                {activeFilter === 'Tous' ? 'Tous nos biens' : FILTERS.find((filter) => filter.value === activeFilter)?.label}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-md text-sm leading-6 text-[#6f756f]">
              Chaque propriété est présentée avec les informations essentielles pour vous permettre de décider rapidement si elle mérite une visite.
            </p>
          </Reveal>
        </div>

        <motion.div layout className="grid gap-5 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                onOpen={() => setSelectedProperty(property)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <Reveal>
            <div className="my-10 rounded-[28px] border border-[#17221f]/8 bg-white px-6 py-20 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f1eadf] text-[#8f6d3b]">
                <Search className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[#17221f]">Aucun bien dans cette catégorie</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#747b75]">
                Certaines opportunités sont commercialisées confidentiellement. Parlez-nous de votre recherche pour accéder à une sélection plus large.
              </p>
              <button
                onClick={openWhatsApp}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#17221f] px-5 py-3 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#263a34]"
              >
                Nous confier votre recherche <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        )}
      </section>

      {/* PRIVATE SEARCH CTA */}
      <section className="px-4 pb-14 sm:px-8 sm:pb-20 md:pb-28 lg:px-10">
        <Reveal>
          <div className="brand-secondary-bg relative mx-auto max-w-[1380px] overflow-hidden rounded-[30px] bg-[#101916] text-white md:rounded-[38px]">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c9a56d]/10 blur-3xl" />
            <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

            <div className="relative grid gap-10 px-6 py-12 sm:px-10 md:px-14 md:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:px-16">
              <div className="max-w-3xl">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d7b57c]">
                  Recherche confidentielle
                </p>
                <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-[48px]">
                  Votre bien idéal n&apos;est peut-être
                  <br className="hidden sm:block" /> pas encore publié.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 sm:text-[15px]">
                  Décrivez-nous votre projet. Un conseiller peut vous orienter vers des biens disponibles, des opportunités discrètes ou une recherche sur mesure.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[11px] text-white/48">
                  <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#d7b57c]" /> Échange confidentiel</span>
                  <span className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-[#d7b57c]" /> Accompagnement personnalisé</span>
                </div>
              </div>

              <button
                onClick={openWhatsApp}
                className="brand-primary-bg brand-secondary-text inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d7b57c] px-6 py-3.5 text-sm font-semibold text-[#101916] transition-all hover:-translate-y-0.5 hover:bg-[#e4c58f] sm:w-fit"
              >
                Parler à un conseiller <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="brand-secondary-bg bg-[#0b1210] px-5 py-12 text-white/45 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.25fr_.75fr_.75fr]">
            <div>
              <AgencyLogo light />
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/45">
                Conseil et transaction immobilière {city ? `à ${city}` : 'à Casablanca, Marrakech, Rabat et Tanger'}.
              </p>
            </div>

            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">Navigation</p>
              <div className="space-y-3 text-sm">
                <Link href={homeHref} className="block transition-colors hover:text-white">Accueil</Link>
                <Link href={propertiesHref} className="block text-[#d7b57c]">Nos biens</Link>
                <Link href={expertiseHref} className="block transition-colors hover:text-white">Expertise</Link>
              </div>
            </div>

            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">Contact</p>
              <div className="space-y-3 text-sm">
                <a href={phoneHref} className="block transition-colors hover:text-white">{displayPhone}</a>
                {!immoBuiltBrand && <a href="mailto:contact@maisonatlas.ma" className="block transition-colors hover:text-white">contact@maisonatlas.ma</a>}
                <p>{city ?? 'Casablanca'}, Maroc</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-[10px] tracking-wide text-white/28 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 {agencyName}. Tous droits réservés.</p>
            <p>Immobilier résidentiel · Maroc</p>
          </div>
        </div>
      </footer>

      {/* PROPERTY MODAL */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            onContact={() => {
              setSelectedProperty(null)
              openWhatsApp()
            }}
          />
        )}
      </AnimatePresence>

    </main>
  )
}

function PropertyCard({
  property: p,
  index,
  onOpen,
}: {
  property: Property
  index: number
  onOpen: () => void
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.24), ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#17221f]/8 bg-white shadow-[0_18px_50px_rgba(23,34,31,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(23,34,31,0.10)]"
    >
      <button onClick={onOpen} className="relative block h-[260px] w-full overflow-hidden text-left sm:h-[330px]">
        <Image
          src={p.image}
          alt={p.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/4 to-black/8" />

        {p.badge && (
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#101916]/78 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            {p.badge}
          </span>
        )}

        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/92 text-[#17221f] shadow-lg transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#d7b57c]">
          <ArrowUpRight className="h-4 w-4" />
        </span>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/85">
            <MapPin className="h-3.5 w-3.5 text-[#e0bd82]" /> {p.location}
          </span>
          <span className="rounded-full border border-white/18 bg-black/22 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] backdrop-blur-md">
            {p.type}
          </span>
        </div>
      </button>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="text-xl font-medium tracking-[-0.025em] text-[#17221f]">{p.title}</h3>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#9b7949]">{p.city}</p>
          </div>
          <p className="shrink-0 text-right text-[15px] font-semibold text-[#17221f]">
            {p.price}
            <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.15em] text-[#989084]">MAD</span>
          </p>
        </div>

        <div className="mt-5 flex items-center gap-5 border-y border-[#17221f]/7 py-4 text-[11px] text-[#6f756f]">
          <span className="inline-flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-[#9b7949]" /> {p.beds} ch.</span>
          <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4 text-[#9b7949]" /> {p.baths} sdb</span>
          <span className="inline-flex items-center gap-1.5"><Maximize2 className="h-4 w-4 text-[#9b7949]" /> {p.area}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#17221f] transition-colors hover:text-[#9b7949]"
          >
            Aperçu <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <Link
            href={`/biens/${p.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#17221f] px-4 py-2.5 text-[11px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#263a34]"
          >
            Voir la fiche <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function PropertyModal({
  property: p,
  onClose,
  onContact,
}: {
  property: Property
  onClose: () => void
  onContact: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#07100d]/78 px-0 pt-4 backdrop-blur-sm sm:items-center sm:px-5 sm:py-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.985 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-h-[calc(100svh-8px)] w-full max-w-4xl flex-col overflow-hidden rounded-t-[26px] bg-[#f8f6f1] shadow-2xl sm:max-h-[92vh] sm:rounded-[30px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-[220px] shrink-0 overflow-hidden sm:h-[370px]">
          <Image
            src={p.image}
            alt={p.title}
            fill
            className="object-cover"
            sizes="(max-width: 900px) 100vw, 900px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/12" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/55"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>

          {p.badge && (
            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#101916]/75 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:left-6 sm:top-6">
              {p.badge}
            </span>
          )}

          <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7 sm:right-7">
            <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] text-white/75">
              <MapPin className="h-3.5 w-3.5 text-[#e0bd82]" /> {p.location}
            </p>
            <h2 className="text-[28px] font-medium leading-tight tracking-[-0.04em] sm:text-4xl">{p.title}</h2>
          </div>
        </div>

        <div className="overscroll-contain overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:py-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p className="text-sm leading-7 text-[#626a64]">{p.description}</p>
            </div>
            <div className="lg:min-w-[185px] lg:text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7949]">Prix</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.025em] text-[#17221f]">{p.price}</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#989084]">MAD</p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 divide-x divide-[#17221f]/8 rounded-2xl border border-[#17221f]/8 bg-white">
            {[
              { icon: BedDouble, label: 'Chambres', value: `${p.beds}` },
              { icon: Bath, label: 'Salles de bain', value: `${p.baths}` },
              { icon: Maximize2, label: 'Surface', value: p.area },
            ].map((item) => (
              <div key={item.label} className="px-3 py-4 text-center sm:px-5 sm:py-5">
                <item.icon className="mx-auto h-4 w-4 text-[#9b7949]" />
                <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.13em] text-[#999084]">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#17221f]">{item.value}</p>
              </div>
            ))}
          </div>

          {p.features.length > 0 && (
            <div className="mt-8">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b7949]">Prestations</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {p.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 rounded-xl border border-[#17221f]/7 bg-white px-3.5 py-3 text-xs font-medium text-[#56605a]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#efe5d5] text-[#8b6938]">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t border-[#17221f]/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={onContact}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d7b57c] px-5 py-3 text-xs font-semibold text-[#101916] transition-all hover:bg-[#e3c58f]"
            >
              <MessageCircle className="h-4 w-4" /> Parler à un conseiller
            </button>
            <Link
              href={`/biens/${p.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17221f] px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-[#263a34]"
            >
              Consulter la fiche complète <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
