import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
};

type ProductInput = {
  slug?: string;
  name?: string;
  description?: string;
  long_description?: string;
  price?: number;
  unit?: string;
  image?: string;
  category?: string;
  tags?: string[];
  in_stock?: boolean;
  sort_order?: number;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function verifyAdminToken(token: string | null, password: string) {
  if (!token || !token.includes(".")) return false;
  const [payload, signature] = token.split(".");
  try {
    const parsed = JSON.parse(atob(payload)) as { exp?: number };
    if (!parsed.exp || Date.now() > parsed.exp) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
    return expected === signature;
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!adminPassword || !supabaseUrl || !serviceKey) {
      return json({ error: "Admin API is not configured." }, 500);
    }

    const token = req.headers.get("x-admin-token");
    const ok = await verifyAdminToken(token, adminPassword);
    if (!ok) {
      return json({ error: "Unauthorized. Please sign in again." }, 401);
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (req.method === "GET") {
      if (id) {
        const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
        if (error) return json({ error: error.message }, 400);
        if (!data) return json({ error: "Product not found." }, 404);
        return json({ product: data });
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) return json({ error: error.message }, 400);
      return json({ products: data ?? [] });
    }

    if (req.method === "POST") {
      const body = (await req.json()) as ProductInput;
      if (!body.name || body.price == null) {
        return json({ error: "Name and price are required." }, 400);
      }

      const slug = body.slug?.trim() || slugify(body.name);
      const row = {
        slug,
        name: body.name.trim(),
        description: body.description?.trim() || "",
        long_description: body.long_description?.trim() || body.description?.trim() || "",
        price: Number(body.price),
        unit: body.unit?.trim() || "each",
        image: body.image?.trim() || "/images/shop-hero.jpg",
        category: body.category?.trim() || "Oils & Pantry",
        tags: body.tags ?? [],
        in_stock: body.in_stock ?? true,
        sort_order: body.sort_order ?? 999,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("products").insert(row).select("*").single();
      if (error) return json({ error: error.message }, 400);
      return json({ product: data }, 201);
    }

    if (req.method === "PUT") {
      if (!id) return json({ error: "Missing product id." }, 400);
      const body = (await req.json()) as ProductInput;

      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (body.slug != null) updates.slug = body.slug.trim();
      if (body.name != null) updates.name = body.name.trim();
      if (body.description != null) updates.description = body.description.trim();
      if (body.long_description != null) updates.long_description = body.long_description.trim();
      if (body.price != null) updates.price = Number(body.price);
      if (body.unit != null) updates.unit = body.unit.trim();
      if (body.image != null) updates.image = body.image.trim();
      if (body.category != null) updates.category = body.category.trim();
      if (body.tags != null) updates.tags = body.tags;
      if (body.in_stock != null) updates.in_stock = body.in_stock;
      if (body.sort_order != null) updates.sort_order = body.sort_order;

      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
      if (error) return json({ error: error.message }, 400);
      return json({ product: data });
    }

    if (req.method === "DELETE") {
      if (!id) return json({ error: "Missing product id." }, 400);
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return json({ error: message }, 500);
  }
});
