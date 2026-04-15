'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './cartContext';
import ShippingForm from './form';
import PayPalButtons from './PaypalButton'; // if you have one already, keep path

export default function CheckoutWrapper({ onDone }:{ onDone?: (orderRef?:string)=>void }) {
  const { cart, clear } = useCart();
  const router = useRouter();

  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [serverOrderRef, setServerOrderRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // called by ShippingForm on success (we modified ShippingForm to pass {saved, shipping})
  async function handleShippingSaved(payload: any) {
    // payload = { saved: <db response>, shipping: <form fields> }
    const shipping = payload?.shipping ?? payload?.saved ?? payload;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipping, items: cart })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || j?.message || JSON.stringify(j));
      setPaypalOrderId(j?.paypalOrderId ?? j?.paypal_order_id ?? null);
      setServerOrderRef(j?.order_ref ?? j?.orderRef ?? null);
    } catch (err:any) {
      console.error('create order error', err);
      setError(err?.message ?? 'Failed to create order');
    } finally {
      setLoading(false);
    }
  }

  // called when server capture returns success via PayPalButtons onSuccess
  const handlePaymentSuccess = (captureResult: any) => {
    // you can clear cart, redirect to thank you etc.
    clear();
    // optionally call callback
    if (onDone) onDone(serverOrderRef ?? captureResult?.orderId ?? '');
    // redirect to a thank-you page (optional)
    router.push(`/order/thank-you?ref=${encodeURIComponent(serverOrderRef ?? '')}`);
  };

  // Render shipping form until we have a PayPal order id
  return (
    <div>
      {!paypalOrderId ? (
        <>
          <ShippingForm
            onSuccess={handleShippingSaved}
            onCancel={() => {
              /* optional: close modal by parent via props or context */
            }}
          />
          {loading && <div className="mt-2">Preparing PayPal…</div>}
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </>
      ) : (
        <>
          <h3 className="mb-2">Pay with PayPal</h3>
          <PayPalButtons
            paypalOrderId={paypalOrderId}
            onSuccess={(result:any) => handlePaymentSuccess(result)}
          />
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => { setPaypalOrderId(null); setServerOrderRef(null); }}
              className="px-3 py-1 rounded border"
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}
