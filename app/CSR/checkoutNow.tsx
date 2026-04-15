// app/CSR/CheckoutFloating.tsx
'use client';
import React from 'react';
import { useCart } from './cartContext';

export default function CheckoutFloating() {
  const { cart, isOpen, open } = useCart();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // do not render anything until we are mounted on client
  if (!mounted) return null;

  // hide when cart empty or cart UI already open
  if (!cart || cart.length === 0 || isOpen) return null;

  const total = cart.reduce((sum, item) => {
    const price = Number(item?.price ?? 0);

    // quantity might live in different places; prefer options.quantity, fallback to item.quantity, then 1
    const rawQty = item?.options?.quantity ?? 1;
    const qtyNum = Number(rawQty);
    const qty = Number.isFinite(qtyNum) && qtyNum > 0 ? qtyNum : 1;

    return sum + price * qty;
  }, 0);
  return (
    <div
      aria-hidden={false}
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(255,255,255,0.95)',
        padding: '0.5rem 0.75rem',
        borderRadius: '12px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
        minWidth: '180px',
      }}
    >
      <div style={{ flex: 1, fontSize: '0.9rem' }}>
        <div style={{ fontWeight: 600 }}>{cart.length} item{cart.length > 1 ? 's' : ''}</div>
        <div style={{ fontSize: '0.85rem', color: '#555' }}>Total ${total.toFixed(2)}</div>
      </div>

      <button
        onClick={open}
        aria-label="Open cart to checkout"
        style={{
          padding: '0.5rem 0.75rem',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 700,
        }}
      >
        Checkout
      </button>
    </div>
  );
}
