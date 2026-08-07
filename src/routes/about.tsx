import { createFileRoute } from "@tanstack/react-router";
import { Heart, Globe, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AfriBites — Our Story" },
      {
        name: "description",
        content:
          "Learn how AfriBites brings authentic African ingredients and meal kits to kitchens across the country.",
      },
      {
        property: "og:title",
        content: "About AfriBites — Our Story",
      },
      {
        property: "og:description",
        content:
          "Learn how AfriBites brings authentic African ingredients and meal kits to kitchens across the country.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Our Story
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            AfriBites was created to share the richness of African cuisine with everyone. From the
            smoky jollof rice of Nigeria to the fragrant tagines of North Africa, our continent's
            food is as diverse as its people — and we believe it deserves a place at every table.
          </p>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl bg-card p-8 text-center shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">Made with love</h3>
              <p className="mt-2 text-muted-foreground">
                Every kit is curated by people who grew up cooking these dishes. We don't cut
                corners on flavor.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-card p-8 text-center shadow-sm">
              <div className="rounded-full bg-secondary/20 p-3 text-secondary-foreground">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">Sourced responsibly</h3>
              <p className="mt-2 text-muted-foreground">
                We work directly with importers and producers to ensure authenticity, freshness, and
                fair practices.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-card p-8 text-center shadow-sm">
              <div className="rounded-full bg-accent/20 p-3 text-accent-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">Built for community</h3>
              <p className="mt-2 text-muted-foreground">
                Food brings people together. Our recipes are designed to be shared with family and
                friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <img
              src="/images/hero.jpg"
              alt="African food spread"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Why African food?
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                African cuisine is built on bold spices, fresh produce, centuries-old techniques, and
                a deep sense of hospitality. Every region has its own signature dishes, from the
                pepper soups of West Africa to the injera and stews of the Horn.
              </p>
              <p>
                Yet too often, these ingredients are hard to find in one place. AfriBites exists to
                change that — by putting everything you need in one box, with clear instructions that
                honor tradition while fitting modern life.
              </p>
              <p>
                Whether you're reconnecting with heritage or exploring something new, we're here to
                make every meal memorable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
