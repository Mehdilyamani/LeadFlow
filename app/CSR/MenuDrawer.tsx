'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ArticleType } from '../lib/types';
import Article from './articleCP';
import { FiShield, FiArrowRight, FiX, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

type MenuDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  focusSearch?: boolean;
  allArticles?: ArticleType[];
};

export default function MenuDrawer({ isOpen, onClose, focusSearch = false, allArticles }: MenuDrawerProps) {
  const [articles, setArticles] = useState<ArticleType[]>(allArticles ?? []);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [adminHovered, setAdminHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const gold = '#c9a84c';
  const mono = "'Courier New', monospace";
  const font = "'Georgia', 'Times New Roman', serif";
  const dark = '#0a0a0a';
  const cream = '#f5f0e8';
  const muted = '#8a8070';

  useEffect(() => {
    if (allArticles && allArticles.length) return;
    let mounted = true;
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        if (mounted) setArticles(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setArticles([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchArticles();
    return () => { mounted = false; };
  }, [allArticles]);

  useEffect(() => {
    if (isOpen && focusSearch) setTimeout(() => inputRef.current?.focus(), 250);
  }, [isOpen, focusSearch]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Add/remove menu-is-open class for BackHome button positioning
  useEffect(() => {
    if (isOpen) document.body.classList.add('menu-is-open');
    else document.body.classList.remove('menu-is-open');
    return () => document.body.classList.remove('menu-is-open');
  }, [isOpen]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => { if (a.categorie) set.add(a.categorie); });
    return Array.from(set).sort();
  }, [articles]);

  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery && !selectedCategory) return [];
    const pool = selectedCategory ? articles.filter((a) => a.categorie === selectedCategory) : articles;
    return pool.filter((a) => (a.name ?? '').toLowerCase().includes(normalizedQuery)).slice(0, 6);
  }, [articles, normalizedQuery, selectedCategory]);

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition: 'opacity 0.35s ease' }} />

      {/* Drawer */}
      <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1200, width: 'clamp(300px, 85vw, 420px)', backgroundColor: dark, borderRight: '1px solid rgba(201,168,76,0.2)', display: 'flex', flexDirection: 'column', transform: isOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: font, overflowY: 'auto' }}>

        {/* Grain */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', zIndex: 2, background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)' }} />

        {/* HEADER */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 20px', borderBottom: '1px solid rgba(201,168,76,0.1)', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: gold, fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: mono }}>✦ &nbsp; Restau</span>
            <span style={{ color: cream, fontSize: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Navigation</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '1px', color: muted, width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)'; (e.currentTarget as HTMLElement).style.color = gold; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)'; (e.currentTarget as HTMLElement).style.color = muted; }}>
            <FiX size={16} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '1px', padding: '10px 14px', backgroundColor: '#0e0d0a' }}>
            <FiSearch size={14} color={muted} />
            <input ref={inputRef} value={query} onChange={(e) => { setQuery(e.target.value); if (selectedCategory) setSelectedCategory(null); }} placeholder="Rechercher un plat..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: cream, fontSize: '0.88rem', fontFamily: font, fontStyle: 'italic' }} />
            {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: muted, cursor: 'pointer', padding: 0 }}><FiX size={12} /></button>}
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ color: gold, fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: mono }}>Catégories</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Tous', ...categories].map((c) => {
                const active = c === 'Tous' ? selectedCategory === null : selectedCategory === c;
                return (
                  <button key={c} onClick={() => { c === 'Tous' ? setSelectedCategory(null) : (setSelectedCategory(c), setQuery('')); }}
                    style={{ background: active ? 'rgba(201,168,76,0.12)' : 'transparent', border: `1px solid ${active ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.15)'}`, borderRadius: '1px', color: active ? gold : muted, padding: '6px 14px', fontSize: '0.72rem', fontFamily: mono, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)' }} />

          {/* Results */}
          <div>
            {loading ? (
              <div style={{ color: muted, fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '20px 0', fontFamily: mono, letterSpacing: '0.15em' }}>Chargement...</div>
            ) : results.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {results.map((a) => <Article key={a.id} article={a} />)}
              </div>
            ) : (normalizedQuery || selectedCategory) ? (
              <div style={{ color: muted, fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '24px 0', fontFamily: mono }}>Aucun plat trouvé</div>
            ) : (
              <div style={{ color: 'rgba(138,128,112,0.4)', fontSize: '0.75rem', fontStyle: 'italic', textAlign: 'center', padding: '24px 0', fontFamily: mono }}>Recherchez un plat ou sélectionnez une catégorie</div>
            )}
          </div>
        </div>

        {/* ── ADMIN FOOTER — high visibility ── */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, borderTop: '1px solid rgba(201,168,76,0.15)', padding: '20px 24px', backgroundColor: 'rgba(201,168,76,0.03)' }}>
          {/* Label above */}
          <div style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.55rem', fontFamily: mono, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
            Accès réservé
          </div>

          <Link href="/admin" onClick={onClose}
            onMouseEnter={() => setAdminHovered(true)}
            onMouseLeave={() => setAdminHovered(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px',
              backgroundColor: adminHovered ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.08)',
              border: `1px solid ${adminHovered ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.35)'}`,
              borderRadius: '1px', textDecoration: 'none',
              transition: 'all 0.25s ease',
              boxShadow: adminHovered ? '0 0 20px rgba(201,168,76,0.12)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Shield with gold background for high visibility */}
              <div style={{ width: '36px', height: '36px', borderRadius: '1px', backgroundColor: adminHovered ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.25s ease' }}>
                <FiShield size={18} color={gold} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ color: adminHovered ? '#f5f0e8' : gold, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: mono, fontWeight: 700, transition: 'color 0.25s ease' }}>
                  Espace Gérant
                </span>
                <span style={{ color: adminHovered ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.5)', fontSize: '0.65rem', letterSpacing: '0.08em', fontFamily: mono, fontStyle: 'italic', transition: 'color 0.25s ease' }}>
                  Dashboard · Réservations
                </span>
              </div>
            </div>
            <FiArrowRight size={16} color={adminHovered ? gold : 'rgba(201,168,76,0.5)'}
              style={{ transition: 'color 0.25s ease, transform 0.25s ease', transform: adminHovered ? 'translateX(4px)' : 'translateX(0)', flexShrink: 0 }} />
          </Link>
        </div>
      </aside>
    </>
  );
}