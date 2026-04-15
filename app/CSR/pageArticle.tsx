'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type ArticleCardProps = {
  route: string;
  image: string;
  text: string;
  alt?: string;
  priority?: boolean;
};

export default function ArticleCardClient({ route, image, text, alt, priority = false }: ArticleCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const go = () => { if (route) router.push(route); };

  const gold = '#c9a84c';
  const mono = "'Courier New', monospace";
  const font = "'Georgia', 'Times New Roman', serif";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => { if (e.key === 'Enter') go(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={text}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3/4',
        cursor: 'pointer',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.12)'}`,
        borderRadius: '1px',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.3)',
        display: 'block',
      }}
    >
      {/* Image — much brighter */}
      <Image
        src={image}
        alt={alt ?? text}
        fill
        sizes="(max-width: 700px) 50vw, 500px"
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        style={{
          objectFit: 'cover',
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          // Bright by default, dims slightly on hover
          filter: hovered ? 'brightness(0.65)' : 'brightness(0.85)',
        }}
      />

      {/* Gradient — only from bottom 40%, subtle */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, transparent 45%, rgba(10,10,8,0.7) 75%, rgba(10,10,8,0.92) 100%)',
      }} />

      {/* Corner TL */}
      <div style={{
        position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 2,
        width: hovered ? '44px' : '24px',
        height: hovered ? '44px' : '24px',
        borderTop: `1px solid rgba(201,168,76,${hovered ? '0.8' : '0.4'})`,
        borderLeft: `1px solid rgba(201,168,76,${hovered ? '0.8' : '0.4'})`,
        transition: 'all 0.35s ease',
      }} />

      {/* Corner BR */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0, pointerEvents: 'none', zIndex: 2,
        width: hovered ? '44px' : '24px',
        height: hovered ? '44px' : '24px',
        borderBottom: `1px solid rgba(201,168,76,${hovered ? '0.8' : '0.4'})`,
        borderRight: `1px solid rgba(201,168,76,${hovered ? '0.8' : '0.4'})`,
        transition: 'all 0.35s ease',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(12px, 4%, 24px)',
      }}>
        {/* Category label — hidden on very small screens */}
        <div style={{
          color: gold,
          fontSize: 'clamp(0.5rem, 1.5vw, 0.6rem)',
          fontFamily: mono,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: 'clamp(6px, 2%, 10px)',
          opacity: hovered ? 1 : 0.8,
          transition: 'opacity 0.3s ease',
          display: 'block',
        }}>
          ✦ &nbsp; Sélection
        </div>

        {/* Title — responsive font */}
        <h3 style={{
          color: '#f5f0e8',
          fontFamily: font,
          fontWeight: 400,
          fontSize: 'clamp(1rem, 4vw, 1.8rem)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: '0 0 clamp(10px, 3%, 16px)',
          lineHeight: 1.1,
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          transition: 'transform 0.35s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}>
          {text}
        </h3>

        {/* CTA — only visible on hover, hidden on touch devices via opacity */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}>
          <div style={{ width: '16px', height: '1px', backgroundColor: gold, flexShrink: 0 }} />
          <span style={{
            color: gold,
            fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)',
            fontFamily: mono,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}>
            Explorer
          </span>
          <span style={{ color: gold, fontSize: '0.7rem' }}>→</span>
        </div>
      </div>
    </div>
  );
}