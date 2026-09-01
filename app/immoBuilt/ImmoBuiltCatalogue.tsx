'use client'

import { useMemo, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import type { DemoBrand } from '../demoBrands'
import { getWhatsAppUrl } from '../demoBrands'
import type { Property, PropertyType } from '../lib/properties'
import {
  ImmoBuiltFooter,
  ImmoBuiltHeader,
  ImmoHeading,
  ImmoPropertyCard,
  ImmoReveal,
} from './ImmoBuiltUI'

const FILTERS: { label: string; value: 'Tous' | PropertyType }[] = [
  { label: 'Tous les biens', value: 'Tous' },
  { label: 'Appartements', value: 'Appartement' },
  { label: 'Villas', value: 'Villa' },
]

export default function ImmoBuiltCatalogue({ brand, properties }: { brand: DemoBrand; properties: Property[] }) {
  const [activeFilter, setActiveFilter] = useState<'Tous' | PropertyType>('Tous')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('fr')
    return properties.filter((property) => {
      const matchesType = activeFilter === 'Tous' || property.type === activeFilter
      const matchesQuery = !normalized || `${property.title} ${property.location}`.toLocaleLowerCase('fr').includes(normalized)
      return matchesType && matchesQuery
    })
  }, [activeFilter, properties, query])

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f2ee] text-[#0c2033] selection:bg-[#c69a62] selection:text-[#0c2033]">
      <ImmoBuiltHeader brand={brand} active="properties" />
      <section className="bg-[#0c2033] px-4 pb-16 pt-[126px] text-white sm:px-7 sm:pb-20 sm:pt-[150px] lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <ImmoReveal><ImmoHeading eyebrow="Immobilier à Casablanca" title="Nos biens de démonstration" copy={`Découvrez une sélection illustrative de biens casablancais. Ces annonces ne constituent pas nécessairement le portefeuille actuel de ${brand.agencyName}.`} inverse /></ImmoReveal>
          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FILTERS.map((filter) => <button key={filter.value} type="button" onClick={() => setActiveFilter(filter.value)} className={`shrink-0 border px-4 py-2.5 text-[10px] font-semibold ${activeFilter === filter.value ? 'border-[#c69a62] bg-[#c69a62] text-[#0c2033]' : 'border-white/15 text-white/55 hover:border-white/35 hover:text-white'}`}>{filter.label}</button>)}
            </div>
            <label className="flex min-h-11 items-center gap-3 border border-white/15 px-4 lg:w-[310px]"><Search className="h-4 w-4 text-[#d7b37b]" /><span className="sr-only">Rechercher un bien</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Quartier, type de bien..." className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/32" /></label>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-7 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex items-center justify-between border-b border-[#0c2033]/10 pb-4"><p className="text-[10px] uppercase tracking-[0.18em] text-[#6f777c]">{filtered.length} {filtered.length === 1 ? 'bien' : 'biens'}</p><p className="hidden text-[10px] text-[#959b9f] sm:block">Prix indicatifs · MAD</p></div>
          {filtered.length ? <div className="grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-3">{filtered.map((property, index) => <ImmoReveal key={property.id} delay={Math.min(index * 0.04, 0.12)}><ImmoPropertyCard brand={brand} property={property} priority={index < 3} /></ImmoReveal>)}</div> : <div className="border border-[#0c2033]/10 bg-white px-6 py-16 text-center"><h2 className="text-3xl font-semibold tracking-[-0.035em]">Aucun bien ne correspond à cette recherche</h2><p className="mt-3 text-sm text-[#70777c]">Modifiez vos critères ou contactez directement {brand.agencyName}.</p><button type="button" onClick={() => { setActiveFilter('Tous'); setQuery('') }} className="mt-6 border-b border-[#9b7446] pb-1 text-xs font-semibold text-[#765631]">Réinitialiser la recherche</button></div>}
        </div>
      </section>
      <section className="bg-[#c69a62] px-4 py-16 sm:px-7 sm:py-20 lg:px-12"><ImmoReveal className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"><div><p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#0c2033]/55">Votre recherche</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#0c2033] sm:text-4xl">Parlez-nous du bien que vous recherchez à Casablanca</h2></div><a href={getWhatsAppUrl(brand)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[#0c2033] px-6 text-[11px] font-semibold text-white"><MessageCircle className="h-4 w-4" /> Écrire sur WhatsApp</a></ImmoReveal></section>
      <ImmoBuiltFooter brand={brand} />
    </main>
  )
}
