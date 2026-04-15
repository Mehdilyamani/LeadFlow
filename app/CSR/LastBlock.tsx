'use client';
import React, { useEffect, useRef } from "react";

const features = [
  {
    number: "01",
    icon: "✦",
    title: "À Votre Service",
    desc: "Une équipe dédiée, disponible à chaque instant pour sublimer votre expérience.",
  },
  {
    number: "02",
    icon: "◈",
    title: "Prix d'Excellence",
    desc: "Le raffinement gastronomique accessible, sans compromis sur la qualité.",
  },
  {
    number: "03",
    icon: "❋",
    title: "Ingrédients Nobles",
    desc: "Sélectionnés chaque matin auprès de producteurs locaux d'exception.",
  },
  {
    number: "04",
    icon: "✿",
    title: "Créations Éphémères",
    desc: "De nouveaux plats d'auteur chaque semaine, inspirés des saisons.",
  },
];

export default function LastBlock() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>('.lb-card');
    const line = section.querySelector<HTMLElement>('.lb-line');
    const heading = section.querySelector<HTMLElement>('.lb-heading');
    const sub = section.querySelector<HTMLElement>('.lb-sub');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (line) line.style.transform = 'scaleX(1)';
          if (heading) heading.style.opacity = '1';
          if (heading) heading.style.transform = 'translateY(0)';
          if (sub) { sub.style.opacity = '1'; sub.style.transform = 'translateY(0)'; }
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 150 + i * 120);
          });
        }
      });
    }, { threshold: 0.15 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        isolation: 'isolate',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        backgroundColor: '#0a0a0a',
        padding: '100px 24px 80px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Grain texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px',
        opacity: 0.6,
      }} />

      {/* Gold accent top border */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #c9a84c, #f0d080, #c9a84c, transparent)',
      }} />

      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%',
        transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '72px', position: 'relative', zIndex: 1 }}>
        <div
          className="lb-line"
          style={{
            width: '48px', height: '1px',
            background: 'linear-gradient(90deg, #c9a84c, #f0d080)',
            margin: '0 auto 28px',
            transform: 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        <h2
          className="lb-heading"
          style={{
            color: '#f5f0e8',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 400,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          L'Art de Recevoir
        </h2>
        <p
          className="lb-sub"
          style={{
            color: '#c9a84c',
            fontSize: '0.85rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            margin: 0,
            opacity: 0,
            transform: 'translateY(12px)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
          }}
        >
          Notre promesse envers vous
        </p>
      </div>

      {/* Cards */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '1px',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(201,168,76,0.12)',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: '2px',
      }}>
        {features.map((f) => (
          <div
            key={f.title}
            className="lb-card"
            style={{
              flex: '1 1 220px',
              backgroundColor: '#0a0a0a',
              padding: '48px 36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '20px',
              boxSizing: 'border-box',
              opacity: 0,
              transform: 'translateY(32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease, background-color 0.3s ease',
              cursor: 'default',
              position: 'relative',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#111008';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#0a0a0a';
            }}
          >
            {/* Number */}
            <span style={{
              color: 'rgba(201,168,76,0.25)',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              fontFamily: "'Courier New', monospace",
              fontWeight: 400,
            }}>
              {f.number}
            </span>

            {/* Icon */}
            <span style={{
              color: '#c9a84c',
              fontSize: '1.6rem',
              lineHeight: 1,
            }}>
              {f.icon}
            </span>

            {/* Divider */}
            <div style={{
              width: '24px', height: '1px',
              backgroundColor: 'rgba(201,168,76,0.4)',
            }} />

            {/* Title */}
            <h4 style={{
              color: '#f5f0e8',
              fontWeight: 400,
              fontSize: '1.05rem',
              letterSpacing: '0.08em',
              margin: 0,
              textTransform: 'uppercase',
            }}>
              {f.title}
            </h4>

            {/* Desc */}
            <p style={{
              color: '#8a8070',
              fontSize: '0.88rem',
              lineHeight: '1.7',
              margin: 0,
              fontFamily: "'Georgia', serif",
              fontStyle: 'italic',
            }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom signature line */}
      <div style={{
        textAlign: 'center',
        marginTop: '64px',
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{
          color: 'rgba(201,168,76,0.35)',
          fontSize: '0.7rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          fontFamily: "'Courier New', monospace",
        }}>
          ✦ &nbsp; Restau &nbsp; ✦
        </span>
      </div>

      {/* Gold accent bottom border */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #c9a84c, #f0d080, #c9a84c, transparent)',
      }} />
    </section>
  );
}