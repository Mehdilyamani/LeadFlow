'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  Gem,
  Home,
  KeyRound,
  Landmark,
  Map,
  MessageCircle,
  Search,
  Trees,
} from 'lucide-react'
import type { DemoBrand } from '../demoBrands'
import { getWhatsAppUrl } from '../demoBrands'
import { GOOD_KECH_LOCATIONS, GOOD_KECH_PROPERTIES } from './data'
import {
  GoodKechFooter,
  GoodKechHeader,
  GoodKechPropertyCard,
  Reveal,
  SectionHeading,
  TextArrow,
} from './GoodKechUI'

const CATEGORIES = [
  { label: 'Villas', detail: 'Architecture, jardins et piscines', icon: Home },
  { label: 'Riads', detail: 'Patrimoine et art de vivre', icon: Landmark },
  { label: 'Appartements haut standing', detail: 'Adresses centrales et résidences', icon: Building2 },
  { label: 'Terrains', detail: 'Parcelles et projets à étudier', icon: Map },
  { label: 'Propriétés golf', detail: 'Amelkis et domaines paysagés', icon: Trees },
  { label: "Opportunités d’investissement", detail: 'Biens sélectionnés selon votre projet', icon: KeyRound },
]

const BENEFITS = [
  'Une recherche définie autour de vos critères',
  'Une sélection claire et facile à comparer',
  'Un contact direct sur WhatsApp',
  'Un accompagnement à chaque étape du projet',
]

