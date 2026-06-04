'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, X, Building2, Home, Banknote,
  MapPin, Clock, User, Send, CheckCircle2, ChevronRight,
} from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

interface LeadData {
  name: string; contact: string; budget: string; location: string
  timeline: string; property_type: string; numericScore: number; label: 'Hot' | 'Warm' | 'Cold'
}

const LABEL_STYLE = {
  Hot:  { bg: 'bg-red-500',    light: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-600',    bar: 'bg-red-500',   tag: 'HOT',  tagCls: 'bg-red-500'   },
  Warm: { bg: 'bg-amber-500',  light: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-600',  bar: 'bg-amber-400', tag: 'WARM', tagCls: 'bg-amber-500' },
  Cold: { bg: 'bg-slate-400',  light: 'bg-slate-100', border: 'border-slate-200',  text: 'text-slate-500',  bar: 'bg-slate-400', tag: 'COLD', tagCls: 'bg-slate-400' },
}

const GREETING = (agencyName: string) =>
  `Bienvenue chez ${agencyName}. Je vais vous poser quelques questions rapides pour mieux vous orienter.`

function renderMessage(text: string | undefined | null) {
  if (!text) return null
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function LeadWidget({
  agencyName = 'Prestige Immobilier',
  isEmbedded = false,
}: {
  agencyName?: string
  isEmbedded?: boolean
}) {
  const [isOpen, setIsOpen]     = useState(isEmbedded)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const [stage, setStage]       = useState<'chat' | 'scored' | 'dashboard'>('chat')
  const [showNotif, setShowNotif] = useState(false)
  const [mounted, setMounted]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0)
      setMessages([{ role: 'assistant', content: GREETING(agencyName) }])
  }, [isOpen, agencyName, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, stage])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  async function send() {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput('')
    const greeting: Message = { role: 'assistant', content: GREETING(agencyName) }
    const prev    = messages.length === 1 ? [greeting] : messages
    const newMsgs: Message[] = [...prev, { role: 'user', content: userText }]
    setMessages(newMsgs)
    setLoading(true)
    try {
      const res  = await fetch('/api/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, sessionData: { agencyName } }),
      })
      const data = await res.json()
      if (data.isComplete && data.lead) {
        setMessages([...newMsgs, { role: 'assistant', content: data.reply || 'Merci pour ces informations !' }])
        setLeadData(data.lead)
        setStage('scored')
        setTimeout(() => setShowNotif(true), 1600)
      } else {
        setMessages([...newMsgs, { role: 'assistant', content: data.reply || 'Comment puis-je vous aider ?' }])
      }
    } catch (err) {
      console.error('[qualify] fetch error:', err)
      setMessages([...newMsgs, { role: 'assistant', content: "Une erreur s'est produite. Veuillez réessayer." }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) { if (e.key === 'Enter') send() }

  function reset() {
    setLeadData(null); setStage('chat'); setShowNotif(false)
    setMessages([{ role: 'assistant', content: GREETING(agencyName) }])
  }

  const style = leadData ? LABEL_STYLE[leadData.label] : null

  // ── Embedded ───────────────────────────────────────────────────────────────
  if (isEmbedded) {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col" style={{ height: 540 }}>
        <WidgetHeader agencyName={agencyName} />
        <WidgetBody {...{ messages, loading, stage, leadData, showNotif, style, input, setInput, send, handleKey, reset, setStage, bottomRef, inputRef }} />
      </div>
    )
  }

  // ── Floating ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Toggle button */}
      {mounted && (
        <button
          onClick={() => {
            const next = !isOpen
            setIsOpen(next)
            if (window.parent !== window)
              window.parent.postMessage(next ? 'leadflow:enable-pointer' : 'leadflow:disable-pointer', '*')
          }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
          aria-label="Ouvrir l'assistant"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-5 h-5 text-white" />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageSquare className="w-5 h-5 text-white" />
              </motion.span>
            )}
          </AnimatePresence>
          {!isOpen && <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />}
        </button>
      )}

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-24 right-6 z-50 w-[375px] rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col"
            style={{ height: 530 }}
          >
            <WidgetHeader agencyName={agencyName} onClose={() => setIsOpen(false)} />
            <WidgetBody {...{ messages, loading, stage, leadData, showNotif, style, input, setInput, send, handleKey, reset, setStage, bottomRef, inputRef }} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Header ─────────────────────────────────────────────────────────────────────
function WidgetHeader({ agencyName, onClose }: { agencyName: string; onClose?: () => void }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
          <Building2 className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <p className="font-semibold text-white text-sm leading-tight">{agencyName}</p>
          <p className="text-xs text-white/60 flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
            Assistant IA · En ligne
          </p>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ── Body ───────────────────────────────────────────────────────────────────────
function WidgetBody({
  messages, loading, stage, leadData, showNotif, style,
  input, setInput, send, handleKey, reset, setStage, bottomRef, inputRef,
}: {
  messages: Message[]; loading: boolean; stage: string
  leadData: LeadData | null; showNotif: boolean
  style: typeof LABEL_STYLE['Hot'] | null
  input: string; setInput: (v: string) => void
  send: () => void; handleKey: (e: KeyboardEvent<HTMLInputElement>) => void
  reset: () => void; setStage: (s: 'chat' | 'scored' | 'dashboard') => void
  bottomRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: '#f8fafc' }}>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-sm'
              }`}
              style={m.role === 'user' ? { background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' } : {}}
            >
              {renderMessage(m.content)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3.5">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-300"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Score card */}
        <AnimatePresence>
          {stage === 'scored' && leadData && style && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border overflow-hidden mt-1 ${style.border}`}
            >
              {/* Card header */}
              <div className={`px-4 py-3 flex items-center justify-between ${style.light}`}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profil qualifié</p>
                <span className={`text-xs font-bold text-white px-2.5 py-0.5 rounded-full ${style.tagCls}`}>
                  {style.tag}
                </span>
              </div>

              {/* Score bar */}
              <div className="px-4 py-3 bg-white border-b border-slate-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-slate-400 font-medium">Score de qualification</span>
                  <span className={`text-xs font-bold ${style.text}`}>{leadData.numericScore}/10</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${leadData.numericScore * 10}%` }}
                    transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                    className={`h-full rounded-full ${style.bar}`}
                  />
                </div>
              </div>

              {/* Lead fields */}
              <div className="bg-white px-4 py-3 space-y-2.5">
                {[
                  { Icon: Home,    label: 'Bien',    value: leadData.property_type },
                  { Icon: Banknote, label: 'Budget', value: leadData.budget },
                  { Icon: MapPin,  label: 'Zone',    value: leadData.location },
                  { Icon: Clock,   label: 'Délai',   value: leadData.timeline },
                  { Icon: User,    label: 'Contact', value: leadData.contact },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-14 shrink-0">{label}</span>
                    <span className="text-xs font-semibold text-slate-800 truncate">{value || '—'}</span>
                  </div>
                ))}
              </div>

              {/* Confirmation */}
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-4 py-3 bg-emerald-50 border-t border-emerald-100 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">Dossier transmis avec succès</p>
                      <p className="text-xs text-emerald-600 mt-0.5">Un conseiller vous rappelle sous 30 minutes.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA */}
              <div className="px-4 py-3 bg-white border-t border-slate-100">
                <button
                  onClick={() => setStage('dashboard')}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
                >
                  Aperçu tableau de bord agent
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent dashboard preview */}
        <AnimatePresence>
          {stage === 'dashboard' && leadData && style && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mt-1"
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
              >
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Dashboard Agent</p>
                  <p className="text-sm font-semibold text-white mt-0.5">Nouveau lead entrant</p>
                </div>
                <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${style.tagCls}`}>
                  {style.tag}
                </span>
              </div>

              <div className="divide-y divide-slate-50">
                {[
                  ['Contact',  leadData.contact],
                  ['Bien',     leadData.property_type],
                  ['Budget',   leadData.budget],
                  ['Zone',     leadData.location],
                  ['Délai',    leadData.timeline],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-2.5 text-xs">
                    <span className="text-slate-400 font-medium">{k}</span>
                    <span className="text-slate-800 font-semibold">{v || '—'}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-slate-100">
                <button
                  onClick={reset}
                  className="w-full py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Recommencer la démo →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      {stage === 'chat' && (
        <div className="px-3 pb-3 pt-2 bg-white border-t border-slate-100 flex-shrink-0">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Votre réponse…"
              disabled={loading}
              className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-opacity hover:opacity-90 shrink-0"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
