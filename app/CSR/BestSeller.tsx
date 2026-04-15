'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ArticleType } from '../lib/types';
import ArticleCard from './articleCP';

export default function BestSellers() {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur Restau:', err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const duplicatedArticles = [...articles, ...articles, ...articles, ...articles];

  if (loading || articles.length === 0) return null;

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#0a0a0a',
      padding: '80px 0',
      overflow: 'hidden',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      isolation: 'isolate',
    }}>

      {/* Grain */}
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

      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '250px',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px', position: 'relative', zIndex: 1, padding: '0 24px' }}>
        <div style={{
          color: '#c9a84c',
          fontSize: '0.7rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          fontFamily: "'Courier New', monospace",
          marginBottom: '18px',
        }}>
          ✦ &nbsp; Sélection du Chef &nbsp; ✦
        </div>
        <h2 style={{
          color: '#f5f0e8',
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 400,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          margin: '0 0 14px',
        }}>
          Nos Best-Sellers
        </h2>
        <p style={{
          color: '#8a8070',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 0,
        }}>
          Validés par nos clients, sublimés par nos chefs
        </p>
      </div>

      {/* Carousel */}
      <div style={{ position: 'relative', width: '100%', zIndex: 1 }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          whileHover={{ transition: { duration: 70 } }}
          style={{
            display: 'flex',
            gap: '20px',
            padding: '12px 0 20px',
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {duplicatedArticles.map((item, idx) => (
            /* ← fixed wrapper width — card fills it via width:100% */
            <div key={`${item.id}-${idx}`} style={{ width: '260px', flexShrink: 0 }}>
              <ArticleCard article={item} />
            </div>
          ))}
        </motion.div>

        {/* Edge fades */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: '10%',
          background: 'linear-gradient(to right, #0a0a0a, transparent)',
          pointerEvents: 'none', zIndex: 2,
        }} />
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: '10%',
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