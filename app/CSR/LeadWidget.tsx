'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface LeadData {
  type: string
  propertyType: string
  budget: string
  location: string
  timeline: string
  contact: string
  score: number
  label: 'Hot' | 'Warm' | 'Cold'
  reason: string
}

const LABEL_STYLE = {
  Hot:  { bg: 'bg-rose-500',   light: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-600',   emoji: '🔥', bar: 'bg-rose-500'   },
  Warm: { bg: 'bg-amber-500',  light: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-600',  emoji: '⚡', bar: 'bg-amber-500'  },
  Cold: { bg: 'bg-sky-400',    light: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-600',    emoji: '❄️', bar: 'bg-sky-400'    },
}

const GREETING = (agencyName: string) =>
  `Bonjour ! 👋 Je suis l'assistant de **${agencyName}**.\n\nJe vous aide à trouver votre bien immobilier idéal en quelques questions rapides.\n\n**Vous cherchez à acheter ou à louer ?**`

function renderMessage(text: string) {
  // Bold **text**
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function LeadWidget({
  agencyName = 'Prestige Immobilier',
  isEmbedded = false,
}: {
  agencyName?: string
  isEmbedded?: boolean
}) {
  const [isOpen, setIsOpen] = useState(isEmbedded)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const [stage, setStage] = useState<'chat' | 'scored' | 'dashboard'>('chat')
  const [showNotif, setShowNotif] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Show greeting on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: GREETING(agencyName) }])
    }
  }, [isOpen])

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
    const prev = messages.length === 1 ? [greeting] : messages
    const newMsgs: Message[] = [...prev, { role: 'user', content: userText }]
    setMessages(newMsgs)
    setLoading(true)

    try {
      const res = await fetch('/api/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, agencyName }),
      })
      const data = await res.json()

      if (data.done && data.lead) {
        setMessages([...newMsgs, { role: 'assistant', content: data.message }])
        setLeadData(data.lead)
        setStage('scored')
        setTimeout(() => setShowNotif(true), 1800)
      } else {
        setMessages([...newMsgs, { role: 'assistant', content: data.message }])
      }
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: "Désolé, une erreur s'est produite. Veuillez réessayer." }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') send()
  }

  function reset() {
    setMessages([])
    setLeadData(null)
    setStage('chat')
    setShowNotif(false)
    setMessages([{ role: 'assistant', content: GREETING(agencyName) }])
  }

  const style = leadData ? LABEL_STYLE[leadData.label] : null

  // ── EMBEDDED (inline on /pitch) ────────────────────────────────────────────
  if (isEmbedded) {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col" style={{ height: 540 }}>
        <WidgetHeader agencyName={agencyName} onClose={undefined} />
        <WidgetBody
          messages={messages}
          loading={loading}
          stage={stage}
          leadData={leadData}
          showNotif={showNotif}
          style={style}
          input={input}
          setInput={setInput}
          send={send}
          handleKey={handleKey}
          reset={reset}
          setStage={setStage}
          bottomRef={bottomRef}
          inputRef={inputRef}
        />
      </div>
    )
  }

  // ── FLOATING (homepage) ─────────────────────────────────────────────────────
  return (
    <>
      {/* Pulse badge */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <div className="bg-white text-slate-800 text-sm font-medium px-3 py-2 rounded-xl shadow-lg border border-slate-100 whitespace-nowrap">
              Qualifiez vos leads en 2 min ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
        aria-label="Ouvrir l'assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-white text-xl">✕</motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="text-white text-2xl">💬</motion.span>
          )}
        </AnimatePresence>
        {/* Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[370px] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
            style={{ height: 520 }}
          >
            <WidgetHeader agencyName={agencyName} onClose={() => setIsOpen(false)} />
            <WidgetBody
              messages={messages}
              loading={loading}
              stage={stage}
              leadData={leadData}
              showNotif={showNotif}
              style={style}
              input={input}
              setInput={setInput}
              send={send}
              handleKey={handleKey}
              reset={reset}
              setStage={setStage}
              bottomRef={bottomRef}
              inputRef={inputRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function WidgetHeader({ agencyName, onClose }: { agencyName: string; onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🏡</div>
        <div>
          <p className="font-semibold text-sm leading-tight">{agencyName}</p>
          <p className="text-xs text-white/70 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
            Assistant IA • En ligne
          </p>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors text-lg">✕</button>
      )}
    </div>
  )
}

function WidgetBody({
  messages, loading, stage, leadData, showNotif, style,
  input, setInput, send, handleKey, reset, setStage, bottomRef, inputRef,
}: {
  messages: Message[]
  loading: boolean
  stage: string
  leadData: LeadData | null
  showNotif: boolean
  style: typeof LABEL_STYLE['Hot'] | null
  input: string
  setInput: (v: string) => void
  send: () => void
  handleKey: (e: KeyboardEvent<HTMLInputElement>) => void
  reset: () => void
  setStage: (s: 'chat' | 'scored' | 'dashboard') => void
  bottomRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div className="flex flex-col flex-1 bg-slate-50 overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-sm'
              }`}
              style={m.role === 'user' ? { background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' } : {}}
            >
              {renderMessage(m.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-slate-400"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lead Score Card */}
        <AnimatePresence>
          {stage === 'scored' && leadData && style && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-4 border ${style.light} ${style.border} mt-2`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profil Lead</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${style.bg}`}>
                  {style.emoji} {leadData.label}
                </span>
              </div>

              {/* Score bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Score de qualification</span>
                  <span className={`font-bold ${style.text}`}>{leadData.score}/10</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${leadData.score * 10}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${style.bar}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-sm">
                {[
                  { icon: '🏠', label: 'Bien', value: `${leadData.type} — ${leadData.propertyType}` },
                  { icon: '💰', label: 'Budget', value: leadData.budget },
                  { icon: '📍', label: 'Zone', value: leadData.location },
                  { icon: '⏱', label: 'Délai', value: leadData.timeline },
                  { icon: '👤', label: 'Contact', value: leadData.contact },
                ].map(row => (
                  <div key={row.label} className="flex gap-2">
                    <span>{row.icon}</span>
                    <span className="text-slate-500 text-xs">{row.label}:</span>
                    <span className="text-slate-800 text-xs font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              <p className={`text-xs mt-3 italic ${style.text}`}>"{leadData.reason}"</p>

              {/* WhatsApp notification */}
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 flex items-start gap-2"
                  >
                    <span className="text-lg">📱</span>
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">Notification envoyée !</p>
                      <p className="text-xs text-emerald-600">WhatsApp envoyé à votre agent — il vous contacte sous 30 min.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setStage('dashboard')}
                className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
              >
                Voir le tableau de bord agent →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent Dashboard */}
        <AnimatePresence>
          {stage === 'dashboard' && leadData && style && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mt-2"
            >
              <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
                <div>
                  <p className="text-xs text-white/60">Dashboard Agent</p>
                  <p className="text-sm font-semibold text-white">Nouveau lead entrant</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${style.bg}`}>{style.emoji} {leadData.label}</span>
              </div>
              <div className="p-4 space-y-2">
                {[
                  ['Contact', leadData.contact],
                  ['Projet', `${leadData.type} — ${leadData.propertyType}`],
                  ['Budget', leadData.budget],
                  ['Zone', leadData.location],
                  ['Délai', leadData.timeline],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs border-b border-slate-50 pb-1.5">
                    <span className="text-slate-400 font-medium">{k}</span>
                    <span className="text-slate-800 font-semibold">{v}</span>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">
                    📞 Appeler
                  </button>
                  <button className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                    💬 WhatsApp
                  </button>
                </div>
                <button onClick={reset} className="w-full py-2 rounded-lg text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  Recommencer une démo →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      {stage === 'chat' && (
        <div className="px-3 pb-3 pt-2 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Votre réponse..."
              className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
