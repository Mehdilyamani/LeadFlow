'use client';

import React, { useMemo } from 'react';

type Review = {
  id: string;
  name: string;
  location?: string;
  text: string;
  rating: number;
  daysAgo: number;
};

function hashToSeed(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) hash = (hash * 33) ^ str.charCodeAt(i);
  return Math.abs(hash >>> 0);
}

function seededRng(seed: number) {
  let x = seed || 2463534242;
  return function () {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function shuffle<T>(arr: T[], rng: () => number) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ReviewsBlockClient({ articleId, count = 7 }: { articleId: string; count?: number }) {
  const pool: Omit<Review, 'id' | 'daysAgo'>[] = [
    { name: 'Lina M.', location: 'Paris, FR', text: 'Une expérience gastronomique incomparable. Les saveurs sont d\'une finesse remarquable.', rating: 5 },
    { name: 'Omar B.', location: 'Casablanca, MA', text: 'Livré chaud et présenté avec soin. Je commande chaque semaine — sans hésitation.', rating: 5 },
    { name: 'Sara T.', location: 'Milan, IT', text: 'La qualité des ingrédients se ressent à chaque bouchée. Un vrai travail de chef.', rating: 5 },
    { name: 'Daniel P.', location: 'Lisbonne, PT', text: 'Service impeccable et plat exquis. La commande via l\'IA est d\'une fluidité remarquable.', rating: 5 },
    { name: 'Aisha K.', location: 'Dubaï, AE', text: 'Présentation soignée, goût authentique. L\'une des meilleures expériences culinaires à domicile.', rating: 5 },
    { name: 'Marc L.', location: 'Berlin, DE', text: 'Arrivé dans les temps, parfaitement emballé. Le plat correspondait exactement à la description.', rating: 5 },
    { name: 'Nora J.', location: 'Madrid, ES', text: 'Livraison rapide et plat délicieux. Je recommande à tous les amateurs de bonne cuisine.', rating: 5 },
    { name: 'Hassan R.', location: 'Rabat, MA', text: 'Excellente maîtrise des épices. Un équilibre parfait entre tradition et modernité.', rating: 5 },
    { name: 'Elena S.', location: 'Barcelone, ES', text: 'Emballage soigné et livraison ponctuelle. Le plat était encore chaud à l\'arrivée.', rating: 5 },
    { name: 'Paul V.', location: 'Bruxelles, BE', text: 'Des produits de qualité supérieure, une fraîcheur indéniable. Bravo au chef !', rating: 5 },
    { name: 'Mina G.', location: 'Istanbul, TR', text: 'L\'attention portée aux détails est impressionnante. Un vrai plaisir pour les papilles.', rating: 5 },
    { name: 'Rami D.', location: 'Tunis, TN', text: 'Commande reçue rapidement. L\'aspect premium est au rendez-vous — je reviendrai.', rating: 5 },
  ];

  const reviews = useMemo(() => {
    const seed = hashToSeed(String(articleId ?? 'default'));
    const rng = seededRng(seed);
    const fullPool: Review[] = pool.map((p, i) => ({
      id: `${seed}-${i}`, ...p,
      daysAgo: Math.floor(rng() * 400) + i * 3,
    }));
    return shuffle(fullPool, seededRng(seed + 12345)).slice(0, Math.min(count, fullPool.length));
  }, [articleId, count]);

  const font = "'Georgia', 'Times New Roman', serif";
  const mono = "'Courier New', monospace";
  const gold = '#c9a84c';
  const cream = '#f5f0e8';
  const muted = '#8a8070';
  const subtle = '#5a5248';

  return (
    <section style={{ paddingTop: '60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
        <div style={{
          color: gold, fontSize: '0.68rem', letterSpacing: '0.35em',
          textTransform: 'uppercase', fontFamily: mono, whiteSpace: 'nowrap',
        }}>
          ✦ &nbsp; Avis Clients &nbsp; ✦
        </div>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
      </div>

      {/* Reviews grid */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '1px',
        border: '1px solid rgba(201,168,76,0.1)',
        borderRadius: '2px', overflow: 'hidden',
      }}>
        {reviews.map((r, idx) => {
          const d = new Date();
          d.setDate(d.getDate() - Math.max(1, r.daysAgo));

          return (
            <article
              key={r.id}
              style={{
                backgroundColor: idx % 2 === 0 ? '#0a0a0a' : '#0e0d0a',
                padding: '28px 32px',
                display: 'flex', flexDirection: 'column', gap: '14px',
                fontFamily: font,
                borderBottom: idx < reviews.length - 1 ? '1px solid rgba(201,168,76,0.07)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: cream, fontSize: '0.9rem', letterSpacing: '0.06em' }}>{r.name}</span>
                  {r.location && (
                    <span style={{ color: subtle, fontSize: '0.72rem', letterSpacing: '0.12em', fontFamily: mono }}>{r.location}</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < r.rating ? gold : subtle, fontSize: '0.75rem' }}>★</span>
                    ))}
                  </div>
                  <span style={{ color: subtle, fontSize: '0.68rem', letterSpacing: '0.1em', fontFamily: mono }}>
                    {formatDate(d)}
                  </span>
                </div>
              </div>

              <p style={{ color: muted, fontSize: '0.88rem', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
                "{r.text}"
              </p>

              <div>
                <span style={{
                  color: gold, fontSize: '0.62rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: mono,
                  opacity: 0.6,
                }}>
                  ✓ Achat vérifié
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}