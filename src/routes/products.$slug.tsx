import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Star, Truck, ChefHat, Package } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/components/cart-context";
import { products, getProductBySlug, formatPrice } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) {
      throw notFound();
    }
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — AfriBites` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — AfriBites` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [
          { title: "Product — AfriBites" },
          { name: "description", content: "Shop authentic African food and ingredients." },
        ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = products
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
    toast.success(`Added ${quantity} ${product.unit}${quantity > 1 ? "s" : ""} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-6 text-sm text-muted-foreground">
        <Link to="/products" className="hover:text-foreground">
          Shop
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
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
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium text-foreground">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <p className="font-display text-3xl font-semibold text-foreground">
            {formatPrice(product.price)}
            <span className="ml-2 text-base font-normal text-muted-foreground">/ {product.unit}</span>
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

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-md border border-border">
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
            <Button onClick={handleAddToCart} className="flex-1 gap-2" size="lg">
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <div className="grid gap-4 rounded-xl border border-border/50 bg-card p-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Nationwide shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Fresh packaging</span>
            </div>
            <div className="flex items-center gap-3">
              <ChefHat className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Easy recipes included</span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl font-bold text-foreground">
            You may also like
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
