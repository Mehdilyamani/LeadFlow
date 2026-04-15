'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import LeadWidget from '../CSR/LeadWidget'

const FEATURES = [
  { icon: '🤖', title: 'IA de qualification', desc: 'Claude pose 5 questions ciblées et score chaque lead automatiquement.' },
  { icon: '📱', title: 'Alerte WhatsApp', desc: "L'agent reçoit une notification instantanée avec les infos du prospect." },
  { icon: '📊', title: 'Dashboard en temps réel', desc: 'Tableau de bord complet : score, budget, délai, coordonnées, tout en un.' },
  { icon: '🔌', title: 'Installation en 5 min', desc: 'Un snippet de code sur votre site. Aucune compétence technique requise.' },
]

const FAQ = [
  { q: 'Est-ce que ça marche sur mon site existant ?', a: "Oui. Leadflow s'installe sur n'importe quel site web : WordPress, Squarespace, site custom, etc. Un simple copier-coller de code suffit." },
  { q: 'Et si un visiteur parle en darija ?', a: "L'IA s'adapte automatiquement à la langue du visiteur. Elle parle français, arabe et darija." },
  { q: 'Comment je reçois les leads ?', a: "Vous recevez une notification WhatsApp immédiate avec tous les détails. Vous accédez aussi à un dashboard web pour voir tous vos leads." },
  { q: "C'est quoi l'engagement ?", a: "Aucun engagement. Vous payez mois par mois et vous pouvez annuler à tout moment." },
  { q: 'Est-ce que les données sont sécurisées ?', a: 'Absolument. Toutes les données sont chiffrées et hébergées en Europe. Nous ne revendons jamais vos données.' },
]

