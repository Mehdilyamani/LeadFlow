// app/api/orders/create/route.ts
import { NextResponse } from 'next/server';
import { createPayPalOrder } from '../../../lib/paypalSandbox';
import supabaseAdmin from '../../../lib/admin';

export function computeTotal(items: any[] = []) {
  return items.reduce((sum, it) => {
    const price = Number(it?.price ?? 0);
    const qty = Math.max(1, Number(it?.options.quantity ?? 1));
    if (!isFinite(price) || price <= 0) return sum;
    return sum + price * qty;
  }, 0);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shipping, items } = body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'invalid_cart', message: 'Cart is empty or invalid' }, { status: 400 });
    }

    // compute total (server-side)
    const rawTotal = computeTotal(items);
    const amount = Number(rawTotal).toFixed(2);
    if (Number(amount) <= 0) {
      console.error('Rejected create order: total <= 0, items:', JSON.stringify(items));
      return NextResponse.json({ error: 'invalid_amount', message: 'Order total must be greater than 0' }, { status: 400 });
    }

    // create pending order in DB
    const order_ref = `ORD-${Date.now().toString(36)}`;
    const { data: created, error: insertErr } = await supabaseAdmin
      .from('orders')
      .insert([{ order_ref, shipping, items, amount, currency: 'USD', status: 'pending' }])
      .select()
      .single();

    if (insertErr) {
      console.error('DB insert error', insertErr);
      return NextResponse.json({ error: 'db_error', message: insertErr.message }, { status: 500 });
    }

    // prepare shipping object for PayPal
    const shippingForPaypal = shipping
      ? {
          name: { full_name: `${shipping.firstName ?? ''} ${shipping.lastName ?? ''}`.trim() },
          address: {
            address_line_1: shipping.address1 ?? '',
            address_line_2: shipping.address2 ?? '',
            admin_area_2: shipping.city ?? '',
            admin_area_1: shipping.province ?? '',
            postal_code: shipping.postcode ?? '',
            country_code: shipping.country ?? 'US',
          },
        }
      : undefined;

    // create PayPal order with try/catch that parses PayPal error JSON if present
    let paypalResp: any = null;
    try {
      paypalResp = await createPayPalOrder({
        amount,
        currency: 'USD',
        orderRef: order_ref,
        shipping: shippingForPaypal,
      });
    } catch (err: any) {
      console.error('PayPal create order failed (raw err):', err);

      // Attempt to extract JSON from err.message
      let paypalParsed: any = null;
      let paypalRaw: string | null = null;
      try {
        const msg = String(err?.message ?? err);
        const jsonStart = msg.indexOf('{');
        if (jsonStart !== -1) {
          paypalRaw = msg.slice(jsonStart);
          paypalParsed = JSON.parse(paypalRaw);
        } else {
          paypalRaw = msg;
        }
      } catch (parseErr) {
        console.warn('Failed to parse PayPal error JSON:', parseErr);
        paypalRaw = String(err);
      }

      // store failure details in DB for debugging
      try {
        await supabaseAdmin
          .from('orders')
          .update({ status: 'paypal_failed', paypal_error: paypalRaw ?? JSON.stringify(err) })
          .eq('id', created.id);
      } catch (dbUpdErr) {
        console.error('Failed to update order with paypal_failed:', dbUpdErr);
      }

      // return structured error to client for debugging
      return NextResponse.json(
        {
          error: 'paypal_create_failed',
          message: 'PayPal create order failed — see paypal details',
          paypal: { parsed: paypalParsed ?? null, raw: paypalRaw ?? String(err) },
        },
        { status: 502 }
      );
    }

    // success: save paypal order id on DB
    await supabaseAdmin.from('orders').update({ paypal_order_id: paypalResp.id }).eq('id', created.id);

    return NextResponse.json({ order_ref, paypalOrderId: paypalResp.id, paypalData: paypalResp });
  } catch (err: any) {
    console.error('create order error (unexpected)', err);
    return NextResponse.json({ error: 'server_error', message: err?.message ?? String(err) }, { status: 500 });
  }
}
