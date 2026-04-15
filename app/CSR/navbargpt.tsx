'use client';
import React, { useState } from 'react';
import MenuDrawer from './MenuDrawer';
import { FiMenu, FiSearch } from 'react-icons/fi';

export default function ClientNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [focusSearch, setFocusSearch] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);

  const openMenu = (focus = false) => {
    setFocusSearch(focus);
    setIsOpen(true);
  };

  const mono = "'Courier New', monospace";
  const gold = '#c9a84c';

  const btnStyle = (hovered: boolean): React.CSSProperties => ({
    background: 'transparent',
    border: `1px solid ${hovered ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.15)'}`,
    borderRadius: '1px',
    color: hovered ? gold : 'rgba(245,240,232,0.6)',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    flexShrink: 0,
  });

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        backgroundColor: 'rgba(10,10,8,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 40px)',
        boxSizing: 'border-box',
      }}>

        {/* Left — menu button */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => openMenu(false)}
          onMouseEnter={() => setMenuHovered(true)}
          onMouseLeave={() => setMenuHovered(false)}
          style={btnStyle(menuHovered)}
        >
          <FiMenu size={18} />
        </button>

        {/* Center — wordmark */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          pointerEvents: 'none',
        }}>
          {/* Top ornament */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <div style={{ width: '20px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6))' }} />
            <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.45rem', letterSpacing: '0.2em' }}>✦</span>
            <div style={{ width: '20px', height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.6), transparent)' }} />
          </div>

          {/* Brand name */}
          <span style={{
            color: '#f5f0e8',
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}>
            Restau
          </span>

          {/* Subtitle */}
          <span style={{
            color: '#c9a84c',
            fontSize: '0.52rem',
            fontFamily: mono,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            Table d'exception
          </span>
        </div>

        {/* Right — search button */}
        <button
          type="button"
          aria-label="Search"
          onClick={() => openMenu(true)}
          onMouseEnter={() => setSearchHovered(true)}
          onMouseLeave={() => setSearchHovered(false)}
          style={btnStyle(searchHovered)}
        >
          <FiSearch size={16} />
        </button>
      </nav>

      <MenuDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        focusSearch={focusSearch}
      />
    </>
  );
}