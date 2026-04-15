'use client';
import React from 'react';
import { motion } from 'framer-motion';

const REVIEWS = [
  { name: "Marc A.", date: "12 Déc 2025", text: "La commande via le chat est révolutionnaire. Rapide et sans erreur !", stars: 5, initial: "M" },
  { name: "Lila R.", date: "28 Nov 2025", text: "Les meilleures pizzas du quartier. Arrivées chaudes et croustillantes.", stars: 5, initial: "L" },
  { name: "Karim B.", date: "15 Nov 2025", text: "Service client au top. Le chatbot a répondu à toutes mes questions sur les allergènes.", stars: 5, initial: "K" },
  { name: "Sarah J.", date: "02 Nov 2025", text: "Un gain de temps incroyable pour commander mon déjeuner. Je recommande !", stars: 5, initial: "S" },
  { name: "Thomas V.", date: "20 Oct 2025", text: "Interface magnifique et plats succulents. Une expérience 5 étoiles.", stars: 5, initial: "T" },
];

export default function Reviews() {
  const infiniteReviews = [...REVIEWS, ...REVIEWS, ...REVIEWS];

  return (
    <section style={{
      padding: '80px 0',
      backgroundColor: '#0a0a0a',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>

      {/* Grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px', opacity: 0.5,
      }} />

      {/* Gold top border */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #c9a84c, #f0d080, #c9a84c, transparent)',
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '250px',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            display: 'inline-block',
            color: '#c9a84c',
            fontSize: '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontFamily: "'Courier New', monospace",
            marginBottom: '20px',
          }}
        >
          ✦ &nbsp; Témoignages &nbsp; ✦
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            color: '#f5f0e8',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '0 0 14px',
          }}
        >
          Mangez en toute tranquillité
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            color: '#8a8070',
            fontSize: '0.95rem',
            fontStyle: 'italic',
            margin: 0,
          }}
        >
          Rejoint par des milliers de gourmets satisfaits
        </motion.p>
      </div>

      {/* Carousel */}
      <div style={{ position: 'relative', width: '100%', zIndex: 1 }}>
        <motion.div
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          whileHover={{ transition: { duration: 70 } }}
          style={{ display: 'flex', gap: '20px', padding: '12px 0', width: 'max-content' }}
        >
          {infiniteReviews.map((rev, i) => (
            <div
              key={i}
              style={{
                width: '320px',
                flexShrink: 0,
                backgroundColor: '#111008',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: '2px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Corner accent */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '40px', height: '40px',
                borderTop: '1px solid rgba(201,168,76,0.4)',
                borderRight: '1px solid rgba(201,168,76,0.4)',
              }} />

              {/* Stars */}
              <div style={{ color: '#c9a84c', fontSize: '0.8rem', letterSpacing: '3px' }}>
                {'★'.repeat(rev.stars)}
              </div>

              {/* Quote */}
              <p style={{
                color: '#c8bfa8',
                fontSize: '0.9rem',
                lineHeight: '1.75',
                fontStyle: 'italic',
                margin: 0,
                flexGrow: 1,
              }}>
                "{rev.text}"
              </p>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'rgba(201,168,76,0.12)' }} />

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  border: '1px solid rgba(201,168,76,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600,
                  backgroundColor: 'rgba(201,168,76,0.06)',
                  fontFamily: "'Courier New', monospace",
                  flexShrink: 0,
                }}>
                  {rev.initial}
                </div>
                <div>
                  <div style={{ color: '#f5f0e8', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {rev.name}
                  </div>
                  <div style={{ color: '#5a5248', fontSize: '0.75rem', letterSpacing: '0.08em', marginTop: '2px' }}>
                    {rev.date}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  color: '#c9a84c', fontSize: '0.7rem',
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.1em',
                }}>
                  ✓ Vérifié
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Edge fades */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: '12%',
          background: 'linear-gradient(to right, #0a0a0a, transparent)',
          pointerEvents: 'none', zIndex: 2,
        }} />
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: '12%',
          background: 'linear-gradient(to left, #0a0a0a, transparent)',
          pointerEvents: 'none', zIndex: 2,
        }} />
      </div>

      {/* Gold bottom border */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #c9a84c, #f0d080, #c9a84c, transparent)',
      }} />
    </section>
  );
}