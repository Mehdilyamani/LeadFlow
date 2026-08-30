'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Gauge,
  Layers3,
  Menu,
  MessageCircle,
  MessageSquareText,
  MonitorSmartphone,
  MousePointer2,
  Palette,
  Sparkles,
  X,
} from 'lucide-react'
import { DemoBrandMark, useDemoBrand } from './demoBranding'

const CONTACT = 'https://wa.me/212723037305?text=Bonjour%20LeadFlow%2C%20j%27aimerais%20discuter%20d%27un%20projet%20web.'

const SERVICES = [
  {
    icon: Palette,
    number: '01',
    title: 'Web design',
    description: 'Une direction visuelle singulière, une hiérarchie limpide et une expérience pensée autour de votre marque.',
  },
  {
    icon: Code2,
    number: '02',
    title: 'Développement',
    description: 'Des interfaces rapides, responsives et fiables, développées avec une stack moderne et maintenable.',
  },
  {
    icon: MousePointer2,
    number: '03',
    title: 'Conversion',
    description: 'Chaque page guide naturellement le visiteur vers la bonne action, sans sacrifier la qualité du design.',
  },
  {
    icon: Gauge,
    number: '04',
    title: 'Optimisation',
    description: 'Performance, SEO technique et finitions mobiles pour une expérience solide dès le premier chargement.',
  },
]

const PROCESS = [
  { step: '01', title: 'Découverte', copy: 'Nous clarifions votre offre, votre audience et la perception que votre site doit créer.' },
  { step: '02', title: 'Direction', copy: 'Nous définissons la structure, les messages et une direction visuelle cohérente.' },
  { step: '03', title: 'Création', copy: 'Le design prend vie dans une interface fluide, responsive et soigneusement développée.' },
  { step: '04', title: 'Lancement', copy: 'Nous vérifions chaque détail, mettons le site en ligne et restons disponibles après livraison.' },
]

