import type { Product } from "@/lib/products";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialCards from "@/components/ui/card-fan-carousel";
import { ProductCard } from "@/components/ProductCard";
import { HeroSection } from "@/components/ui/hero-section-5";
import { fetchProducts, CATEGORIES } from "@/lib/products";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const products = await fetchProducts();
      const featuredProducts = products.filter((p) =>
        ["egusi-seeds", "ola-ola-pounded-yam-10lb", "njangsang", "malta"].includes(p.slug),
      );
      return { products, featuredProducts };
    } catch (error) {
      console.error("Home loader failed:", error);
      return { products: [], featuredProducts: [] };
    }
  },
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

const galleryCards = [
  {
    imgUrl: "/images/products/egusi.jpg",
    alt: "Egusi seeds",
    linkUrl: "/products/egusi-seeds",
  },
  {
    imgUrl: "/images/products/malta.jpg",
    alt: "Malta Guinness",
    linkUrl: "/products/malta",
  },
  {
    imgUrl: "/images/products/njansang.jpg",
    alt: "Njangsang",
    linkUrl: "/products/njangsang",
  },
  {
    imgUrl: "/images/products/pounded-yam-10lb.jpg",
    alt: "Ola Ola pounded yam",
    linkUrl: "/products/ola-ola-pounded-yam-10lb",
  },
  {
    imgUrl: "/images/products/african-plum.jpg",
    alt: "African plum",
    linkUrl: "/products/african-plum",
  },
  {
    imgUrl: "/images/products/crayfish.jpg",
    alt: "Dried crayfish",
    linkUrl: "/products/crayfish",
  },
  {
    imgUrl: "/images/products/palm-soup-base.jpg",
    alt: "Palm soup base",
    linkUrl: "/products/palm-soup-base",
  },
  {
    imgUrl: "/images/products/plantain-fufu.jpg",
    alt: "Plantain fufu mix",
    linkUrl: "/products/plantain-fufu",
  },
  {
    imgUrl: "/images/products/yam.jpg",
    alt: "Fresh yam",
    linkUrl: "/products/fresh-yam",
  },
  {
    imgUrl: "/images/intro-feast.jpg",
    alt: "Shared feast at Leavora",
    linkUrl: "/about",
  },
];

const departmentBlurb: Record<string, string> = {
  "Fresh Produce": "Fresh yam, okongobong, bitterleaf, eru, African plum, and boiled corn.",
  "Spices & Seasonings": "Njangsang, maggi, suya spice, dry pepper, and soup spices.",
  "Flours & Staples": "Pounded yam, plantain fufu, garri, bobolo, egusi, beans, and peanuts.",
  "Fish & Meat": "Crayfish, dry fish, smoked fish, fresh mackerel, snails, and cow skin.",
  "Oils & Condiments": "Palm oil, Carotino, Banga, De Rica, Mambo, and palm soup base.",
  "Drinks & Dairy": "Malta, Peak milk, Nido, Ovaltine, Vita Malt, Tartina, and Cerelac.",
};

function HomePage() {
  const { featuredProducts } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Gallery fan */}
      <section className="overflow-hidden bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-medium text-foreground md:text-4xl">
            Inside Leavora
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            <span className="hidden md:inline">Hover a card to fan it open.</span>
            <span className="md:hidden">Swipe the cards or use the arrows.</span>
          </p>
        </div>
        <SocialCards cards={galleryCards} />
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
          {featuredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
