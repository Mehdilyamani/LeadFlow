// webhook-server.js
// Usage: install deps: npm i express node-fetch nodemailer dotenv
// Run: node webhook-server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // if Node v18+ you can use global fetch
const nodemailer = require('nodemailer');

const app = express();

// capture raw body for safety (useful if you need exact bytes)
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf ? buf.toString() : ''; }
}));

const PORT = process.env.PORT || 3000;
const PAYPAL_ENV = process.env.PAYPAL_ENV || 'sandbox'; // 'sandbox' or 'live'
const PAYPAL_API = PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID; // set AFTER creating webhook in dashboard

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.error('Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in env');
  process.exit(1);
}

// Optional: configure an SMTP transporter to receive email alerts
let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: (process.env.SMTP_SECURE === 'true'),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

// helper: get OAuth access token from PayPal
async function getAccessToken() {
  const creds = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  const json = await res.json();
  if (!res.ok) throw new Error('Failed to get access token: ' + JSON.stringify(json));
  return json.access_token;
}

app.post('/api/paypal/webhook', async (req, res) => {
  try {
    // PayPal sends several headers we use for verification:
    const transmissionId = req.get('paypal-transmission-id');
    const transmissionTime = req.get('paypal-transmission-time');
    const certUrl = req.get('paypal-cert-url');
    const authAlgo = req.get('paypal-auth-algo');
    const transmissionSig = req.get('paypal-transmission-sig');

    if (!transmissionId || !transmissionSig) {
      console.warn('Missing PayPal headers - rejecting');
      return res.status(400).send('missing-paypal-headers');
    }

    const webhookEvent = req.body; // parsed JSON

    // Get app access token
    const accessToken = await getAccessToken();

    // Verify signature with PayPal
    const verifyRes = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: webhookEvent
      })
    });
    const verifyJson = await verifyRes.json();
    if (verifyJson.verification_status !== 'SUCCESS') {
      console.warn('PayPal webhook verification failed', verifyJson);
      return res.status(400).send('verification_failed');
    }

    // Verified — process the event type(s)
    const eventType = webhookEvent.event_type;
    console.log('VERIFIED PayPal webhook event:', eventType);

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = webhookEvent.resource || {};
      const amount = resource.amount || {};
      const captureId = resource.id;

      // Example: print/log
      console.log(`Payment completed! capture id=${captureId} amount=${amount.value} ${amount.currency_code}`);
      // TODO: persist to DB (mark order paid), send to queue, etc. Make operations idempotent.

      // Optional: send yourself an email notification (non-blocking)
      if (transporter && process.env.NOTIFY_EMAIL) {
        const subject = `PayPal sale ${amount.value} ${amount.currency_code}`;
        const html = `
          <h3>PayPal sale received</h3>
          <p><strong>Amount:</strong> ${amount.value} ${amount.currency_code}</p>
          <p><strong>Capture ID:</strong> ${captureId}</p>
          <pre>${JSON.stringify(resource, null, 2)}</pre>
        `;
        transporter.sendMail({
          from: process.env.NOTIFY_FROM || 'no-reply@local.test',
          to: process.env.NOTIFY_EMAIL,
          subject,
          html
        }).then(()=>console.log('Notification email sent')).catch(err=>console.error('Email error', err));
      }
    } else {
      console.log('Unhandled event type (logged):', eventType);
    }

    // Always return 2xx quickly for successful receipt
    return res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook handler error:', err);
    // return 500 so PayPal may retry (helps during development)
    return res.status(500).send('server error');
  }
});

app.get('/', (req, res) => res.send('Webhook server running'));

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`Ngrok forward to this port (ngrok http ${PORT}) and use the https URL in PayPal Webhook config`);
});
