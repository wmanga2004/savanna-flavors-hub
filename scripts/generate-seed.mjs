import { readFileSync, writeFileSync } from "fs";

const src = readFileSync("src/lib/products.ts", "utf8");
const match = src.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find products array");
  process.exit(1);
}

const products = eval(
  match[1].replace(/PLACEHOLDER/g, JSON.stringify("/images/shop-hero.jpg")),
);

function esc(s) {
  return String(s).replace(/'/g, "''");
}

const values = products
  .map((p, i) => {
    const tags =
      "ARRAY[" + p.tags.map((t) => `'${esc(t)}'`).join(",") + "]::text[]";
    return `('${esc(p.slug)}', '${esc(p.name)}', '${esc(p.description)}', '${esc(p.longDescription)}', ${p.price}, '${esc(p.unit)}', '${esc(p.image)}', '${esc(p.category)}', ${tags}, ${p.inStock}, ${i + 1})`;
  })
  .join(",\n");

const sql = `insert into public.products (slug, name, description, long_description, price, unit, image, category, tags, in_stock, sort_order) values
${values}
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  long_description = excluded.long_description,
  price = excluded.price,
  unit = excluded.unit,
  image = excluded.image,
  category = excluded.category,
  tags = excluded.tags,
  in_stock = excluded.in_stock,
  sort_order = excluded.sort_order,
  updated_at = now();`;

writeFileSync("seed-products.sql", sql);
console.log(`Wrote seed for ${products.length} products`);
