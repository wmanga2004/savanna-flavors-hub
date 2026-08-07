import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { SQUARE_SHOP_URL } from "@/lib/products";

const DUST_COUNT = 18;

export function HeroMarket() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const light = lightRef.current;
    const dust = dustRef.current;
    const content = contentRef.current;
    if (!section || !image || !light || !dust || !content) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const eyebrow = content.querySelector("[data-hero='eyebrow']");
      const lines = content.querySelectorAll("[data-hero='line']");
      const body = content.querySelector("[data-hero='body']");
      const actions = content.querySelector("[data-hero='actions']");
      const scrollCue = content.querySelector("[data-hero='scroll']");
      const motes = dust.querySelectorAll("[data-mote]");

      if (reduceMotion) {
        gsap.set([image, light, eyebrow, lines, body, actions, scrollCue, motes], {
          clearProps: "all",
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        gsap.set(image, { scale: 1.05 });
        return;
      }

      // Start state: slightly cropped aisle, dark, copy waiting below
      gsap.set(image, { scale: 1.22, xPercent: -4, yPercent: 3, transformOrigin: "45% 55%" });
      gsap.set(light, { opacity: 0, xPercent: -30 });
      gsap.set(eyebrow, { opacity: 0, y: 18, letterSpacing: "0.4em" });
      gsap.set(lines, { opacity: 0, y: 48, rotateX: 12 });
      gsap.set(body, { opacity: 0, y: 24 });
      gsap.set(actions, { opacity: 0, y: 20 });
      gsap.set(scrollCue, { opacity: 0 });
      gsap.set(motes, { opacity: 0, y: 40 });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Walk into the aisle — slow Ken Burns settle
      intro.to(
        image,
        {
          scale: 1.08,
          xPercent: 0,
          yPercent: 0,
          duration: 3.4,
          ease: "power2.out",
        },
        0,
      );

      // Warm afternoon light drifts across the shelves
      intro.to(
        light,
        {
          opacity: 0.55,
          xPercent: 20,
          duration: 2.8,
          ease: "sine.inOut",
        },
        0.15,
      );

      intro.to(
        eyebrow,
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.22em",
          duration: 1.1,
        },
        0.55,
      );

      intro.to(
        lines,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.15,
          stagger: 0.18,
          ease: "power4.out",
        },
        0.75,
      );

      intro.to(body, { opacity: 1, y: 0, duration: 1 }, 1.15);
      intro.to(actions, { opacity: 1, y: 0, duration: 0.9 }, 1.35);
      intro.to(scrollCue, { opacity: 0.7, duration: 0.8 }, 1.8);

      // Spice dust rising through the light
      intro.to(
        motes,
        {
          opacity: 0.7,
          y: 0,
          duration: 1.4,
          stagger: { each: 0.08, from: "random" },
        },
        1.0,
      );

      // Ambient loops after intro
      gsap.to(image, {
        scale: 1.14,
        xPercent: 2.5,
        yPercent: -1.5,
        duration: 22,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 3.2,
      });

      gsap.to(light, {
        xPercent: 45,
        opacity: 0.35,
        duration: 14,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2.8,
      });

      motes.forEach((mote, i) => {
        gsap.to(mote, {
          y: `-=${40 + (i % 5) * 12}`,
          x: `+=${((i % 3) - 1) * 18}`,
          opacity: 0.15 + (i % 4) * 0.12,
          duration: 5 + (i % 6),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.5 + i * 0.12,
        });
      });

      gsap.to(scrollCue, {
        y: 8,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2.2,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[88vh] w-full overflow-hidden bg-espresso"
    >
      <img
        ref={imageRef}
        src="/images/hero.jpg"
        alt="Shelves stocked with African market staples: oils, spices, gari, egusi, fresh produce, and plantains"
        className="absolute inset-0 h-full w-full origin-center scale-110 object-cover will-change-transform"
      />

      {/* Warm shelf light */}
      <div
        ref={lightRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 35% 40%, rgba(184,137,47,0.45) 0%, rgba(184,137,47,0.12) 40%, transparent 70%)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/20" />

      {/* Spice dust motes */}
      <div ref={dustRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: DUST_COUNT }).map((_, i) => (
          <span
            key={i}
            data-mote
            className="absolute rounded-full bg-primary/80"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${8 + ((i * 17) % 84)}%`,
              top: `${18 + ((i * 23) % 62)}%`,
              boxShadow: "0 0 8px rgba(232, 207, 156, 0.55)",
            }}
          />
        ))}
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex min-h-[88vh] flex-col justify-end px-4 pb-16 pt-28 md:px-10 md:pb-20 lg:px-16"
        style={{ perspective: "800px" }}
      >
        <p
          data-hero="eyebrow"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary"
        >
          Authentic African Grocery & Market
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.05] text-background md:text-6xl lg:text-7xl">
          <span data-hero="line" className="block origin-left">
            Rooted in Heritage.
          </span>
          <span data-hero="line" className="block origin-left">
            Grown for Community.
          </span>
        </h1>
        <p
          data-hero="body"
          className="mt-5 max-w-xl text-base leading-relaxed text-background/80 md:text-lg"
        >
          Fresh produce, staple grains, spices, and the flavors of home — gathered from the
          motherland and shared across every aisle.
        </p>
        <div data-hero="actions" className="mt-8 flex flex-wrap gap-3">
          <Link to="/products">
            <Button size="lg" className="gap-2 bg-background text-foreground hover:bg-background/90">
              Explore the Market <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href={SQUARE_SHOP_URL} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="gap-2 bg-primary text-espresso hover:bg-gold-deep hover:text-background"
            >
              Order Online <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>

        <div
          data-hero="scroll"
          className="mt-12 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-background/55"
        >
          <span className="inline-block h-10 w-px bg-background/40" />
          Scroll
        </div>
      </div>
    </section>
  );
}
