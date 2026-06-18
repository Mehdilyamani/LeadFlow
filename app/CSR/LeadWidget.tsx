'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Building2, Send } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

interface LeadData {
  name: string; contact: string; budget: string; location: string
  timeline: string; property_type: string; numericScore: number; label: 'Hot' | 'Warm' | 'Cold'
}

interface PropertyCtx {
  id: string; title: string; price?: string; location?: string; city?: string
  area?: string; beds?: number; baths?: number; type?: string
  description?: string; features?: string[]
}

const GREETING = (agencyName: string, propertyContext?: PropertyCtx | null) =>
  propertyContext
    ? `Excellent choix ! **${propertyContext.title}** est un très beau bien. Avez-vous des questions à son sujet avant que je vous mette en relation avec un conseiller ?`
    : `Bienvenue chez **${agencyName}**. Je suis là pour vous aider — n'hésitez pas à me poser vos questions.`

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
  propertyContext = null,
  externalOpen = false,
  clientId,
}: {
  agencyName?: string
  isEmbedded?: boolean
  propertyContext?: PropertyCtx | null
  externalOpen?: boolean
  clientId?: string
}) {
  const [isOpen, setIsOpen]     = useState(isEmbedded)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [leadName, setLeadName] = useState<string | null>(null)
  const [stage, setStage]       = useState<'chat' | 'done'>('chat')
  const [mounted, setMounted]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])

  function notifyParent(open: boolean) {
    if (typeof window !== 'undefined' && window.parent !== window)
      window.parent.postMessage(open ? 'leadflow:open' : 'leadflow:close', '*')
  }

  function toggleOpen(next: boolean) {
    setIsOpen(next)
    notifyParent(next)
  }

  useEffect(() => {
    if (externalOpen) toggleOpen(true)
  }, [externalOpen])

  useEffect(() => {
    if (isOpen && messages.length === 0)
      setMessages([{ role: 'assistant', content: GREETING(agencyName, propertyContext) }])
  }, [isOpen, agencyName, propertyContext, messages.length])

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
        body: JSON.stringify({ messages: newMsgs, sessionData: { agencyName, propertyContext, clientId } }),
      })
      const data = await res.json()

      if (data.isComplete && data.lead) {
        const name = (data.lead as LeadData).name ?? ''
        const thanks = name
          ? `Merci ${name} ! Un conseiller vous recontacte très vite.`
          : 'Merci ! Un conseiller vous recontacte très vite.'
        setMessages([...newMsgs, { role: 'assistant', content: thanks }])
        setLeadName(name)
        setStage('done')
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

  // ── Embedded ───────────────────────────────────────────────────────────────
  if (isEmbedded) {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col" style={{ height: 540 }}>
        <WidgetHeader agencyName={agencyName} />
        <WidgetBody {...{ messages, loading, stage, leadName, input, setInput, send, handleKey, bottomRef, inputRef }} />
      </div>
    )
  }

  // ── Floating ───────────────────────────────────────────────────────────────
  return (
    <>
      {mounted && (
        <button
          onClick={() => toggleOpen(!isOpen)}
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-24 right-6 z-50 w-93.75 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col"
            style={{ height: 530 }}
          >
            <WidgetHeader agencyName={agencyName} onClose={() => toggleOpen(false)} />
            <WidgetBody {...{ messages, loading, stage, leadName, input, setInput, send, handleKey, bottomRef, inputRef }} />
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
      className="flex items-center justify-between px-4 py-3 shrink-0"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
          <Building2 style={{ width: 18, height: 18 }} className="text-white" />
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
  messages, loading, stage, leadName,
  input, setInput, send, handleKey, bottomRef, inputRef,
}: {
  messages: Message[]; loading: boolean; stage: string; leadName: string | null
  input: string; setInput: (v: string) => void
  send: () => void; handleKey: (e: KeyboardEvent<HTMLInputElement>) => void
  bottomRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: '#f8fafc' }}>

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

        {/* Done state: subtle confirmation strip */}
        {stage === 'done' && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex justify-center pt-2"
          >
            <span className="text-xs text-slate-400 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
              {leadName ? `À très vite, ${leadName}.` : 'À très vite.'}
            </span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — hidden once done */}
      {stage === 'chat' && (
        <div className="px-3 pb-3 pt-2 bg-white border-t border-slate-100 shrink-0">
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
