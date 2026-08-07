import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products, getAllCategories } from "@/lib/products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Shop African Food & Ingredients — AfriBites" },
      {
        name: "description",
        content:
          "Browse our collection of African meal kits, spices, snacks, and fresh ingredients.",
      },
      {
        property: "og:title",
        content: "Shop African Food & Ingredients — AfriBites",
      },
      {
        property: "og:description",
        content:
          "Browse our collection of African meal kits, spices, snacks, and fresh ingredients.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const categories = getAllCategories();

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
          Shop African Flavors
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Meal kits, spices, snacks, and staples sourced from across the continent.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border/50 bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Categories</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#all"
                  className="text-sm font-medium text-primary"
                >
                  All Products
                </a>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <span className="text-sm text-muted-foreground">{category}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
