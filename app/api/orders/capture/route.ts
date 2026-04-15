// app/api/paypal/capture/route.ts
import { NextResponse } from "next/server";
import { capturePayPalOrder } from "../../../lib/paypalSandbox";
import supabaseAdmin from "../../../lib/admin";

async function postToPipedream(payload: any) {
  const url = process.env.PIPEDREAM_WEBHOOK_URL;
  const secret = process.env.PIPEDREAM_SECRET;

  if (!url) {
    console.warn("PIPEDREAM_WEBHOOK_URL not set — skipping Pipedream notify");
    return { ok: false, reason: "missing_url" as const };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (secret) headers["x-webhook-secret"] = secret;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await resp.text().catch(() => null);
    if (!resp.ok) {
      console.error("Pipedream POST failed", resp.status, text);
      return { ok: false, status: resp.status, body: text ?? null };
    }
    console.log("Posted to Pipedream", { status: resp.status });
    return { ok: true, status: resp.status, body: text ?? null };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err?.name === "AbortError") {
      console.error("Pipedream POST aborted (timeout)");
      return { ok: false, reason: "timeout" as const };
    }
    console.error("Pipedream POST error", err);
    return { ok: false, reason: "network_error" as const, errorMessage: String(err) };
  }
}

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "missing orderId" }, { status: 400 });

    const capture = await capturePayPalOrder(orderId);

    // find matching order in DB (by paypal_order_id or reference_id)
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("paypal_order_id", orderId)
      .single();

    if (!order) {
      // record as orphan payment for manual reconciliation
      console.warn("Order not found for paypal order", orderId);
      return NextResponse.json({ ok: false, message: "order not found" }, { status: 404 });
    }

    // Verify captured amount matches DB amount (safety)
    const capturedAmount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
    if (Number(capturedAmount).toFixed(2) !== Number(order.amount).toFixed(2)) {
      // flag -> manual review
      await supabaseAdmin
        .from("orders")
        .update({ status: "payment_mismatch", paypal_capture: capture })
        .eq("id", order.id);
      return NextResponse.json({ ok: false, message: "amount mismatch" }, { status: 400 });
    }

    // mark paid
    await supabaseAdmin
      .from("orders")
      .update({ status: "paid", paypal_capture: capture })
      .eq("id", order.id);

    // Build a small trimmed payload to keep Pipedream executions cheap
    const captureObj = capture.purchase_units?.[0]?.payments?.captures?.[0] || {};
    const payer = capture.payer || {};
    const payload = {
      type: "paypal_capture",
      orderId: order.id,
      paypalOrderId: orderId,
      captureId: captureObj.id || null,
      amount: captureObj.amount?.value || capturedAmount || order.amount,
      currency: captureObj.amount?.currency_code || order.currency || null,
      payerEmail: payer.email_address || order.email || null,
      payerName: `${payer.name?.given_name || ""} ${payer.name?.surname || ""}`.trim() || order.customer_name || null,
      items: order.items || null,
      timestamp: new Date().toISOString(),
    };

    // Fire-and-forget Pipedream notify (we await so we can log result, but errors won't block)
    try {
      const res = await postToPipedream(payload);
      console.log("Pipedream notify result:", res);
    } catch (e) {
      console.error("Unexpected postToPipedream error", e);
    }

    // TODO: trigger confirmation email, notify fulfillment etc.

    return NextResponse.json({ ok: true, capture });
  } catch (err: any) {
    console.error("capture error", err);
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}