export default function GoodKechHome({ brand }: { brand: DemoBrand }) {
  const reduceMotion = useReducedMotion()
  const whatsapp = getWhatsAppUrl(brand)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f0e6] text-[#171512] selection:bg-[#b28a55] selection:text-white">
      <GoodKechHeader brand={brand} />

      <section className="relative min-h-[760px] overflow-hidden bg-[#171512] text-white sm:min-h-[820px] lg:min-h-[780px]">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=2000&q=90"
          alt="Villa contemporaine à Marrakech"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,14,12,.88)_0%,rgba(16,14,12,.63)_43%,rgba(16,14,12,.17)_78%),linear-gradient(0deg,rgba(16,14,12,.55)_0%,transparent_45%)]" />
        <div className="absolute inset-x-0 bottom-0 top-[72px] sm:top-[82px]">
          <div className="mx-auto flex h-full max-w-[1440px] items-end px-4 pb-16 sm:px-7 sm:pb-20 lg:items-center lg:px-12 lg:pb-0">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[760px]"
            >
              <p className="mb-6 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#ddc397] sm:text-[10px]">
                <span className="h-px w-9 bg-[#ddc397]" /> {brand.agencyName} · Marrakech
              </p>
              <h1 className="max-w-[750px] font-serif text-[46px] leading-[0.98] tracking-[-0.045em] text-white sm:text-[66px] lg:text-[82px]">
                L’immobilier d’exception à Marrakech
              </h1>
              <p className="mt-6 max-w-[590px] text-[15px] leading-7 text-white/68 sm:text-[17px] sm:leading-8">
                Villas, riads, appartements et opportunités sélectionnés à Marrakech et ses environs.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/biens"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#b28a55] px-6 text-[11px] font-semibold tracking-[0.04em] text-white transition-colors hover:bg-[#c29a65]"
                >
                  Découvrir nos propriétés <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/28 bg-black/10 px-6 text-[11px] font-semibold tracking-[0.04em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#171512]"
                >
                  <MessageCircle className="h-4 w-4" /> Nous contacter sur WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
        <a href="#selection" aria-label="Voir la sélection" className="absolute bottom-7 right-7 hidden h-12 w-12 place-items-center border border-white/25 text-white/70 transition-colors hover:bg-white hover:text-[#171512] sm:grid lg:right-12">
          <ArrowDown className="h-4 w-4" />
        </a>
      </section>

      <section id="selection" className="px-4 py-20 sm:px-7 sm:py-28 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionHeading
                eyebrow="Sélection du moment"
                title="Des propriétés pensées pour votre projet"
                copy="Une sélection de démonstration représentative des différents styles de vie et projets immobiliers à Marrakech."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <Link href="/biens" className="inline-flex items-center gap-2 border-b border-[#8f693d] pb-1.5 text-[11px] font-semibold text-[#7c5b37] transition-colors hover:text-[#171512]">
                Voir toutes les propriétés <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {GOOD_KECH_PROPERTIES.slice(0, 6).map((property, index) => (
              <Reveal key={property.id} delay={Math.min(index * 0.045, 0.14)}>
                <GoodKechPropertyCard brand={brand} property={property} priority={index < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#171512] px-4 py-20 text-white sm:px-7 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <SectionHeading
              eyebrow="Votre recherche"
              title="Un marché, plusieurs façons d’habiter Marrakech"
              copy="Explorez les formats de biens qui correspondent à votre rythme de vie, à votre projet familial ou à votre stratégie d’investissement."
              inverse
            />
          </Reveal>
          <div className="mt-12 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => {
              const Icon = category.icon
              return (
                <Reveal key={category.label} delay={Math.min(index * 0.04, 0.12)}>
                  <Link href="/biens" className="group block min-h-[180px] border-b border-r border-white/10 p-6 transition-colors hover:bg-white/[0.045] sm:min-h-[210px] sm:p-8">
                    <div className="flex items-start justify-between">
                      <Icon className="h-5 w-5 text-[#d7b986]" strokeWidth={1.35} />
                      <span className="text-[9px] text-white/24">0{index + 1}</span>
                    </div>
                    <h3 className="mt-10 font-serif text-2xl tracking-[-0.025em] text-white">{category.label}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/45">{category.detail}</p>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="quartiers" className="bg-[#fcfaf6] px-4 py-20 sm:px-7 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <SectionHeading
              eyebrow="Adresses marrakchies"
              title="Trouvez votre bien à Marrakech"
              copy="Du cœur urbain aux domaines paysagés, chaque secteur offre une manière différente de vivre la ville ocre."
            />
          </Reveal>
          <div className="mt-11 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
            {GOOD_KECH_LOCATIONS.map((location, index) => (
              <Reveal key={location.name} delay={Math.min(index * 0.04, 0.12)} className="min-w-[76vw] snap-center sm:min-w-[44vw] md:min-w-0">
                <Link href="/biens" className="group relative block aspect-[3/4] overflow-hidden bg-[#ded6ca]">
                  <Image src={location.image} alt={location.name} fill sizes="(max-width: 640px) 76vw, (max-width: 768px) 44vw, 17vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/8 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[8px] uppercase tracking-[0.23em] text-white/55">Marrakech</p>
                    <h3 className="mt-1.5 font-serif text-[22px] text-white">{location.name}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="approche" className="grid bg-[#efe5d6] lg:grid-cols-2">
        <div className="relative min-h-[430px] lg:min-h-[720px]">
          <Image src="https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1600&q=88" alt="Architecture et art de vivre à Marrakech" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-[#6c3f2d]/10" />
        </div>
        <div className="flex items-center px-4 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-24">
          <Reveal>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#916637]">Une approche simple</p>
            <h2 className="mt-5 max-w-xl font-serif text-[36px] leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[58px]">
              Votre projet immobilier, présenté avec clarté
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#665f56]">
              {brand.agencyName} vous aide à préciser votre recherche, découvrir des biens cohérents avec vos critères et avancer avec un interlocuteur direct à Marrakech.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 border-t border-black/10 pt-3 text-[12px] leading-5 text-[#4e4942]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7241]" /> {benefit}
                </div>
              ))}
            </div>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 bg-[#171512] px-6 text-[11px] font-semibold text-white transition-colors hover:bg-[#9a5b44]">
              Parler de votre projet <MessageCircle className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#fcfaf6] px-4 py-20 sm:px-7 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <Reveal>
            <div className="flex h-14 w-14 items-center justify-center border border-[#b28a55]/45 text-[#9a7241]">
              <Gem className="h-5 w-5" strokeWidth={1.35} />
            </div>
            <h2 className="mt-7 max-w-lg font-serif text-[36px] leading-[1.04] tracking-[-0.035em] sm:text-5xl">
              Une sélection adaptée à votre manière de vivre Marrakech
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-black/9 p-6 sm:p-8">
                <Search className="h-5 w-5 text-[#9a7241]" strokeWidth={1.4} />
                <h3 className="mt-6 font-serif text-2xl">Recherche personnalisée</h3>
                <p className="mt-3 text-sm leading-6 text-[#6b635a]">Secteur, type de bien, usages et budget structurent une recherche plus lisible.</p>
              </div>
              <div className="border border-black/9 p-6 sm:p-8">
                <MessageCircle className="h-5 w-5 text-[#9a7241]" strokeWidth={1.4} />
                <h3 className="mt-6 font-serif text-2xl">Échange direct</h3>
                <p className="mt-3 text-sm leading-6 text-[#6b635a]">Posez vos questions et organisez la suite simplement depuis WhatsApp.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#9a5b44] px-4 py-20 text-white sm:px-7 sm:py-24 lg:px-12">
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_38%),radial-gradient(circle_at_80%_80%,white_0,transparent_35%)]" />
        <Reveal className="relative mx-auto flex max-w-[1100px] flex-col items-center text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/65">Votre prochain bien à Marrakech</p>
          <h2 className="mt-5 max-w-4xl font-serif text-[39px] leading-[1.03] tracking-[-0.035em] sm:text-6xl">
            Parlons de ce que vous recherchez
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">Un message suffit pour préciser votre projet et recevoir une première orientation.</p>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center bg-white px-6 text-[11px] font-semibold text-[#6f3f2d] transition-transform hover:-translate-y-0.5">
            <TextArrow>Contacter {brand.agencyName} sur WhatsApp</TextArrow>
          </a>
        </Reveal>
      </section>

      <GoodKechFooter brand={brand} />
    </main>
  )
}
