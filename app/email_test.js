// send_pipedream_test.js
// Usage:
//   node send_pipedream_test.js https://eojo...   OR
//   PIPEDREAM_URL="https://eojo..." node send_pipedream_test.js
//
// Requires Node 18+ (global fetch). If using older Node, run with node >=18 or install node-fetch.

const urlArg = process.argv[2] || process.env.PIPEDREAM_URL;
if (!urlArg) {
  console.error('Please provide the Pipedream webhook URL as an argument or set PIPEDREAM_URL env var.');
  process.exit(1);
}

const PIPEDREAM_URL = urlArg;

async function send() {
  const payload = {
    // Top-level helpers your email template expects
    payerName: "John Doe",
    orderId: "ORD-mg16ht12",
    paypalOrderId: "6V514710U16274945",
    captureId: "6N105780HA198800C",
    amount: 979.99,
    currency: "USD",

    // created time (used by formatter)
    created_at: "2025-09-26T18:34:41Z",

    // purchase_units / capture info (PayPal-like)
    paypal_capture: {
      id: "6V514710U16274945",
      status: "COMPLETED",
      create_time: "2025-09-26T18:34:41Z",
      seller_receivable_breakdown: {
        gross_amount: { value: "979.99", currency_code: "USD" },
        paypal_fee: { value: "34.69", currency_code: "USD" },
        net_amount: { value: "945.30", currency_code: "USD" }
      }
    },

    purchase_units: [
      {
        reference_id: "ORD-mg16ht12",
        payments: {
          captures: [
            {
              id: "6N105780HA198800C",
              amount: { value: "979.99", currency_code: "USD" },
              create_time: "2025-09-26T18:34:41Z"
            }
          ]
        },
        shipping: {
          name: { full_name: "Mehdi lyamani" },
          address: {
            address_line_1: "aaa",
            address_line_2: "xx",
            admin_area_2: "ttt",
            admin_area_1: "qqqq",
            postal_code: "yy",
            country_code: "FR"
          }
        }
      }
    ],

    // IMPORTANT: shipping.email as requested
    shipping: {
      email: "mehdilyamani2000@gmail.com",
      firstName: "Mehdi",
      lastName: "lyamani",
      address1: "aaa",
      address2: "xx",
      city: "ttt",
      province: "qqqq",
      postcode: "yy",
      country: "FR"
    },

    // Items exactly like your example (keeps imgs as relative paths — for emails replace with public URLs)
    items: [
      {
        id: 13,
        imgs: [
          "/1_ea169eee-7717-4f96-a2f0-d15213b92075.jpg",
          "/2_1613620102719.jpg"
        ],
        name: "Plush Lapel Leather Jacket Winter Warm Fleece",
        price: 150,
        short_name: "Leather Jacket Winter Coat",
        options: { size: "4XL lengthened", color: "maroon", quantity: 5 },
        created_at: "2025-09-25T18:41:53.857703+00:00"
      },
      {
        id: 10,
        imgs: [
          "/1_7eb07b63-faa5-469d-a780-0e649cc459f3.jpg",
          "/2_c7a2ac59-4823-4c4f-9d87-4f8bf2280d21.jpg"
        ],
        name: "Men's Work Fashion Leather Shoes",
        price: 49.99,
        short_name: "Leather Shoes",
        options: { size: 40, color: "black", quantity: 1 },
        created_at: "2025-09-24T20:50:15.865101+00:00"
      },
      {
        id: 12,
        imgs: [
          "/1_09ce19a2-4f8e-4918-b6b7-81c35abadbe5.jpg",
          "/4_b30f217e-3c71-4e32-8bc4-9306459190f2.jpg"
        ],
        name: "Lapel Jacquard Half-zipper Sweatshirt",
        price: 60,
        short_name: "Lapel Jacquard Sweatshirt",
        options: { size: "L", color: "lightgrey", quantity: 3 },
        created_at: "2025-09-25T18:19:44.489455+00:00"
      }
    ],

    // optional shipping cost (your formatter will pick up shipping_cost or shipping.cost)
    shipping_cost: 0
  };

  try {
    console.log('Posting test payload to', PIPEDREAM_URL);
    const res = await fetch(PIPEDREAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload, null, 2),
      // timeout isn't built into fetch; keep it simple
    });

    const text = await res.text().catch(() => null);
    console.log('Response status:', res.status);
    console.log('Response body:', text);
    if (!res.ok) process.exitCode = 2;
  } catch (err) {
    console.error('Request failed:', err);
    process.exitCode = 3;
  }
}

send();
