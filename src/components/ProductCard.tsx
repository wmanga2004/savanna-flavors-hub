import { Link } from "@tanstack/react-router";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";
import { formatPrice, type Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden border border-border/70 bg-card transition-shadow hover:shadow-md">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
          {product.category}
        </p>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="mt-1 font-display text-lg font-medium leading-tight text-foreground transition-colors hover:text-gold-deep"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <p className="mt-auto pt-4 font-display text-xl font-medium text-foreground">
          {formatPrice(product.price)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">/ {product.unit}</span>
        </p>
      </div>
      <div className="flex gap-2 p-4 pt-0">
        <Button
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              slug: product.slug,
              unit: product.unit,
            })
          }
          className="flex-1 gap-2"
          size="sm"
        >
          <ShoppingBag className="h-4 w-4" />
          Add
        </Button>
        {product.squareUrl && (
          <Button asChild variant="outline" size="sm" className="px-3">
            <a href={product.squareUrl} target="_blank" rel="noopener noreferrer" aria-label="Order on Square">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}
