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

type NotifyResult = { sent: boolean; reason?: string; to?: string };

function env(name: string) {
  const raw = Deno.env.get(name)?.trim();
  if (!raw) return "";
  return raw.replace(/^["']|["']$/g, "").trim();
}

function dollarsToCents(amount: number) {
  return Math.round(amount * 100);
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Normalize US-ish numbers to E.164 (+1…). */
function toE164(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+") && cleaned.length >= 11) return cleaned;
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return cleaned.startsWith("+") ? cleaned : digits ? `+${digits}` : "";
}

function buildOrderSummary(
  items: CheckoutItem[],
  shipping: Shipping,
  amountCents: number,
) {
  return {
    sms: `Leavora order ${formatMoney(amountCents)}: ${items
      .map((i) => `${i.quantity}x ${i.name}`)
      .join(", ")}. ${shipping.name || "Customer"} ${shipping.phone || ""} ${shipping.email || ""}`
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 320),
  };
}

async function notifySellerSms(body: string): Promise<NotifyResult> {
  const sid = env("TWILIO_ACCOUNT_SID");
  const token = env("TWILIO_AUTH_TOKEN");
  const fromRaw = env("TWILIO_FROM_NUMBER");
  const toRaw = env("SELLER_PHONE") || "+14054762965";
  const from = toE164(fromRaw);
  const to = toE164(toRaw);

  if (!sid || !token || !from) {
    console.warn("Twilio not fully configured — skipping seller SMS.", {
      hasSid: Boolean(sid),
      hasToken: Boolean(token),
      hasFrom: Boolean(from),
    });
    return { sent: false, reason: "missing_twilio", to };
  }

  if (!to) {
    return { sent: false, reason: "invalid_seller_phone", to: toRaw };
  }

  const auth = btoa(`${sid}:${token}`);

  async function send(messageBody: string) {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: messageBody }),
      },
    );
    if (!response.ok) {
      const detail = await response.text();
      return { sent: false as const, reason: detail.slice(0, 300), to };
    }
    return { sent: true as const, to };
  }

  // Full accounts: send the real order text.
  // Trial accounts: Twilio only allows predefined templates (e.g. sms_order_confirmation).
  const preferred = env("TWILIO_SMS_TEMPLATE") || body;
  let result = await send(preferred);
  if (!result.sent && /572006|predefined SMS templates/i.test(result.reason || "")) {
    console.warn("Twilio trial blocked custom SMS — retrying with sms_order_confirmation");
    result = await send("sms_order_confirmation");
  }

  if (!result.sent) {
    console.error("Seller SMS failed:", result.reason);
    return result;
  }

  console.log("Seller SMS sent to", to);
  return result;
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

    const accessToken = env("SQUARE_ACCESS_TOKEN");
    const locationId = env("SQUARE_LOCATION_ID");
    const environment = env("SQUARE_ENVIRONMENT") || "sandbox";

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

    const paymentId = payload.payment.id;
    const summary = buildOrderSummary(items, shipping, amountCents);

    // Never fail the sale if SMS notify fails
    const smsResult = await notifySellerSms(summary.sms).catch((err) => ({
      sent: false,
      reason: err instanceof Error ? err.message : "sms_error",
    }));

    console.log("sellerNotify", JSON.stringify({ sms: smsResult }));

    return new Response(
      JSON.stringify({
        paymentId,
        status: payload.payment.status ?? "COMPLETED",
        receiptUrl: payload.payment.receipt_url ?? null,
        sellerNotify: {
          sms: smsResult,
        },
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
