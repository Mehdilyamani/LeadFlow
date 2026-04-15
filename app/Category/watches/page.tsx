// app/Category/[slug]/page.tsx  — apply to ALL categories, only change the category name and metadata
import React from 'react';
import type { Metadata } from 'next';
import Article from '../../CSR/articleCP';
import { getArticlesByCategory } from '../../lib/getArticlebyCate';
import type { ArticleType } from '../../lib/types';
import HeroVideo from '../../CSR/HeroVideo';

export const metadata: Metadata = {
  title: 'Restau — Desserts Maison',
  description: "Découvrez notre sélection de desserts maison.",
};

const gold = '#c9a84c';
const goldLight = '#f0d080';
const mono = "'Courier New', monospace";
const font = "'Georgia', 'Times New Roman', serif";

export default async function CategoryPage() {
  let articles: ArticleType[] = [];
  try {
    articles = await getArticlesByCategory('Desserts Maison'); // ← change per category
  } catch (err) {
    console.error('Error fetching articles:', err);
  }

  return (
    <main style={{ backgroundColor: '#0d0d0b', minHeight: '100vh', fontFamily: font }}>

      {/* ── HERO VIDEO ── */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(280px, 45vh, 520px)', overflow: 'hidden' }}>
        <HeroVideo
            src="/1858094-hd_1080_1920_30fps.mp4"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,8,0.3) 0%, transparent 35%, transparent 55%, rgba(10,10,8,0.9) 100%)', pointerEvents: 'none' }} />

        {/* Centered text */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', pointerEvents: 'none' }}>
          <span style={{ color: gold, fontSize: '0.62rem', fontFamily: mono, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
            ✦ &nbsp; Notre Carte &nbsp; ✦
          </span>
          <h1 style={{ color: '#f5f0e8', fontFamily: font, fontWeight: 400, fontSize: 'clamp(1.8rem, 6vw, 4.5rem)', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0, textShadow: '0 6px 30px rgba(0,0,0,0.6)', lineHeight: 1 }}>
            Desserts Maison {/* ← change per category */}
          </h1>
          <div style={{ width: '50px', height: '1px', background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
          <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '0.68rem', fontFamily: mono, letterSpacing: '0.2em', fontStyle: 'italic', margin: 0 }}>
            Sélectionnés avec soin, préparés avec passion
          </p>
        </div>
      </div>

      {/* ── SECTION HEADER ── */}
      <div style={{ padding: '52px clamp(16px, 4vw, 48px) 36px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginBottom: '14px' }}>
          <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4))' }} />
          <span style={{ color: gold, fontSize: '0.6rem', fontFamily: mono, letterSpacing: '0.35em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {articles.length} plat{articles.length !== 1 ? 's' : ''} disponible{articles.length !== 1 ? 's' : ''}
          </span>
          <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)' }} />
        </div>
      </div>

      {/* ── GRID ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(12px, 3vw, 48px) 80px' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: gold, fontSize: '1.5rem' }}>✦</span>
            <p style={{ color: '#8a8070', fontStyle: 'italic', fontSize: '0.95rem', fontFamily: font }}>
              Aucun plat disponible pour le moment. Revenez bientôt.
            </p>
          </div>
        ) : (
          <>
            {/* Inline responsive grid styles */}
            <style>{`
              .cat-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
              }
              @media (min-width: 640px) {
                .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
              }
              @media (min-width: 900px) {
                .cat-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
              }
              @media (min-width: 1200px) {
                .cat-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
              }
            `}</style>
            <div className="cat-grid">
              {articles.map((article) => (
                <MobileCompactCard article={article} key={article.id} />
              ))}
            </div>
          </>
        )}
      </section>

    </main>
  );
}

// ── Compact card wrapper for mobile — shrinks ArticleCard proportionally ──
function MobileCompactCard({ article }: { article: ArticleType }) {
  return (
    <div style={{ width: '100%' }}>
      <Article article={article} />
    </div>
  );
}