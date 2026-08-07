import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
}

interface SocialCardsProps {
  cards: CardItem[];
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  if (typeof window === "undefined") return 1;
  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

type SlotConfig = { rot: number; scale: number; x: number; y: number; zIndex: number };

function getSlotConfig(totalCards: number, slot: number): SlotConfig {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot] as SlotConfig;
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border-[1.5px] border-black/10 bg-black/5 backdrop-blur-[16px] text-black/40 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:border-black/25 hover:text-black/70 active:opacity-70 transition-colors duration-300";

function useIsMobileCarousel() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="relative z-[2] h-4 w-4 md:h-5 md:w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

/** Native scroll-snap carousel — smooth on iOS/Android */
function MobileSnapCarousel({ cards }: SocialCardsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const slides = scroller.querySelectorAll<HTMLElement>("[data-slide]");
        if (!slides.length) return;
        const mid = scroller.scrollLeft + scroller.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        slides.forEach((slide, i) => {
          const center = slide.offsetLeft + slide.offsetWidth / 2;
          const dist = Math.abs(center - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActive(best);
      });
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [cards.length]);

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    const slide = scroller?.querySelectorAll<HTMLElement>("[data-slide]")[index];
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section className="relative z-20 w-full py-2">
      <div
        ref={scrollerRef}
        className="mobile-snap-scroller flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-[12vw] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
      >
        {cards.map((card, index) => {
          const inner = (
            <img
              src={card.imgUrl}
              alt={card.alt || `Card ${index + 1}`}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
            />
          );
          return (
            <div
              key={index}
              data-slide
              className="mobile-snap-slide w-[76vw] max-w-[18rem] shrink-0 snap-center"
            >
              <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-muted shadow-[0_12px_32px_rgba(33,26,16,0.18)]">
                {card.linkUrl ? (
                  <a
                    href={card.linkUrl}
                    className="block h-full w-full"
                    onClick={(e) => {
                      // Ignore tap if user was scrolling
                      if (Math.abs((scrollerRef.current?.scrollLeft ?? 0) - active) > 2) {
                        /* keep link */
                      }
                    }}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          className={`${ARROW_CLASSES} h-10 w-10`}
          onClick={() => goTo(Math.max(0, active - 1))}
          aria-label="Previous"
        >
          <Chevron direction="left" />
        </button>
        <div className="flex items-center gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to card ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-transform duration-200 ${
                i === active ? "scale-[1.35] bg-black/70" : "bg-black/15"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          className={`${ARROW_CLASSES} h-10 w-10`}
          onClick={() => goTo(Math.min(cards.length - 1, active + 1))}
          aria-label="Next"
        >
          <Chevron direction="right" />
        </button>
      </div>
    </section>
  );
}

function DesktopFanCarousel({ cards }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback(
    (center: number) => {
      const map = new Map<number, number>();
      if (!needsPagination) {
        cards.forEach((_, i) => map.set(i, i));
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set((((center + slot - HALF) % totalCards) + totalCards) % totalCards, slot);
      }
      return map;
    },
    [totalCards, needsPagination, cards],
  );

  const cycle = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current || !needsPagination) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) =>
        direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards,
      );
    },
    [totalCards, needsPagination],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
          force3D: true,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, {
            ...target,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.12 + slot * 0.04,
            onComplete: onCardDone,
          });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, {
            x: `${enterX}rem`,
            y: `${y * hMult}rem`,
            rotation: direction === "right" ? 30 : -30,
            scale: 0.5,
            opacity: 0,
          });
          gsap.to(card, { ...target, duration: 0.4, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.35, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, {
          x: `${exitX}rem`,
          opacity: 0,
          scale: 0.5,
          rotation: direction === "right" ? -30 : 30,
          duration: 0.3,
          ease: "power2.in",
          zIndex: 0,
        });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength =
              8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          duration: 0.4,
          delay,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true,
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener("pointerenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    container.addEventListener("pointerleave", onMouseLeave);

    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("pointerenter", handler));
      container.removeEventListener("pointerleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  return (
    <section className="relative z-20 flex w-full flex-col items-center px-4 py-4 md:px-8 lg:py-8">
      <div className="flex w-full max-w-[90rem] items-center justify-center">
        <div
          ref={containerRef}
          className="fan-layout relative flex w-full max-w-[80rem] items-center justify-center"
        >
          {cards.map((card, index) => {
            const image = (
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={card.imgUrl}
                  loading="lazy"
                  alt={card.alt || `Card ${index}`}
                  className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            );
            return card.linkUrl ? (
              <a
                key={index}
                href={card.linkUrl}
                target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="fan-card block cursor-pointer"
              >
                {image}
              </a>
            ) : (
              <div key={index} className="fan-card">
                {image}
              </div>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="z-30 mt-4 flex items-center justify-center gap-4 md:mt-6">
          <button
            type="button"
            className={`${ARROW_CLASSES} h-10 w-10 md:h-12 md:w-12`}
            onClick={() => cycle("left")}
            aria-label="Previous"
          >
            <Chevron direction="left" />
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === centerIndex ? "scale-[1.3] bg-black/70" : "bg-black/15"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            className={`${ARROW_CLASSES} h-10 w-10 md:h-12 md:w-12`}
            onClick={() => cycle("right")}
            aria-label="Next"
          >
            <Chevron direction="right" />
          </button>
        </div>
      )}
    </section>
  );
}

export default function SocialCards({ cards }: SocialCardsProps) {
  const isMobile = useIsMobileCarousel();

  if (!cards.length) return null;

  // Phones: native snap scroll (smooth). Desktop: fan hover carousel.
  if (isMobile) return <MobileSnapCarousel cards={cards} />;
  return <DesktopFanCarousel cards={cards} />;
}
