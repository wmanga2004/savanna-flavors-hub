import { Link } from "@tanstack/react-router";
import { ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/components/cart-context";
import { formatPrice, type Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="group flex flex-col overflow-hidden border-border/50 bg-card transition-shadow hover:shadow-lg">
      <Link to="/products/$slug" params={{ slug: product.slug }} className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="font-display text-lg font-semibold leading-tight text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <p className="mt-auto pt-4 font-display text-xl font-semibold text-foreground">
          {formatPrice(product.price)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">/ {product.unit}</span>
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
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
          className="w-full gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
