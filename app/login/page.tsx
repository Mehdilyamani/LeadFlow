'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [show, setShow]         = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
    >
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
          >
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-slate-900 font-bold text-lg">Accès Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">Connectez-vous pour voir vos leads</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
              placeholder="vous@agence.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                  error
                    ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 bg-slate-50 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                {show ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
          >
            {loading ? 'Connexion…' : 'Accéder au tableau de bord →'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          <Link href="/" className="hover:text-amber-600 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Retour au site
          </Link>
        </p>
      </div>
    </div>
  )
}
