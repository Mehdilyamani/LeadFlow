import Script from 'next/script'

const PROPERTIES = [
  {
    title: 'Villa Contemporaine',
    location: 'Anfa, Casablanca',
    price: '8 500 000 MAD',
    beds: 5, baths: 4, area: '450 m²',
    tag: 'Exclusivité',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
  },
  {
    title: 'Penthouse Vue Mer',
    location: 'Aïn Diab, Casablanca',
    price: '4 200 000 MAD',
    beds: 3, baths: 2, area: '220 m²',
    tag: 'Coup de cœur',
    img: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=600&q=80',
  },
  {
    title: 'Riad Traditionnel',
    location: 'Médina, Marrakech',
    price: '3 700 000 MAD',
    beds: 6, baths: 3, area: '380 m²',
    tag: 'Rare',
    img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80',
  },
  {
    title: 'Appartement Standing',
    location: 'Agdal, Rabat',
    price: '1 950 000 MAD',
    beds: 3, baths: 2, area: '145 m²',
    tag: 'Neuf',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  },
  {
    title: 'Villa Balnéaire',
    location: 'M\'diq, Tétouan',
    price: '5 600 000 MAD',
    beds: 6, baths: 5, area: '600 m²',
    tag: 'Vue mer',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
  {
    title: 'Duplex Moderne',
    location: 'Guéliz, Marrakech',
    price: '2 300 000 MAD',
    beds: 4, baths: 3, area: '210 m²',
    tag: 'Terrasse',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
  },
]

export default function DemoEmbedPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f8f7f5; color: #1a1a1a; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ background: '#0f172a', color: '#fff', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏡</span>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Immo Marrakech</span>
        </div>
        <nav style={{ display: 'flex', gap: 28, fontSize: 14, opacity: 0.8 }}>
          <a href="#">Acheter</a>
          <a href="#">Louer</a>
          <a href="#">Estimer</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', color: '#fff', padding: '72px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.6, marginBottom: 16 }}>Agence immobilière premium</p>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 20 }}>
          Trouvez votre bien d&apos;exception<br />au Maroc
        </h1>
        <p style={{ fontSize: 17, opacity: 0.75, maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Villas, appartements de standing, riads et penthouses — des propriétés soigneusement sélectionnées par nos experts.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ background: '#fff', color: '#0f172a', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Voir les biens →
          </button>
          <button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '12px 28px', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
            Nous contacter
          </button>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '20px 40px', display: 'flex', justifyContent: 'center', gap: 60 }}>
        {[['350+', 'Biens vendus'], ['12 ans', "D'expérience"], ['98%', 'Clients satisfaits'], ['3', 'Villes couvertes']].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{n}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </section>

      {/* ── Listings ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700 }}>Nos biens à la vente</h2>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{PROPERTIES.length} propriétés disponibles</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {PROPERTIES.map((p) => (
            <article key={p.title} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', top: 12, left: 12, background: '#0f172a', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: 0.5 }}>
                  {p.tag}
                </span>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>📍 {p.location}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
                  <span>🛏 {p.beds} ch.</span>
                  <span>🚿 {p.baths} sdb.</span>
                  <span>📐 {p.area}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{p.price}</span>
                  <button style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Voir →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* ── Why us ── */}
      <section style={{ background: '#fff', padding: '56px 40px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Pourquoi choisir Immo Marrakech ?</h2>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>Une approche personnalisée pour chaque projet immobilier</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {[
            ['🔍', 'Sélection rigoureuse', 'Chaque bien est visité et vérifié par nos experts avant publication.'],
            ['⚡', 'Réactivité 24/7', 'Notre équipe répond à vos demandes en moins de 30 minutes.'],
            ['🤝', 'Accompagnement complet', 'De la recherche à la signature, nous gérons toutes les étapes.'],
            ['💎', 'Biens exclusifs', "Accès à des propriétés off-market introuvables ailleurs."],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.5)', padding: '32px 40px', textAlign: 'center', fontSize: 13 }}>
        <p style={{ color: '#fff', fontWeight: 600, marginBottom: 8 }}>Immo Marrakech — Agence Immobilière Premium</p>
        <p>📍 Avenue Mohammed V, Guéliz — Marrakech &nbsp;|&nbsp; 📞 +212 5 24 00 00 00 &nbsp;|&nbsp; ✉️ contact@immo-marrakech.ma</p>
        <p style={{ marginTop: 16 }}>© 2026 Immo Marrakech. Tous droits réservés.</p>
      </footer>

      {/* ── LeadFlow widget embed ── */}
      <Script
        src="/leadflow-widget.js"
        data-agency="Immo Marrakech"
        data-client-id="demo-client"
        strategy="afterInteractive"
      />
    </>
  )
}
