import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const checkoutItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  productId: z.string().optional(),
});

const checkoutInputSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
});

function dollarsToCents(amount: number) {
  return Math.round(amount * 100);
}

export const createSquareCheckout = createServerFn({ method: "POST" })
  .validator((data: unknown) => checkoutInputSchema.parse(data))
  .handler(async ({ data }) => {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;
    const environment = process.env.SQUARE_ENVIRONMENT ?? "production";
    const siteUrl =
      process.env.SITE_URL ??
      process.env.VITE_SITE_URL ??
      "https://savanna-flavors-hub.lovable.app";

    if (!accessToken) {
      throw new Error("Square is not configured (missing SQUARE_ACCESS_TOKEN).");
    }
    if (!locationId) {
      throw new Error(
        "Square is not configured (missing SQUARE_LOCATION_ID). Find it in Square Developer → Locations.",
      );
    }

    const baseUrl =
      environment === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com";

    const lineItems = data.items.map((item) => ({
      name: item.name,
      quantity: String(item.quantity),
      base_price_money: {
        amount: dollarsToCents(item.price),
        currency: "USD",
      },
    }));

    const subtotalCents = data.items.reduce(
      (sum, item) => sum + dollarsToCents(item.price) * item.quantity,
      0,
    );

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
        pre_populated_data: {},
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
      throw new Error(detail);
    }

    return {
      checkoutUrl: payload.payment_link.url,
      paymentLinkId: payload.payment_link.id ?? null,
      orderId: payload.payment_link.order_id ?? null,
      subtotalCents,
    };
  });
