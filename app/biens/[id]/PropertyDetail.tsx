'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react'
import type { Property } from '../../lib/properties'

const WHATSAPP_URL = 'https://wa.me/212723037305'

function AgencyLogo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`grid h-10 w-10 place-items-center rounded-full border text-[11px] font-semibold tracking-[0.16em] ${
          light
            ? 'border-white/20 bg-white/10 text-white'
            : 'border-[#c8b28d]/60 bg-[#f7f1e7] text-[#7a5c2f]'
        }`}
      >
        MA
      </span>
      <span className="leading-none">
        <span
          className={`block text-[13px] font-semibold tracking-[0.17em] ${
            light ? 'text-white' : 'text-[#17221f]'
          }`}
        >
          MAISON ATLAS
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

export default function PropertyDetail({
  property,
  similar,
}: {
  property: Property
  similar: Property[]
}) {
  const gallery = useMemo(
    () => (property.images?.length ? property.images : [property.image]),
    [property.image, property.images]
  )

  const [activeImage, setActiveImage] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const openWhatsApp = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')
  }

  const previousImage = () => {
    setActiveImage((current) => (current - 1 + gallery.length) % gallery.length)
  }

  const nextImage = () => {
    setActiveImage((current) => (current + 1) % gallery.length)
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f5f0] text-[#17221f] selection:bg-[#b9945f] selection:text-white">
      {/* NAVIGATION */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#101916]/92 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1380px] items-center justify-between px-4 sm:h-[76px] sm:px-8 lg:px-10">
          <Link href="/demo" aria-label="Accueil Maison Atlas">
            <AgencyLogo light />
          </Link>

          <nav className="hidden items-center gap-8 text-[12px] font-medium tracking-wide text-white/65 md:flex">
            <Link href="/demo" className="transition-colors hover:text-white">
              Accueil
            </Link>
            <Link href="/biens" className="text-[#d7b57c]">
              Nos biens
            </Link>
            <Link href="/demo#expertise" className="transition-colors hover:text-white">
              Expertise
            </Link>
            <Link href="/demo#villes" className="transition-colors hover:text-white">
              Villes
            </Link>
            <Link href="/demo#contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/biens"
              className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-[11px] font-semibold text-white transition-all hover:bg-white hover:text-[#17221f] sm:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Tous les biens
            </Link>
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
                <Link href="/demo" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white/5">
                  Accueil
                </Link>
                <Link href="/biens" onClick={() => setMenuOpen(false)} className="rounded-xl bg-white/5 px-3 py-3 text-[#d7b57c]">
                  Nos biens
                </Link>
                <Link href="/demo#expertise" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white/5">
                  Expertise
                </Link>
                <Link href="/demo#contact" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white/5">
                  Contact
                </Link>
                <a href="tel:+212723037305" className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-3">
                  <Phone className="h-4 w-4" /> +212 723-037305
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PROPERTY INTRO */}
      <section className="bg-[#101916] pb-20 pt-[68px] text-white sm:pb-28 sm:pt-[76px]">
        <div className="mx-auto max-w-[1380px] px-4 pt-8 sm:px-8 sm:pt-14 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/38"
          >
            <Link href="/demo" className="transition-colors hover:text-white/75">Accueil</Link>
            <span>/</span>
            <Link href="/biens" className="transition-colors hover:text-white/75">Nos biens</Link>
            <span>/</span>
            <span className="text-[#d7b57c]">{property.city}</span>
          </motion.div>

          <div className="mt-7 grid gap-7 sm:mt-9 sm:gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="mb-5 flex flex-wrap items-center gap-2.5"
              >
                <span className="rounded-full border border-[#d7b57c]/25 bg-[#d7b57c]/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#e3c799]">
                  {property.badge}
                </span>
                <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60">
                  {property.type}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(2.25rem,11vw,2.625rem)] font-medium leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-[72px]"
              >
                {property.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="mt-5 inline-flex items-center gap-2 text-sm text-white/55 sm:text-base"
              >
                <MapPin className="h-4 w-4 text-[#d7b57c]" /> {property.location}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="lg:text-right"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35">Prix de vente</p>
              <p className="mt-2 text-3xl font-medium tracking-[-0.035em] text-[#e0c08b] sm:text-4xl">
                {property.price}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/38">MAD</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="relative z-10 -mt-12 sm:-mt-16">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[28px] bg-[#d9d7cf] shadow-[0_24px_80px_rgba(20,31,27,.14)] sm:rounded-[34px]"
          >
            <div className="relative h-[330px] overflow-hidden sm:h-[560px] lg:h-[660px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${property.id}-${activeImage}`}
                  initial={{ opacity: 0.45, scale: 1.018 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.25 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={gallery[activeImage] ?? property.image}
                    alt={`${property.title} — photo ${activeImage + 1}`}
                    fill
                    priority={activeImage === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/8" />

              <div className="absolute bottom-5 left-5 flex items-center gap-2 sm:bottom-7 sm:left-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#101916]/72 px-3.5 py-2 text-[10px] font-semibold text-white backdrop-blur-xl">
                  <Camera className="h-3.5 w-3.5 text-[#e0c08b]" /> {activeImage + 1} / {gallery.length}
                </span>
              </div>

              {gallery.length > 1 && (
                <div className="absolute bottom-5 right-5 flex gap-2 sm:bottom-7 sm:right-7">
                  <button
                    onClick={previousImage}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-[#101916]/72 text-white backdrop-blur-xl transition-all hover:bg-white hover:text-[#17221f]"
                    aria-label="Photo précédente"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-[#101916]/72 text-white backdrop-blur-xl transition-all hover:bg-white hover:text-[#17221f]"
                    aria-label="Photo suivante"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2.5 sm:mt-4 sm:gap-4">
              {gallery.slice(0, 4).map((image, index) => (
                <motion.button
                  key={`${image}-${index}`}
                  type="button"
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveImage(index)}
                  className={`relative h-[74px] overflow-hidden rounded-[14px] border transition-all sm:h-[108px] sm:rounded-[18px] ${
                    activeImage === index
                      ? 'border-[#9b7949] shadow-lg shadow-[#17221f]/8'
                      : 'border-transparent opacity-62 hover:opacity-100'
                  }`}
                  aria-label={`Afficher la photo ${index + 1}`}
                >
                  <Image src={image} alt={`Miniature ${index + 1}`} fill className="object-cover" sizes="25vw" />
                  {activeImage === index && <span className="absolute inset-x-0 bottom-0 h-1 bg-[#b9945f]" />}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto grid max-w-[1380px] gap-10 px-4 py-12 sm:gap-12 sm:px-8 sm:py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 xl:gap-16">
        <div className="min-w-0">
          {/* QUICK FACTS */}
          <Reveal>
            <div className="grid grid-cols-2 overflow-hidden rounded-[24px] border border-[#17221f]/8 bg-white sm:grid-cols-4">
              {[
                { icon: BedDouble, label: 'Chambres', value: `${property.beds}` },
                { icon: Bath, label: 'Salles de bain', value: `${property.baths}` },
                { icon: Maximize2, label: 'Surface', value: property.area },
                { icon: Building2, label: 'Type', value: property.type },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={`px-4 py-5 sm:px-5 sm:py-6 ${
                    index % 2 === 0 ? 'border-r border-[#17221f]/8' : ''
                  } ${index < 2 ? 'border-b border-[#17221f]/8 sm:border-b-0' : ''} ${
                    index === 1 ? 'sm:border-r' : ''
                  }`}
                >
                  <item.icon className="h-4 w-4 text-[#9b7949]" strokeWidth={1.7} />
                  <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b9387]">{item.label}</p>
                  <p className="mt-1.5 text-sm font-semibold text-[#17221f]">{item.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* DESCRIPTION */}
          <Reveal className="mt-10 sm:mt-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9b7949]">La propriété</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#17221f] sm:text-[42px]">
              Une adresse pensée dans les moindres détails.
            </h2>
            <p className="mt-6 max-w-3xl text-[15px] leading-8 text-[#687069] sm:text-base">
              {property.description}
            </p>
          </Reveal>

          {/* FEATURES */}
          <Reveal className="mt-10 sm:mt-14" delay={0.05}>
            <div className="border-t border-[#17221f]/10 pt-10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9b7949]">Prestations</p>
                  <h2 className="mt-3 text-2xl font-medium tracking-[-0.035em] text-[#17221f] sm:text-3xl">
                    Ce qui distingue ce bien
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-6 text-[#7a807a]">
                  Les informations ci-dessous reprennent les principaux équipements et atouts communiqués pour cette propriété.
                </p>
              </div>

              <div className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {property.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.035 }}
                    className="flex items-center gap-3 border-b border-[#17221f]/7 py-3.5 text-sm font-medium text-[#4f5a53]"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eee5d7] text-[#8e6b39]">
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    {feature}
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* LOCATION */}
          <Reveal className="mt-10 sm:mt-14" delay={0.08}>
            <div className="overflow-hidden rounded-[28px] bg-[#17221f] text-white">
              <div className="grid md:grid-cols-[0.8fr_1.2fr]">
                <div className="flex flex-col justify-center p-7 sm:p-9">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/7 text-[#d7b57c]">
                    <Compass className="h-4.5 w-4.5" />
                  </span>
                  <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#d7b57c]">Localisation</p>
                  <h3 className="mt-2 text-2xl font-medium tracking-[-0.03em]">{property.location}</h3>
                  <p className="mt-2 text-sm text-white/45">{property.city}, Maroc</p>
                  <p className="mt-6 max-w-sm text-sm leading-6 text-white/55">
                    L&apos;adresse exacte et les informations d&apos;accès sont communiquées lors de l&apos;organisation d&apos;une visite.
                  </p>
                </div>
                <div className="relative min-h-[220px] overflow-hidden border-t border-white/8 bg-[#1d2d28] sm:min-h-[280px] md:border-l md:border-t-0">
                  <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:36px_36px]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,181,124,.15),transparent_35%)]" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#d7b57c] text-[#17221f] shadow-2xl shadow-black/20">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <p className="mt-4 text-xs font-semibold text-white/80">{property.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* STICKY CONTACT PANEL */}
        <aside className="lg:relative">
          <div className="lg:sticky lg:top-[104px]">
            <Reveal>
              <div className="overflow-hidden rounded-[28px] border border-[#17221f]/8 bg-white shadow-[0_20px_60px_rgba(23,34,31,.08)]">
                <div className="border-b border-[#17221f]/8 px-6 py-6 sm:px-7">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#9b9387]">Prix de vente</p>
                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-3xl font-medium tracking-[-0.035em] text-[#17221f]">{property.price}</p>
                    <span className="pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a59276]">MAD</span>
                  </div>
                </div>

                <div className="space-y-3 px-6 py-6 text-sm sm:px-7">
                  {[
                    ['Type', property.type],
                    ['Surface', property.area],
                    ['Chambres', `${property.beds}`],
                    ['Salles de bain', `${property.baths}`],
                    ['Localisation', property.location],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-5 border-b border-[#17221f]/7 pb-3 last:border-b-0 last:pb-0">
                      <span className="text-[#8a918a]">{label}</span>
                      <span className="max-w-[190px] text-right font-semibold text-[#25312d]">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="px-6 pb-6 sm:px-7 sm:pb-7">
                  <button
                    onClick={openWhatsApp}
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#17221f] px-5 py-3.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#263a34]"
                  >
                    Organiser une visite
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <a
                    href="tel:+212723037305"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#17221f]/12 bg-[#f8f6f1] px-5 py-3.5 text-xs font-semibold text-[#17221f] transition-all hover:border-[#b9945f]/40 hover:bg-white"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#9b7949]" /> +212 723-037305
                  </a>

                  <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f3eee5] p-4">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#8f6d3b]" />
                    <p className="text-[11px] leading-5 text-[#6e695f]">
                      Votre demande est traitée de manière confidentielle par un conseiller Maison Atlas.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="mt-4">
              <div className="rounded-[24px] border border-[#17221f]/8 bg-[#eee9df] p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#17221f] text-[10px] font-semibold tracking-[0.14em] text-[#d7b57c]">MA</span>
                  <div>
                    <p className="text-sm font-semibold text-[#17221f]">Maison Atlas Immobilier</p>
                    <p className="mt-0.5 text-[10px] text-[#898276]">Casablanca · Marrakech · Rabat · Tanger</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-[#77746c]">
                  Une question sur ce bien, son emplacement ou les modalités de visite ? Notre équipe vous répond directement.
                </p>
                <button
                  onClick={openWhatsApp}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#76572e] transition-colors hover:text-[#17221f]"
                >
                  Poser une question <MessageCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            </Reveal>
          </div>
        </aside>
      </section>

      {/* SIMILAR PROPERTIES */}
      {similar.length > 0 && (
        <section className="border-t border-[#17221f]/8 bg-[#eee9df] py-14 sm:py-20">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-8 lg:px-10">
            <Reveal>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9b7949]">À découvrir aussi</p>
                  <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#17221f] sm:text-[42px]">Biens similaires</h2>
                </div>
                <Link href="/biens" className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-[#76572e] transition-colors hover:text-[#17221f]">
                  Voir toute la collection <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:gap-6 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
              {similar.slice(0, 3).map((item, index) => (
                <Reveal key={item.id} delay={index * 0.07} className="w-[86vw] max-w-[380px] shrink-0 snap-center md:w-auto md:max-w-none">
                  <Link
                    href={`/biens/${item.id}`}
                    className="group block overflow-hidden rounded-[24px] bg-[#f8f6f1] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#17221f]/8"
                  >
                    <div className="relative h-[220px] overflow-hidden sm:h-[250px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-transparent to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/18 bg-[#101916]/74 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                        {item.badge}
                      </span>
                      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-white">
                        <MapPin className="h-3.5 w-3.5 text-[#e0c08b]" /> {item.location}
                      </span>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b7949]">{item.type}</p>
                          <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.02em] text-[#17221f]">{item.title}</h3>
                        </div>
                        <p className="whitespace-nowrap text-right text-sm font-semibold text-[#17221f]">
                          {item.price}
                          <span className="block text-[9px] font-medium text-[#999184]">MAD</span>
                        </p>
                      </div>
                      <div className="mt-5 flex items-center gap-4 border-t border-[#17221f]/8 pt-4 text-[11px] text-[#777f78]">
                        <span className="inline-flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5 text-[#9b7949]" /> {item.beds} ch.</span>
                        <span className="inline-flex items-center gap-1.5"><Bath className="h-3.5 w-3.5 text-[#9b7949]" /> {item.baths} sdb</span>
                        <span className="inline-flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5 text-[#9b7949]" /> {item.area}</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      <section className="bg-[#101916] px-4 py-14 text-white sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center text-center">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d7b57c]">Une visite ? Une question ?</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-5xl">
              Parlons de cette propriété
              <span className="font-serif font-normal italic text-[#d7b57c]"> en toute simplicité.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/52">
              Décrivez votre projet ou demandez une visite. Un conseiller Maison Atlas pourra reprendre votre demande avec le contexte de ce bien.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={openWhatsApp}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d7b57c] px-6 py-3.5 text-xs font-semibold text-[#17221f] transition-all hover:-translate-y-0.5 hover:bg-[#e1c493] sm:w-auto"
              >
                Organiser une visite <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="tel:+212723037305"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-xs font-semibold text-white transition-all hover:bg-white hover:text-[#17221f] sm:w-auto"
              >
                <Phone className="h-3.5 w-3.5" /> Nous appeler
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b1210] px-4 py-12 text-white/42 sm:px-8">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex flex-col justify-between gap-10 border-b border-white/8 pb-10 md:flex-row">
            <div>
              <AgencyLogo light />
              <p className="mt-5 max-w-sm text-xs leading-6 text-white/38">
                Immobilier résidentiel et de prestige au Maroc. Sélection, conseil et accompagnement confidentiel.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-xs sm:grid-cols-3">
              <div>
                <p className="mb-4 font-semibold text-white">Navigation</p>
                <Link href="/demo" className="mb-2.5 block transition-colors hover:text-[#d7b57c]">Accueil</Link>
                <Link href="/biens" className="mb-2.5 block transition-colors hover:text-[#d7b57c]">Nos biens</Link>
                <Link href="/demo#expertise" className="block transition-colors hover:text-[#d7b57c]">Expertise</Link>
              </div>
              <div>
                <p className="mb-4 font-semibold text-white">Villes</p>
                {['Casablanca', 'Marrakech', 'Rabat', 'Tanger'].map((city) => (
                  <p key={city} className="mb-2.5">{city}</p>
                ))}
              </div>
              <div>
                <p className="mb-4 font-semibold text-white">Contact</p>
                <a href="tel:+212723037305" className="mb-2.5 block transition-colors hover:text-[#d7b57c]">+212 723-037305</a>
                <p>Maroc</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] text-white/25 sm:flex-row">
            <p>© 2026 Maison Atlas Immobilier.</p>
            <p>Casablanca · Marrakech · Rabat · Tanger</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
