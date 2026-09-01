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
  GoodKechFooter,
  GoodKechHeader,
  GoodKechPropertyCard,
  Reveal,
  SectionHeading,
} from './GoodKechUI'

export default function GoodKechPropertyDetail({ brand, property, similar }: { brand: DemoBrand; property: Property; similar: Property[] }) {
  const gallery = useMemo(() => property.images?.length ? property.images : [property.image], [property.image, property.images])
  const [activeImage, setActiveImage] = useState(0)
  const propertyMessage = `Bonjour, je souhaite avoir plus d'informations sur le bien « ${property.title} ».`
  const whatsapp = getWhatsAppUrl(brand, propertyMessage)

  const previousImage = () => setActiveImage((current) => (current - 1 + gallery.length) % gallery.length)
  const nextImage = () => setActiveImage((current) => (current + 1) % gallery.length)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f0e6] text-[#171512] selection:bg-[#b28a55] selection:text-white">
      <GoodKechHeader brand={brand} active="properties" />

      <section className="bg-[#171512] px-4 pb-8 pt-[104px] text-white sm:px-7 sm:pb-10 sm:pt-[118px] lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link href={getBrandHref(brand, '/biens')} className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.06em] text-white/48 transition-colors hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour aux propriétés
          </Link>
          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#d7b986]"><MapPin className="h-3 w-3" /> {property.location}</p>
              <h1 className="mt-4 font-serif text-[39px] leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[70px]">{property.title}</h1>
            </div>
            <div className="lg:text-right">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/38">Prix</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">{property.price} MAD</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#171512] px-0 pb-0 sm:px-7 sm:pb-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#29251f] sm:aspect-[16/9] lg:aspect-[2.08/1]">
            <Image src={gallery[activeImage]} alt={`${property.title} — vue ${activeImage + 1}`} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-4 pt-16 sm:p-6">
              <span className="flex items-center gap-2 bg-black/45 px-3 py-2 text-[10px] text-white backdrop-blur"><Camera className="h-3.5 w-3.5" /> {activeImage + 1} / {gallery.length}</span>
              {gallery.length > 1 && (
                <div className="flex gap-2">
                  <button type="button" onClick={previousImage} className="grid h-11 w-11 place-items-center border border-white/25 bg-black/35 text-white backdrop-blur transition-colors hover:bg-white hover:text-[#171512]" aria-label="Photo précédente"><ChevronLeft className="h-4 w-4" /></button>
                  <button type="button" onClick={nextImage} className="grid h-11 w-11 place-items-center border border-white/25 bg-black/35 text-white backdrop-blur transition-colors hover:bg-white hover:text-[#171512]" aria-label="Photo suivante"><ChevronRight className="h-4 w-4" /></button>
                </div>
              )}
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="mt-2 hidden grid-cols-4 gap-2 sm:grid">
              {gallery.slice(0, 4).map((image, index) => (
                <button key={image} type="button" onClick={() => setActiveImage(index)} className={`relative aspect-[16/9] overflow-hidden border-2 bg-[#29251f] ${activeImage === index ? 'border-[#b28a55]' : 'border-transparent opacity-62 hover:opacity-100'}`} aria-label={`Afficher la photo ${index + 1}`}>
                  <Image src={image} alt="" fill sizes="25vw" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-7 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1260px] gap-12 lg:grid-cols-[1fr_360px] lg:gap-20">
          <div>
            <Reveal>
              <div className="grid grid-cols-2 border-l border-t border-black/9 sm:grid-cols-4">
                <div className="border-b border-r border-black/9 p-4 sm:p-5">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-[#998f83]">Type</p>
                  <p className="mt-2 font-serif text-xl">{property.type}</p>
                </div>
                {property.beds > 0 && <div className="border-b border-r border-black/9 p-4 sm:p-5"><BedDouble className="h-4 w-4 text-[#9a7241]" /><p className="mt-3 text-sm">{property.beds} chambres</p></div>}
                {property.baths > 0 && <div className="border-b border-r border-black/9 p-4 sm:p-5"><Bath className="h-4 w-4 text-[#9a7241]" /><p className="mt-3 text-sm">{property.baths} salles de bain</p></div>}
                <div className="border-b border-r border-black/9 p-4 sm:p-5"><Maximize2 className="h-4 w-4 text-[#9a7241]" /><p className="mt-3 text-sm">{property.area}</p></div>
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#9a7241]">Présentation</p>
              <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] sm:text-4xl">À propos de ce bien</h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#625c54]">{property.description}</p>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-serif text-3xl tracking-[-0.03em]">Caractéristiques</h2>
              <div className="mt-6 grid gap-x-8 gap-y-0 border-t border-black/9 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 border-b border-black/9 py-3.5 text-sm text-[#514c45]"><Check className="h-4 w-4 shrink-0 text-[#9a7241]" /> {feature}</div>
                ))}
              </div>
            </Reveal>
          </div>

          <aside className="lg:relative">
            <Reveal className="border border-black/9 bg-[#fcfaf6] p-6 sm:p-8 lg:sticky lg:top-[110px]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.23em] text-[#9a7241]">Ce bien vous intéresse ?</p>
              <h2 className="mt-4 font-serif text-[29px] leading-[1.08]">Échangez avec {brand.agencyName}</h2>
              <p className="mt-4 text-sm leading-6 text-[#716960]">Posez vos questions ou demandez à organiser une visite directement avec l’agence.</p>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 bg-[#25D366] px-5 text-[11px] font-semibold text-white transition-transform hover:-translate-y-0.5"><MessageCircle className="h-4 w-4" /> Demander sur WhatsApp</a>
              <a href={`tel:+${brand.whatsappNumber}`} className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 border border-black/12 px-5 text-[11px] font-semibold text-[#171512] transition-colors hover:bg-[#171512] hover:text-white"><Phone className="h-4 w-4" /> {brand.displayPhone}</a>
              <p className="mt-5 text-center text-[9px] leading-4 text-[#9b9185]">Mentionnez ce bien pour faciliter votre demande.</p>
            </Reveal>
          </aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="bg-[#fcfaf6] px-4 py-20 sm:px-7 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <Reveal><SectionHeading eyebrow="À découvrir aussi" title="D’autres propriétés à Marrakech" /></Reveal>
            <div className="mt-10 grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
              {similar.slice(0, 3).map((item, index) => <Reveal key={item.id} delay={index * 0.05}><GoodKechPropertyCard brand={brand} property={item} /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      <GoodKechFooter brand={brand} />
    </main>
  )
}
