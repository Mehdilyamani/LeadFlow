// lib/paypal.ts  (server)
const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const client = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  if (!client || !secret) throw new Error('Missing PayPal server credentials');

  const basic = Buffer.from(`${client}:${secret}`).toString('base64');
  const r = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const j = await r.json();
  if (!r.ok) throw new Error('Failed to get PayPal access token: ' + JSON.stringify(j));
  return j.access_token as string;
}

export async function createPayPalOrder({ amount, currency = 'USD', orderRef, shipping }:{
  amount: string; currency?: string; orderRef?: string; shipping?: any;
}) {
  const token = await getAccessToken();
  const resp = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderRef ?? undefined,
          amount: { currency_code: currency, value: amount },
          ...(shipping ? { shipping } : {})
        }
      ],
      application_context: {
        shipping_preference: shipping ? 'SET_PROVIDED_ADDRESS' : 'NO_SHIPPING',
        user_action: 'PAY_NOW'
      }
    })
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error('PayPal create order error: ' + JSON.stringify(data));
  return data; // includes id
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getAccessToken();
  const r = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await r.json();
  if (!r.ok) throw new Error('PayPal capture error: ' + JSON.stringify(data));
  return data;
}
