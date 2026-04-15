'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { ArticleType } from "../lib/types";
import ReviewsBlockClient from "./CustomerReview";

export type ArticleProps = { article: ArticleType };

const ArticlePageCom = ({ article }: ArticleProps) => {
  const initialOptions: Record<string, any> = { ...(article.options ?? {}) };
  if (!initialOptions.quantity || Number(initialOptions.quantity) < 1) initialOptions.quantity = 1;

  const [options, setOptions] = useState<Record<string, any>>(initialOptions);
  const [localArticle, setLocalArticle] = useState<ArticleType>({ ...article, options: initialOptions });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [btnHovered, setBtnHovered] = useState(false);
  const router = useRouter();

  const optionsOptions = (article as any).options_options as Record<string, (string | number)[]> | undefined;

  const handleOptionChange = (key: string, value: any) => {
    if (key === 'quantity') {
      const n = Number(value);
      value = Number.isNaN(n) ? 1 : Math.max(1, n);
    }
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => { setLocalArticle(a => ({ ...a, options })); }, [options]);

  const qty = useMemo(() => Math.max(1, Number(options.quantity ?? 1)), [options.quantity]);
  const totalPrice = useMemo(() => (Number(localArticle.price ?? 0) || 0) * qty, [localArticle.price, qty]);

  const handleOrderWithBot = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    const optionsSummary = Object.entries(options).map(([k, v]) => `${k}: ${v}`).join(', ');
    const dishDescription = `${localArticle.short_name || article.name} [Détails: ${optionsSummary}]`;
    window.dispatchEvent(new CustomEvent('TRIGGER_ORDER', { detail: { dishName: dishDescription } }));
    router.push('/');
  };

  const imgs = Array.isArray(article.imgs) && article.imgs.length ? article.imgs : ['/placeholder.png'];

  const font = "'Georgia', 'Times New Roman', serif";
  const mono = "'Courier New', monospace";
  const gold = '#c9a84c';
  const goldLight = '#f0d080';
  const cream = '#f5f0e8';
  const muted = '#8a8070';
  const dark = '#0a0a0a';
  const cardBg = '#0e0d0a';

  return (
    <main style={{
      backgroundColor: dark,
      minHeight: '100vh',
      fontFamily: font,
      position: 'relative',
      paddingBottom: '120px',
    }}>

      {/* Grain overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px', opacity: 0.5,
      }} />

      {/* ── HERO SECTION ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
        gap: '0', maxWidth: '1200px', margin: '0 auto',
        padding: 'clamp(32px, 5vw, 80px) clamp(16px, 4vw, 48px)',
        alignItems: 'flex-start',
      }}>

        {/* LEFT — Images */}
        <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'row', gap: '12px', minWidth: 0 }}>

          {/* Thumbnails */}
          {imgs.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
              {imgs.map((src, i) => (
                <div
                  key={`${i}-${src}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                  style={{
                    width: '68px', height: '68px', cursor: 'pointer',
                    border: `1px solid ${i === selectedIndex ? gold : 'rgba(201,168,76,0.15)'}`,
                    borderRadius: '1px', overflow: 'hidden', position: 'relative',
                    flexShrink: 0, transition: 'border-color 0.25s ease',
                  }}
                >
                  <Image src={src} alt={`${article.name} ${i}`} fill style={{ objectFit: 'cover' }} />
                  {i === selectedIndex && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(201,168,76,0.08)',
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Main image */}
          <div style={{
            position: 'relative', flex: 1, minHeight: '420px',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '1px', overflow: 'hidden',
          }}>
            <Image
              src={imgs[selectedIndex]}
              alt={`${article.name} preview`}
              fill priority
              style={{ objectFit: 'cover', filter: 'brightness(0.88)' }}
            />
            {/* Bottom gradient */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 50%, rgba(10,10,8,0.7) 100%)',
              pointerEvents: 'none',
            }} />
            {/* Corner TL */}
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: '40px', height: '40px',
              borderTop: `1px solid ${gold}`, borderLeft: `1px solid ${gold}`,
              pointerEvents: 'none',
            }} />
            {/* Corner BR */}
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '40px', height: '40px',
              borderBottom: `1px solid ${gold}`, borderRight: `1px solid ${gold}`,
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* RIGHT — Details */}
        <div style={{
          flex: '1 1 360px', padding: 'clamp(0px, 3vw, 0px) 0 0 clamp(24px, 4vw, 56px)',
          display: 'flex', flexDirection: 'column', gap: '28px', minWidth: 0,
        }}>

          {/* Category badge */}
          <div style={{
            color: gold, fontSize: '0.68rem',
            letterSpacing: '0.35em', textTransform: 'uppercase',
            fontFamily: mono,
          }}>
            ✦ &nbsp; {localArticle.categorie || 'Plat'}
          </div>

          {/* Title */}
          <h1 style={{
            color: cream, fontWeight: 400,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            margin: 0, lineHeight: 1.2,
          }}>
            {localArticle.short_name || article.name}
          </h1>

          {/* Price */}
          <div style={{
            color: gold, fontSize: '1.6rem',
            fontFamily: mono, letterSpacing: '0.05em',
          }}>
            {Number(localArticle.price ?? 0).toLocaleString('fr-MA', { style: 'currency', currency: 'MAD' })}
          </div>

          {/* Gold divider */}
          <div style={{ height: '1px', background: `linear-gradient(90deg, ${gold}, transparent)`, opacity: 0.4 }} />

          {/* Description */}
          {localArticle.description && (
            <p style={{
              color: muted, fontSize: '0.92rem',
              lineHeight: 1.8, fontStyle: 'italic', margin: 0,
            }}>
              {localArticle.description}
            </p>
          )}

          {/* Gold divider */}
          <div style={{ height: '1px', background: `linear-gradient(90deg, ${gold}, transparent)`, opacity: 0.2 }} />

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: gold, fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: mono }}>
              Options
            </div>

            {optionsOptions && Object.entries(optionsOptions).map(([key, choices]) => {
              const isNumberChoice = Array.isArray(choices) && choices.every(c => typeof c === 'number');
              const dedupedStrings = Array.isArray(choices) ? Array.from(new Set(choices.map(c => String(c)))) : [];
              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: muted, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: mono }}>
                    {key}
                  </label>
                  <select
                    value={options[key] !== undefined ? String(options[key]) : (dedupedStrings[0] ?? '')}
                    onChange={(e) => handleOptionChange(key, isNumberChoice ? Number(e.target.value) : e.target.value)}
                    style={{
                      backgroundColor: cardBg, color: cream,
                      border: '1px solid rgba(201,168,76,0.3)',
                      borderRadius: '1px', padding: '10px 14px',
                      fontSize: '0.85rem', fontFamily: font,
                      outline: 'none', cursor: 'pointer',
                    }}
                  >
                    {dedupedStrings.map((s, idx) => (
                      <option key={`${key}-${s}-${idx}`} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              );
            })}

            {Object.entries(options).map(([key, val]) => {
              if (optionsOptions && key in optionsOptions) return null;
              const isNumber = typeof val === 'number';
              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: muted, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: mono }}>
                    {key}
                  </label>
                  <input
                    type={isNumber ? 'number' : 'text'}
                    min={isNumber ? 1 : undefined}
                    value={String(val ?? '')}
                    onChange={(e) => {
                      let v: any = e.target.value;
                      if (isNumber) {
                        let n = Number(v);
                        if (key === 'quantity') n = Number.isNaN(n) ? 1 : Math.max(1, n);
                        v = Number.isNaN(n) ? val : n;
                      }
                      handleOptionChange(key, v);
                    }}
                    style={{
                      backgroundColor: cardBg, color: cream,
                      border: '1px solid rgba(201,168,76,0.3)',
                      borderRadius: '1px', padding: '10px 14px',
                      fontSize: '0.85rem', fontFamily: font, outline: 'none',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Delivery info pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { label: 'Livraison', value: '30–60 min' },
              { label: 'Qualité', value: 'Vérifiée' },
              { label: 'Garantie', value: 'Satisfait ou remboursé' },
            ].map(item => (
              <div key={item.label} style={{
                border: '1px solid rgba(201,168,76,0.2)',
                padding: '6px 14px', borderRadius: '1px',
                display: 'flex', gap: '6px', alignItems: 'center',
              }}>
                <span style={{ color: muted, fontSize: '0.7rem', letterSpacing: '0.1em', fontFamily: mono }}>{item.label}</span>
                <span style={{ color: gold, fontSize: '0.7rem', letterSpacing: '0.1em', fontFamily: mono }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px) 60px' }}>
        <ReviewsBlockClient articleId={article.id} count={7} />
      </section>

      {/* ── STICKY TOTAL BAR ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: 'rgba(10,10,8,0.96)',
        borderTop: '1px solid rgba(201,168,76,0.25)',
        backdropFilter: 'blur(12px)',
        padding: '16px clamp(16px, 5vw, 48px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: muted, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: mono }}>
            Total
          </span>
          <span style={{ color: gold, fontSize: '1.5rem', fontFamily: mono, letterSpacing: '0.05em' }}>
            {totalPrice.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD' })}
          </span>
        </div>

        <button
          onClick={handleOrderWithBot}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            padding: '14px 40px',
            backgroundColor: btnHovered ? 'rgba(201,168,76,0.15)' : 'transparent',
            border: `1px solid ${btnHovered ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.4)'}`,
            borderRadius: '1px',
            color: gold,
            fontSize: '0.75rem',
            fontFamily: mono,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}
        >
          Commander via l'IA
          <span style={{ opacity: btnHovered ? 1 : 0.5, transition: 'opacity 0.25s ease' }}>→</span>
        </button>
      </div>
    </main>
  );
};

export default ArticlePageCom;