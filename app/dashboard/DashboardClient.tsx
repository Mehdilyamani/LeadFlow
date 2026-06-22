'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  UserRoundX, ArrowLeft, Flame, TrendingUp, Wind, Users,
  Search, Download, RefreshCw, LogOut, MapPin, Building2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'

// ── Types ──────────────────────────────────────────────────────────────────────
interface Lead {
  id: string
  name: string
  contact: string
  score: 'HOT' | 'WARM' | 'COLD'
  budget: string
  timeline: string
  property_type: string
  location: string
  property_interest?: string | null
  created_at: string
}

type Filter = 'ALL' | 'HOT' | 'WARM' | 'COLD'

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'À l\'instant'
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}j`
}

function exportCSV(leads: Lead[]) {
  const headers = ['Nom', 'Contact', 'Score', 'Budget', 'Délai', 'Bien', 'Bien demandé', 'Lieu', 'Date']
  const rows = leads.map(l => [
    l.name, l.contact, l.score, l.budget, l.timeline, l.property_type,
    l.property_interest ?? '—', l.location,
    new Date(l.created_at).toLocaleDateString('fr-MA'),
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `leads-${Date.now()}.csv`; a.click()
  URL.revokeObjectURL(url)
}

// ── Score config ───────────────────────────────────────────────────────────────
const SCORE_CFG = {
  HOT:  { bg: 'bg-red-500',   text: 'text-white',    label: 'HOT'  },
  WARM: { bg: 'bg-amber-500', text: 'text-white',     label: 'WARM' },
  COLD: { bg: 'bg-slate-300', text: 'text-slate-700', label: 'COLD' },
}

function ScoreBadge({ score }: { score: Lead['score'] }) {
  const s = SCORE_CFG[score]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wide px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-white/50 inline-block" />
      {s.label}
    </span>
  )
}

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const palettes = [
    'from-amber-400 to-amber-600',
    'from-slate-600 to-slate-800',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
  ]
  const idx = name.charCodeAt(0) % palettes.length
  return (
    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br ${palettes[idx]} text-white text-xs font-bold shrink-0 shadow-sm`}>
      {initials}
    </span>
  )
}

// ── KPI card ───────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, rate, icon: Icon, iconBg, iconColor, barColor, showBar,
}: {
  label: string; value: number; rate?: number
  icon: React.ElementType; iconBg: string; iconColor: string
  barColor: string; showBar?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {rate !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${iconBg} ${iconColor}`}>
            {rate}%
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-slate-900 leading-none tracking-tight">{value}</p>
      <p className="text-xs text-slate-400 font-medium mt-1.5">{label}</p>
      {showBar && rate !== undefined && (
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${Math.max(rate, 2)}%` }}
          />
        </div>
      )}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function DashboardClient({
  leads: initialLeads,
  agencyName,
}: {
  leads: Lead[]
  agencyName: string
}) {
  const router               = useRouter()
  const [isPending, startT]  = useTransition()
  const [filter, setFilter]  = useState<Filter>('ALL')
  const [search, setSearch]  = useState('')

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function handleRefresh() {
    startT(() => { router.refresh() })
  }

  const leads = initialLeads

  const counts = {
    ALL:  leads.length,
    HOT:  leads.filter(l => l.score === 'HOT').length,
    WARM: leads.filter(l => l.score === 'WARM').length,
    COLD: leads.filter(l => l.score === 'COLD').length,
  }

  const pct = (n: number) => counts.ALL > 0 ? Math.round((n / counts.ALL) * 100) : 0

  const visible = leads
    .filter(l => filter === 'ALL' || l.score === filter)
    .filter(l =>
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase())
    )

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'ALL',  label: `Tous  ${counts.ALL}`  },
    { key: 'HOT',  label: `Hot  ${counts.HOT}`   },
    { key: 'WARM', label: `Warm  ${counts.WARM}` },
    { key: 'COLD', label: `Cold  ${counts.COLD}` },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f0f2f7' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-white/70" />
              <span className="font-bold text-white text-lg tracking-tight">{agencyName}</span>
            </div>
            <div className="w-px h-5 bg-white/15 hidden md:block" />
            <span className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Dashboard Agent
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour au site
            </Link>
            <div className="hidden md:block w-px h-5 bg-white/15 mx-1" />
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Actualiser</span>
            </button>
            <button
              onClick={() => exportCSV(visible)}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Exporter
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Page title ──────────────────────────────────────────────────── */}
        <div className="mb-7">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leads qualifiés</h1>
          <p className="text-slate-400 text-sm mt-1">
            Prospects collectés via l&apos;assistant IA
            · mis à jour à {new Date().toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* ── KPI cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <KpiCard
            label="Total prospects" value={counts.ALL}
            icon={Users} iconBg="bg-slate-100" iconColor="text-slate-600"
            barColor="bg-slate-400" showBar={false}
          />
          <KpiCard
            label="Priorité haute" value={counts.HOT} rate={pct(counts.HOT)}
            icon={Flame} iconBg="bg-red-50" iconColor="text-red-500"
            barColor="bg-red-500" showBar
          />
          <KpiCard
            label="Priorité moyenne" value={counts.WARM} rate={pct(counts.WARM)}
            icon={TrendingUp} iconBg="bg-amber-50" iconColor="text-amber-500"
            barColor="bg-amber-400" showBar
          />
          <KpiCard
            label="En exploration" value={counts.COLD} rate={pct(counts.COLD)}
            icon={Wind} iconBg="bg-slate-100" iconColor="text-slate-400"
            barColor="bg-slate-300" showBar
          />
        </div>

        {/* ── Table card ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">

          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {FILTERS.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filter === f.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 w-48 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          {isPending ? (
            <div className="py-24 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Chargement…</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-2">
                <UserRoundX className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Aucun lead trouvé</p>
              <p className="text-xs text-slate-400">
                {search ? 'Essayez une autre recherche' : `Aucun lead ${filter !== 'ALL' ? filter.toLowerCase() : ''} pour le moment`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Prospect', 'Contact', 'Score', 'Budget', 'Délai', 'Bien', 'Bien demandé', 'Localisation', 'Reçu'].map(h => (
                      <th key={h}
                        className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50/70">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((lead, i) => (
                    <tr key={lead.id}
                      className={`group hover:bg-amber-50/50 transition-colors border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.name} />
                          <span className="font-semibold text-slate-900 text-sm">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          {lead.contact}
                        </span>
                      </td>
                      <td className="px-5 py-4"><ScoreBadge score={lead.score} /></td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-800 text-sm whitespace-nowrap">{lead.budget}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-500 text-xs whitespace-nowrap">{lead.timeline}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                          {lead.property_type}
                        </span>
                      </td>
                      <td className="px-5 py-4 max-w-40">
                        {lead.property_interest
                          ? <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md truncate block">
                              {lead.property_interest}
                            </span>
                          : <span className="text-slate-300 text-xs">—</span>
                        }
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          {lead.location}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-400 whitespace-nowrap tabular-nums"
                          title={new Date(lead.created_at).toLocaleString('fr-MA')}>
                          {timeAgo(lead.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-600">{visible.length}</span>
                  {' '}lead{visible.length !== 1 ? 's' : ''} affiché{visible.length !== 1 ? 's' : ''}
                  {filter !== 'ALL' && <span className="ml-1 text-slate-400">· filtre {filter}</span>}
                </span>
                <span className="text-xs text-slate-400">
                  Propulsé par <span className="font-bold text-amber-600">Leadflow AI</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
