import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type CheckoutItem = {
  name: string;
  quantity: number;
  price: number;
  productId?: string;
};

export type CheckoutShipping = {
  name: string;
  email: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
};

export async function processCardPayment(input: {
  sourceId: string;
  items: CheckoutItem[];
  shipping: CheckoutShipping;
  idempotencyKey: string;
}) {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.functions.invoke("create-payment", {
    body: {
      sourceId: input.sourceId,
      idempotencyKey: input.idempotencyKey,
      items: input.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping: input.shipping,
    },
  });

  if (error) {
    throw new Error(error.message || "Payment failed.");
  }

  const payload = data as
    | {
        paymentId?: string;
        status?: string;
        receiptUrl?: string | null;
        error?: string;
        sellerNotify?: {
          email?: { sent?: boolean; reason?: string; to?: string };
          sms?: { sent?: boolean; reason?: string; to?: string };
        };
      }
    | null;

  if (!payload?.paymentId) {
    throw new Error(payload?.error || "Payment failed.");
  }

  return payload;
}
