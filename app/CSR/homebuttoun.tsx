'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeButton() {
  const [isShifted, setIsShifted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const gold = '#c9a84c';
  const mono = "'Courier New', monospace";

  useEffect(() => {
    const checkMenu = () => setIsShifted(document.body.classList.contains('menu-is-open'));
    const observer = new MutationObserver(checkMenu);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    checkMenu();
    return () => observer.disconnect();
  }, []);

  return (
    <button
      onClick={() => router.push('/')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Retour à l'accueil"
      style={{
        position: 'fixed',
        bottom: '32px',
        left: isShifted ? '450px' : '24px',
        zIndex: 9999,
        transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease',
        backgroundColor: hovered ? 'rgba(201,168,76,0.12)' : 'rgba(10,10,8,0.96)',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.3)'}`,
        borderRadius: '2px',
        padding: '0 18px',
        height: '46px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        boxShadow: hovered
          ? '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(201,168,76,0.1)'
          : '0 4px 20px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Arrow */}
      <span style={{
        color: gold,
        fontSize: '0.75rem',
        transition: 'transform 0.25s ease',
        transform: hovered ? 'translateX(-3px)' : 'translateX(0)',
        display: 'inline-block',
      }}>
        ←
      </span>

      {/* Label */}
      <span style={{
        color: hovered ? '#f5f0e8' : 'rgba(245,240,232,0.6)',
        fontSize: '0.62rem',
        fontFamily: mono,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        transition: 'color 0.25s ease',
        whiteSpace: 'nowrap',
      }}>
        La Carte
      </span>

      {/* Gold dot */}
      <span style={{
        color: gold,
        fontSize: '0.4rem',
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.25s ease',
      }}>
        ✦
      </span>
    </button>
  );
}