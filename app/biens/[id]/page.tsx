'use client'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { PROPERTIES } from '../../lib/properties'
import LeadWidget from '../../CSR/LeadWidget'

export default function PropertyPage() {
  const { id } = useParams() as { id: string }
  const property = PROPERTIES.find(p => p.id === id)
  const [activeImage, setActiveImage] = useState(0)

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 gap-4">
        <p className="text-5xl">🔍</p>
        <h1 className="text-2xl font-bold">Bien introuvable</h1>
        <Link href="/biens" className="text-amber-600 hover:underline font-medium">← Retour aux biens</Link>
      </div>
    )
  }

  const similar = PROPERTIES.filter(p => p.id !== property.id && p.type === property.type).slice(0, 3)

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
            <Link href="/biens" className="hover:text-amber-600 transition-colors">Nos biens</Link>
          </nav>
          <Link href="/biens" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors flex items-center gap-1">
            ← Tous les biens
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
              <Link href="/" className="hover:text-slate-600 transition-colors">Accueil</Link>
              <span>›</span>
              <Link href="/biens" className="hover:text-slate-600 transition-colors">Nos biens</Link>
              <span>›</span>
              <span className="text-slate-600 font-medium">{property.title}</span>
            </div>

            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden mb-3" style={{ height: 420 }}>
              <Image
                src={property.images[activeImage]}
                alt={property.title}
                fill
                className="object-cover transition-opacity duration-300"
                priority
              />
              <span className={`absolute top-4 left-4 text-xs font-bold text-white px-3 py-1.5 rounded-full ${property.badgeColor}`}>
                {property.badge}
              </span>
              <span className="absolute top-4 right-4 text-xs font-medium text-white bg-black/40 backdrop-blur px-3 py-1.5 rounded-full">
                {property.type}
              </span>
            </div>

            {/* Thumbnail gallery */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative rounded-xl overflow-hidden transition-all ${
                    activeImage === i
                      ? 'ring-2 ring-amber-500 ring-offset-2'
                      : 'opacity-60 hover:opacity-90'
                  }`}
                  style={{ height: 72 }}
                >
                  <Image src={img} alt={`Photo ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Prestations incluses</h2>
              <div className="grid grid-cols-2 gap-2">
                {property.features.map(f => (
                  <div key={f} className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                    <span className="text-sm text-slate-700 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: '🛏', label: 'Chambres', value: `${property.beds}` },
                  { icon: '🚿', label: 'Salles de bain', value: `${property.baths}` },
                  { icon: '📐', label: 'Surface habitable', value: property.area },
                  { icon: '🏙', label: 'Ville', value: property.city },
                  { icon: '📍', label: 'Quartier', value: property.location },
                  { icon: '🏠', label: 'Type', value: property.type },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <span className="text-2xl">{s.icon}</span>
                    <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Localisation</h2>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center" style={{ height: 200 }}>
                <div className="text-center text-slate-400">
                  <p className="text-3xl mb-2">📍</p>
                  <p className="font-medium text-slate-600">{property.location}</p>
                  <p className="text-sm">{property.city}, Maroc</p>
                  <p className="text-xs mt-2">Coordonnées exactes communiquées sur rendez-vous</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (Sticky Sidebar) ── */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-24">
              {/* Price card */}
              <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg p-6 mb-4">
                <div className="mb-4">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Prix de vente</p>
                  <p className="text-3xl font-bold text-amber-600">{property.price}</p>
                  <p className="text-slate-500 font-medium">MAD</p>
                </div>

                <div className="space-y-2 mb-5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Type</span>
                    <span className="font-semibold text-slate-900">{property.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Surface</span>
                    <span className="font-semibold text-slate-900">{property.area}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Chambres</span>
                    <span className="font-semibold text-slate-900">{property.beds}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Localisation</span>
                    <span className="font-semibold text-slate-900 text-right">{property.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const btn = document.getElementById('widget-trigger')
                    btn?.click()
                  }}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-3 transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
                >
                  💬 Parler à un conseiller
                </button>
                <a
                  href="tel:+212600000000"
                  className="w-full py-3 rounded-xl font-semibold text-slate-900 text-sm border-2 border-slate-200 hover:border-amber-500 transition-colors flex items-center justify-center gap-2"
                >
                  📞 +212 6 00 00 00 00
                </a>
              </div>

              {/* Agency card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
                    🏛
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">Prestige Immobilier</p>
                    <p className="text-xs text-slate-500">Agence agréée • 15 ans d&apos;expertise</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Notre équipe est disponible 7j/7 pour répondre à vos questions et organiser une visite.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SIMILAR PROPERTIES ── */}
        {similar.length > 0 && (
          <section className="mt-14 pt-10 border-t border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Biens similaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similar.map(p => (
                <Link key={p.id} href={`/biens/${p.id}`} className="group rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow bg-white block">
                  <div className="relative overflow-hidden" style={{ height: 180 }}>
                    <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className={`absolute top-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-full ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900">{p.title}</h3>
                    <p className="text-slate-500 text-xs mt-1">📍 {p.location}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-amber-600 font-bold">{p.price} <span className="text-xs text-slate-500 font-normal">MAD</span></p>
                      <span className="text-xs text-slate-400">{p.area}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-6 text-center text-xs mt-14">
        <p>
          <Link href="/" className="text-white font-semibold hover:text-amber-400 transition-colors">🏛 Prestige Immobilier</Link>
          {' '}— L&apos;agence de référence pour l&apos;immobilier de prestige au Maroc
        </p>
        <p className="mt-2">© 2025 Prestige Immobilier • Propulsé par <span className="text-amber-500 font-semibold">Leadflow AI</span></p>
      </footer>

      {/* Hidden trigger button for the sidebar CTA */}
      <button id="widget-trigger" className="hidden" />

      {/* Floating widget */}
      <LeadWidget agencyName="Prestige Immobilier" />
    </main>
  )
}
