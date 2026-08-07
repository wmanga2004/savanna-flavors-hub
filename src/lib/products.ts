import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  tags: string[];
  inStock: boolean;
}

export const CATEGORIES = [
  "Fresh Produce",
  "Spices & Seasonings",
  "Flours & Staples",
  "Fish & Meat",
  "Oils & Condiments",
  "Drinks & Dairy",
] as const;

export type Category = (typeof CATEGORIES)[number];

type ProductRow = {
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
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    price: typeof row.price === "string" ? Number(row.price) : row.price,
    unit: row.unit,
    image: row.image,
    category: row.category,
    tags: row.tags ?? [],
    inStock: row.in_stock,
  };
}

/** Static fallback if Supabase is unreachable during local/offline work. */
export const fallbackProducts: Product[] = [
  {
    id: "fallback-egusi",
    slug: "egusi-seeds",
    name: "Egusi Seeds",
    description: "For traditional egusi soup, 100g pack.",
    longDescription:
      "Ground melon seeds for rich, nutty egusi soup. 100g pack — the heart of a classic West African pot.",
    price: 8.99,
    unit: "100g",
    image: "/images/products/egusi.jpg",
    category: "Flours & Staples",
    tags: ["Staple", "Soup"],
    inStock: true,
  },
  {
    id: "fallback-yam",
    slug: "ola-ola-pounded-yam-10lb",
    name: "Ola Ola Pounded Yam 10 lb",
    description: "Smooth, ready in minutes.",
    longDescription:
      "Ola Ola pounded yam flour, 10 lb — smooth, stretchy swallow ready in minutes with hot water.",
    price: 14.99,
    unit: "10 lb",
    image: "/images/products/pounded-yam-10lb.jpg",
    category: "Flours & Staples",
    tags: ["Staple", "Swallow"],
    inStock: true,
  },
  {
    id: "fallback-malta",
    slug: "malta",
    name: "Malta",
    description: "Non-alcoholic, chilled.",
    longDescription: "Malta Guinness — non-alcoholic malt drink, chilled and ready.",
    price: 2.49,
    unit: "bottle",
    image: "/images/products/malta.jpg",
    category: "Drinks & Dairy",
    tags: ["Drink", "Malt"],
    inStock: true,
  },
  {
    id: "fallback-njansang",
    slug: "njangsang",
    name: "Njangsang",
    description: "A soup-thickening staple, 100g pack.",
    longDescription:
      "Njangsang seeds — a Cameroonian soup thickener with a deep, nutty aroma. 100g pack.",
    price: 7.99,
    unit: "100g",
    image: "/images/products/njansang.jpg",
    category: "Spices & Seasonings",
    tags: ["Spice", "Cameroon"],
    inStock: true,
  },
];

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase || !isSupabaseConfigured) {
    return fallbackProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, long_description, price, unit, image, category, tags, in_stock",
    )
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    console.error("Failed to load products from Supabase:", error?.message);
    return fallbackProducts;
  }

  return data.map((row) => mapRow(row as ProductRow));
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  if (!supabase || !isSupabaseConfigured) {
    return fallbackProducts.find((p) => p.slug === slug);
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, long_description, price, unit, image, category, tags, in_stock",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return fallbackProducts.find((p) => p.slug === slug);
  }

  return mapRow(data as ProductRow);
}

export function getAllCategories(productList: Product[] = []): string[] {
  const fromProducts = Array.from(new Set(productList.map((p) => p.category)));
  return fromProducts.length ? fromProducts : [...CATEGORIES];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
