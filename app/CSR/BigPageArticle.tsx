'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type BigArticleCardProps = {
  route: string;
  image: string;
  mobileImage?: string;
  text: string;
  alt?: string;
};

export default function BigArticleCardClient({ route, image, mobileImage, text, alt }: BigArticleCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const go = () => { if (route) router.push(route); };

  const gold = '#c9a84c';
  const goldLight = '#f0d080';
  const mono = "'Courier New', monospace";
  const font = "'Georgia', 'Times New Roman', serif";

  return (
    <div
      onClick={go}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '21/9',
        cursor: 'pointer',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.12)'}`,
        borderRadius: '1px',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered ? '0 32px 80px rgba(0,0,0,0.5)' : '0 12px 40px rgba(0,0,0,0.35)',
      }}
      className="big-card-root"
    >
      <style>{`
        .big-card-desktop { display: flex; }
        .big-card-mobile  { display: none; }
        @media (max-width: 767px) {
          .big-card-desktop { display: none !important; }
          .big-card-mobile  { display: flex !important; }
        }
      `}</style>

      {/* Image */}
      <Image
        src={image}
        alt={alt ?? text}
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          filter: hovered ? 'brightness(0.6)' : 'brightness(0.8)',
        }}
      />

      {/* Desktop overlay — left dark panel */}
      <div className="big-card-desktop" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(105deg, rgba(10,10,8,0.88) 0%, rgba(10,10,8,0.55) 40%, transparent 65%)',
      }} />

      {/* Mobile overlay — bottom rise */}
      <div className="big-card-mobile" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, transparent 20%, rgba(10,10,8,0.7) 60%, rgba(10,10,8,0.93) 100%)',
      }} />

      {/* Corners */}
      {[
        { top: true, left: true },
        { top: true, right: true },
        { bottom: true, left: true },
        { bottom: true, right: true },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', zIndex: 3, pointerEvents: 'none',
          top: c.top ? 0 : undefined,
          bottom: c.bottom ? 0 : undefined,
          left: c.left ? 0 : undefined,
          right: c.right ? 0 : undefined,
          width: hovered ? '52px' : '30px',
          height: hovered ? '52px' : '30px',
          borderTop: c.top ? `1px solid rgba(201,168,76,${hovered ? '0.8' : '0.35'})` : 'none',
          borderBottom: c.bottom ? `1px solid rgba(201,168,76,${hovered ? '0.8' : '0.35'})` : 'none',
          borderLeft: c.left ? `1px solid rgba(201,168,76,${hovered ? '0.8' : '0.35'})` : 'none',
          borderRight: c.right ? `1px solid rgba(201,168,76,${hovered ? '0.8' : '0.35'})` : 'none',
          transition: 'all 0.4s ease',
        }} />
      ))}

      {/* ── DESKTOP TEXT — left aligned ── */}
      <div className="big-card-desktop" style={{
        position: 'absolute', inset: 0, zIndex: 4,
        flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(24px, 5%, 64px)',
        maxWidth: '55%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', opacity: hovered ? 1 : 0.8, transition: 'opacity 0.3s ease' }}>
          <div style={{ width: '28px', height: '1px', background: `linear-gradient(90deg, ${gold}, ${goldLight})` }} />
          <span style={{ color: gold, fontSize: '0.6rem', fontFamily: mono, letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            Offre du moment
          </span>
        </div>
        <h1 style={{
          color: '#f5f0e8', fontFamily: font, fontWeight: 400,
          fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          margin: '0 0 10px', lineHeight: 1.05,
          transition: 'transform 0.4s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}>
          {text}
        </h1>
        <p style={{
          color: 'rgba(245,240,232,0.5)', fontFamily: font, fontStyle: 'italic',
          fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
          margin: '0 0 28px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s',
        }}>
          Découvrez notre sélection exclusive
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          opacity: hovered ? 1 : 0.6,
          transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
          transition: 'opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s',
        }}>
          <span style={{ color: gold, fontSize: '0.7rem', fontFamily: mono, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Explorer la carte
          </span>
          <div style={{ width: hovered ? '28px' : '16px', height: '1px', backgroundColor: gold, transition: 'width 0.35s ease' }} />
          <span style={{ color: gold, fontSize: '0.8rem' }}>→</span>
        </div>
      </div>

      {/* ── MOBILE TEXT — bottom centered, compact ── */}
      <div className="big-card-mobile" style={{
        position: 'absolute', inset: 0, zIndex: 4,
        flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center',
        padding: '0 16px clamp(14px, 5%, 22px)',
        textAlign: 'center',
        gap: '6px',
      }}>
        <span style={{
          color: gold, fontSize: '0.52rem', fontFamily: mono,
          letterSpacing: '0.28em', textTransform: 'uppercase',
        }}>
          ✦ &nbsp; Offre du moment
        </span>
        <h2 style={{
          color: '#f5f0e8', fontFamily: font, fontWeight: 400,
          fontSize: 'clamp(0.9rem, 4.5vw, 1.4rem)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          margin: 0, lineHeight: 1.1,
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        }}>
          {text}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '4px' }}>
          <div style={{ width: '12px', height: '1px', backgroundColor: gold }} />
          <span style={{ color: gold, fontSize: '0.52rem', fontFamily: mono, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Explorer
          </span>
          <span style={{ color: gold, fontSize: '0.65rem' }}>→</span>
        </div>
      </div>

      {/* Vertical watermark — desktop only */}
      <div className="big-card-desktop" style={{
        position: 'absolute', right: 'clamp(16px, 3%, 36px)', top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        zIndex: 4, pointerEvents: 'none',
        opacity: hovered ? 0.45 : 0.15,
        transition: 'opacity 0.4s ease',
        alignItems: 'center', gap: '10px',
      }}>
        <div style={{ width: '20px', height: '1px', backgroundColor: gold }} />
        <span style={{ color: gold, fontSize: '0.52rem', fontFamily: mono, letterSpacing: '0.3em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Restau &nbsp; ✦
        </span>
      </div>
    </div>
  );
}