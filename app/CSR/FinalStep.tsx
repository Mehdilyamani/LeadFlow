// app/CSR/CheckoutStep.tsx
'use client';

import React, { useState } from 'react';
import ShippingForm from './form'; // your ShippingForm file (you already have this)
import PayPalButtons from './PaypalButton'; // your PayPal buttons component
import { useCart } from './cartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutStep() {
  const { cart, clear } = useCart();
  const router = useRouter();

  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [serverOrderRef, setServerOrderRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // called when ShippingForm saved (it may return { saved, shipping } or just shipping)
  const handleShippingSaved = async (savedShipping: any) => {
    setError(null);
    setLoading(true);

    const shipping = savedShipping?.shipping ?? savedShipping?.saved ?? savedShipping ?? {};
    console.log('handleShippingSaved sending shipping:', shipping, 'cart:', cart);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipping, items: cart })
      });

      const text = await res.text();
      let body: any;
      try { body = JSON.parse(text); } catch { body = text; }

      console.log('create order HTTP', res.status, body);

      if (!res.ok) {
        // show server details if available
        const msg = (body && (body.error || body.message || JSON.stringify(body))) || `Server ${res.status}`;
        throw new Error(msg);
      }

      setPaypalOrderId(body?.paypalOrderId ?? body?.paypal_order_id ?? null);
      setServerOrderRef(body?.order_ref ?? body?.orderRef ?? null);
      console.log("paypalOrderId from API:", body?.paypalOrderId);

    } catch (err: any) {
      console.error('create order failed (client):', err);
      setError(err?.message ?? 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  // called when capture on server returns success via PayPalButtons onSuccess
  const handlePaymentSuccess = (captureResult: any) => {
    console.log('CheckoutStep: payment success result', captureResult);
    // clear cart and redirect to thank-you page
    try {
      clear();
    } catch (e) {
      console.warn('CheckoutStep: failed to clear cart', e);
    }
    // navigate to thank-you or order page; include order ref if available
    const ref = serverOrderRef ?? (captureResult?.orderId ?? '');
    router.push(`/order/thank-you?ref=${encodeURIComponent(ref ?? '')}`);
  };

  return (
    <div className="checkout-step">
      {!paypalOrderId ? (
        <>
          <h3 className="text-xl font-semibold mb-4">Shipping details</h3>

          <ShippingForm
            onSuccess={handleShippingSaved}
            onCancel={() => {
              // optional: implement modal close in parent; here we just reset errors
              setError(null);
            }}
          />

          {loading && (
            <div className="mt-3 text-sm">Creating order & preparing PayPal…</div>
          )}

          {error && (
            <div className="mt-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-3">Pay with PayPal</h3>

          <div style={{ minHeight: 60 }}>
            <PayPalButtons
              paypalOrderId={paypalOrderId}
              onSuccess={(result: any) => handlePaymentSuccess(result)}
            />
          </div>

        </>
      )}
    </div>
  );
}
