'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property, PropertyType } from '../lib/properties'
import LeadWidget from '../CSR/LeadWidget'

const FILTERS: { label: string; value: 'Tous' | PropertyType }[] = [
  { label: 'Tous', value: 'Tous' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Appartement', value: 'Appartement' },
  { label: 'Penthouse', value: 'Penthouse' },
  { label: 'Riad', value: 'Riad' },
]

export default function BiensClient({ properties }: { properties: Property[] }) {
  const [activeFilter, setActiveFilter] = useState<'Tous' | PropertyType>('Tous')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [widgetOpen, setWidgetOpen] = useState(false)

  const filtered = activeFilter === 'Tous'
    ? properties
    : properties.filter(p => p.type === activeFilter)

  return (
    <main className="bg-white text-slate-900 min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🏛</span>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Prestige <span className="text-amber-600">Immobilier</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-amber-600 transition-colors">Accueil</Link>
            <Link href="/biens" className="text-amber-600 font-semibold">Nos biens</Link>
            <Link href="/#apropos" className="hover:text-amber-600 transition-colors">À propos</Link>
          </nav>
          <a
            href="tel:+212600000000"
            className="hidden md:flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-slate-200 hover:border-amber-500 hover:text-amber-600 transition-colors"
          >
            📞 +212 6 00 00 00 00
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="py-14 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Sélection exclusive</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Nos biens du moment</h1>
          <p className="text-slate-500 max-w-xl leading-relaxed">
            Découvrez notre portefeuille de propriétés d&apos;exception à Casablanca, Marrakech, Rabat et Tanger.
            Chaque bien est soigneusement sélectionné pour son emplacement, sa qualité et son potentiel.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-16 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium mr-1 flex-shrink-0">Filtrer :</span>
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.value
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">
                ({f.value === 'Tous' ? properties.length : properties.filter(p => p.type === f.value).length})
              </span>
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 flex-shrink-0">{filtered.length} bien{filtered.length > 1 ? 's' : ''}</span>
        </div>
      </section>

      {/* GRID */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(p => (
            <PropertyCard key={p.id} property={p} onOpen={() => setSelectedProperty(p)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">Aucun bien pour ce filtre</p>
          </div>
        )}
      </section>

      {/* CTA BAND */}
      <section className="py-14 px-6" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Vous ne trouvez pas votre bien idéal ?</h2>
          <p className="text-white/70 mb-6">Notre assistant IA vous qualifie en 2 minutes et vous met en relation avec le bon conseiller.</p>
          <button
            onClick={() => setWidgetOpen(true)}
            className="px-7 py-3.5 rounded-xl font-semibold text-slate-900 bg-amber-400 hover:bg-amber-500 transition-colors"
          >
            Parler à notre assistant ✨
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-6 text-center text-xs">
        <p>
          <Link href="/" className="text-white font-semibold hover:text-amber-400 transition-colors">🏛 Prestige Immobilier</Link>
          {' '}— L&apos;agence de référence pour l&apos;immobilier de prestige au Maroc
        </p>
        <p className="mt-2">© 2025 Prestige Immobilier • Propulsé par <span className="text-amber-500 font-semibold">Leadflow AI</span></p>
      </footer>

      {/* PROPERTY MODAL */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onContact={() => { setSelectedProperty(null); setWidgetOpen(true) }}
        />
      )}

      <WidgetWithTrigger open={widgetOpen} onManualClose={() => setWidgetOpen(false)} />
    </main>
  )
}

// ── Property Card ──────────────────────────────────────────────────────────────
function PropertyCard({ property: p, onOpen }: { property: Property; onOpen: () => void }) {
  return (
    <div className="group rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
      <div className="relative overflow-hidden" style={{ height: 224 }}>
        <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className={`absolute top-3 left-3 text-xs font-bold text-white px-3 py-1 rounded-full ${p.badgeColor}`}>
          {p.badge}
        </span>
        <span className="absolute top-3 right-3 text-xs font-medium text-white bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
          {p.type}
        </span>
        <span className="absolute bottom-3 right-3 text-xs font-medium text-white bg-black/50 backdrop-blur px-2.5 py-1 rounded-full">
          📍 {p.city}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-lg">{p.title}</h3>
        <p className="text-slate-500 text-sm flex items-center gap-1 mt-1"><span>📍</span> {p.location}</p>
        <div className="flex gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-50">
          <span>🛏 {p.beds} ch.</span>
          <span>🚿 {p.baths} sdb</span>
          <span>📐 {p.area}</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3">
          <p className="text-amber-600 font-bold text-lg">{p.price} <span className="text-sm font-normal text-slate-500">MAD</span></p>
          <div className="flex gap-2">
            <Link
              href={`/biens/${p.id}`}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-600 transition-colors"
            >
              Détails
            </Link>
            <button
              onClick={onOpen}
              className="text-xs font-semibold px-3 py-2 rounded-lg text-white transition-colors hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
            >
              Voir le bien →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Property Modal ─────────────────────────────────────────────────────────────
function PropertyModal({ property: p, onClose, onContact }: { property: Property; onClose: () => void; onContact: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative flex-shrink-0" style={{ height: 260 }}>
          <Image src={p.image} alt={p.title} fill className="object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors text-lg">✕</button>
          <span className={`absolute top-4 left-4 text-xs font-bold text-white px-3 py-1 rounded-full ${p.badgeColor}`}>{p.badge}</span>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{p.title}</h2>
              <p className="text-slate-500 text-sm mt-1">📍 {p.location}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-600">{p.price}</p>
              <p className="text-sm text-slate-500">MAD</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: '🛏', label: 'Chambres', value: `${p.beds}` },
              { icon: '🚿', label: 'Salles de bain', value: `${p.baths}` },
              { icon: '📐', label: 'Surface', value: p.area },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <span className="text-xl">{s.icon}</span>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                <p className="font-bold text-slate-900 text-sm">{s.value}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-5">{p.description}</p>
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Prestations</p>
            <div className="flex flex-wrap gap-2">
              {p.features.map(f => (
                <span key={f} className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">✓ {f}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onContact}
              className="flex-1 py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
            >
              💬 Parler à un conseiller
            </button>
            <Link
              href={`/biens/${p.id}`}
              className="flex-1 py-3.5 rounded-xl font-semibold text-slate-900 text-sm border-2 border-slate-200 hover:border-amber-500 transition-colors text-center"
            >
              Voir la fiche complète →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Widget trigger wrapper ─────────────────────────────────────────────────────
function WidgetWithTrigger({ open, onManualClose }: { open: boolean; onManualClose: () => void }) {
  void open; void onManualClose
  return <LeadWidget agencyName="Prestige Immobilier" />
}
