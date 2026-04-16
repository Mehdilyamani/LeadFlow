'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LeadWidget from './CSR/LeadWidget'

const PROPERTIES = [
  {
    id: '1',
    title: 'Villa Contemporaine',
    location: 'Anfa, Casablanca',
    price: '8 500 000 MAD',
    type: 'Villa',
    beds: 5,
    baths: 4,
    area: '450 m²',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    badge: 'Exclusivité',
    badgeColor: 'bg-amber-500',
  },
  {
    id: '2',
    title: 'Penthouse Vue Mer',
    location: 'Aïn Diab, Casablanca',
    price: '4 200 000 MAD',
    type: 'Penthouse',
    beds: 3,
    baths: 2,
    area: '220 m²',
    image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
    badge: 'Nouveau',
    badgeColor: 'bg-emerald-500',
  },
  {
    id: '3',
    title: 'Villa de Prestige',
    location: 'Palmeraie, Marrakech',
    price: '12 000 000 MAD',
    type: 'Villa',
    beds: 6,
    baths: 5,
    area: '680 m²',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    badge: 'Coup de cœur',
    badgeColor: 'bg-rose-500',
  },
]

const TESTIMONIALS = [
  {
    name: 'Karim Benali',
    role: 'Entrepreneur, Casablanca',
    text: "Grâce à Prestige Immobilier, j'ai trouvé ma villa de rêve en moins de 3 semaines. Service exceptionnel, équipe à l'écoute.",
    avatar: 'KB',
  },
  {
    name: 'Nadia El Fassi',
    role: 'Directrice, Rabat',
    text: "Professionnalisme et réactivité au rendez-vous. Mon penthouse à Aïn Diab est exactement ce que je cherchais. Merci !",
    avatar: 'NF',
  },
  {
    name: 'Youssef Amrani',
    role: 'Investisseur, Marrakech',
    text: "Accompagnement parfait du début à la fin. Je recommande Prestige Immobilier à tous mes associés sans hésitation.",
    avatar: 'YA',
  },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="bg-white text-slate-900">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛</span>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Prestige <span className="text-amber-600">Immobilier</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/biens" className="hover:text-amber-600 transition-colors">Nos biens</Link>
            <button onClick={() => scrollTo('apropos')} className="hover:text-amber-600 transition-colors">À propos</button>
            <button onClick={() => scrollTo('temoignages')} className="hover:text-amber-600 transition-colors">Avis clients</button>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+212600000000"
              className="hidden md:flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-slate-200 hover:border-amber-500 hover:text-amber-600 transition-colors"
            >
              📞 +212 6 00 00 00 00
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-slate-900 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-900 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-900 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-4">
            <Link href="/biens" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors">
              🏠 Nos biens
            </Link>
            <button
              onClick={() => { scrollTo('apropos'); setMenuOpen(false) }}
              className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors text-left"
            >
              ℹ️ À propos
            </button>
            <button
              onClick={() => { scrollTo('temoignages'); setMenuOpen(false) }}
              className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors text-left"
            >
              ⭐ Avis clients
            </button>
            <a
              href="tel:+212600000000"
              className="text-sm font-semibold text-amber-600 border border-amber-200 rounded-lg px-4 py-2.5 text-center hover:bg-amber-50 transition-colors"
            >
              📞 +212 6 00 00 00 00
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ height: '92vh', minHeight: 600 }}>
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"
          alt="Villa de luxe au Maroc"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 100%)' }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="mb-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white text-xs font-medium px-4 py-2 rounded-full border border-white/20">
            <span className="w-2 h-2 bg-amber-400 rounded-full inline-block" />
            Agence agréée • 15 ans d&apos;expertise au Maroc
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl">
            Trouvez votre bien<br />
            <span className="text-amber-400">d&apos;exception</span> au Maroc
          </h1>
          <p className="text-lg text-white/85 mb-8 max-w-xl leading-relaxed">
            Villas premium, appartements de standing et opportunités d&apos;investissement à Casablanca, Marrakech et Rabat.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/biens"
              className="px-7 py-3.5 rounded-xl font-semibold text-slate-900 bg-amber-400 hover:bg-amber-500 transition-colors"
            >
              Voir nos biens
            </Link>
            <button
              onClick={() => scrollTo('widget-cta')}
              className="px-7 py-3.5 rounded-xl font-semibold text-white bg-white/20 backdrop-blur hover:bg-white/30 border border-white/30 transition-colors"
            >
              Parler à notre assistant ✨
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-900 text-white py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Biens vendus' },
            { value: '15 ans', label: "D'expérience" },
            { value: '98%', label: 'Clients satisfaits' },
            { value: '3 villes', label: 'Présence nationale' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-amber-400">{s.value}</p>
              <p className="text-sm text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROPERTIES */}
      <section id="biens" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Sélection exclusive</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Nos biens du moment</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Découvrez notre sélection de propriétés d&apos;exception, soigneusement choisies pour leur emplacement et leur qualité.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {PROPERTIES.map(p => (
            <div key={p.id} className="group rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300 bg-white">
              <div className="relative overflow-hidden" style={{ height: 224 }}>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 text-xs font-bold text-white px-3 py-1 rounded-full ${p.badgeColor}`}>
                  {p.badge}
                </span>
                <span className="absolute top-3 right-3 text-xs font-medium text-white bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
                  {p.type}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg">{p.title}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                  <span>📍</span> {p.location}
                </p>
                <div className="flex gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-50">
                  <span>🛏 {p.beds} ch.</span>
                  <span>🚿 {p.baths} sdb</span>
                  <span>📐 {p.area}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-amber-600 font-bold text-lg">{p.price}</p>
                  <Link
                    href={`/biens/${p.id}`}
                    className="text-xs font-semibold text-slate-900 hover:text-amber-600 transition-colors"
                  >
                    Détails →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-10">
          <Link
            href="/biens"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
          >
            Voir tous nos biens →
          </Link>
        </div>
      </section>

      {/* ABOUT */}
      <section id="apropos" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-3">À propos</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-5">
              L&apos;excellence immobilière<br />depuis 2009
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Prestige Immobilier est la référence de l&apos;immobilier de luxe au Maroc. Fondée en 2009 à Casablanca, notre agence accompagne investisseurs et particuliers dans leurs projets les plus ambitieux.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Notre équipe de consultants expérimentés vous guide à chaque étape : de la recherche jusqu&apos;à la signature, avec un service personnalisé et discret.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Agence agréée FNAIM Maroc', 'Service 7j/7', 'Évaluation gratuite', 'Réseau international'].map(tag => (
                <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { icon: '🏠', title: 'Résidentiel', desc: 'Villas, appartements, penthouses' },
              { icon: '🏢', title: 'Commercial', desc: 'Bureaux, locaux, entrepôts' },
              { icon: '📈', title: 'Investissement', desc: 'Rentabilité et valorisation' },
              { icon: '🌍', title: 'International', desc: 'Acheteurs MRE bienvenus' },
            ].map(s => (
              <div key={s.title} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <span className="text-3xl">{s.icon}</span>
                <h4 className="font-semibold text-slate-900 mt-2 text-sm">{s.title}</h4>
                <p className="text-slate-500 text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="temoignages" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Témoignages</p>
          <h2 className="text-3xl font-bold text-slate-900">Ce que disent nos clients</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400">★</span>)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WIDGET CTA */}
      <section
        id="widget-cta"
        className="py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Assistant IA disponible 24h/24</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Qualifiez votre projet en 2 minutes</h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            Notre assistant IA vous pose quelques questions et met votre profil en relation avec le bon consultant immédiatement.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            {['⚡ Réponse en moins de 30 min', '🔒 Données confidentielles', '📱 Notification WhatsApp agent'].map(item => (
              <div key={item} className="bg-white/10 backdrop-blur px-4 py-2 rounded-full">{item}</div>
            ))}
          </div>
          <p className="mt-8 text-white/50 text-sm">👉 Cliquez sur le bouton chat en bas à droite pour commencer</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🏛</span>
                <span className="font-bold text-white text-lg">
                  Prestige <span className="text-amber-500">Immobilier</span>
                </span>
              </div>
              <p className="text-sm max-w-xs leading-relaxed">
                L&apos;agence de référence pour l&apos;immobilier de prestige au Maroc depuis 2009.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div>
                <p className="text-white font-semibold mb-3">Navigation</p>
                <Link href="/" className="block mb-2 hover:text-amber-400 transition-colors">Accueil</Link>
                <Link href="/biens" className="block mb-2 hover:text-amber-400 transition-colors">Nos biens</Link>
                <button onClick={() => scrollTo('apropos')} className="block mb-2 hover:text-amber-400 transition-colors">À propos</button>
                <button onClick={() => scrollTo('temoignages')} className="block hover:text-amber-400 transition-colors">Avis clients</button>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Villes</p>
                {['Casablanca', 'Marrakech', 'Rabat', 'Tanger'].map(l => (
                  <p key={l} className="mb-2 hover:text-amber-400 cursor-pointer transition-colors">{l}</p>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Contact</p>
                <p className="mb-2">📞 +212 6 00 00 00 00</p>
                <p className="mb-2">✉ contact@prestige-immo.ma</p>
                <p>📍 Boulevard Anfa, Casablanca</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-xs text-center text-slate-600">
            © 2025 Prestige Immobilier. Tous droits réservés. •{' '}
            Propulsé par <span className="text-amber-500 font-semibold">Leadflow AI</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Widget */}
      <LeadWidget agencyName="Prestige Immobilier" />
    </main>
  )
}
