import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { ProductCard } from "@/components/ProductCard";
import {
  products,
  getAllCategories,
  SQUARE_SHOP_URL,
  CATEGORIES,
} from "@/lib/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const productsSearchSchema = z.object({
  category: z.string().optional(),
});

export const Route = createFileRoute("/products/")({
  validateSearch: productsSearchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Leavora African Market" },
      {
        name: "description",
        content:
          "Browse fresh produce, spices, grains, oils, frozen foods, and beverages at Leavora African Market.",
      },
      {
        property: "og:title",
        content: "Shop — Leavora African Market",
      },
      {
        property: "og:description",
        content:
          "Browse fresh produce, spices, grains, oils, frozen foods, and beverages at Leavora African Market.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { category } = Route.useSearch();
  const categories = getAllCategories();

  const filtered = useMemo(() => {
    if (!category || !CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
      return products;
    }
    return products.filter((p) => p.category === category);
  }, [category]);

  return (
    <div>
      <section className="relative overflow-hidden bg-espresso">
        <img
          src="/images/shop-hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/60 to-espresso/30" />
        <div className="relative z-10 container mx-auto px-4 py-16 md:px-6 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Shop</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-background md:text-5xl">
            The Full Market
          </h1>
          <p className="mt-4 max-w-xl text-background/75">
            Produce, spices, grains, oils, frozen foods, and specialty drinks — stocked for the
            diaspora kitchen.
          </p>
          <a href={SQUARE_SHOP_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
            <Button className="bg-primary text-espresso hover:bg-gold-deep hover:text-background">
              Order Online on Square
            </Button>
          </a>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          <Link
            to="/products"
            search={{}}
            className={cn(
              "shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider",
              !category
                ? "border-espresso bg-espresso text-background"
                : "border-border text-muted-foreground",
            )}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              to="/products"
              search={{ category: cat }}
              className={cn(
                "shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider",
                category === cat
                  ? "border-espresso bg-espresso text-background"
                  : "border-border text-muted-foreground",
              )}
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="hidden lg:block">
            <div className="sticky top-24 border border-border/60 bg-card p-6">
              <h2 className="font-display text-lg font-medium text-foreground">Departments</h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/products"
                    search={{}}
                    className={cn(
                      "text-sm transition-colors hover:text-foreground",
                      !category ? "font-semibold text-gold-deep" : "text-muted-foreground",
                    )}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link
                      to="/products"
                      search={{ category: cat }}
                      className={cn(
                        "text-sm transition-colors hover:text-foreground",
                        category === cat
                          ? "font-semibold text-gold-deep"
                          : "text-muted-foreground",
                      )}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <p className="mb-6 text-sm text-muted-foreground">
              Showing {filtered.length} product{filtered.length === 1 ? "" : "s"}
              {category ? ` in ${category}` : ""}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
