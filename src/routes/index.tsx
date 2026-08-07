import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products, SQUARE_SHOP_URL, CATEGORIES } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leavora African Market | Authentic Groceries & Community Market" },
      {
        name: "description",
        content:
          "Leavora African Market — authentic African groceries, spices, produce and prepared foods in Oklahoma City.",
      },
      {
        property: "og:title",
        content: "Leavora African Market | Authentic Groceries & Community Market",
      },
      {
        property: "og:description",
        content:
          "Fresh produce, staple grains, spices, and the flavors of home — gathered from the motherland and shared across every aisle.",
      },
    ],
  }),
  component: HomePage,
});

const featuredProducts = products.filter((p) =>
  ["egusi-seeds", "ola-ola-pounded-yam-10lb", "njangsang", "malta"].includes(p.slug),
);

const departmentBlurb: Record<string, string> = {
  "Fresh Produce": "Fresh yam, okongobong, African plum, and boiled corn.",
  "Spices & Seasonings": "Njangsang, egusi, crayfish, mambo, and maggi.",
  "Grains & Pounded Yam": "Ola Ola pounded yam, plantain fufu, and garri.",
  "Prepared & Frozen": "Bitter leaves, eru, dry fish, and snails.",
  "Oils & Pantry": "Carotino, Praise palm oil, and pantry staples.",
  "Beverages & Specialty": "Peak milk, Ovaltine, Nido, Tartina, and Malta.",
};

function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Full-bleed hero */}
      <section className="relative min-h-[88vh] w-full overflow-hidden bg-espresso">
        <img
          src="/images/hero.jpg"
          alt="Shelves stocked with African market staples: oils, spices, gari, egusi, fresh produce, and plantains"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/25" />
        <div className="relative z-10 flex min-h-[88vh] flex-col justify-end px-4 pb-16 pt-28 md:px-10 md:pb-20 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary animate-in fade-in duration-700">
            Authentic African Grocery & Market
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.05] text-background md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Rooted in Heritage.
            <br />
            Grown for Community.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-background/80 md:text-lg animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-150">
            Fresh produce, staple grains, spices, and the flavors of home — gathered from the
            motherland and shared across every aisle.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-in fade-in duration-1000 delay-300">
            <Link to="/products">
              <Button
                size="lg"
                className="gap-2 bg-background text-foreground hover:bg-background/90"
              >
                Explore the Market <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href={SQUARE_SHOP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 bg-primary text-espresso hover:bg-gold-deep hover:text-background">
                Order Online <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src="/images/intro-feast.jpg"
              alt="A shared table of jollof rice, grilled fish, fufu, plantains, and stews"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">
              Home, In Every Aisle
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium text-foreground md:text-4xl">
              Leavora, where community gathers
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Leavora African Market was built on a simple idea: that a grocery run should feel like
              coming home. Every shelf carries the staples of the diaspora — the grains, spices, and
              produce that turn a house into a home-cooked meal.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We source with care, keep our prices honest, and greet every customer like family. This
              isn&apos;t just where the community shops. It&apos;s where it gathers.
            </p>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-espresso py-16 text-background md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">What We Offer</p>
          <h2 className="mt-3 font-display text-3xl font-medium uppercase tracking-wide md:text-4xl">
            Flavors that carry home
          </h2>
          <p className="mt-4 max-w-2xl text-background/70">
            From market staples to hard-to-find imports, every department is stocked with the
            ingredients that make a dish taste like it should.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, i) => (
              <Link
                key={category}
                to="/products"
                search={{ category }}
                className="group border border-background/15 p-6 transition-colors hover:border-primary hover:bg-background/5"
              >
                <span className="font-display text-sm text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-medium">{category}</h3>
                <p className="mt-2 text-sm text-background/65">{departmentBlurb[category]}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/products">
              <Button
                size="lg"
                className="gap-2 bg-background text-foreground hover:bg-background/90"
              >
                View Full Shop <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">
              From the Shelves
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium text-foreground md:text-4xl">
              Customer Favorites
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-1 text-sm font-semibold text-gold-deep hover:underline md:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Mission break */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <img
          src="/images/products/crayfish.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-espresso/80" />
        <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            More Than a Market
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-medium uppercase tracking-wide text-background md:text-5xl">
            Where the community gathers
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-background/75">
            Like the dove and the olive branch on our sign, Leavora stands for peace, abundance, and
            homecoming.
          </p>
          <div className="mt-8">
            <Link to="/about">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                Visit Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
