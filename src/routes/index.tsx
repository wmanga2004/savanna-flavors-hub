import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChefHat, Leaf, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AfriBites — Authentic African Food & Ingredients" },
      {
        name: "description",
        content:
          "Discover meal kits, spices, snacks, and ingredients from across Africa. Delivered fresh to your door.",
      },
      {
        property: "og:title",
        content: "AfriBites — Authentic African Food & Ingredients",
      },
      {
        property: "og:description",
        content:
          "Discover meal kits, spices, snacks, and ingredients from across Africa. Delivered fresh to your door.",
      },
    ],
  }),
  component: HomePage,
});

const featuredProducts = products.slice(0, 4);

function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-6">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Now shipping nationwide
              </span>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Taste Africa, <span className="text-primary">delivered home</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                Meal kits, spices, and snacks from across the continent — made simple for your
                kitchen. Cook jollof, egusi, suya, and more with authentic ingredients.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className="gap-2">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline">
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <img
                  src="/images/hero.jpg"
                  alt="Vibrant spread of authentic African dishes"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-card p-4 shadow-lg md:block">
                <p className="font-display text-2xl font-bold text-primary">4.9</p>
                <p className="text-sm text-muted-foreground">Average rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <ChefHat className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Curated Meal Kits</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pre-measured ingredients and step-by-step guides for iconic African dishes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-secondary/20 p-3 text-secondary-foreground">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Authentic Sourcing</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We partner with trusted suppliers to bring you genuine spices and staples.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-accent/20 p-3 text-accent-foreground">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Nationwide Delivery</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Fresh, carefully packed, and shipped straight to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Customer Favorites
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our most-loved African meal kits and ingredients.
            </p>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 flex justify-center md:hidden">
          <Link to="/products">
            <Button variant="outline">View all products</Button>
          </Link>
        </div>
      </section>

      {/* Story teaser */}
      <section className="bg-sage/10 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src="/images/plantains.jpg"
                alt="Fresh ripe plantains"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                From our kitchen to yours
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                AfriBites was born from a simple idea: everyone should be able to enjoy the rich,
                diverse flavors of Africa at home. We source the hardest-to-find ingredients and
                package them into easy-to-follow kits.
              </p>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-fit gap-2">
                  Read our story <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
