import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type CheckoutItem = {
  name: string;
  quantity: number;
  price: number;
};

type Shipping = {
  name?: string;
  email?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

function dollarsToCents(amount: number) {
  return Math.round(amount * 100);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const locationId = Deno.env.get("SQUARE_LOCATION_ID");
    const environment = Deno.env.get("SQUARE_ENVIRONMENT") ?? "sandbox";

    if (!accessToken || !locationId) {
      return new Response(
        JSON.stringify({ error: "Square is not configured on the server." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = (await req.json()) as {
      sourceId?: string;
      items?: CheckoutItem[];
      shipping?: Shipping;
      idempotencyKey?: string;
    };

    const sourceId = body.sourceId?.trim();
    const items = body.items ?? [];
    const shipping = body.shipping ?? {};

    if (!sourceId) {
      return new Response(JSON.stringify({ error: "Missing payment token." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!items.length) {
      return new Response(JSON.stringify({ error: "Cart is empty." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const item of items) {
      if (
        !item.name ||
        !Number.isFinite(item.price) ||
        item.price <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return new Response(JSON.stringify({ error: "Invalid cart items." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const amountCents = items.reduce(
      (sum, item) => sum + dollarsToCents(item.price) * item.quantity,
      0,
    );

    if (amountCents < 1) {
      return new Response(JSON.stringify({ error: "Invalid payment amount." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseUrl =
      environment === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com";

    const noteParts = [
      ...items.map((item) => `${item.quantity}x ${item.name}`),
      shipping.name ? `Ship to: ${shipping.name}` : null,
      shipping.line1,
      [shipping.city, shipping.state, shipping.postalCode].filter(Boolean).join(", ") ||
        null,
      shipping.email,
      shipping.phone,
    ].filter(Boolean);

    const response = await fetch(`${baseUrl}/v2/payments`, {
      method: "POST",
      headers: {
        "Square-Version": "2025-01-23",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotency_key: body.idempotencyKey || crypto.randomUUID(),
        source_id: sourceId,
        location_id: locationId,
        amount_money: {
          amount: amountCents,
          currency: "USD",
        },
        autocomplete: true,
        buyer_email_address: shipping.email || undefined,
        note: noteParts.join(" | ").slice(0, 500),
      }),
    });

    const payload = (await response.json()) as {
      payment?: { id?: string; status?: string; receipt_url?: string };
      errors?: Array<{ detail?: string; code?: string }>;
    };

    if (!response.ok || !payload.payment?.id) {
      const detail =
        payload.errors?.map((e) => e.detail || e.code).filter(Boolean).join("; ") ||
        `Payment failed (${response.status})`;
      return new Response(JSON.stringify({ error: detail }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        paymentId: payload.payment.id,
        status: payload.payment.status ?? "COMPLETED",
        receiptUrl: payload.payment.receipt_url ?? null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
