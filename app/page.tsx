'use client'

import { Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  MessageSquare, BarChart3, Zap, Clock,
  CheckCircle, ArrowRight, Mail,
} from 'lucide-react'
import Logo from './CSR/Logo'

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] })

const CONTACT = 'mailto:mehdi@leadflowimmo.com'

// ── Shared animation helper ────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Connexion', href: '/login' },
]

function Navbar() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="no-underline">
          <Logo variant="dark" />
        </Link>
        <nav className="hidden md:flex items-center gap-7" style={{ fontSize: 14 }}>
          {NAV_LINKS.map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <a
          href="/demo"
          className="transition-opacity hover:opacity-85"
          style={{ background: '#c9a84c', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14, padding: '8px 18px' }}
        >
          Démo gratuite
        </a>
      </div>
    </header>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          style={{ color: '#c9a84c', fontSize: 13, letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 20 }}
        >
          Assistant IA pour régies immobilières · Suisse romande
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            color: '#0f172a', fontWeight: 800,
            fontSize: 'clamp(36px, 5.5vw, 58px)',
            lineHeight: 1.12, letterSpacing: '-1.5px', marginBottom: 22,
          }}
        >
          Ne ratez plus jamais<br />un lead immobilier
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ color: '#475569', fontSize: 'clamp(17px, 2vw, 20px)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 36px' }}
        >
          LeadFlow installe un assistant IA sur votre site en 5 minutes.
          Il répond à vos visiteurs 24h/24, qualifie chaque demande et
          vous livre des leads priorisés — même quand l'agence est fermée.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <a
            href={CONTACT}
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-85"
            style={{ background: '#0f172a', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 16, padding: '14px 28px' }}
          >
            Essayer gratuitement
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 transition-colors hover:border-slate-400"
            style={{ background: 'transparent', color: '#0f172a', borderRadius: 10, fontWeight: 600, fontSize: 16, border: '1.5px solid #e2e8f0', padding: '14px 28px' }}
          >
            Voir la démo
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ── Problème ───────────────────────────────────────────────────────────────────
function Problem() {
  return (
    <section style={{ background: '#f9fafb' }}>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <FadeUp>
          <h2
            style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 36px)', letterSpacing: '-0.5px', marginBottom: 20 }}
          >
            Des leads qui passent entre les mailles
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p style={{ color: '#475569', fontSize: 18, lineHeight: 1.75 }}>
            Une grande partie des demandes immobilières arrivent le soir et le week-end,
            quand votre agence est fermée. Le visiteur pose une question sur votre site,
            n'obtient pas de réponse, et contacte l'agence concurrente le lendemain matin.
          </p>
        </FadeUp>
        <FadeUp delay={0.18}>
          <p style={{ color: '#475569', fontSize: 18, lineHeight: 1.75, marginTop: 18 }}>
            LeadFlow répond à leur place, immédiatement, et vous transmet un lead
            qualifié et priorisé — prêt à être rappelé.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Comment ça marche ──────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '01',
    title: 'Le visiteur pose une question',
    desc: "Le widget apparaît discrètement sur votre site. Votre visiteur interagit naturellement, à n'importe quelle heure.",
  },
  {
    num: '02',
    title: "L'assistant qualifie et capture",
    desc: 'En quelques échanges, il collecte budget, délai, type de bien et coordonnées — sans formulaire froid.',
  },
  {
    num: '03',
    title: 'Le lead arrive dans votre dashboard',
    desc: 'Classé HOT, WARM ou COLD selon le profil, avec toutes les informations pour rappeler au bon moment.',
  },
]

