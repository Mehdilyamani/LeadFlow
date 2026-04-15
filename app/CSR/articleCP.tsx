'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ArticleType } from '../lib/types';

export type ArticleProps = { article: ArticleType };

export default function ArticleCard({ article }: ArticleProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const goToProduct = () => router.push(`/article/${article.id}`);

  const triggerChatOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('TRIGGER_ORDER', { detail: { dishName: article.name } }));
  };

  const formattedPrice = new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(Number(article.price ?? 0));

  const imageSrc = article.imgs?.length ? article.imgs[0] : '/placeholder-meal.jpg';

  return (
    <div
      onClick={goToProduct}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: hovered ? '#111008' : '#0e0d0a',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.35)' : 'rgba(201,168,76,0.1)'}`,
        borderRadius: '2px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(201,168,76,0.06)' : '0 4px 20px rgba(0,0,0,0.3)',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        flexShrink: 0,
      }}
    >
      {/* Corner accent TL */}
      <div style={{
        position: 'absolute', top: 0, left: 0, zIndex: 3,
        width: hovered ? '50px' : '32px',
        height: hovered ? '50px' : '32px',
        borderTop: `1px solid rgba(201,168,76,${hovered ? '0.6' : '0.3'})`,
        borderLeft: `1px solid rgba(201,168,76,${hovered ? '0.6' : '0.3'})`,
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
      }} />

      {/* Corner accent BR */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0, zIndex: 3,
        width: hovered ? '50px' : '32px',
        height: hovered ? '50px' : '32px',
        borderBottom: `1px solid rgba(201,168,76,${hovered ? '0.6' : '0.3'})`,
        borderRight: `1px solid rgba(201,168,76,${hovered ? '0.6' : '0.3'})`,
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
      }} />

      {/* Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4/3',
        overflow: 'hidden',
        backgroundColor: '#0a0a0a',
      }}>
        <img
          src={imageSrc}
          alt={article.name || 'Plat délicieux'}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.6s ease, filter 0.4s ease',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            filter: hovered ? 'brightness(0.85)' : 'brightness(0.75)',
          }}
        />

        {/* Gold overlay on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,8,0.85) 100%)',
          transition: 'opacity 0.3s ease',
        }} />

        {/* Availability badge */}
        {article.is_available && (
          <div style={{
            position: 'absolute', top: '12px', right: '12px',
            backgroundColor: 'rgba(10,10,8,0.8)',
            border: '1px solid rgba(201,168,76,0.5)',
            color: '#c9a84c',
            fontSize: '0.6rem',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '1px',
          }}>
            Disponible
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        padding: '24px 22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flexGrow: 1,
      }}>
        {/* Name */}
        <h2 style={{
          color: '#f5f0e8',
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: 0,
          lineHeight: 1.3,
          transition: 'color 0.3s ease',
        }}>
          {article.name}
        </h2>

        {/* Price */}
        <div style={{
          color: '#c9a84c',
          fontSize: '1.1rem',
          letterSpacing: '0.05em',
          fontFamily: "'Courier New', monospace",
        }}>
          {formattedPrice}
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'rgba(201,168,76,0.12)',
          margin: '4px 0',
        }} />

        {/* CTA Button */}
        <button
          onClick={triggerChatOrder}
          disabled={!article.is_available}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: btnHovered && article.is_available ? 'rgba(201,168,76,0.12)' : 'transparent',
            border: `1px solid ${article.is_available ? (btnHovered ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.35)') : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '1px',
            color: article.is_available ? '#c9a84c' : '#3a3530',
            fontSize: '0.72rem',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: article.is_available ? 'pointer' : 'not-allowed',
            transition: 'all 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          Commander
          <span style={{ opacity: btnHovered ? 1 : 0.5, transition: 'opacity 0.25s ease' }}>→</span>
        </button>
      </div>
    </div>
  );
}