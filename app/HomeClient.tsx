'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  Check,
  ChevronDown,
  Compass,
  KeyRound,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'
import LeadWidget from './CSR/LeadWidget'
import type { Property } from './lib/properties'

const CITIES = [
  {
    name: 'Casablanca',
    subtitle: 'Anfa · Aïn Diab · CFC',
    image: 'https://images.unsplash.com/photo-1577147443647-81856d5151af?w=1200&q=85',
  },
  {
    name: 'Marrakech',
    subtitle: 'Médina · Palmeraie · Hivernage',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=85',
  },
  {
    name: 'Rabat',
    subtitle: 'Souissi · Hay Riad · Agdal',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=85',
  },
  {
    name: 'Tanger',
    subtitle: 'Malabata · Iberia · Centre',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tangier%20-%2044699733295.jpg?width=1400',
  },
]

const SERVICES = [
  {
    icon: KeyRound,
    eyebrow: 'Acquisition',
    title: 'Trouver le bon bien',
    description:
      'Une sélection ciblée selon votre style de vie, votre budget et vos priorités, avec un accompagnement jusqu’à la signature.',
  },
  {
    icon: Building2,
    eyebrow: 'Commercialisation',
    title: 'Valoriser votre propriété',
    description:
      'Positionnement, présentation et diffusion de votre bien auprès d’acquéreurs qualifiés au Maroc et à l’international.',
  },
  {
    icon: TrendingUp,
    eyebrow: 'Investissement',
    title: 'Décider avec clarté',
    description:
      'Lecture du marché, potentiel de valorisation et sélection d’opportunités cohérentes avec vos objectifs patrimoniaux.',
  },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

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

export default function HomeClient({
  properties,
}: {
  properties: Property[]
  agencyContext?: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f5f0] text-[#17221f] selection:bg-[#b9945f] selection:text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#101916]/85 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/demo" aria-label="Accueil Maison Atlas">
            <AgencyLogo light />
          </Link>

          <nav className="hidden items-center gap-8 text-[12px] font-medium tracking-wide text-white/70 md:flex">
            <Link href="/biens" className="transition-colors hover:text-white">
              Nos biens
            </Link>
            <button onClick={() => scrollTo('expertise')} className="transition-colors hover:text-white">
              Expertise
            </button>
            <button onClick={() => scrollTo('villes')} className="transition-colors hover:text-white">
              Villes
            </button>
            <button onClick={() => scrollTo('contact')} className="transition-colors hover:text-white">
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="tel:+212600000000"
              className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-[11px] font-semibold text-white transition-all hover:bg-white hover:text-[#17221f] sm:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" /> +212 6 00 00 00 00
            </a>
            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/8 md:hidden"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-white/10 bg-[#101916] px-5 py-5 md:hidden"
          >
            <div className="mx-auto flex max-w-[1380px] flex-col gap-1 text-sm text-white/85">
              <Link href="/biens" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white/5">
                Nos biens
              </Link>
              <button onClick={() => { scrollTo('expertise'); setMenuOpen(false) }} className="rounded-xl px-3 py-3 text-left hover:bg-white/5">
                Expertise
              </button>
              <button onClick={() => { scrollTo('villes'); setMenuOpen(false) }} className="rounded-xl px-3 py-3 text-left hover:bg-white/5">
                Villes
              </button>
              <button onClick={() => { scrollTo('contact'); setMenuOpen(false) }} className="rounded-xl px-3 py-3 text-left hover:bg-white/5">
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </header>

      <section className="relative min-h-[92vh] overflow-hidden bg-[#101916] text-white">
        <motion.div
          initial={{ scale: 1.06, opacity: 0.75 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=88"
            alt="Villa contemporaine au Maroc"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,20,17,.88)_0%,rgba(12,20,17,.63)_43%,rgba(12,20,17,.17)_72%,rgba(12,20,17,.28)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101916]/80 via-transparent to-[#101916]/30" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-[1380px] items-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
          <div className="grid w-full gap-12 lg:grid-cols-[1.12fr_.88fr] lg:items-end">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d7b57c]"
              >
                <span className="h-px w-9 bg-[#d7b57c]/70" /> Immobilier résidentiel au Maroc
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl text-[46px] font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[78px]"
              >
                Des lieux rares.
                <br />
                <span className="font-serif font-normal italic text-[#d7b57c]">Des décisions justes.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.3 }}
                className="mt-7 max-w-xl text-[15px] leading-7 text-white/65 sm:text-base sm:leading-8"
              >
                Villas, appartements de standing, penthouses et riads sélectionnés à Casablanca,
                Marrakech, Rabat et Tanger.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42 }}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="/biens"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#d7b57c] px-6 py-3.5 text-[12px] font-bold text-[#17221f] transition-all hover:-translate-y-0.5 hover:bg-[#e4c691]"
                >
                  Découvrir les propriétés
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <button
                  onClick={() => scrollTo('contact')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 py-3.5 text-[12px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/14"
                >
                  <MessageCircle className="h-4 w-4" /> Parler de votre projet
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden justify-self-end rounded-[24px] border border-white/14 bg-[#101916]/48 p-5 backdrop-blur-xl lg:block lg:w-[390px]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d7b57c]">Votre recherche</p>
                  <p className="mt-1 text-sm font-medium text-white">Un bien qui vous ressemble</p>
                </div>
                <Search className="h-4.5 w-4.5 text-white/45" />
              </div>
              <div className="grid grid-cols-2 gap-3 py-4">
                {[
                  ['Ville', 'Casablanca'],
                  ['Type', 'Villa'],
                  ['Budget', 'Sur mesure'],
                  ['Projet', 'Achat'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">{label}</p>
                    <p className="mt-1.5 flex items-center justify-between text-xs font-semibold text-white">
                      {value} <ChevronDown className="h-3 w-3 text-white/35" />
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollTo('contact')}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[#17221f] transition-transform hover:-translate-y-0.5"
              >
                Confier ma recherche <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#17221f]/8 bg-white">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 divide-y divide-[#17221f]/8 px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
          {[
            ['Casablanca · Marrakech', 'Une sélection dans les marchés les plus recherchés'],
            ['Rabat · Tanger', 'Une présence pensée pour vos projets au Maroc'],
            ['Vente · Location · Conseil', 'Un accompagnement clair du premier échange à la signature'],
          ].map(([title, text]) => (
            <div key={title} className="px-0 py-6 md:px-7 lg:px-9">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b6b3f]">{title}</p>
              <p className="mt-2 max-w-sm text-[13px] leading-5 text-[#58615d]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 md:py-28 lg:px-10">
        <Reveal>
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#9a743f]">Sélection actuelle</p>
              <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.04em] text-[#17221f] sm:text-4xl md:text-[52px]">
                Des propriétés choisies pour leur caractère.
              </h2>
            </div>
            <Link href="/biens" className="group inline-flex w-fit items-center gap-2 text-[12px] font-bold text-[#76562c]">
              Voir tous les biens
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {properties.map((property, index) => (
            <Reveal key={property.id} delay={index * 0.08}>
              <Link
                href={`/biens/${property.id}`}
                className="group block overflow-hidden rounded-[24px] border border-[#17221f]/8 bg-white shadow-[0_18px_55px_rgba(23,34,31,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(23,34,31,0.11)]"
              >
                <div className="relative h-[330px] overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  {property.badge && (
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      {property.badge}
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/90">
                      <MapPin className="h-3.5 w-3.5 text-[#e3c58f]" /> {property.location}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#17221f] transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9a743f]">{property.type}</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#17221f]">{property.title}</h3>
                    </div>
                    <p className="whitespace-nowrap text-right text-sm font-bold text-[#17221f]">
                      {property.price}
                      <span className="mt-0.5 block text-[9px] font-medium tracking-[0.12em] text-[#8b918e]">MAD</span>
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-5 border-t border-[#17221f]/8 pt-4 text-[11px] text-[#68716d]">
                    <span className="inline-flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5 text-[#9a743f]" /> {property.beds} ch.</span>
                    <span className="inline-flex items-center gap-1.5"><Bath className="h-3.5 w-3.5 text-[#9a743f]" /> {property.baths} sdb</span>
                    <span className="inline-flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5 text-[#9a743f]" /> {property.area}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="villes" className="bg-[#111a17] py-20 text-white md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
          <Reveal>
            <div className="max-w-2xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#d7b57c]">Nos territoires</p>
              <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-[52px]">
                Quatre villes, quatre façons d’habiter le Maroc.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CITIES.map((city, index) => (
              <Reveal key={city.name} delay={index * 0.06}>
                <button
                  onClick={() => scrollTo('contact')}
                  className="group relative block h-[420px] w-full overflow-hidden rounded-[24px] text-left"
                >
                  <img
                    src={city.image}
                    alt={`Vue de ${city.name}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-2xl font-medium tracking-[-0.03em]">{city.name}</p>
                    <p className="mt-1.5 text-[11px] text-white/60">{city.subtitle}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e1c795]">
                      Explorer <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="expertise" className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#9a743f]">Notre approche</p>
                <h2 className="max-w-lg text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-[52px]">
                  L’immobilier, avec plus de précision et moins de bruit.
                </h2>
                <p className="mt-6 max-w-md text-[14px] leading-7 text-[#68716d]">
                  Nous privilégions la qualité de la sélection, la connaissance du marché et une relation directe. Chaque projet commence par une vraie compréhension de vos critères.
                </p>
              </div>
            </Reveal>

            <div className="space-y-4">
              {SERVICES.map((service, index) => (
                <Reveal key={service.title} delay={index * 0.06}>
                  <div className="group grid gap-6 rounded-[24px] border border-[#17221f]/8 bg-[#f7f5f0] p-6 transition-all duration-500 hover:border-[#b9945f]/40 hover:bg-white hover:shadow-[0_22px_60px_rgba(23,34,31,0.07)] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#17221f] text-[#e0c28c]">
                      <service.icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9a743f]">{service.eyebrow}</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em]">{service.title}</h3>
                      <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#68716d]">{service.description}</p>
                    </div>
                    <ArrowUpRight className="hidden h-5 w-5 text-[#8b6b3f] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 sm:block" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 md:py-28 lg:px-10">
        <div className="grid overflow-hidden rounded-[30px] bg-[#e9e2d6] lg:grid-cols-2">
          <div className="relative min-h-[420px] lg:min-h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&q=85"
              alt="Intérieur résidentiel haut de gamme"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex items-center px-6 py-12 sm:px-10 md:p-14 lg:p-16">
            <Reveal>
              <div className="max-w-xl">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#17221f] text-[#e1c795]">
                  <Compass className="h-4.5 w-4.5" />
                </span>
                <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8b6b3f]">Une relation sur mesure</p>
                <h2 className="mt-3 text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-[48px]">
                  Votre projet ne devrait jamais ressembler à un formulaire.
                </h2>
                <p className="mt-6 text-[14px] leading-7 text-[#5f6965]">
                  Expliquez-nous ce que vous recherchez. Nous vous aidons à préciser vos critères et à identifier les biens qui méritent réellement votre attention.
                </p>
                <button
                  onClick={() => scrollTo('contact')}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#17221f] px-6 py-3.5 text-[12px] font-bold text-white transition-all hover:-translate-y-0.5"
                >
                  Échanger avec un conseiller
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#111a17] px-5 py-20 text-white sm:px-8 md:py-28 lg:px-10">
        <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[1fr_.85fr] lg:items-center">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d7b57c]">Parlons de votre projet</p>
              <h2 className="mt-4 text-4xl font-medium leading-[1.04] tracking-[-0.045em] sm:text-5xl md:text-[64px]">
                Une recherche, un bien à vendre, une question ?
              </h2>
              <p className="mt-6 max-w-xl text-[14px] leading-7 text-white/55">
                Notre conseiller immobilier est disponible pour comprendre votre besoin et vous orienter vers la bonne prochaine étape.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 text-[11px] text-white/55">
                <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#d7b57c]" /> Réponse personnalisée</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-[#d7b57c]" /> Échange confidentiel</span>
                <span className="inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-[#d7b57c]" /> Disponible en ligne</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-[26px] border border-white/12 bg-white/6 p-5 backdrop-blur-sm sm:p-7">
              <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#d7b57c] text-[#17221f]">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Conseiller Maison Atlas</p>
                  <p className="mt-1 text-[11px] text-white/40">Disponible pour votre recherche immobilière</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl rounded-bl-sm bg-white px-4 py-3.5 text-[13px] leading-6 text-[#4e5a55] shadow-xl">
                Bonjour, dites-moi simplement ce que vous recherchez : ville, type de bien, budget et délai.
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-[11px] text-white/45">
                <span>Ouvrez le conseiller en bas à droite</span>
                <ArrowRight className="h-4 w-4 text-[#d7b57c]" />
              </div>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-4 py-3.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/12"
              >
                <MessageCircle className="h-4 w-4" /> Continuer sur WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/8 bg-[#0c1311] px-5 py-12 text-white/45 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-10 md:grid-cols-[1fr_auto_auto]">
            <div>
              <AgencyLogo light />
              <p className="mt-5 max-w-sm text-[12px] leading-6 text-white/40">
                Immobilier résidentiel au Maroc. Sélection de propriétés, conseil et accompagnement personnalisé.
              </p>
            </div>

            <div className="text-[12px]">
              <p className="mb-4 font-semibold text-white">Navigation</p>
              <Link href="/biens" className="mb-2.5 block transition-colors hover:text-white">Nos biens</Link>
              <button onClick={() => scrollTo('expertise')} className="mb-2.5 block transition-colors hover:text-white">Expertise</button>
              <button onClick={() => scrollTo('villes')} className="mb-2.5 block transition-colors hover:text-white">Villes</button>
            </div>

            <div className="text-[12px]">
              <p className="mb-4 font-semibold text-white">Contact</p>
              <a href="tel:+212600000000" className="mb-2.5 block transition-colors hover:text-white">+212 6 00 00 00 00</a>
              <a href="mailto:contact@maisonatlas.ma" className="mb-2.5 block transition-colors hover:text-white">contact@maisonatlas.ma</a>
              <p>Casablanca, Maroc</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/8 pt-6 text-[10px] text-white/25 sm:flex-row">
            <p>© 2026 Maison Atlas Immobilier. Tous droits réservés.</p>
            <p>Casablanca · Marrakech · Rabat · Tanger</p>
          </div>
        </div>
      </footer>

      <LeadWidget agencyName="Maison Atlas Immobilier" />
    </main>
  )
}