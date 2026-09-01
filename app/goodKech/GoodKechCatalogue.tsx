'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, MessageCircle, Search } from 'lucide-react'
import type { DemoBrand } from '../demoBrands'
import { getWhatsAppUrl } from '../demoBrands'
import type { Property, PropertyType } from '../lib/properties'
import {
  GoodKechFooter,
  GoodKechHeader,
  GoodKechPropertyCard,
  Reveal,
  SectionHeading,
} from './GoodKechUI'

const FILTERS: { label: string; value: 'Tous' | PropertyType }[] = [
  { label: 'Tous', value: 'Tous' },
  { label: 'Villas', value: 'Villa' },
  { label: 'Riads', value: 'Riad' },
  { label: 'Appartements', value: 'Appartement' },
  { label: 'Terrains', value: 'Terrain' },
]

export default function GoodKechCatalogue({ brand, properties }: { brand: DemoBrand; properties: Property[] }) {
  const [activeFilter, setActiveFilter] = useState<'Tous' | PropertyType>('Tous')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('fr')
    return properties.filter((property) => {
      const matchesType = activeFilter === 'Tous' || property.type === activeFilter
      const matchesQuery = !normalized || `${property.title} ${property.location} ${property.type}`.toLocaleLowerCase('fr').includes(normalized)
      return matchesType && matchesQuery
    })
  }, [activeFilter, properties, query])

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f0e6] text-[#171512] selection:bg-[#b28a55] selection:text-white">
      <GoodKechHeader brand={brand} active="properties" />

      <section className="bg-[#171512] px-4 pb-16 pt-[126px] text-white sm:px-7 sm:pb-20 sm:pt-[150px] lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <SectionHeading
              eyebrow="Catalogue Marrakech"
              title="Nos propriétés"
              copy="Villas, riads, appartements et opportunités de démonstration sélectionnés dans les secteurs les plus recherchés de Marrakech."
              inverse
            />
          </Reveal>
          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`shrink-0 border px-4 py-2.5 text-[10px] font-semibold transition-colors ${activeFilter === filter.value ? 'border-[#b28a55] bg-[#b28a55] text-white' : 'border-white/15 text-white/56 hover:border-white/35 hover:text-white'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <label className="flex min-h-11 items-center gap-3 border border-white/15 px-4 lg:w-[300px]">
              <Search className="h-4 w-4 shrink-0 text-[#d7b986]" />
              <span className="sr-only">Rechercher une propriété</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Quartier, type de bien..."
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/33"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-7 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex items-center justify-between border-b border-black/9 pb-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#776f65]">{filtered.length} {filtered.length === 1 ? 'propriété' : 'propriétés'}</p>
            <p className="hidden text-[10px] text-[#958b7f] sm:block">Prix affichés en MAD</p>
          </div>

          {filtered.length ? (
            <div className="grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((property, index) => (
                <Reveal key={property.id} delay={Math.min(index * 0.04, 0.12)}>
                  <GoodKechPropertyCard brand={brand} property={property} priority={index < 3} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="border border-black/9 bg-[#fcfaf6] px-6 py-16 text-center">
              <p className="font-serif text-3xl">Aucun bien ne correspond à cette recherche</p>
              <p className="mt-3 text-sm text-[#746c62]">Modifiez vos filtres ou échangez directement avec {brand.agencyName}.</p>
              <button type="button" onClick={() => { setActiveFilter('Tous'); setQuery('') }} className="mt-6 inline-flex items-center gap-2 border-b border-[#8f693d] pb-1 text-xs font-semibold text-[#7c5b37]">
                Réinitialiser la recherche <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#9a5b44] px-4 py-16 text-white sm:px-7 sm:py-20 lg:px-12">
        <Reveal className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/58">Recherche sur mesure</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight tracking-[-0.025em] sm:text-4xl">Vous ne trouvez pas encore le bien qui vous correspond ?</h2>
          </div>
          <a href={getWhatsAppUrl(brand)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-white px-6 text-[11px] font-semibold text-[#6f3f2d] transition-transform hover:-translate-y-0.5">
            <MessageCircle className="h-4 w-4" /> Décrire mon projet
          </a>
        </Reveal>
      </section>

      <GoodKechFooter brand={brand} />
    </main>
  )
}
