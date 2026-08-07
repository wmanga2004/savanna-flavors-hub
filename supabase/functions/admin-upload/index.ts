import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!adminPassword || !supabaseUrl || !serviceKey) {
      return json({ error: "Upload API is not configured." }, 500);
    }

    const token = req.headers.get("x-admin-token");
    const ok = await verifyAdminToken(token, adminPassword);
    if (!ok) {
      return json({ error: "Unauthorized. Please sign in again." }, 401);
    }

    const body = (await req.json()) as {
      fileName?: string;
      contentType?: string;
      dataBase64?: string;
    };

    const contentType = body.contentType?.trim() || "";
    const dataBase64 = body.dataBase64?.trim() || "";
    if (!ALLOWED_TYPES.has(contentType) || !dataBase64) {
      return json(
        { error: "Upload a JPG, PNG, WebP, or GIF under 5MB." },
        400,
      );
    }

    const binary = Uint8Array.from(atob(dataBase64), (c) => c.charCodeAt(0));
    if (binary.byteLength > 5 * 1024 * 1024) {
      return json({ error: "Image must be 5MB or smaller." }, 400);
    }

    const safeBase = (body.fileName || "product")
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "product";
    const path = `${safeBase}-${crypto.randomUUID().slice(0, 8)}.${extensionFor(contentType)}`;

    const supabase = createClient(supabaseUrl, serviceKey);
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, binary, {
        contentType,
        upsert: false,
      });

    if (error) {
      return json({ error: error.message }, 400);
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return json({ url: data.publicUrl, path });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return json({ error: message }, 500);
  }
});
