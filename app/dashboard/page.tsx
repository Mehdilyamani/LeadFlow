'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { UserRoundX, ArrowLeft, Users, Flame, TrendingUp, Wind, LogOut } from 'lucide-react'

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
  if (m < 1)   return 'À l\'instant'
  if (m < 60)  return `Il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24)  return `Il y a ${h}h`
  const d = Math.floor(h / 24)
  return `Il y a ${d}j`
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

// ── Score badge ────────────────────────────────────────────────────────────────
const SCORE = {
  HOT:  { dot: 'bg-red-500',    pill: 'bg-red-500 text-white',                label: 'HOT' },
  WARM: { dot: 'bg-orange-400', pill: 'bg-orange-400 text-white',             label: 'WARM' },
  COLD: { dot: 'bg-slate-400',  pill: 'bg-slate-200 text-slate-600',          label: 'COLD' },
}

function ScoreBadge({ score }: { score: Lead['score'] }) {
  const s = SCORE[score]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full bg-white/70`} />
      {s.label}
    </span>
  )
}

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const colors   = ['from-amber-500 to-orange-500', 'from-emerald-500 to-teal-600', 'from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600']
  const idx      = name.charCodeAt(0) % colors.length
  return (
    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-br ${colors[idx]} text-white text-xs font-bold shrink-0`}>
      {initials}
    </span>
  )
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, percentage, icon, accentText, barColor, iconBg }: {
  label: string
  value: number | string
  percentage?: number
  icon: React.ReactNode
  accentText: string
  barColor: string
  iconBg: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {percentage !== undefined && (
          <span className={`text-sm font-bold ${accentText}`}>{percentage}%</span>
        )}
      </div>
      <div>
        <p className="text-3xl font-extrabold text-slate-900 leading-none">{value}</p>
        <p className="text-sm text-slate-400 mt-1">{label}</p>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage ?? 100}%` }}
        />
      </div>
    </div>
  )
}

