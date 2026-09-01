'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
} from 'lucide-react'
import type { DemoBrand } from '../demoBrands'
import { getBrandHref, getWhatsAppUrl } from '../demoBrands'
import type { Property } from '../lib/properties'
import {
  ImmoBuiltFooter,
  ImmoBuiltHeader,
  ImmoHeading,
  ImmoPropertyCard,
  ImmoReveal,
} from './ImmoBuiltUI'

export default function ImmoBuiltPropertyDetail({ brand, property, similar }: { brand: DemoBrand; property: Property; similar: Property[] }) {
  const gallery = useMemo(() => property.images?.length ? property.images : [property.image], [property.image, property.images])
  const [activeImage, setActiveImage] = useState(0)
  const whatsapp = getWhatsAppUrl(brand, `Bonjour, je souhaite avoir plus d'informations sur ce bien : « ${property.title} ».`)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f2ee] text-[#0c2033] selection:bg-[#c69a62] selection:text-[#0c2033]">
      <ImmoBuiltHeader brand={brand} active="properties" />
      <section className="bg-[#0c2033] px-4 pb-8 pt-[106px] text-white sm:px-7 sm:pb-10 sm:pt-[122px] lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link href={getBrandHref(brand, '/biens')} className="inline-flex items-center gap-2 text-[10px] font-semibold text-white/48 hover:text-white"><ArrowLeft className="h-3.5 w-3.5" /> Retour aux biens</Link>
          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl"><p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d7b37b]"><MapPin className="h-3 w-3" /> {property.location}</p><h1 className="mt-4 text-[38px] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-[68px]">{property.title}</h1></div>
            <div className="lg:text-right"><p className="text-[8px] uppercase tracking-[0.2em] text-white/36">Prix indicatif</p><p className="mt-1 text-xl font-semibold sm:text-2xl">{property.price} MAD</p></div>
          </div>
          <p className="mt-7 max-w-3xl border-l border-[#c69a62]/55 pl-4 text-[10px] leading-5 text-white/40">Annonce de démonstration : ce bien ne constitue pas nécessairement une annonce actuellement commercialisée par {brand.agencyName}.</p>
        </div>
      </section>

      <section className="bg-[#0c2033] sm:px-7 sm:pb-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#172d3e] sm:aspect-[16/9] lg:aspect-[2.1/1]">
            <Image src={gallery[activeImage]} alt={`${property.title} — vue ${activeImage + 1}`} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/58 to-transparent p-4 pt-16 sm:p-6">
              <span className="flex items-center gap-2 bg-[#0c2033]/65 px-3 py-2 text-[10px] text-white backdrop-blur"><Camera className="h-3.5 w-3.5" /> {activeImage + 1} / {gallery.length}</span>
              {gallery.length > 1 && <div className="flex gap-2"><button type="button" onClick={() => setActiveImage((current) => (current - 1 + gallery.length) % gallery.length)} className="grid h-11 w-11 place-items-center border border-white/25 bg-[#0c2033]/55 text-white hover:bg-white hover:text-[#0c2033]" aria-label="Photo précédente"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => setActiveImage((current) => (current + 1) % gallery.length)} className="grid h-11 w-11 place-items-center border border-white/25 bg-[#0c2033]/55 text-white hover:bg-white hover:text-[#0c2033]" aria-label="Photo suivante"><ChevronRight className="h-4 w-4" /></button></div>}
            </div>
          </div>
          <div className="mt-2 hidden grid-cols-4 gap-2 sm:grid">{gallery.slice(0, 4).map((image, index) => <button key={image} type="button" onClick={() => setActiveImage(index)} className={`relative aspect-[16/9] overflow-hidden border-2 ${activeImage === index ? 'border-[#c69a62]' : 'border-transparent opacity-60 hover:opacity-100'}`} aria-label={`Afficher la photo ${index + 1}`}><Image src={image} alt="" fill sizes="25vw" className="object-cover" /></button>)}</div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-7 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1260px] gap-12 lg:grid-cols-[1fr_360px] lg:gap-20">
          <div>
            <ImmoReveal><div className="grid grid-cols-2 border-l border-t border-[#0c2033]/10 sm:grid-cols-4"><div className="border-b border-r border-[#0c2033]/10 p-4 sm:p-5"><p className="text-[8px] uppercase tracking-[0.2em] text-[#8d9498]">Type</p><p className="mt-2 text-lg font-semibold">{property.type}</p></div>{property.beds > 0 && <div className="border-b border-r border-[#0c2033]/10 p-4 sm:p-5"><BedDouble className="h-4 w-4 text-[#9b7446]" /><p className="mt-3 text-sm">{property.beds} chambres</p></div>}{property.baths > 0 && <div className="border-b border-r border-[#0c2033]/10 p-4 sm:p-5"><Bath className="h-4 w-4 text-[#9b7446]" /><p className="mt-3 text-sm">{property.baths} salles de bain</p></div>}<div className="border-b border-r border-[#0c2033]/10 p-4 sm:p-5"><Maximize2 className="h-4 w-4 text-[#9b7446]" /><p className="mt-3 text-sm">{property.area}</p></div></div></ImmoReveal>
            <ImmoReveal className="mt-12"><p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#9b7446]">Présentation</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">À propos de ce bien</h2><p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#626a70]">{property.description}</p></ImmoReveal>
            <ImmoReveal className="mt-12"><h2 className="text-3xl font-semibold tracking-[-0.035em]">Caractéristiques</h2><div className="mt-6 grid border-t border-[#0c2033]/10 sm:grid-cols-2 sm:gap-x-8">{property.features.map((feature) => <div key={feature} className="flex items-center gap-3 border-b border-[#0c2033]/10 py-3.5 text-sm text-[#525a60]"><Check className="h-4 w-4 shrink-0 text-[#9b7446]" /> {feature}</div>)}</div></ImmoReveal>
          </div>
          <aside><ImmoReveal className="border border-[#0c2033]/10 bg-white p-6 sm:p-8 lg:sticky lg:top-[110px]"><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#9b7446]">Demande d’information</p><h2 className="mt-4 text-[28px] font-semibold leading-[1.08] tracking-[-0.035em]">Échangez avec {brand.agencyName}</h2><p className="mt-4 text-sm leading-6 text-[#70777c]">Posez vos questions ou demandez plus d’informations directement à l’agence.</p><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 bg-[#25D366] px-5 text-[11px] font-semibold text-white hover:-translate-y-0.5"><MessageCircle className="h-4 w-4" /> Demander sur WhatsApp</a><a href={`tel:+${brand.whatsappNumber}`} className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 border border-[#0c2033]/14 px-5 text-[11px] font-semibold hover:bg-[#0c2033] hover:text-white"><Phone className="h-4 w-4" /> {brand.displayPhone}</a></ImmoReveal></aside>
        </div>
      </section>

      {similar.length > 0 && <section className="bg-white px-4 py-20 sm:px-7 sm:py-24 lg:px-12"><div className="mx-auto max-w-[1440px]"><ImmoReveal><ImmoHeading eyebrow="À découvrir" title="D’autres biens à Casablanca" /></ImmoReveal><div className="mt-10 grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-3">{similar.slice(0, 3).map((item, index) => <ImmoReveal key={item.id} delay={index * 0.05}><ImmoPropertyCard brand={brand} property={item} /></ImmoReveal>)}</div></div></section>}
      <ImmoBuiltFooter brand={brand} />
    </main>
  )
}
