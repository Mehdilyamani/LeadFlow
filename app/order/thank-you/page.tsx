import React from 'react';
import Link from 'next/link';
import { getOrderByRef } from '../../lib/getOrderbyref'; // adjust path if needed

type Props = { searchParams?: { ref?: string } };

export default async function Page({ searchParams }: Props) {
  const orderRef = searchParams?.ref ?? 'N/A';

  // fetch order server-side using service key (see lib/getOrderByRef)
  let order: any = null;
  try {
    order = await getOrderByRef(orderRef);
  } catch (err) {
    console.error('Error fetching order by ref:', err);
    order = null;
  }

  // Fallbacks if order not found
  if (!order) {
    // optionally: show friendly message and still render page
    return (
      <main className="thank-you-page" style={styles.page}>
        <h1 style={{ fontSize: 22 }}>Order not found</h1>
        <p>We could not find an order with reference <strong>{orderRef}</strong>.</p>
        <p>If you believe this is an error, please contact us at <a href="mailto:Restau.bespoke@gmail.com">Restau.bespoke@gmail.com</a>.</p>
        <Link href="/" style={styles.primaryButton}>Back to home</Link>
      </main>
    );
  }

  // Parse items (handle stringified JSON or array)
  let items: any[] = [];
  if (Array.isArray(order.items)) {
    items = order.items;
  } else if (typeof order.items === 'string') {
    try {
      const parsed = JSON.parse(order.items);
      items = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      // fallback: try to coerce via replace (handles escaped quotes)
      try {
        const parsed = JSON.parse(order.items.replace(/\\"/g, '"'));
        items = Array.isArray(parsed) ? parsed : [];
      } catch {
        items = [];
      }
    }
  } else if (order.items == null) {
    items = [];
  } else {
    // last resort: if items is an object with numeric keys, convert to array
    if (typeof order.items === 'object') {
      const maybeArr = Object.values(order.items).filter(Boolean);
      items = Array.isArray(maybeArr) ? maybeArr : [];
    } else {
      items = [];
    }
  }

  const currency = order.currency || order.currency_code || 'USD';

  // handle shipping details (same as your current logic)
  let shippingName = '';
  let shippingAddress = '';
  if (order?.purchase_units?.[0]?.shipping) {
    const shipping = order.purchase_units[0].shipping;
    shippingName = shipping.name?.full_name || '';
    const addr = shipping.address || {};
    shippingAddress = `${addr.address_line_1 || ''} ${addr.address_line_2 || ''}, ${addr.postal_code || ''} ${addr.admin_area_1 || ''}, ${addr.country_code || ''}`.trim();
  } else if (order.shipping) {
    const ship = order.shipping;
    shippingName = ship.name?.full_name || `${ship.firstName || ''} ${ship.lastName || ''}`.trim();
    const addr = ship.address || {};
    shippingAddress = `${addr.address_line_1 || addr.address1 || ''} ${addr.address_line_2 || addr.address2 || ''}, ${addr.postal_code || addr.postcode || ''} ${addr.admin_area_1 || addr.province || ''}, ${addr.country_code || addr.country || ''}`.trim();
  }

  // Use created_at if present
  const orderDate = order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString();

  const subtotal = items.reduce((sum: number, item: any) => {
    const qty = Number(item.options?.quantity ?? item.qty ?? 1);
    return sum + (Number(item.price ?? 0) * qty);
  }, 0);
  const shippingCost = Number(order.shipping_cost ?? order.shipping?.cost ?? 0);
  const total = subtotal + shippingCost;

  // Helper: ensure image URL is usable
  const resolveImg = (imgPath: string | undefined) => {
    if (!imgPath) return '/placeholder-80x80.png';
    if (/^https?:\/\//i.test(imgPath)) return imgPath;
    if (imgPath.startsWith('/')) return imgPath;
    return `/${imgPath}`;
  };

  // --- MAIN RENDER ---
  return (
    <main className="thank-you-page" style={styles.page}>
      {/* Inject mobile-friendly CSS that overrides inline styles when needed.
          Using !important here is intentional so we can override the inline style object values on mobile. */}
      <style>{`
        /* Base small tweaks */
        .thank-you-page img[alt="Banner"] { border-radius: 20px !important; }
        /* Mobile-specific overrides */
        @media (max-width: 768px) {
          .thank-you-page { padding: 16px !important; }
          .thank-you-page picture, .thank-you-page img { display: block; width: 100% !important; height: auto !important; }
          .thank-you-page .hero { flex-direction: column !important; gap: 12px !important; padding: 16px !important; }
          .thank-you-page .icon { width: 52px !important; height: 52px !important; font-size: 32px !important; border-radius: 10px !important; }
          .thank-you-page .title { font-size: 18px !important; margin-bottom: 4px !important; }
          .thank-you-page .subtitle { font-size: 13px !important; }
          .thank-you-page .container { padding: 14px !important; }
          .thank-you-page .receiptGrid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .thank-you-page .receiptBox, .thank-you-page .itemsBox { padding: 12px !important; }
          .thank-you-page .itemsList { gap: 10px !important; }
          .thank-you-page .itemRow { padding: 6px 0 !important; gap: 8px !important; align-items: center !important; }
          .thank-you-page .itemImg { width: 64px !important; height: 64px !important; }
          .thank-you-page .itemPrice { min-width: 58px !important; text-align: right !important; font-weight: 700 !important; }
          .thank-you-page .totalRow { flex-direction: column !important; align-items: flex-end !important; gap: 6px !important; }
          .thank-you-page .notes { padding: 12px !important; }
          /* Sticky bottom bar: compact and fixed */
          .thank-you-page .Total { position: fixed !important; left: 8px; right: 8px; bottom: 12px; background: #fff; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); padding: 8px !important; z-index: 1200 !important; }
          .thank-you-page footer { margin-bottom: 72px !important; text-align: center; }
          .thank-you-page .primaryButton { width: 100% !important; text-align: center !important; }
        }

        /* small desktop adjustments (optional) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .thank-you-page { padding: 24px !important; }
          .thank-you-page .hero { padding: 20px !important; }
        }
      `}</style>

      <picture>
        <source media="(max-width: 768px)" srcSet="/thnksmobile.jpg" />
        <source media="(min-width: 769px)" srcSet="/thnksImage.jpg" />
        <img src="/thnksImage.jpg" alt="Banner" style={{ marginBottom: '1rem', width: '100%', height: 'auto', display: 'block', marginTop:"-35px", borderRadius:"25px" }} />
      </picture>

      <section style={styles.hero} aria-labelledby="order-title" className="hero">
        <div style={styles.icon} className="icon">✅</div>
        <div>
          <h1 id="order-title" style={styles.title} className="title">Your order has been confirmed</h1>
          <p style={styles.subtitle} className="subtitle">Thank you for your purchase. We have successfully received your order and are preparing it for shipment.</p>
          <p style={styles.subtitle} className="subtitle">You will receive a confirmation email shortly with your order details.</p>
        </div>
      </section>

      <section style={styles.container} aria-labelledby="receipt-title" className="container">
        <h2 id="receipt-title" style={styles.sectionTitle} className="sectionTitle">Order receipt</h2>

        <div style={styles.receiptGrid} className="receiptGrid">
          <div style={styles.receiptBox} className="receiptBox">
            <div style={styles.row} className="row"><strong>Order reference</strong><span>{orderRef}</span></div>
            <div style={styles.row} className="row"><strong>Order date</strong><span>{orderDate}</span></div>
            <div style={styles.row} className="row">
              <strong>Payment method</strong>
              <span>{order?.payment_method || (order.paypal_capture ? 'PayPal' : 'Card')} &nbsp;</span>
            </div>

            {shippingName && (
              <div style={styles.row} className="row">
                <strong>Shipping to</strong>
                <span>{shippingName}{shippingAddress ? ` — ${shippingAddress}` : ''}</span>
              </div>
            )}
          </div>

          <div style={styles.itemsBox} className="itemsBox">
            <strong style={{ marginBottom: 8, display: 'block' }}>Items</strong>
            <ul style={styles.itemsList} className="itemsList">
              {items.map((item: any, idx: number) => {
                const qty = Number(item.options?.quantity ?? item.qty ?? 1);
                const itemTotal = (Number(item.price ?? 0) * qty).toFixed(2);
                return (
                  <li key={idx} style={styles.itemRow} className="itemRow">
                    <div style={styles.itemPrice} className="itemPrice">{currency} {itemTotal}</div>
                    <img src={resolveImg(item.imgs?.[0])} alt={item.short_name || item.name} style={styles.itemImg} className="itemImg" />
                    <div style={styles.itemInfo} className="itemInfo">
                      <div style={styles.itemName} className="itemName">{item.short_name || item.name}</div>
                      <div style={styles.itemMeta} className="itemMeta">
                        Size: {String(item.options?.size ?? '')} • Color: {String(item.options?.color ?? '')} • Qty: {qty}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div style={styles.totalRow} className="totalRow">
              <div>
                <div style={{ color: '#666' }}>Subtotal</div>
                <div style={{ color: '#666' }}>Shipping</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{currency} {subtotal.toFixed(2)}</div>
                <div>{currency} {shippingCost.toFixed(2)}</div>
                <div style={{ marginTop: 8, fontWeight: 700, fontSize: 18 }}>{currency} {total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.notes} className="notes">
          <h3 style={styles.noteTitle} className="noteTitle">Shipping information</h3>
          <p style={styles.noteText} className="noteText">Delivery times vary depending on the destination and local traffic. Typical shipping time is between <strong>1 week and 5 weeks</strong>. If you have concerns, please contact us.</p>

          <h3 style={styles.noteTitle} className="noteTitle">Return & replacement policy</h3>
          <p style={styles.noteText} className="noteText">If an item arrives damaged or does not arrive at all, we will <strong>reship</strong> the item to you at no additional cost. To initiate a replacement, please contact our support team by email at <a href="mailto:Restau.bespoke@gmail.com">Restau.bespoke@gmail.com</a> and include your order reference and photos if applicable.</p>

          <h3 style={styles.noteTitle} className="noteTitle">Customer support</h3>
          <p style={styles.noteText} className="noteText">Our customer support team is available <strong>24/7</strong>. We strive to respond to all messages and requests within <strong>24 hours</strong>.</p>
        </div>

        <div style={styles.actions} className="actions">
          <Link href="/" style={styles.primaryButton} className="primaryButton" aria-label="Back to home">OK — Back to Home</Link>
        </div>
      </section>

      <footer style={styles.footer} className="footer">
        <small style={{ color: '#888' }}>If you have any questions, please email <a href="mailto:Restau.bespoke@gmail.com">Restau.bespoke@gmail.com</a>.</small>
      </footer>

      {/* Compact sticky bottom bar on mobile is handled by CSS above (class .Total) */}
      <div style={styles.Total} className="Total">
        <div style={styles.inner}>
          <div style={styles.totalLeft} className="total-left">
            <div style={styles.totalLabel} className="total-label">Total</div>
            <div style={styles.totalValue} className="total-value">{currency} {total.toFixed(2)}</div>
          </div>

          <div style={styles.totalRight} className="total-right">
            <Link href="/" style={styles.primaryButton}>Continue</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// keep your styles object as before (I added a few keys referenced above to avoid undefined)
const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    padding: '36px',
    background: '#fff',
    color: '#111',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  hero: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    background:
      'linear-gradient(90deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
    padding: 28,
    borderRadius: 12,
    marginBottom: 24,
    border: '1px solid rgba(0,0,0,0.04)',
  },
  icon: {
    fontSize: 48,
    width: 72,
    height: 72,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    background: 'white',
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
  },
  title: { margin: 0, fontSize: 24 },
  subtitle: { margin: '6px 0 0', color: '#444' },
  container: {
    marginTop: 12,
    background: 'white',
    padding: 20,
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.04)',
  },
  sectionTitle: { margin: '0 0 12px 0', fontSize: 18 },
  receiptGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: 20,
    alignItems: 'start',
  },
  receiptBox: {
    padding: 16,
    borderRadius: 8,
    background: '#fafafa',
    border: '1px solid rgba(0,0,0,0.03)',
  },
  itemsBox: {
    padding: 16,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.03)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    color: '#222',
  },
  itemsList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  itemRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    borderBottom: '1px solid rgba(0,0,0,0.04)',
    padding: '8px 0',
  },
  itemImg: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 8,
    background: '#eee',
  },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 600 },
  itemMeta: { color: '#666', fontSize: 13 },
  itemPrice: { minWidth: 64, textAlign: 'right', fontWeight: 600 },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  notes: { marginTop: 18, padding: 16, background: '#fbfbfb', borderRadius: 8 },
  noteTitle: { margin: '8px 0' },
  noteText: { margin: '6px 0 12px 0', color: '#333' },
  actions: { marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' },
  primaryButton: {
    display: 'inline-block',
    background: '#111',
    color: 'white',
    padding: '10px 18px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700,
  },
  linkButton: {
    display: 'inline-block',
    color: '#111',
    padding: '10px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  footer: { marginTop: 28, textAlign: 'center' },

  /* small extras used for the mobile bottom bar */
  Total: { display: 'none' }, // desktop: keep hidden by default; CSS will override on mobile
  inner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalLeft: { display: 'flex', flexDirection: 'column' },
  totalLabel: { fontSize: 12, color: '#666' },
  totalValue: { fontSize: 18, fontWeight: 700 },
  totalRight: {},
};
