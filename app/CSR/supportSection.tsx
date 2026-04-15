'use client';
import React, { useRef, useEffect, useState } from 'react';

const contactOptions = [
  {
    id: 1,
    number: '01',
    icon: '◈',
    title: 'Chat en Direct',
    desc: 'Réponse en moins de 2 minutes',
    action: 'Ouvrir le chat',
    isTrigger: true,
  },
  {
    id: 2,
    number: '02',
    icon: '✉',
    title: 'Email Support',
    desc: 'support@restau.com',
    action: 'Envoyer un email',
    link: 'mailto:support@restau.com',
  },
  {
    id: 3,
    number: '03',
    icon: '✆',
    title: 'Ligne VIP',
    desc: '+212 6 00 00 00 00',
    action: 'Appeler maintenant',
    link: 'tel:+212600000000',
  },
];

export default function SupportSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = (opt: typeof contactOptions[0]) => {
    if (opt.isTrigger) {
      document.querySelector('.Restau-trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    } else if (opt.link) {
      window.location.href = opt.link;
    }
  };

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#0a0a0a',
        padding: '100px 24px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        isolation: 'isolate',
      }}
    >
      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px', opacity: 0.5,
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Gold top border */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #c9a84c, #f0d080, #c9a84c, transparent)',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '72px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          marginBottom: '24px',
        }}>
          <span style={{
            display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: '#2ecc71',
            boxShadow: '0 0 8px rgba(46,204,113,0.8)',
            animation: 'pulse-dot 2s infinite',
          }} />
          <span style={{
            color: '#c9a84c',
            fontSize: '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontFamily: "'Courier New', monospace",
          }}>
            Support En Ligne
          </span>
        </div>

        <h2 style={{
          color: '#f5f0e8',
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 400,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          margin: '0 0 16px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          À Votre Écoute
        </h2>

        <p style={{
          color: '#8a8070',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.9s ease 0.15s',
        }}>
          Contactez-nous via votre canal préféré. On répond vite.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '1px',
        backgroundColor: 'rgba(201,168,76,0.1)',
        border: '1px solid rgba(201,168,76,0.1)',
        borderRadius: '2px',
        position: 'relative',
        zIndex: 1,
      }}>
        {contactOptions.map((opt, i) => (
          <div
            key={opt.id}
            onClick={() => handleClick(opt)}
            onMouseEnter={() => setHovered(opt.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: '1 1 260px',
              backgroundColor: hovered === opt.id ? '#130f05' : '#0a0a0a',
              padding: '48px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxSizing: 'border-box',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(28px)',
              transition: `opacity 0.7s ease ${0.1 + i * 0.12}s, transform 0.7s ease ${0.1 + i * 0.12}s, background-color 0.3s ease`,
            }}
          >
            {/* Corner accent */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: hovered === opt.id ? '60px' : '40px',
              height: hovered === opt.id ? '60px' : '40px',
              borderTop: `1px solid rgba(201,168,76,${hovered === opt.id ? '0.6' : '0.3'})`,
              borderRight: `1px solid rgba(201,168,76,${hovered === opt.id ? '0.6' : '0.3'})`,
              transition: 'all 0.3s ease',
            }} />

            {/* Number */}
            <span style={{
              color: 'rgba(201,168,76,0.25)',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              fontFamily: "'Courier New', monospace",
            }}>
              {opt.number}
            </span>

            {/* Icon */}
            <span style={{
              color: '#c9a84c',
              fontSize: '1.8rem',
              lineHeight: 1,
              transition: 'transform 0.3s ease',
              transform: hovered === opt.id ? 'scale(1.15)' : 'scale(1)',
              display: 'inline-block',
            }}>
              {opt.icon}
            </span>

            {/* Divider */}
            <div style={{
              width: hovered === opt.id ? '40px' : '24px',
              height: '1px',
              backgroundColor: 'rgba(201,168,76,0.4)',
              transition: 'width 0.3s ease',
            }} />

            {/* Title */}
            <h3 style={{
              color: '#f5f0e8',
              fontWeight: 400,
              fontSize: '1.1rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              {opt.title}
            </h3>

            {/* Desc */}
            <p style={{
              color: '#8a8070',
              fontSize: '0.88rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
              margin: 0,
              flexGrow: 1,
            }}>
              {opt.desc}
            </p>

            {/* CTA */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: hovered === opt.id ? '12px' : '8px',
              color: '#c9a84c',
              fontSize: '0.78rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: "'Courier New', monospace",
              transition: 'gap 0.3s ease',
            }}>
              {opt.action}
              <span style={{
                opacity: hovered === opt.id ? 1 : 0.5,
                transition: 'opacity 0.3s ease',
              }}>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '64px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
          {'★★★★★'.split('').map((s, i) => (
            <span key={i} style={{ color: '#c9a84c', fontSize: '0.75rem' }}>{s}</span>
          ))}
        </div>
        <span style={{
          color: 'rgba(201,168,76,0.35)',
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontFamily: "'Courier New', monospace",
        }}>
          Support élu meilleur service 2024
        </span>
      </div>

      {/* Gold bottom border */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #c9a84c, #f0d080, #c9a84c, transparent)',
      }} />

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}