function Brand({ light = false }: { light?: boolean }) {
  const demoBrand = useDemoBrand()

  return (
    <span className="inline-flex items-center gap-2.5">
      <DemoBrandMark
        priority
        className="h-[38px] w-[38px] rounded-xl object-contain"
        fallback={<Image src="/icon.png" alt="" width={38} height={38} className="h-[38px] w-[38px] rounded-xl" priority />}
      />
      <span className={`text-[17px] font-bold tracking-[-0.03em] ${light ? 'text-white' : 'brand-secondary-text text-[#111a2f]'}`}>
        {demoBrand ? demoBrand.agencyName : <>Lead<span className="brand-primary-text text-[#d4af50]">Flow</span></>}
      </span>
    </span>
  )
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="mb-4 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#a9852f]">
        <span className="h-px w-7 bg-[#d4af50]" /> {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#111a2f] sm:text-4xl md:text-[52px]">{title}</h2>
      {copy && <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-500 md:text-base">{copy}</p>}
    </div>
  )
}

export default function AgencyHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const demoBrand = useDemoBrand()
  const agencyName = demoBrand?.agencyName ?? 'LeadFlow'
  const contactUrl = demoBrand
    ? `https://wa.me/212723037305?text=${encodeURIComponent(`Bonjour ${agencyName}, j’aimerais discuter d’un projet web.`)}`
    : CONTACT

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main className="brand-secondary-text min-h-screen overflow-x-hidden bg-[#f7f6f2] text-[#111a2f]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#111a2f]/8 bg-[#f7f6f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" aria-label={`Accueil ${agencyName}`}><Brand /></Link>

          <nav className="hidden items-center gap-8 text-[12px] font-semibold text-slate-600 md:flex">
            <button onClick={() => scrollTo('services')} className="transition-colors hover:text-[#a9852f]">Services</button>
            <button onClick={() => scrollTo('work')} className="transition-colors hover:text-[#a9852f]">Réalisations</button>
              <button onClick={() => scrollTo('process')} className="transition-colors hover:text-[#a9852f]">Méthode</button>
              <Link href="/demo" className="transition-colors hover:text-[#a9852f]">Démo</Link>
          </nav>

          <div className="flex items-center gap-2">
            <a href={contactUrl} target="_blank" rel="noreferrer" className="brand-secondary-bg hidden items-center gap-2 rounded-full bg-[#111a2f] px-5 py-3 text-[11px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1b2742] sm:inline-flex">
              Écrire sur WhatsApp <MessageCircle className="brand-primary-text h-3.5 w-3.5 text-[#d4af50]" />
            </a>
            <button
              onClick={() => setMenuOpen(open => !open)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#111a2f]/10 bg-white md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="border-t border-[#111a2f]/8 bg-[#f7f6f2] px-5 py-5 md:hidden">
            <div className="mx-auto flex max-w-[1380px] flex-col gap-1">
              <button onClick={() => scrollTo('services')} className="rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-white">Services</button>
              <button onClick={() => scrollTo('work')} className="rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-white">Réalisations</button>
              <button onClick={() => scrollTo('process')} className="rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-white">Méthode</button>
              <Link href="/demo" className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-white">Voir la démo</Link>
              <a href={contactUrl} target="_blank" rel="noreferrer" className="brand-secondary-bg mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#111a2f] px-4 py-3 text-sm font-bold text-white">Écrire sur WhatsApp <MessageCircle className="brand-primary-text h-4 w-4 text-[#d4af50]" /></a>
            </div>
          </motion.div>
        )}
      </header>

      <section className="brand-secondary-bg relative min-h-screen overflow-hidden bg-[#111a2f] pt-[76px] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'linear-gradient(to bottom, black, transparent 88%)',
          }}
        />
        <div className="pointer-events-none absolute -left-52 top-28 h-[520px] w-[520px] rounded-full bg-[#d4af50]/8 blur-[110px]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-[1380px] items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#e4c471]"
            >
              <Sparkles className="h-3 w-3" /> Studio web indépendant · Maroc
            </motion.p>
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[45px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[76px] xl:text-[86px]"
            >
              Des sites qui<br />font avancer<br /><span className="brand-primary-text font-serif font-normal italic text-[#d4af50]">votre marque.</span>
            </motion.h1>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-7 max-w-xl text-[15px] leading-7 text-white/58 sm:text-lg sm:leading-8"
            >
              {agencyName} conçoit et développe des expériences web premium, rapides et pensées pour transformer l&apos;attention en vraies opportunités.
            </motion.p>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.26 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a href={contactUrl} target="_blank" rel="noreferrer" className="brand-primary-bg brand-secondary-text inline-flex items-center justify-center gap-2 rounded-full bg-[#d4af50] px-6 py-4 text-[12px] font-extrabold text-[#111a2f] transition-all hover:-translate-y-0.5 hover:bg-[#e4c471]">
                Parlons sur WhatsApp <MessageCircle className="h-4 w-4" />
              </a>
              <Link href="/demo" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-[12px] font-bold text-white transition-colors hover:bg-white/10">
                Voir la démo <ArrowUpRight className="h-4 w-4 text-[#d4af50]" />
              </Link>
            </motion.div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-medium text-white/38"
            >
              {['Design sur mesure', 'Mobile-first', 'SEO technique'].map(item => <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-[#d4af50]" /> {item}</span>)}
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[680px] lg:ml-auto"
          >
            <div className="overflow-hidden rounded-[26px] border border-white/12 bg-[#0c1427] shadow-[0_40px_100px_rgba(0,0,0,.35)]">
              <div className="flex h-12 items-center justify-between border-b border-white/8 bg-white/5 px-4">
                <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/10" /></div>
                <div className="rounded-full border border-white/8 bg-white/5 px-7 py-1.5 text-[8px] text-white/35">maisonatlas.ma</div>
                <MonitorSmartphone className="h-3.5 w-3.5 text-white/25" />
              </div>
              <div className="grid min-h-[430px] md:grid-cols-[0.82fr_1.18fr]">
                <div className="flex flex-col justify-center p-7 sm:p-9">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d4af50]">Immobilier premium</span>
                  <p className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em]">Des lieux rares.<br /><span className="font-serif italic text-[#d4af50]">Une approche humaine.</span></p>
                  <p className="mt-4 text-[10px] leading-5 text-white/38">Une expérience éditoriale conçue pour inspirer confiance dès le premier regard.</p>
                  <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#d4af50] px-4 py-2.5 text-[9px] font-extrabold text-[#111a2f]">Découvrir <ArrowRight className="h-3 w-3" /></span>
                </div>
                <div className="relative min-h-[300px] overflow-hidden md:min-h-full">
                  <Image src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85" alt="Aperçu d'un site immobilier conçu par LeadFlow" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111a2f]/35 to-transparent" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-3 rounded-2xl border border-white/12 bg-[#17223c]/95 p-4 shadow-2xl backdrop-blur sm:-left-8">
              <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d4af50] text-[#111a2f]"><Gauge className="h-4 w-4" /></span><span><span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">Priorité</span><span className="mt-1 block text-xs font-semibold">Rapide par défaut</span></span></div>
            </div>
            <div className="absolute -right-2 -top-5 hidden rounded-2xl border border-[#111a2f]/8 bg-white p-4 text-[#111a2f] shadow-2xl sm:block lg:-right-5">
              <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f2ead2] text-[#a9852f]"><Palette className="h-4 w-4" /></span><span><span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">Approche</span><span className="mt-1 block text-xs font-semibold">100% sur mesure</span></span></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[#111a2f]/8 bg-white">
        <div className="mx-auto grid max-w-[1380px] grid-cols-2 px-5 sm:px-8 md:grid-cols-4 lg:px-10">
          {[
            [Layers3, 'Stratégie claire'],
            [Palette, 'Design distinctif'],
            [Code2, 'Code moderne'],
            [MonitorSmartphone, 'Responsive partout'],
          ].map(([Icon, label], index) => {
            const ItemIcon = Icon as typeof Layers3
            return <div key={label as string} className={`flex items-center justify-center gap-2.5 px-3 py-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 ${index % 2 === 0 ? 'border-r border-[#111a2f]/8' : ''} ${index === 1 ? 'md:border-r' : ''}`}><ItemIcon className="h-3.5 w-3.5 text-[#a9852f]" /> {label as string}</div>
          })}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 md:py-32 lg:px-10">
        <Reveal><SectionTitle eyebrow="Ce que nous faisons" title="Tout ce qu’il faut pour un site qui compte." copy="De la première idée au lancement, nous réunissons stratégie, design et développement dans un processus simple et exigeant." /></Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <article className="group flex h-full min-h-[300px] flex-col rounded-[24px] border border-[#111a2f]/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af50]/45 hover:shadow-xl hover:shadow-[#111a2f]/5 sm:p-7">
                <div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#111a2f] text-[#d4af50]"><service.icon className="h-4.5 w-4.5" /></span><span className="text-[9px] font-bold tracking-[0.18em] text-slate-300">{service.number}</span></div>
                <div className="mt-auto pt-12"><h3 className="text-lg font-bold tracking-[-0.025em]">{service.title}</h3><p className="mt-3 text-[13px] leading-6 text-slate-500">{service.description}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="work" className="bg-white px-5 py-24 sm:px-8 md:py-32 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionTitle eyebrow="Réalisations sélectionnées" title="Du beau, mais surtout du juste." copy="Chaque projet traduit une marque, une offre et un objectif différent. La cohérence vient avant les effets." />
              <Link href="/demo" className="inline-flex w-fit items-center gap-2 text-[12px] font-extrabold text-[#a9852f] transition-colors hover:text-[#111a2f]">Explorer la démo complète <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <Reveal>
              <Link href="/demo" className="group block overflow-hidden rounded-[28px] bg-[#111a2f] text-white">
                <div className="relative h-[430px] overflow-hidden sm:h-[560px]">
                  <Image src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&q=85" alt="Projet Maison Atlas Immobilier" fill className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" sizes="(max-width: 1024px) 100vw, 65vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111a2f] via-[#111a2f]/8 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-9">
                    <div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#e4c471]">Web design · Développement · IA</p><h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-4xl">Maison Atlas Immobilier</h3><p className="mt-2 text-[12px] text-white/48">Expérience digitale premium pour une agence immobilière.</p></div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#111a2f] transition-transform group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span>
                  </div>
                </div>
              </Link>
            </Reveal>

            <Reveal delay={0.08} className="h-full">
              <Link href="/pitch" className="group flex min-h-[430px] h-full flex-col overflow-hidden rounded-[28px] bg-[#ece7da] p-6 sm:min-h-[560px] sm:p-8">
                <div className="rounded-[20px] border border-[#111a2f]/8 bg-white p-4 shadow-xl shadow-[#111a2f]/7">
                  <div className="flex items-center justify-between border-b border-[#111a2f]/7 pb-3"><span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a9852f]">LeadFlow</span><span className="h-2 w-2 rounded-full bg-emerald-400" /></div>
                  <div className="mt-4 space-y-2.5"><div className="h-2.5 w-3/4 rounded-full bg-[#111a2f]/10" /><div className="h-2.5 w-1/2 rounded-full bg-[#111a2f]/7" /><div className="mt-5 rounded-xl bg-[#111a2f] p-4"><div className="h-2 w-2/3 rounded-full bg-white/20" /><div className="mt-2 h-2 w-1/3 rounded-full bg-[#d4af50]" /></div></div>
                </div>
                <div className="mt-auto pt-10"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8d702a]">Produit · Conversion</p><h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">LeadFlow Experience</h3><p className="mt-3 text-[13px] leading-6 text-slate-600">Une présentation interactive qui rend la valeur du produit évidente en quelques secondes.</p><span className="mt-7 inline-flex items-center gap-2 text-[11px] font-extrabold">Voir le projet <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" /></span></div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 md:py-32 lg:px-10">
        <Reveal><SectionTitle eyebrow="Notre méthode" title="Un processus simple. Aucun flou." copy="Vous savez toujours où en est le projet, ce qui arrive ensuite et pourquoi chaque décision est prise." /></Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[24px] border border-[#111a2f]/8 bg-[#111a2f]/8 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.05} className="h-full">
              <article className="h-full bg-white p-6 sm:p-8"><span className="text-[10px] font-black tracking-[0.2em] text-[#d4af50]">{item.step}</span><h3 className="mt-9 text-lg font-bold">{item.title}</h3><p className="mt-3 text-[13px] leading-6 text-slate-500">{item.copy}</p></article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 md:pb-28 lg:px-10">
        <Reveal>
          <div className="brand-secondary-bg relative mx-auto max-w-[1380px] overflow-hidden rounded-[30px] bg-[#111a2f] px-6 py-16 text-white sm:px-10 md:rounded-[38px] md:px-16 md:py-20">
            <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#d4af50]/12 blur-[100px]" />
            <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <div className="max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e4c471]">Un projet en tête ?</p><h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.05em] sm:text-5xl md:text-6xl">Créons quelque chose<br />qui vous ressemble.</h2><p className="mt-5 max-w-xl text-[14px] leading-7 text-white/50">Parlez-nous de votre activité, de votre site actuel ou simplement de ce que vous aimeriez améliorer.</p></div>
              <a href={contactUrl} target="_blank" rel="noreferrer" className="brand-primary-bg brand-secondary-text inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#d4af50] px-6 py-4 text-[12px] font-extrabold text-[#111a2f] transition-all hover:-translate-y-0.5 hover:bg-[#e4c471]"><MessageCircle className="h-4 w-4" /> Écrire sur WhatsApp <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="brand-secondary-bg border-t border-white/8 bg-[#0b1222] px-5 py-12 text-white/42 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-10 md:grid-cols-[1fr_auto_auto]">
            <div><Brand light /><p className="mt-5 max-w-sm text-[12px] leading-6 text-white/35">Studio de design et développement web basé au Maroc. Des sites clairs, rapides et construits pour durer.</p></div>
            <div className="text-[12px]"><p className="mb-4 font-bold text-white">Navigation</p><button onClick={() => scrollTo('services')} className="mb-2.5 block transition-colors hover:text-white">Services</button><button onClick={() => scrollTo('work')} className="mb-2.5 block transition-colors hover:text-white">Réalisations</button><button onClick={() => scrollTo('process')} className="block transition-colors hover:text-white">Méthode</button></div>
            <div className="text-[12px]"><p className="mb-4 font-bold text-white">Contact</p><a href={contactUrl} target="_blank" rel="noreferrer" className="mb-2.5 block transition-colors hover:text-white">WhatsApp · +212 723-037305</a><p>Casablanca, Maroc</p></div>
          </div>
          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/8 pt-6 text-[10px] text-white/22 sm:flex-row"><p>© 2026 {agencyName}. Tous droits réservés.</p><p className="inline-flex items-center gap-1.5"><MessageSquareText className="brand-primary-text h-3 w-3 text-[#d4af50]" /> Design · Code · Croissance</p></div>
        </div>
      </footer>
    </main>
  )
}