// ── Password Gate ──────────────────────────────────────────────────────────────
function PasswordGate({ onAuth, error }: { onAuth: (pw: string) => void; error: string }) {
  const [pw, setPw]     = useState('')
  const [show, setShow] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (pw.trim()) onAuth(pw.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <span className="text-2xl">🏛</span>
            <span className="font-bold text-slate-900 text-xl tracking-tight">
              Prestige <span className="text-amber-600">Immobilier</span>
            </span>
          </Link>
          <div className="w-full h-px bg-slate-100 mb-6" />
          <h2 className="text-slate-900 font-bold text-lg">Accès Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Réservé à l&apos;équipe Prestige</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={e => setPw(e.target.value)}
                autoFocus
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                  ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100'}`}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                {show ? 'Cacher' : 'Voir'}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
          >
            Accéder au dashboard →
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          ← <Link href="/" className="hover:text-amber-600 transition-colors">Retour au site</Link>
        </p>
      </div>
    </div>
  )
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [password, setPassword]   = useState<string | null>(null)
  const [leads, setLeads]         = useState<Lead[]>([])
  const [filter, setFilter]       = useState<Filter>('ALL')
  const [loading, setLoading]     = useState(false)
  const [authError, setAuthError] = useState('')
  const [search, setSearch]       = useState('')

  const fetchLeads = useCallback(async (pw: string) => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/leads', { headers: { 'x-dashboard-password': pw } })
      if (res.status === 401) { setAuthError('Mot de passe incorrect.'); setPassword(null); return }
      const json = await res.json()
      setLeads(json.leads ?? [])
      setPassword(pw)
      sessionStorage.setItem('dash_pw', pw)
    } catch {
      setAuthError('Erreur réseau.')
      setPassword(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const saved = sessionStorage.getItem('dash_pw')
    if (saved) fetchLeads(saved)
  }, [fetchLeads])

  if (!password) return <PasswordGate onAuth={fetchLeads} error={authError} />

  const counts = {
    ALL:  leads.length,
    HOT:  leads.filter(l => l.score === 'HOT').length,
    WARM: leads.filter(l => l.score === 'WARM').length,
    COLD: leads.filter(l => l.score === 'COLD').length,
  }

  const hotRate  = counts.ALL > 0 ? Math.round((counts.HOT  / counts.ALL) * 100) : 0
  const warmRate = counts.ALL > 0 ? Math.round((counts.WARM / counts.ALL) * 100) : 0
  const coldRate = counts.ALL > 0 ? Math.round((counts.COLD / counts.ALL) * 100) : 0

  const visible = leads
    .filter(l => filter === 'ALL' || l.score === filter)
    .filter(l =>
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase())
    )

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'ALL',  label: `Tous ${counts.ALL}` },
    { key: 'HOT',  label: `Hot ${counts.HOT}` },
    { key: 'WARM', label: `Warm ${counts.WARM}` },
    { key: 'COLD', label: `Cold ${counts.COLD}` },
  ]

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Left: logo + badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🏛</span>
              <span className="font-bold text-white text-lg tracking-tight">
                Prestige <span className="text-amber-400">Immobilier</span>
              </span>
            </Link>
            <div className="hidden md:block w-px h-5 bg-white/20" />
            <span className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Dashboard Agent
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Retour au site
            </Link>
            <div className="w-px h-5 bg-white/20 mx-1" />
            <button
              onClick={() => fetchLeads(password)}
              className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              ↻ Actualiser
            </button>
            <button
              onClick={() => exportCSV(visible)}
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 transition-colors ml-1"
            >
              ↓ Exporter
            </button>
            <button
              onClick={() => { sessionStorage.removeItem('dash_pw'); setPassword(null) }}
              className="ml-1 text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Page title ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Leads qualifiés</h1>
          <p className="text-slate-500 text-sm mt-1">
            Prospects collectés via l&apos;assistant IA · mis à jour à {new Date().toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* ── KPI cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total prospects"
            value={counts.ALL}
            icon={<Users className="w-5 h-5 text-slate-500" />}
            accentText=""
            barColor="bg-slate-300"
            iconBg="bg-slate-100"
          />
          <StatCard
            label="Priorité haute"
            value={counts.HOT}
            percentage={hotRate}
            icon={<Flame className="w-5 h-5 text-red-500" />}
            accentText="text-red-500"
            barColor="bg-red-500"
            iconBg="bg-red-50"
          />
          <StatCard
            label="Priorité moyenne"
            value={counts.WARM}
            percentage={warmRate}
            icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
            accentText="text-amber-500"
            barColor="bg-amber-400"
            iconBg="bg-amber-50"
          />
          <StatCard
            label="En exploration"
            value={counts.COLD}
            percentage={coldRate}
            icon={<Wind className="w-5 h-5 text-slate-400" />}
            accentText="text-slate-400"
            barColor="bg-slate-300"
            iconBg="bg-slate-100"
          />
        </div>

        {/* ── Table card ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            {/* Filters */}
            <div className="flex items-center gap-2">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
                    filter === f.key
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 w-52"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-sm">Chargement des leads…</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <UserRoundX className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-base font-semibold text-slate-600">Aucun lead trouvé</p>
              <p className="text-sm mt-1">{search ? 'Essayez une autre recherche' : `Aucun lead ${filter !== 'ALL' ? filter : ''} pour le moment`}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Prospect', 'Contact', 'Score', 'Budget', 'Délai', 'Bien', 'Bien demandé', 'Localisation', 'Reçu'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {visible.map(lead => (
                    <tr key={lead.id} className="group hover:bg-slate-50 transition-colors">
                      {/* Prospect */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.name} />
                          <span className="font-semibold text-slate-900">{lead.name}</span>
                        </div>
                      </td>
                      {/* Contact */}
                      <td className="px-5 py-4 text-slate-500 text-xs font-mono">{lead.contact}</td>
                      {/* Score */}
                      <td className="px-5 py-4"><ScoreBadge score={lead.score} /></td>
                      {/* Budget */}
                      <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">{lead.budget}</td>
                      {/* Timeline */}
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{lead.timeline}</td>
                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                          {lead.property_type}
                        </span>
                      </td>
                      {/* Property interest */}
                      <td className="px-5 py-4 max-w-40">
                        {lead.property_interest
                          ? <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md truncate block">{lead.property_interest}</span>
                          : <span className="text-xs text-slate-300">—</span>
                        }
                      </td>
                      {/* Location */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                          <span className="text-amber-500">📍</span>
                          {lead.location}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-400 whitespace-nowrap" title={new Date(lead.created_at).toLocaleString('fr-MA')}>
                          {timeAgo(lead.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{visible.length} lead{visible.length !== 1 ? 's' : ''} affiché{visible.length !== 1 ? 's' : ''}</span>
                <span className="text-amber-600 font-semibold">
                  Propulsé par <span className="font-bold">Leadflow AI</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
