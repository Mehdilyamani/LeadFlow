'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Props = {
  label?: string;
  href?: string;
};

export default function BackToHomeButton({ label = 'Retour à la carte', href = '/' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isArticlePage = pathname?.startsWith('/article/');

  // Watch for menu drawer open/close via body class
  useEffect(() => {
    const check = () => setMenuOpen(document.body.classList.contains('menu-is-open'));
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    check();
    return () => observer.disconnect();
  }, []);

  const gold = '#c9a84c';
  const mono = "'Courier New', monospace";

  // Position logic:
  // - Menu open → slide right to 450px
  // - Article page → lift up above sticky bar (bottom: 100px)
  // - Default → bottom: 32px, left: 24px
  const bottomPos = isArticlePage ? '108px' : '32px';
  const leftPos = menuOpen ? '450px' : '24px';

  return (
    <button
      onClick={() => router.push(href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      style={{
        position: 'fixed',
        bottom: bottomPos,
        left: leftPos,
        zIndex: 9998, // just below chat widget (999999) and drawer (1200)
        backgroundColor: hovered ? 'rgba(201,168,76,0.12)' : 'rgba(10,10,8,0.95)',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.3)'}`,
        borderRadius: '2px',
        padding: '0 18px',
        height: '46px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1), bottom 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease',
        boxShadow: hovered
          ? '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(201,168,76,0.1)'
          : '0 4px 20px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        color: gold, fontSize: '0.75rem',
        transition: 'transform 0.25s ease',
        transform: hovered ? 'translateX(-3px)' : 'translateX(0)',
        display: 'inline-block',
      }}>←</span>
      <span style={{
        color: hovered ? '#f5f0e8' : 'rgba(245,240,232,0.6)',
        fontSize: '0.62rem', fontFamily: mono,
        letterSpacing: '0.25em', textTransform: 'uppercase',
        transition: 'color 0.25s ease',
      }}>
        {label}
      </span>
      <span style={{ color: gold, fontSize: '0.4rem', opacity: hovered ? 1 : 0.4, transition: 'opacity 0.25s ease' }}>✦</span>
    </button>
  );
}