function HowItWorks() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <FadeUp>
          <h2
            style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 36px)', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 52 }}
          >
            Comment ça marche
          </h2>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-10">
          {STEPS.map((s, i) => (
            <FadeUp key={s.num} delay={i * 0.1}>
              <div style={{ color: '#c9a84c', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', marginBottom: 14 }}>
                {s.num}
              </div>
              <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
                {s.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
                {s.desc}
              </p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features ───────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Clock,
    title: 'Disponible 24h/24, 7j/7',
    desc: "Votre assistant répond instantanément — week-end, jours fériés, nuits comprises. Aucun lead n'est perdu faute de réponse.",
  },
  {
    icon: BarChart3,
    title: 'Qualification automatique',
    desc: "Chaque lead est scoré HOT, WARM ou COLD selon le budget et l'urgence. Vous savez en un coup d'œil qui rappeler en priorité.",
  },
  {
    icon: MessageSquare,
    title: 'Dashboard clair',
    desc: 'Toutes vos demandes dans une interface simple : nom, contact, budget, délai, type de bien. Filtrable, exportable.',
  },
  {
    icon: Zap,
    title: 'Installation en 5 minutes',
    desc: 'Une seule ligne de code à coller sur votre site. Compatible avec tous les CMS (WordPress, Wix, Webflow, etc.).',
  },
]

function Features() {
  return (
    <section id="fonctionnalites" style={{ background: '#f9fafb' }}>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <FadeUp>
          <h2
            style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 36px)', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 52 }}
          >
            Tout ce dont vous avez besoin
          </h2>
        </FadeUp>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(15,23,42,0.08)' }}
                transition={{ duration: 0.2 }}
                style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: '28px 28px', height: '100%' }}
              >
                <div
                  style={{ background: '#f1f5f9', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}
                >
                  <f.icon style={{ width: 20, height: 20, color: '#c9a84c' }} />
                </div>
                <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: 17, marginBottom: 10 }}>
                  {f.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ────────────────────────────────────────────────────────────────────
const INCLUS = [
  'Premier mois entièrement gratuit',
  'Sans engagement — résiliable à tout moment',
  'Installation et configuration incluses',
  'Assistant personnalisé à votre agence',
  'Dashboard leads inclus',
  'Support par email',
]

function Pricing() {
  return (
    <section id="tarifs" style={{ background: '#ffffff' }}>
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <FadeUp>
          <h2
            style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 36px)', letterSpacing: '-0.5px', marginBottom: 12 }}
          >
            Un tarif simple et transparent
          </h2>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p style={{ color: '#64748b', fontSize: 17, marginBottom: 44 }}>
            Pas de frais cachés. Pas de contrat annuel. Juste un abonnement mensuel qui s'arrête quand vous voulez.
          </p>
        </FadeUp>
        <FadeUp delay={0.16}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                background: '#0f172a', borderRadius: 20,
                padding: '44px 52px', textAlign: 'left',
                maxWidth: 440, width: '100%',
              }}
            >
              <p style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Plan unique
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#fff', fontSize: 52, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1 }}>199</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, fontWeight: 600 }}>CHF / mois</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 32 }}>
                Premier mois offert — sans carte bancaire requise
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {INCLUS.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle style={{ width: 17, height: 17, color: '#c9a84c', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={CONTACT}
                className="transition-opacity hover:opacity-85"
                style={{ display: 'block', background: '#c9a84c', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 16, textAlign: 'center', padding: '14px 0', textDecoration: 'none' }}
              >
                Commencer l'essai gratuit →
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── CTA final ──────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ background: '#f9fafb' }}>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <FadeUp>
          <h2
            style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 36px)', letterSpacing: '-0.5px', marginBottom: 16 }}
          >
            Prêt à ne plus rater un seul lead ?
          </h2>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p style={{ color: '#64748b', fontSize: 18, lineHeight: 1.7, marginBottom: 36 }}>
            Écrivez-nous et nous configurons votre assistant gratuitement pour le premier mois.
          </p>
        </FadeUp>
        <FadeUp delay={0.16}>
          <a
            href={CONTACT}
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-85"
            style={{ background: '#0f172a', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 16, padding: '14px 32px', textDecoration: 'none' }}
          >
            <Mail className="w-4 h-4" />
            Contacter LeadFlow Immo
          </a>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo variant="dark" size={24} />
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center' }}>
          Assistant IA pour régies immobilières · Suisse romande
        </p>
        <a
          href={CONTACT}
          className="transition-colors hover:text-white"
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
        >
          <Mail className="w-3.5 h-3.5" />
          mehdi@leadflowimmo.com
        </a>
      </div>
    </footer>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className={inter.className} style={{ minHeight: '100vh', color: '#0f172a' }}>
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  )
}
