'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  Check,
  Home,
  KeyRound,
  MessageCircle,
  Search,
} from 'lucide-react'
import type { DemoBrand } from '../demoBrands'
import { getWhatsAppUrl } from '../demoBrands'
import { IMMO_BUILT_AREAS, IMMO_BUILT_PROPERTIES } from './data'
import {
  ImmoBuiltFooter,
  ImmoBuiltHeader,
  ImmoHeading,
  ImmoPropertyCard,
  ImmoReveal,
} from './ImmoBuiltUI'

const CATEGORIES = [
  { title: 'Appartements', copy: 'Du pied-à-terre urbain à l’appartement familial.', icon: Building2 },
  { title: 'Villas', copy: 'Des espaces contemporains dans les quartiers résidentiels.', icon: Home },
  { title: 'Investissement', copy: 'Des opportunités de démonstration à étudier selon votre projet.', icon: KeyRound },
]

export default function ImmoBuiltHome({ brand }: { brand: DemoBrand }) {
  const reduceMotion = useReducedMotion()
  const whatsapp = getWhatsAppUrl(brand)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f2ee] text-[#0c2033] selection:bg-[#c69a62] selection:text-[#0c2033]">
      <ImmoBuiltHeader brand={brand} />

      <section className="bg-[#0c2033] pt-[72px] text-white sm:pt-[82px]">
        <div className="mx-auto grid min-h-[720px] max-w-[1600px] lg:grid-cols-[.92fr_1.08fr]">
          <div className="flex items-center px-4 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-20">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }} className="max-w-[650px]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d7b37b]">{brand.agencyName} · Casablanca</p>
              <h1 className="mt-6 text-[44px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[62px] lg:text-[72px] xl:text-[82px]">
                Votre projet immobilier à Casablanca
              </h1>
              <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-white/62 sm:text-[17px] sm:leading-8">
                Une sélection de biens à vendre et à louer, avec un accompagnement simple et personnalisé.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/biens" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#c69a62] px-6 text-[11px] font-semibold text-[#0c2033] transition-colors hover:bg-[#dfb77f]">
                  Découvrir nos biens <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/24 px-6 text-[11px] font-semibold text-white transition-colors hover:bg-white hover:text-[#0c2033]">
                  <MessageCircle className="h-4 w-4" /> Nous contacter
                </a>
              </div>
              <p className="mt-7 max-w-lg border-l border-[#c69a62]/55 pl-4 text-[10px] leading-5 text-white/38">
                Les biens présentés sur ce site sont des annonces de démonstration et ne constituent pas nécessairement le portefeuille actuel de {brand.agencyName}.
              </p>
            </motion.div>
          </div>
          <div className="relative min-h-[440px] overflow-hidden lg:min-h-full">
            <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2000&q=90" alt="Architecture contemporaine à Casablanca" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c2033]/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0c2033]/18 lg:to-transparent" />
            <div className="absolute bottom-5 right-5 border border-white/22 bg-[#0c2033]/55 px-4 py-3 text-[9px] uppercase tracking-[0.2em] text-white/75 backdrop-blur sm:bottom-7 sm:right-7">
              Casablanca · Architecture urbaine
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-7 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <ImmoReveal><ImmoHeading eyebrow="Sélection de démonstration" title="Des biens pour vivre Casablanca autrement" copy="Une présentation réaliste de plusieurs projets et styles de vie casablancais." /></ImmoReveal>
            <ImmoReveal delay={0.08}><Link href="/biens" className="inline-flex items-center gap-2 border-b border-[#9b7446] pb-1.5 text-[11px] font-semibold text-[#765631]">Voir tous les biens <ArrowRight className="h-3.5 w-3.5" /></Link></ImmoReveal>
          </div>
          <div className="mt-12 grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {IMMO_BUILT_PROPERTIES.map((property, index) => <ImmoReveal key={property.id} delay={Math.min(index * 0.04, 0.12)}><ImmoPropertyCard brand={brand} property={property} priority={index < 3} /></ImmoReveal>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-7 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <ImmoReveal><ImmoHeading eyebrow="Votre recherche" title="Un bien adapté à votre projet" /></ImmoReveal>
          <div className="mt-11 grid border-l border-t border-[#0c2033]/10 md:grid-cols-3">
            {CATEGORIES.map((category, index) => {
              const Icon = category.icon
              return <ImmoReveal key={category.title} delay={index * 0.05}><Link href="/biens" className="group block min-h-[220px] border-b border-r border-[#0c2033]/10 p-7 transition-colors hover:bg-[#f3f2ee] sm:p-9"><div className="flex items-start justify-between"><Icon className="h-5 w-5 text-[#9b7446]" strokeWidth={1.4} /><span className="text-[9px] text-[#0c2033]/25">0{index + 1}</span></div><h3 className="mt-12 text-2xl font-semibold tracking-[-0.03em]">{category.title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#747b80]">{category.copy}</p></Link></ImmoReveal>
            })}
          </div>
        </div>
      </section>

      <section id="quartiers" className="bg-[#0c2033] px-4 py-20 text-white sm:px-7 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <ImmoReveal><ImmoHeading eyebrow="Casablanca, quartier par quartier" title="Trouvez votre bien à Casablanca" copy="Explorez des secteurs aux rythmes et aux architectures différents, selon votre mode de vie." inverse /></ImmoReveal>
          <div className="mt-11 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
            {IMMO_BUILT_AREAS.map((area, index) => <ImmoReveal key={area.name} delay={Math.min(index * 0.04, 0.12)} className="min-w-[75vw] snap-center sm:min-w-[43vw] md:min-w-0"><Link href="/biens" className="group relative block aspect-[3/4] overflow-hidden bg-[#1b3041]"><Image src={area.image} alt={area.name} fill sizes="(max-width: 640px) 75vw, (max-width: 768px) 43vw, 17vw" className="object-cover grayscale-[15%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#071624]/92 via-[#071624]/8 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-5"><p className="text-[8px] uppercase tracking-[0.2em] text-[#d7b37b]">Casablanca</p><h3 className="mt-1.5 text-xl font-semibold">{area.name}</h3><p className="mt-1 text-[10px] text-white/48">{area.detail}</p></div></Link></ImmoReveal>)}
          </div>
        </div>
      </section>

      <section id="accompagnement" className="grid bg-[#e9e6df] lg:grid-cols-2">
        <div className="relative min-h-[420px] lg:min-h-[650px]"><Image src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=88" alt="Espace contemporain à Casablanca" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
        <div className="flex items-center px-4 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-24">
          <ImmoReveal>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9b7446]">Une approche directe</p>
            <h2 className="mt-5 max-w-xl text-[36px] font-semibold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-[58px]">Votre projet, simplement accompagné</h2>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#626a70]">Que vous recherchiez un appartement, une villa ou un investissement à Casablanca, {brand.agencyName} vous accompagne dans votre projet immobilier.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Recherche structurée selon vos critères', 'Présentation claire des informations', 'Échange direct sur WhatsApp', 'Accompagnement à votre rythme'].map((item) => <div key={item} className="flex items-start gap-3 border-t border-[#0c2033]/12 pt-3 text-[12px] leading-5 text-[#4e565c]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9b7446]" /> {item}</div>)}
            </div>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 bg-[#0c2033] px-6 text-[11px] font-semibold text-white transition-colors hover:bg-[#c69a62] hover:text-[#0c2033]"><MessageCircle className="h-4 w-4" /> Parler de votre projet</a>
          </ImmoReveal>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-7 sm:py-24 lg:px-12">
        <ImmoReveal className="mx-auto grid max-w-[1180px] items-center gap-8 border border-[#0c2033]/10 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
          <div><div className="grid h-12 w-12 place-items-center bg-[#f3f2ee] text-[#9b7446]"><Search className="h-5 w-5" /></div><h2 className="mt-6 max-w-2xl text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">Quel bien recherchez-vous à Casablanca ?</h2><p className="mt-4 max-w-xl text-sm leading-6 text-[#70777c]">Décrivez simplement votre secteur, votre budget et vos priorités.</p></div>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#c69a62] px-6 text-[11px] font-semibold text-[#0c2033] transition-colors hover:bg-[#0c2033] hover:text-white"><MessageCircle className="h-4 w-4" /> Contacter {brand.agencyName}</a>
        </ImmoReveal>
      </section>

      <ImmoBuiltFooter brand={brand} />
    </main>
  )
}
