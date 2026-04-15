// app/CSR/startCheckout.tsx  (or inside your CheckoutStep component)
'use client';
import React from 'react';
import { useCart } from './cartContext';
import { useRouter } from 'next/navigation';

export default function StartCheckout({ onGotPayPalOrder }:{ onGotPayPalOrder:(paypalOrderId:string, orderRef?:string)=>void }) {
  const { cart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function startCheckout(shipping: any) {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipping, items: cart })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || j?.message || 'create order failed');
      // j.paypalOrderId should exist
      onGotPayPalOrder(j.paypalOrderId, j.order_ref ?? j.orderRef);
    } catch (err:any) {
      console.error('startCheckout error', err);
      alert(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return <div>{/* call startCheckout(shippingObj) when shipping saved */}</div>;
}
