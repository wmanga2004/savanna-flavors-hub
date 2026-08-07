import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Visit Us — Leavora African Market" },
      {
        name: "description",
        content:
          "Visit Leavora African Market at 16405 Drywater Dr, Oklahoma City. Hours, phone, and our story.",
      },
      {
        property: "og:title",
        content: "Visit Us — Leavora African Market",
      },
      {
        property: "og:description",
        content:
          "Hospitality that feels like home. Visit our Oklahoma City African grocery and community market.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-[50vh] overflow-hidden bg-espresso">
        <img
          src="/images/intro-feast.jpg"
          alt="Shared table of African dishes at Leavora"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-transparent" />
        <div className="relative z-10 flex min-h-[50vh] flex-col justify-end px-4 pb-12 md:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Our Story</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium text-background md:text-5xl">
            Hospitality that feels like home
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Leavora was founded to close the distance between the diaspora and the ingredients of
            home. What started as a single shelf of hard-to-find staples has grown into a full market
            — one built on trust, quality, and community.
          </p>
          <p>
            Every detail, from our name to the dove on our sign, points back to the same idea: peace,
            abundance, and a place to belong.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-8 sm:grid-cols-3">
          <div className="border-t border-primary pt-4">
            <p className="font-display text-4xl font-medium text-foreground">250+</p>
            <p className="mt-1 text-sm text-muted-foreground">Authentic Products</p>
          </div>
          <div className="border-t border-primary pt-4">
            <p className="font-display text-4xl font-medium text-foreground">15+</p>
            <p className="mt-1 text-sm text-muted-foreground">Countries Represented</p>
          </div>
          <div className="border-t border-primary pt-4">
            <p className="font-display text-4xl font-medium text-foreground">1</p>
            <p className="mt-1 text-sm text-muted-foreground">Community, Always</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container mx-auto grid gap-10 px-4 md:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">Visit</p>
            <h2 className="mt-3 font-display text-3xl font-medium text-foreground">
              Come see us in Oklahoma City
            </h2>
            <div className="mt-8 space-y-5 text-muted-foreground">
              <p>
                <strong className="text-foreground">Address</strong>
                <br />
                16405 Drywater Dr
                <br />
                Oklahoma City, OK 73170
              </p>
              <p>
                <strong className="text-foreground">Hours</strong>
                <br />
                Mon – Sat: 9:00 AM – 8:00 PM
                <br />
                Sunday: 10:00 AM – 6:00 PM
              </p>
              <p>
                <strong className="text-foreground">Phone</strong>
                <br />
                <a href="tel:+14054762965" className="hover:text-foreground">
                  (405) 476-2965
                </a>
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg">Shop the Market</Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline">
                  Browse Shop
                </Button>
              </Link>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src="/images/shop-hero.jpg"
              alt="Inside Leavora African Market"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