function PitchContent() {
  const params = useSearchParams()
  const agencyName = params.get('agency') || 'Votre Agence'
  const city = params.get('city') || 'Maroc'
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  return (
    <main className="bg-white text-slate-900 min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="font-bold text-slate-900 tracking-tight">
              Lead<span className="text-blue-600">flow</span>
            </span>
          </div>
          <button
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Voir les tarifs
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="py-16 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full border border-blue-100 mb-6">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Démo personnalisée pour {agencyName}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
          On a créé votre widget IA<br />
          <span className="text-blue-600">pour {agencyName} à {city}</span>
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Testez-le maintenant. Ce widget qualifie vos prospects en 2 minutes et envoie une alerte WhatsApp à votre agent — automatiquement, 24h/24.
        </p>
        <div className="flex flex-wrap gap-3 justify-center text-sm text-slate-600 mb-10">
          {['✅ Aucune carte de crédit pour tester', '✅ Installé en 5 minutes', '✅ Sans engagement'].map(f => (
            <span key={f} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">{f}</span>
          ))}
        </div>

        {/* LIVE DEMO WIDGET */}
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Widget en direct — essayez maintenant
            </span>
          </div>
          <LeadWidget agencyName={agencyName} isEmbedded />
          <p className="text-xs text-slate-400 mt-3 text-center">
            ↑ C&apos;est exactement ce que vos visiteurs voient sur votre site
          </p>
        </div>
      </section>

      {/* WHAT HAPPENS AFTER */}
      <section className="py-16 bg-slate-50 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Ce qui se passe après chaque conversation
            </h2>
            <p className="text-slate-500">Tout est automatique. Zéro travail manuel de votre côté.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: '💬', title: 'Le visiteur discute', desc: 'Le widget accueille votre visiteur 24h/24 et pose 5 questions de qualification naturellement.' },
              { step: '2', icon: '🧠', title: "L'IA calcule un score", desc: 'Budget, délai, sérieux : chaque lead reçoit un score Hot / Warm / Cold en temps réel.' },
              { step: '3', icon: '📱', title: "Vous êtes alerté", desc: 'WhatsApp immédiat avec score + résumé complet. Vous appelez les leads chauds en priorité.' },
            ].map(s => (
              <div key={s.step} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl mx-auto mb-4">
                  {s.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Tout ce dont vous avez besoin</h2>
          <p className="text-slate-500">Un outil conçu spécifiquement pour les agences immobilières au Maroc.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all">
              <span className="text-3xl">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-12 bg-slate-900 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-slate-400 text-sm mb-8 uppercase tracking-widest font-medium">
            Déjà utilisé par des agences au Maroc
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { agency: 'Immo Premium Casablanca', result: '+34% de leads qualifiés en 30 jours', score: '🔥 HOT' },
              { agency: 'Marrakech Luxe Realty', result: 'Temps de réponse : 28 min en moyenne', score: '⚡ WARM' },
              { agency: 'Rabat Properties', result: '12 deals closés depuis lancement', score: '🔥 HOT' },
            ].map(t => (
              <div key={t.agency} className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                <p className="text-emerald-400 text-xs font-semibold mb-3">{t.score}</p>
                <p className="text-white font-semibold text-sm mb-2">{t.agency}</p>
                <p className="text-slate-400 text-sm">{t.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 max-w-2xl mx-auto text-center">
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Tarification simple</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Un seul forfait. Tout inclus.</h2>
        <p className="text-slate-500 mb-10">Pas de setup, pas de commission sur les leads. Juste un abonnement mensuel fixe.</p>

        <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 shadow-xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
              🚀 Offre de lancement
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-end justify-center gap-2">
              <span className="text-5xl font-bold text-slate-900">1 490</span>
              <span className="text-2xl font-bold text-slate-600 mb-1">MAD</span>
            </div>
            <p className="text-slate-500 text-sm mt-1">par mois • sans engagement</p>
          </div>

          <div className="space-y-3 text-left mb-8">
            {[
              'Widget IA illimité sur votre site',
              'Qualification automatique des leads',
              'Score Hot / Warm / Cold en temps réel',
              'Alertes WhatsApp instantanées',
              'Dashboard agent complet',
              'Support prioritaire 7j/7',
              'Installation & configuration incluses',
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                <span className="text-slate-700">{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowPayment(true)}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Commencer maintenant — 1 490 MAD/mois
          </button>
          <p className="text-xs text-slate-400 mt-3">
            Paiement sécurisé • Annulable à tout moment
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
          <span>🔒 Paiement sécurisé</span>
          <span>↩ Remboursement 14 jours</span>
          <span>📞 Support humain inclus</span>
        </div>
      </section>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <button onClick={() => setShowPayment(false)} className="float-right text-slate-400 hover:text-slate-700 text-xl">✕</button>
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-slate-900 mb-1">Démarrer Leadflow</p>
              <p className="text-slate-500 text-sm">Pour {agencyName} — {city}</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-center">
              <p className="text-3xl font-bold text-blue-700">1 490 MAD<span className="text-lg font-normal text-slate-500">/mois</span></p>
            </div>
            <div className="space-y-3">
              <a
                href={`https://www.paypal.com/paypalme/leadflowai/1490MAD`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 rounded-xl font-semibold text-center text-white bg-[#0070ba] hover:bg-[#005ea6] transition-colors"
              >
                💳 Payer avec PayPal
              </a>
              <a
                href={`https://wa.me/212600000000?text=Bonjour, je souhaite activer Leadflow pour ${agencyName} à ${city}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 rounded-xl font-semibold text-center text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
              >
                📱 Contacter sur WhatsApp
              </a>
              <button onClick={() => setShowPayment(false)} className="block w-full py-3 text-slate-400 text-sm hover:text-slate-600 transition-colors">
                Annuler
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">
              Notre équipe vous contacte sous 2h pour l&apos;installation.
            </p>
          </div>
        </div>
      )}

      {/* FAQ */}
      <section className="py-16 px-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Questions fréquentes</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-sm text-slate-900">{item.q}</span>
                <span className="text-slate-400 flex-shrink-0 ml-4">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="py-16 px-6 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)' }}
      >
        <h2 className="text-3xl font-bold mb-4">Prêt à automatiser vos leads ?</h2>
        <p className="text-white/80 mb-8 max-w-lg mx-auto">
          Rejoignez les agences marocaines qui qualifient leurs leads automatiquement avec Leadflow.
        </p>
        <button
          onClick={() => {
            setShowPayment(true)
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-lg"
        >
          Démarrer maintenant — 1 490 MAD/mois
        </button>
        <p className="mt-4 text-white/50 text-sm">Sans engagement • Annulable à tout moment</p>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-8 px-6 text-center text-xs">
        <p>
          <span className="text-white font-semibold">⚡ Leadflow</span> — Le widget IA de qualification pour les agences immobilières au Maroc
        </p>
        <p className="mt-2">
          © 2025 Leadflow •{' '}
          <a href="/" className="hover:text-slate-300 transition-colors">Voir la démo Prestige Immobilier</a>
        </p>
      </footer>
    </main>
  )
}

export default function PitchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-400">Chargement...</div>}>
      <PitchContent />
    </Suspense>
  )
}
