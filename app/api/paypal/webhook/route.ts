// app/api/paypal/webhook/route.ts
import { NextResponse } from "next/server";

const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";
const PAYPAL_API =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(clientId: string, clientSecret: string) {
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  return res.json();
}

/**
 * Simple in-memory idempotency set for local/dev only.
 * Replace with DB/Redis in production.
 */
const processedIds = new Set<string>();

export async function POST(req: Request) {
  const raw = await req.text();
  let webhookEvent: any;
  try {
    webhookEvent = JSON.parse(raw);
  } catch (e) {
    console.error("Invalid JSON body", e);
    return NextResponse.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }

  // Log for debug
  console.log(">>> PayPal webhook received", {
    id: webhookEvent?.id,
    event_type: webhookEvent?.event_type,
  });

  // Extract PayPal headers (for signature verification)
  const headers = Object.fromEntries(req.headers.entries());
  const transmission_id = headers["paypal-transmission-id"];
  const transmission_time = headers["paypal-transmission-time"];
  const cert_url = headers["paypal-cert-url"];
  const auth_algo = headers["paypal-auth-algo"];
  const transmission_sig = headers["paypal-transmission-sig"];

  // If missing headers (PayPal simulator may omit them) -> return 200 but log
  if (!transmission_id || !transmission_sig) {
    console.warn("Missing PayPal verification headers; likely a simulator call. Logging and returning 200.");
    console.log("webhookEvent:", webhookEvent);
    return NextResponse.json({ ok: true });
  }

  // Verify webhook signature
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
  const webhookId = process.env.PAYPAL_WEBHOOK_ID || "";

  if (!clientId || !clientSecret || !webhookId) {
    console.error("Missing PayPal env vars (CLIENT/SECRET/WEBHOOK_ID)");
    return NextResponse.json({ ok: false, reason: "missing_env" }, { status: 500 });
  }

  try {
    const tokenJson = await getAccessToken(clientId, clientSecret);
    if (!tokenJson.access_token) {
      console.error("Failed to obtain PayPal access token", tokenJson);
      return NextResponse.json({ ok: false, reason: "token_failed" }, { status: 500 });
    }
    const accessToken = tokenJson.access_token;

    const verifyRes = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({
        transmission_id,
        transmission_time,
        cert_url,
        auth_algo,
        transmission_sig,
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }),
    });
    const verifyJson = await verifyRes.json();
    console.log("verify response:", verifyJson);

    if (verifyJson.verification_status !== "SUCCESS") {
      console.warn("Webhook verification failed", verifyJson);
      return NextResponse.json({ ok: false, verifyJson }, { status: 400 });
    }

    // Verified — handle events
    const eventType = webhookEvent.event_type;
    console.log("Verified event:", eventType);

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = webhookEvent.resource || {};
      const captureId = resource.id;
      // Idempotency check (dev only)
      if (processedIds.has(captureId)) {
        console.log("Already processed capture:", captureId);
        return NextResponse.json({ ok: true });
      }
      processedIds.add(captureId);

      // Compose your custom email body from webhook JSON
      const amount = resource.amount?.value || "N/A";
      const currency = resource.amount?.currency_code || "N/A";
      const payerEmail = resource?.payer?.email_address || "unknown";
      const subject = `New PayPal payment ${amount} ${currency}`;
      const html = `
        <h3>New PayPal sale received</h3>
        <p><strong>Amount:</strong> ${amount} ${currency}</p>
        <p><strong>Payer email:</strong> ${payerEmail}</p>
        <p><strong>Capture id:</strong> ${captureId}</p>
        <pre>${JSON.stringify(resource, null, 2)}</pre>
      `;

      // Send email via SendGrid API (recommended for serverless)
      const sendgridKey = process.env.SENDGRID_API_KEY;
      if (sendgridKey) {
        try {
          const sendResp = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sendgridKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: process.env.NOTIFY_EMAIL || "you@example.com" }] }],
              from: { email: process.env.FROM_EMAIL || "no-reply@yourdomain.com", name: "Your Store" },
              subject,
              content: [{ type: "text/html", value: html }],
            }),
          });
          if (!sendResp.ok) {
            const body = await sendResp.text();
            console.error("SendGrid send failed", sendResp.status, body);
          } else {
            console.log("Notification email sent via SendGrid");
          }
        } catch (e) {
          console.error("SendGrid error", e);
        }
      } else {
        console.warn("SENDGRID_API_KEY not set — skipping email.");
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Handler error", err);
    return NextResponse.json({ ok: false, error: "handler_error" }, { status: 500 });
  }
}
