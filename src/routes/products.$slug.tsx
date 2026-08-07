import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, MapPin, Package } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/components/cart-context";
import { fetchProductBySlug, fetchProducts, formatPrice } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const [product, allProducts] = await Promise.all([
      fetchProductBySlug(params.slug),
      fetchProducts(),
    ]);
    if (!product) {
      throw notFound();
    }
    return { product, allProducts };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Leavora African Market` },
          { name: "description", content: loaderData.product.description },
          {
            property: "og:title",
            content: `${loaderData.product.name} — Leavora African Market`,
          },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [
          { title: "Product — Leavora African Market" },
          {
            name: "description",
            content: "Shop authentic African groceries at Leavora African Market.",
          },
        ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product, allProducts } = Route.useLoaderData();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      unit: product.unit,
      quantity,
    });
    toast.success(`Added ${quantity} × ${product.name} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-6 text-sm text-muted-foreground">
        <Link to="/products" className="hover:text-foreground">
          Shop
        </Link>{" "}
        /{" "}
        <Link
          to="/products"
          search={{ category: product.category }}
          className="hover:text-foreground"
        >
          {product.category}
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="font-display text-3xl font-medium text-foreground md:text-4xl">
              {product.name}
            </h1>
          </div>

          <p className="font-display text-3xl font-medium text-foreground">
            {formatPrice(product.price)}
            <span className="ml-2 text-base font-normal text-muted-foreground">
              / {product.unit}
            </span>
          </p>

          <p className="leading-relaxed text-muted-foreground">{product.longDescription}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator />

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2rem] text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={handleAddToCart} className="flex-1 gap-2 sm:flex-none" size="lg">
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <div className="grid gap-4 border border-border/50 bg-card p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">In stock at OKC market</span>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Secure Square checkout</span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl font-medium text-foreground">
            More from {product.category}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
