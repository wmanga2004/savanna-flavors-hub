import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type CheckoutItem = {
  name: string;
  quantity: number;
  price: number;
  productId?: string;
};

export async function createCheckoutSession(items: CheckoutItem[]) {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: {
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  });

  if (error) {
    throw new Error(error.message || "Checkout failed.");
  }

  const payload = data as { checkoutUrl?: string; error?: string } | null;
  if (!payload?.checkoutUrl) {
    throw new Error(payload?.error || "Checkout failed.");
  }

  return payload;
}
