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
    const siteUrl =
      Deno.env.get("SITE_URL") ?? "https://savanna-flavors-hub.lovable.app";

    if (!accessToken || !locationId) {
      return new Response(
        JSON.stringify({
          error: "Square is not configured on the server.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = (await req.json()) as { items?: CheckoutItem[] };
    const items = body.items ?? [];

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

    const baseUrl =
      environment === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com";

    const lineItems = items.map((item) => ({
      name: item.name,
      quantity: String(item.quantity),
      base_price_money: {
        amount: dollarsToCents(item.price),
        currency: "USD",
      },
    }));

    const response = await fetch(`${baseUrl}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: {
        "Square-Version": "2025-01-23",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        order: {
          location_id: locationId,
          line_items: lineItems,
        },
        checkout_options: {
          redirect_url: `${siteUrl.replace(/\/$/, "")}/checkout/success`,
          ask_for_shipping_address: true,
        },
      }),
    });

    const payload = (await response.json()) as {
      payment_link?: { id?: string; url?: string; order_id?: string };
      errors?: Array<{ detail?: string; code?: string }>;
    };

    if (!response.ok || !payload.payment_link?.url) {
      const detail =
        payload.errors?.map((e) => e.detail || e.code).filter(Boolean).join("; ") ||
        `Square checkout failed (${response.status})`;
      return new Response(JSON.stringify({ error: detail }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        checkoutUrl: payload.payment_link.url,
        paymentLinkId: payload.payment_link.id ?? null,
        orderId: payload.payment_link.order_id ?? null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
