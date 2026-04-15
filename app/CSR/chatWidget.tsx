'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const gold = '#c9a84c';
const goldLight = '#f0d080';
const dark = '#0a0a0a';
const cardBg = '#0e0d0a';
const cream = '#f5f0e8';
const muted = '#8a8070';
const mono = "'Courier New', monospace";
const font = "'Georgia', 'Times New Roman', serif";

export default function ChatWidget() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [triggerHovered, setTriggerHovered] = useState(false);
  const [sendHovered, setSendHovered] = useState(false);

  const isProcessing = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // On article pages, move the widget up so it doesn't overlap the sticky total bar
  const isArticlePage = pathname?.startsWith('/article/');
  const bottomOffset = isArticlePage ? '100px' : '24px';

  useEffect(() => {
    const handleOrder = (event: any) => {
      const dish = event.detail.dishName;
      setIsOpen(true);
      handleSendMessage(`Je veux commander : ${dish}`);
    };
    window.addEventListener('TRIGGER_ORDER', handleOrder);
    return () => window.removeEventListener('TRIGGER_ORDER', handleOrder);
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Reconnaissance vocale non supportée.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing.current) return;
    const newMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    await triggerGemini([...messages, newMsg]);
  };

  const triggerGemini = async (history: any[]) => {
    if (isProcessing.current) return;
    setLoading(true);
    isProcessing.current = true;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain' },
        body: JSON.stringify({ messages: history }),
      });
      const contentType = response.headers.get('content-type') || '';
      let botReply = '';
      if (contentType.includes('application/json')) {
        const json = await response.json().catch(() => null);
        botReply = json?.reply || json?.message || '';
      } else {
        botReply = await response.text().catch(() => '');
      }
      if (!botReply) botReply = "Je n'ai pas de réponse pour le moment, veuillez réessayer.";
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur réseau, veuillez réessayer.' }]);
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  const MicIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3"/>
      <path d="M5 10a7 7 0 0 0 14 0"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="9" y1="22" x2="15" y2="22"/>
    </svg>
  );

  const StopIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  );

  return (
    <>
      <style>{`
        @keyframes ring-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(201,168,76,0.15), 0 8px 32px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 40px rgba(201,168,76,0.3), 0 8px 32px rgba(0,0,0,0.5); }
        }
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-window-enter { animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .chat-input:focus { outline: none; }
        .chat-input::placeholder { color: rgba(138,128,112,0.5); font-style: italic; }
        .chat-scrollbar::-webkit-scrollbar { width: 3px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
        .trigger-btn { animation: glow-pulse 3s ease-in-out infinite; }
        .trigger-btn:hover { animation: none; }
      `}</style>

      <div style={{
        position: 'fixed',
        bottom: bottomOffset,
        right: '24px',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        pointerEvents: 'none',
        transition: 'bottom 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* ── CHAT WINDOW ── */}
        {isOpen && (
          <div className="chat-window-enter" style={{
            width: 'clamp(300px, 90vw, 380px)',
            height: 'clamp(420px, 65vh, 560px)',
            backgroundColor: dark,
            border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: '2px',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(201,168,76,0.06)',
            pointerEvents: 'auto', position: 'relative',
          }}>
            {/* Grain */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px', opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', zIndex: 2, background: `linear-gradient(90deg, transparent, ${gold}, ${goldLight}, ${gold}, transparent)` }} />

            {/* HEADER */}
            <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, padding: '16px 20px', borderBottom: '1px solid rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(10,10,8,0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative', width: '32px', height: '32px', flexShrink: 0 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid rgba(201,168,76,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(201,168,76,0.06)', color: gold, fontSize: '0.8rem' }}>✦</div>
                  <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2ecc71', border: `1px solid ${dark}`, boxShadow: '0 0 6px rgba(46,204,113,0.8)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ color: cream, fontSize: '0.88rem', letterSpacing: '0.08em', fontFamily: font }}>Maître d'Hôtel</span>
                  <span style={{ color: gold, fontSize: '0.58rem', fontFamily: mono, letterSpacing: '0.25em', textTransform: 'uppercase' }}>✦ &nbsp; Restau — IA</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '1px', color: muted, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0, transition: 'all 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)'; (e.currentTarget as HTMLElement).style.color = gold; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)'; (e.currentTarget as HTMLElement).style.color = muted; }}>✕</button>
            </div>

            {/* MESSAGES */}
            <div ref={scrollRef} className="chat-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
              {messages.length === 0 && (
                <div style={{ margin: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px' }}>
                  <div style={{ color: gold, fontSize: '1.4rem' }}>✦</div>
                  <p style={{ color: muted, fontSize: '0.85rem', fontFamily: font, fontStyle: 'italic', lineHeight: 1.7, margin: 0, maxWidth: '240px' }}>Bonsoir, je suis votre Maître d'Hôtel. Comment puis-je sublimer votre soirée ?</p>
                  <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ maxWidth: '82%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: m.role === 'user' ? 'rgba(201,168,76,0.5)' : 'rgba(138,128,112,0.5)', fontSize: '0.55rem', fontFamily: mono, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: m.role === 'user' ? 'right' : 'left', paddingLeft: m.role === 'user' ? 0 : '4px', paddingRight: m.role === 'user' ? '4px' : 0 }}>
                    {m.role === 'user' ? 'Vous' : "Maître d'Hôtel"}
                  </span>
                  <div style={{ padding: '10px 14px', backgroundColor: m.role === 'user' ? 'rgba(201,168,76,0.1)' : '#0e0d0a', border: `1px solid ${m.role === 'user' ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'}`, borderRadius: '1px', color: m.role === 'user' ? cream : 'rgba(245,240,232,0.85)', fontSize: '0.85rem', fontFamily: font, lineHeight: 1.6, position: 'relative' }}>
                    {m.role === 'assistant' && <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderTop: `1px solid rgba(201,168,76,0.4)`, borderLeft: `1px solid rgba(201,168,76,0.4)` }} />}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: 'rgba(138,128,112,0.5)', fontSize: '0.55rem', fontFamily: mono, letterSpacing: '0.2em', textTransform: 'uppercase', paddingLeft: '4px' }}>Maître d'Hôtel</span>
                  <div style={{ padding: '12px 18px', backgroundColor: cardBg, border: '1px solid rgba(201,168,76,0.1)', borderRadius: '1px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: gold, opacity: 0.6, animation: `typing-dot 1.2s ease ${i * 0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, borderTop: '1px solid rgba(201,168,76,0.12)', padding: '12px 14px', backgroundColor: 'rgba(10,10,8,0.9)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={startListening} style={{ width: '34px', height: '34px', flexShrink: 0, backgroundColor: isListening ? 'rgba(255,71,87,0.15)' : 'transparent', border: `1px solid ${isListening ? 'rgba(255,71,87,0.6)' : 'rgba(201,168,76,0.2)'}`, borderRadius: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isListening ? '#ff4757' : muted, transition: 'all 0.2s ease' }}>
                {isListening ? <StopIcon /> : <MicIcon />}
              </button>
              <input ref={inputRef} className="chat-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)} placeholder="Votre message..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '1px', padding: '8px 12px', color: cream, fontSize: '0.85rem', fontFamily: font, fontStyle: 'italic', minWidth: 0 }} />
              <button onClick={() => handleSendMessage(input)} onMouseEnter={() => setSendHovered(true)} onMouseLeave={() => setSendHovered(false)} style={{ width: '34px', height: '34px', flexShrink: 0, backgroundColor: sendHovered ? 'rgba(201,168,76,0.15)' : 'transparent', border: `1px solid ${sendHovered ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.3)'}`, borderRadius: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '0.8rem', transition: 'all 0.2s ease' }}>→</button>
            </div>
          </div>
        )}

        {/* ── TRIGGER BUTTON ── */}
        <div style={{ position: 'relative', pointerEvents: 'auto' }}>
          {!isOpen && (
            <>
              <div style={{ position: 'absolute', inset: '-6px', borderRadius: '2px', border: `1px solid ${gold}`, animation: 'ring-pulse 2.8s ease-out infinite', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: '-6px', borderRadius: '2px', border: `1px solid ${gold}`, animation: 'ring-pulse 2.8s ease-out 1s infinite', pointerEvents: 'none' }} />
            </>
          )}
          <button
            className={!isOpen ? 'trigger-btn' : ''}
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setTriggerHovered(true)}
            onMouseLeave={() => setTriggerHovered(false)}
            style={{
              width: '70px', height: '70px',
              backgroundColor: triggerHovered ? 'rgba(201,168,76,0.18)' : 'rgba(10,10,8,0.97)',
              border: `1px solid ${triggerHovered || isOpen ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.5)'}`,
              borderRadius: '2px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
              transition: 'background-color 0.25s ease, border-color 0.25s ease',
              position: 'relative', zIndex: 1,
            }}
          >
            {isOpen ? (
              <span style={{ color: gold, fontSize: '0.85rem' }}>✕</span>
            ) : (
              <>
                <span style={{ color: gold, fontSize: '1rem', lineHeight: 1 }}>✦</span>
                <span style={{ color: cream, fontSize: '0.45rem', fontFamily: mono, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.8, lineHeight: 1 }}>Commander</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}