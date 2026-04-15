// app/CSR/PayPalButtons.tsx
'use client';
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window { paypal?: any; }
}

export default function PayPalButtons({
  paypalOrderId,
  onSuccess,
}: {
  paypalOrderId: string | null;
  onSuccess?: (data: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const addedScriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!paypalOrderId) return; // nothing to render yet

    let mounted = true; // guard to avoid actions after unmount

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.error('PayPalButtons: NEXT_PUBLIC_PAYPAL_CLIENT_ID is missing');
      return;
    }

    // Helper: wait until window.paypal exists (with timeout)
    const waitForPaypal = async (timeout = 10000) => {
      if (window.paypal) return window.paypal;
      return new Promise<any>((resolve, reject) => {
        const start = Date.now();
        const check = setInterval(() => {
          if (window.paypal) {
            clearInterval(check);
            resolve(window.paypal);
          } else if (Date.now() - start > timeout) {
            clearInterval(check);
            resolve(null);
          }
        }, 50);
      });
    };

    const loadSdkIfNeeded = async () => {
      // avoid adding duplicate script with same client-id
      const existing = document.querySelector(`script[data-paypal-sdk][data-client-id="${clientId}"]`) as HTMLScriptElement | null;

      if (!existing && !window.paypal) {
        const s = document.createElement('script');
        s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
        s.async = true;
        s.setAttribute('data-paypal-sdk', 'true');
        s.setAttribute('data-client-id', clientId);
        document.body.appendChild(s);
        addedScriptRef.current = s;

        // wait for load or error
        await new Promise<void>((resolve, reject) => {
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load PayPal SDK script'));
        });
      } else if (!window.paypal) {
        // script exists but window.paypal not ready yet — wait for it
        await waitForPaypal(10000);
      }

      return window.paypal;
    };

    const render = async () => {
      try {
        const paypal = await loadSdkIfNeeded();
        if (!mounted) return;

        if (!paypal) {
          console.error('PayPal SDK not available after loading');
          return;
        }

        // Ensure container exists before instructing the SDK to render into it
        if (!containerRef.current) {
          // Container removed; bail out
          console.warn('PayPalButtons: container not found, aborting render');
          return;
        }

        // clear previous content safely
        try { containerRef.current.innerHTML = ''; } catch (e) { /* ignore if DOM removed */ }

        // Create the Buttons instance
        const buttons = paypal.Buttons({
          createOrder: async () => {
            // we use server-side created order id; caller must set paypalOrderId
            return paypalOrderId;
          },
          onApprove: async (data: any) => {
            try {
              const res = await fetch('/api/orders/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderID }),
              });
              const result = await res.json();
              if (res.ok && result?.ok) {
                onSuccess?.(result);
              } else {
                console.error('PayPal capture failed', result);
                alert('Payment captured by PayPal but server capture failed. Check console.');
              }
            } catch (err) {
              console.error('Error capturing PayPal order', err);
              alert('Unexpected error during capture. See console.');
            }
          },
          onCancel: (data: any) => {
            console.warn('PayPal flow canceled by buyer', data);
          },
          onError: (err: any) => {
            console.error('PayPal SDK reported an error', err);
          },
        });

        // final guard: container still present?
        if (!mounted || !containerRef.current) {
          try { buttons.close && buttons.close(); } catch (_) {}
          return;
        }

        // Render and wait for completion (the SDK resolves once rendered)
        await buttons.render(containerRef.current);
      } catch (err) {
        // If the error is "Detected container element removed from DOM", add guidance
        console.error('PayPalButtons render error', err);
        if (String(err).includes('Detected container element removed from DOM')) {
          console.warn('PayPalButtons: container was removed while SDK tried to render. Avoid unmounting parent until render completes (or close modal after render).');
        }
      }
    };

    render();

    return () => {
      mounted = false;
      // cleanup container safely
      try {
        if (containerRef.current) containerRef.current.innerHTML = '';
      } catch (e) {
        // ignore
      }
      // don't remove the global script because other components may use it.
      // If you added the script and you are sure nothing else needs it, you could remove it here:
      // if (addedScriptRef.current && addedScriptRef.current.parentNode) addedScriptRef.current.parentNode.removeChild(addedScriptRef.current);
    };
  }, [paypalOrderId, onSuccess]);

  return <div ref={containerRef} />;
}
