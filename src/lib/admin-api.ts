import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/products";

const TOKEN_KEY = "leavora_admin_token";
const EXPIRES_KEY = "leavora_admin_expires";

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price: number | string;
  unit: string;
  image: string;
  category: string;
  tags: string[] | null;
  in_stock: boolean;
  sort_order: number;
};

export type AdminProductInput = {
  slug?: string;
  name: string;
  description?: string;
  long_description?: string;
  price: number;
  unit?: string;
  image?: string;
  category?: string;
  tags?: string[];
  in_stock?: boolean;
  sort_order?: number;
};

export { CATEGORIES as ADMIN_CATEGORIES };

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const expires = Number(localStorage.getItem(EXPIRES_KEY) || 0);
  if (!token || !expires || Date.now() > expires) {
    clearAdminSession();
    return null;
  }
  return token;
}

export function setAdminSession(token: string, expiresAt: number) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_KEY, String(expiresAt));
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

async function invokeAdmin<T>(
  name: "admin-auth" | "admin-products",
  options: {
    method?: string;
    body?: unknown;
    query?: Record<string, string>;
    authed?: boolean;
  } = {},
): Promise<T> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const headers: Record<string, string> = {};
  if (options.authed !== false && name === "admin-products") {
    const token = getAdminToken();
    if (!token) throw new Error("Please sign in.");
    headers["x-admin-token"] = token;
  }

  // supabase-js invoke is POST-only; use fetch for full REST methods
  const url = new URL(
    `${import.meta.env['VITE_SUPABASE_URL']}/functions/v1/${name}`,
  );
  if (options.query) {
    Object.entries(options.query).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const anon = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string;
  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: options.method || "POST",
      headers: {
        Authorization: `Bearer ${anon}`,
        apikey: anon,
        "Content-Type": "application/json",
        ...headers,
      },
      ...(options.body != null ? { body: JSON.stringify(options.body) } : {}),
    });
  } catch {
    throw new Error("Could not reach the admin API. Check your connection and try again.");
  }

  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  return payload;
}

export async function adminLogin(password: string) {
  const result = await invokeAdmin<{ token: string; expiresAt: number }>("admin-auth", {
    method: "POST",
    body: { password },
    authed: false,
  });
  setAdminSession(result.token, result.expiresAt);
  return result;
}

export async function listAdminProducts() {
  const result = await invokeAdmin<{ products: AdminProduct[] }>("admin-products", {
    method: "GET",
  });
  return result.products;
}

export async function getAdminProduct(id: string) {
  const result = await invokeAdmin<{ product: AdminProduct }>("admin-products", {
    method: "GET",
    query: { id },
  });
  return result.product;
}

export async function createAdminProduct(input: AdminProductInput) {
  const result = await invokeAdmin<{ product: AdminProduct }>("admin-products", {
    method: "POST",
    body: input,
  });
  return result.product;
}

export async function updateAdminProduct(id: string, input: Partial<AdminProductInput>) {
  const result = await invokeAdmin<{ product: AdminProduct }>("admin-products", {
    method: "PUT",
    query: { id },
    body: input,
  });
  return result.product;
}

export async function deleteAdminProduct(id: string) {
  await invokeAdmin<{ ok: boolean }>("admin-products", {
    method: "DELETE",
    query: { id },
  });
}
