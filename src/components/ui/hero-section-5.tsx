"use client";

import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const aisleMarks = [
  { label: "Fresh Produce", hint: "Yam · Plum · Corn" },
  { label: "Egusi & Seeds", hint: "Soup bases" },
  { label: "Palm Oils", hint: "Carotino · Praise" },
  { label: "Pounded Yam", hint: "Ola Ola · Fufu" },
  { label: "Spices", hint: "Njangsang · Maggi" },
  { label: "Dried Fish", hint: "Crayfish · Stockfish" },
  { label: "Beverages", hint: "Malta · Peak" },
  { label: "Pantry", hint: "Garri · Semolina" },
];

/**
 * Leavora market hero — Tailark hero-section-5 structure,
 * rethemed around the main aisle photograph.
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    if (!section || !image || !content) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const eyebrow = content.querySelector("[data-hero='eyebrow']");
      const title = content.querySelector("[data-hero='title']");
      const body = content.querySelector("[data-hero='body']");
      const actions = content.querySelector("[data-hero='actions']");
      const scrollCue = content.querySelector("[data-hero='scroll']");

      if (reduceMotion) {
        gsap.set([image, eyebrow, title, body, actions, scrollCue], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      gsap.set(image, { scale: 1.18, xPercent: -3, transformOrigin: "42% 48%" });
      gsap.set([eyebrow, title, body, actions], { opacity: 0, y: 36 });
      gsap.set(scrollCue, { opacity: 0 });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro.to(
        image,
        { scale: 1.06, xPercent: 0, duration: 3.2, ease: "power2.out" },
        0,
      );
      intro.to(eyebrow, { opacity: 1, y: 0, duration: 1 }, 0.45);
      intro.to(title, { opacity: 1, y: 0, duration: 1.15 }, 0.65);
      intro.to(body, { opacity: 1, y: 0, duration: 0.95 }, 0.95);
      intro.to(actions, { opacity: 1, y: 0, duration: 0.85 }, 1.15);
      intro.to(scrollCue, { opacity: 0.75, duration: 0.7 }, 1.55);

      gsap.to(image, {
        scale: 1.12,
        xPercent: 1.5,
        duration: 20,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 3,
      });

      gsap.to(scrollCue, {
        y: 6,
        duration: 1.35,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <main className="overflow-x-hidden">
      <section
        ref={sectionRef}
        className="relative min-h-[92vh] w-full overflow-hidden bg-espresso"
      >
        {/* Full-bleed market aisle — the main picture */}
        <img
          ref={imageRef}
          src="/images/hero.jpg"
          alt="Shelves stocked with African market staples: palm oils, gari, egusi, plantains, and fresh produce"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />

        {/* Warm shelf wash + read gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 75% at 32% 42%, rgba(184,137,47,0.38) 0%, transparent 62%)",
            mixBlendMode: "soft-light",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/55 to-espresso/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />

        <div
          ref={contentRef}
          className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 lg:justify-center lg:px-12 lg:pb-24 lg:pt-32"
        >
          <div className="max-w-2xl lg:max-w-3xl">
            <p
              data-hero="eyebrow"
              className="text-xs font-semibold uppercase tracking-[0.28em] text-primary md:text-sm"
            >
              Authentic African Grocery & Market
            </p>

            <h1
              data-hero="title"
              className="mt-6 font-display text-balance text-4xl font-medium leading-[1.05] text-background md:text-6xl xl:text-7xl"
            >
              Rooted in Heritage.
              <br />
              Grown for Community.
            </h1>

            <p
              data-hero="body"
              className="mt-6 max-w-xl text-balance text-base leading-relaxed text-background/80 md:text-lg"
            >
              Fresh produce, staple grains, spices, and the flavors of home — gathered from the
              motherland and shared across every aisle.
            </p>

            <div
              data-hero="actions"
              className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                className="h-12 rounded-md bg-primary px-6 text-base text-espresso hover:bg-gold-deep hover:text-background"
              >
                <Link to="/products">
                  <span className="text-nowrap">Shop the Market</span>
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-12 rounded-md bg-background px-6 text-base text-foreground hover:bg-background/90"
              >
                <Link to="/about">
                  <span className="text-nowrap">Visit Us</span>
                </Link>
              </Button>
            </div>
          </div>

          <div
            data-hero="scroll"
            className="mt-14 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-background/55 lg:mt-20"
          >
            <span className="inline-block h-10 w-px bg-background/45" />
            Scroll
          </div>
        </div>
      </section>

      {/* Aisle marquee — market twin of the template logo strip */}
      <section className="border-t border-border/60 bg-background py-5 md:py-6">
        <div className="group relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-0">
            <div className="shrink-0 md:max-w-48 md:border-r md:border-border md:pr-6">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground md:text-end">
                Across every aisle
              </p>
            </div>
            <div className="relative w-full py-2 md:w-[calc(100%-12rem)]">
              <InfiniteSlider speedOnHover={28} speed={48} gap={48}>
                {aisleMarks.map((aisle) => (
                  <motion.div
                    key={aisle.label}
                    className="flex min-w-[9.5rem] flex-col items-start border-l border-primary/40 pl-4"
                    whileHover={{ x: 2 }}
                  >
                    <span className="font-display text-sm font-medium tracking-wide text-foreground">
                      {aisle.label}
                    </span>
                    <span className="mt-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {aisle.hint}
                    </span>
                  </motion.div>
                ))}
              </InfiniteSlider>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-16"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-16"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
