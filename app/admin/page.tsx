'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Trash2, CheckCircle, XCircle, RefreshCw, LogOut } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const gold = '#c9a84c';
const goldLight = '#f0d080';
const dark = '#0a0a0a';
const cardBg = '#0e0d0a';
const cream = '#f5f0e8';
const muted = '#8a8070';
const mono = "'Courier New', monospace";
const font = "'Georgia', 'Times New Roman', serif";
const grain = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [deleteHover, setDeleteHover] = useState<number | null>(null);
  const [refreshHover, setRefreshHover] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
      else fetchReservations();
    };
    checkUser();
  }, [mounted, router]);

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Erreur:', error);
    else setReservations(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await supabase.from('reservations').update({ status: newStatus }).eq('id', id);
    fetchReservations();
  };

  const deleteReservation = async (id: number) => {
    if (!confirm('Supprimer cette réservation ?')) return;
    await supabase.from('reservations').delete().eq('id', id);
    fetchReservations();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const analytics = useMemo(() => {
    const total = reservations.length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = reservations.filter(r => new Date(r.created_at) >= today).length;
    const totalGuests = reservations
      .filter(r => r.status !== 'cancelled')
      .reduce((s, r) => s + (parseInt(r.guest_count) || 0), 0);
    return { total, pending, confirmed, cancelled, todayCount, totalGuests };
  }, [reservations]);

  if (!mounted) return null;

  const statCards = [
    { label: 'Total', value: analytics.total, color: cream, border: 'rgba(245,240,232,0.2)', sub: 'réservations' },
    { label: 'En attente', value: analytics.pending, color: '#f0c040', border: 'rgba(240,192,64,0.3)', sub: 'à traiter' },
    { label: 'Confirmées', value: analytics.confirmed, color: '#2ecc71', border: 'rgba(46,204,113,0.3)', sub: 'validées' },
    { label: 'Annulées', value: analytics.cancelled, color: '#e74c3c', border: 'rgba(231,76,60,0.3)', sub: 'refusées' },
    { label: "Aujourd'hui", value: analytics.todayCount, color: gold, border: 'rgba(201,168,76,0.3)', sub: 'nouvelles' },
    { label: 'Couverts', value: analytics.totalGuests, color: goldLight, border: 'rgba(240,208,128,0.3)', sub: 'attendus' },
  ];

  const statusStyle = (status: string) => {
    if (status === 'confirmed') return { bg: 'rgba(46,204,113,0.15)', border: 'rgba(46,204,113,0.5)', color: '#2ecc71', label: '✓ Confirmé' };
    if (status === 'cancelled') return { bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.4)', color: '#e74c3c', label: '✕ Annulé' };
    return { bg: 'rgba(240,192,64,0.12)', border: 'rgba(240,192,64,0.4)', color: '#f0c040', label: '⏳ En attente' };
  };

  return (
    <div className="admin-dashboard" style={{ minHeight: '100vh', backgroundColor: dark, fontFamily: font, position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: grain, backgroundRepeat: 'repeat', backgroundSize: '128px', opacity: 0.5 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '1px', zIndex: 10, background: `linear-gradient(90deg, transparent, ${gold}, ${goldLight}, ${gold}, transparent)` }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: 'clamp(24px, 4vw, 64px) clamp(16px, 4vw, 48px)' }}>
        {/* HEADER */}
        <div className="dashboard-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '52px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: gold, fontSize: '0.62rem', fontFamily: mono, letterSpacing: '0.35em', textTransform: 'uppercase' }}>✦ &nbsp; Espace Gérant</span>
            <h1 style={{ color: cream, fontWeight: 400, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Dashboard</h1>
            <p style={{ color: muted, fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>Gérez les réservations en temps réel</p>
          </div>
          <div className="dashboard-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchReservations}
              onMouseEnter={() => setRefreshHover(true)}
              onMouseLeave={() => setRefreshHover(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: refreshHover ? 'rgba(201,168,76,0.1)' : 'transparent', border: `1px solid ${refreshHover ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.2)'}`, borderRadius: '1px', padding: '10px 18px', color: refreshHover ? cream : muted, fontSize: '0.7rem', fontFamily: mono, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Actualiser
            </button>
            <button
              onClick={handleLogout}
              onMouseEnter={() => setLogoutHover(true)}
              onMouseLeave={() => setLogoutHover(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: logoutHover ? 'rgba(231,76,60,0.12)' : 'transparent', border: `1px solid ${logoutHover ? 'rgba(231,76,60,0.6)' : 'rgba(231,76,60,0.25)'}`, borderRadius: '1px', padding: '10px 18px', color: logoutHover ? '#e74c3c' : 'rgba(231,76,60,0.6)', fontSize: '0.7rem', fontFamily: mono, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <LogOut size={13} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* ANALYTICS */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ height: '1px', width: '32px', background: `linear-gradient(90deg, ${gold}, transparent)` }} />
            <span style={{ color: gold, fontSize: '0.6rem', fontFamily: mono, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Analytiques</span>
          </div>
          <div className="stats-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {statCards.map(s => (
              <div
                key={s.label}
                style={{ flex: '1 1 140px', backgroundColor: cardBg, border: `1px solid ${s.border}`, borderRadius: '1px', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: `1px solid ${s.border}`, borderLeft: `1px solid ${s.border}` }} />
                <span style={{ color: muted, fontSize: '0.58rem', fontFamily: mono, letterSpacing: '0.25em', textTransform: 'uppercase' }}>{s.label}</span>
                <span style={{ color: s.color, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontFamily: mono, fontWeight: 400, lineHeight: 1 }}>{s.value}</span>
                <span style={{ color: 'rgba(138,128,112,0.5)', fontSize: '0.6rem', fontFamily: mono }}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ height: '1px', width: '32px', background: `linear-gradient(90deg, ${gold}, transparent)` }} />
            <span style={{ color: gold, fontSize: '0.6rem', fontFamily: mono, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Réservations</span>
            <span style={{ color: 'rgba(138,128,112,0.4)', fontSize: '0.58rem', fontFamily: mono }}>({reservations.length})</span>
          </div>

          <div style={{ border: '1px solid rgba(201,168,76,0.12)', borderRadius: '1px', overflow: 'hidden', backgroundColor: cardBg }}>
            {/* Desktop header row */}
            <div className="table-head" style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 2fr 1.2fr 1fr', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '12px 20px', backgroundColor: 'rgba(201,168,76,0.04)' }}>
              {['Client', 'Couverts', 'Heure', 'Commande', 'Statut', 'Actions'].map(h => (
                <span key={h} style={{ color: 'rgba(138,128,112,0.7)', fontSize: '0.58rem', fontFamily: mono, letterSpacing: '0.25em', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: muted, fontStyle: 'italic', fontSize: '0.85rem' }}>Chargement...</div>
            ) : reservations.length === 0 ? (
              <div style={{ padding: '64px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: gold, fontSize: '1.2rem', opacity: 0.3 }}>✦</span>
                <p style={{ color: muted, fontStyle: 'italic', fontSize: '0.85rem', margin: 0 }}>Aucune réservation pour le moment.</p>
              </div>
            ) : reservations.map((res, idx) => {
              const ss = statusStyle(res.status);
              const clientInitials = `${res?.name?.[0] ?? ''}`.toUpperCase();
              return (
                <div
                  key={res.id}
                  className="reservation-row"
                  style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 2fr 1.2fr 1fr', padding: '16px 20px', alignItems: 'center', borderBottom: idx < reservations.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none', transition: 'background-color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(201,168,76,0.03)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  {/* Client */}
                  <div className="reservation-client" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ color: cream, fontSize: '0.88rem' }}>{res.name}</span>
                    <span style={{ color: 'rgba(138,128,112,0.4)', fontSize: '0.6rem', fontFamily: mono }}>#{res.id}</span>
                  </div>

                  {/* Couverts */}
                  <div className="reservation-field">
                    <span style={{ color: gold, fontFamily: mono, fontSize: '0.9rem', fontWeight: 600 }}>{res.guest_count}</span>
                    <span style={{ color: muted, fontFamily: mono, fontSize: '0.65rem' }}> pers.</span>
                  </div>

                  {/* Heure */}
                  <div className="reservation-field" style={{ color: cream, fontSize: '0.82rem', fontFamily: mono }}>{res.reservation_time || '—'}</div>

                  {/* Commande */}
                  <div className="reservation-order" style={{ color: 'rgba(245,240,232,0.65)', fontSize: '0.78rem', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }}>
                    {res.order || res.notes || '—'}
                  </div>

                  {/* Statut */}
                  <div className="reservation-status">
                    <span style={{ padding: '5px 12px', backgroundColor: ss.bg, border: `1px solid ${ss.border}`, borderRadius: '1px', color: ss.color, fontSize: '0.65rem', fontFamily: mono, letterSpacing: '0.1em', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {ss.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="reservation-actions" style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {res.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(res.id, 'confirmed')}
                          title="Confirmer"
                          style={{ background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.4)', borderRadius: '1px', color: '#2ecc71', cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6rem', fontFamily: mono, letterSpacing: '0.1em', transition: 'all 0.2s ease' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(46,204,113,0.25)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(46,204,113,0.12)'; }}
                        >
                          <CheckCircle size={12} /> OK
                        </button>
                        <button
                          onClick={() => updateStatus(res.id, 'cancelled')}
                          title="Annuler"
                          style={{ background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.4)', borderRadius: '1px', color: '#e74c3c', cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6rem', fontFamily: mono, letterSpacing: '0.1em', transition: 'all 0.2s ease' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(231,76,60,0.25)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(231,76,60,0.12)'; }}
                        >
                          <XCircle size={12} /> NON
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteReservation(res.id)}
                      title="Supprimer"
                      style={{ background: 'none', border: 'none', color: deleteHover === res.id ? '#e74c3c' : 'rgba(138,128,112,0.35)', cursor: 'pointer', padding: '5px', transition: 'color 0.2s ease' }}
                      onMouseEnter={() => setDeleteHover(res.id)}
                      onMouseLeave={() => setDeleteHover(null)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Mobile card layout only */}
                  <div className="reservation-mobile-card" aria-hidden="true">
                    <div className="mobile-topline">
                      <div className="mobile-avatar">{clientInitials || '•'}</div>
                      <div className="mobile-client-block">
                        <span className="mobile-client-name">{res.name}</span>
                        <span className="mobile-client-id">#{res.id}</span>
                      </div>
                      <div className="mobile-status-wrap">
                        <span style={{ padding: '5px 12px', backgroundColor: ss.bg, border: `1px solid ${ss.border}`, borderRadius: '1px', color: ss.color, fontSize: '0.65rem', fontFamily: mono, letterSpacing: '0.1em', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {ss.label}
                        </span>
                      </div>
                    </div>

                    <div className="mobile-meta-grid">
                      <div className="mobile-meta-item">
                        <span className="mobile-meta-label">Couverts</span>
                        <span className="mobile-meta-value">{res.guest_count} pers.</span>
                      </div>
                      <div className="mobile-meta-item">
                        <span className="mobile-meta-label">Heure</span>
                        <span className="mobile-meta-value">{res.reservation_time || '—'}</span>
                      </div>
                    </div>

                    <div className="mobile-order-block">
                      <span className="mobile-meta-label">Commande</span>
                      <span className="mobile-order-text">{res.order || res.notes || '—'}</span>
                    </div>

                    <div className="mobile-actions-row">
                      {res.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(res.id, 'confirmed')} className="mobile-action-btn mobile-action-confirm">
                            <CheckCircle size={12} /> OK
                          </button>
                          <button onClick={() => updateStatus(res.id, 'cancelled')} className="mobile-action-btn mobile-action-cancel">
                            <XCircle size={12} /> NON
                          </button>
                        </>
                      )}
                      <button onClick={() => deleteReservation(res.id)} className="mobile-action-icon" title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <span style={{ color: 'rgba(138,128,112,0.25)', fontSize: '0.6rem', fontFamily: mono, letterSpacing: '0.3em', textTransform: 'uppercase' }}>✦ &nbsp; Restau — Administration &nbsp; ✦</span>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .reservation-mobile-card {
          display: none;
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            overflow-x: hidden;
          }

          .admin-dashboard > div[style*="max-width"] {
            padding-left: 14px !important;
            padding-right: 14px !important;
          }

          .dashboard-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 14px !important;
            margin-bottom: 32px !important;
          }

          .dashboard-actions {
            width: 100%;
            display: grid !important;
            grid-template-columns: 1fr 1fr;
          }

          .dashboard-actions button {
            width: 100%;
            justify-content: center;
            padding: 12px 10px !important;
            font-size: 0.62rem !important;
          }

          .stats-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 10px !important;
          }

          .stats-grid > div {
            min-width: 0;
            padding: 16px 14px !important;
          }

          .table-head {
            display: none !important;
          }

          .reservation-row {
            display: block !important;
            padding: 0 !important;
          }

          .reservation-client,
          .reservation-field,
          .reservation-order,
          .reservation-status,
          .reservation-actions {
            display: none !important;
          }

          .reservation-mobile-card {
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 14px;
            border-bottom: 1px solid rgba(201,168,76,0.06);
          }

          .reservation-row:last-child .reservation-mobile-card {
            border-bottom: none;
          }

          .mobile-topline {
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }

          .mobile-avatar {
            width: 34px;
            height: 34px;
            border-radius: 999px;
            border: 1px solid rgba(201,168,76,0.22);
            color: ${gold};
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: ${mono};
            font-size: 0.75rem;
            flex: 0 0 auto;
            background: rgba(201,168,76,0.06);
          }

          .mobile-client-block {
            min-width: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .mobile-client-name {
            color: ${cream};
            font-size: 0.92rem;
            line-height: 1.15;
            word-break: break-word;
          }

          .mobile-client-id {
            color: rgba(138,128,112,0.45);
            font-size: 0.6rem;
            font-family: ${mono};
          }

          .mobile-status-wrap {
            flex: 0 0 auto;
          }

          .mobile-meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .mobile-meta-item,
          .mobile-order-block {
            border: 1px solid rgba(201,168,76,0.08);
            background: rgba(201,168,76,0.03);
            border-radius: 1px;
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
          }

          .mobile-order-block {
            gap: 6px;
          }

          .mobile-meta-label {
            color: rgba(138,128,112,0.65);
            font-size: 0.56rem;
            font-family: ${mono};
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }

          .mobile-meta-value,
          .mobile-order-text {
            color: ${cream};
            font-size: 0.82rem;
            line-height: 1.35;
            word-break: break-word;
          }

          .mobile-order-text {
            color: rgba(245,240,232,0.8);
            font-style: italic;
          }

          .mobile-actions-row {
            display: flex;
            gap: 8px;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
          }

          .mobile-action-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 10px;
            border-radius: 1px;
            font-family: ${mono};
            font-size: 0.6rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border: 1px solid transparent;
            cursor: pointer;
          }

          .mobile-action-confirm {
            background: rgba(46,204,113,0.12);
            border-color: rgba(46,204,113,0.35);
            color: #2ecc71;
          }

          .mobile-action-cancel {
            background: rgba(231,76,60,0.12);
            border-color: rgba(231,76,60,0.35);
            color: #e74c3c;
          }

          .mobile-action-icon {
            margin-left: auto;
            background: none;
            border: none;
            color: rgba(138,128,112,0.45);
            padding: 6px;
            cursor: pointer;
          }

          .mobile-action-icon:active {
            color: #e74c3c;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-actions {
            grid-template-columns: 1fr;
          }

          .mobile-meta-grid {
            grid-template-columns: 1fr;
          }

          .mobile-topline {
            align-items: center;
          }

          .mobile-status-wrap {
            margin-left: auto;
          }
        }
      `}</style>
    </div>
  );
}
