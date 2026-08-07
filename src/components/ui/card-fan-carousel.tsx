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

function isPhoneViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768;
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
  "relative flex items-center justify-center rounded-full border-[1.5px] border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-[16px] text-black/40 dark:text-white/55 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-black/25 dark:hover:border-white/25 hover:text-black/70 dark:hover:text-white/80 active:opacity-70 transition-colors duration-300 before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:border before:border-black/[0.04] dark:before:border-white/[0.04] before:pointer-events-none";

export default function SocialCards({ cards }: SocialCardsProps) {
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
      if (!needsPagination) return;
      // On phones, allow snappy back-to-back swipes
      if (isAnimating.current && !isPhoneViewport()) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) =>
        direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards,
      );
    },
    [totalCards, needsPagination],
  );

  // Phone-only autoplay — smooth automatic advance, pauses while you interact
  useEffect(() => {
    if (!needsPagination || totalCards < 2) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    let paused = false;

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const start = () => {
      stop();
      if (!isPhoneViewport()) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (document.hidden) return;
      timer = setInterval(() => {
        if (paused || !isPhoneViewport()) return;
        cycle("right");
      }, 300);
    };

    const pauseForInteraction = () => {
      paused = true;
      stop();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
        start();
      }, 5000);
    };

    start();

    const onResize = () => {
      if (isPhoneViewport()) start();
      else stop();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!paused) start();
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    const container = containerRef.current;
    container?.addEventListener("touchstart", pauseForInteraction, { passive: true });

    return () => {
      stop();
      if (resumeTimer) clearTimeout(resumeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      container?.removeEventListener("touchstart", pauseForInteraction);
    };
  }, [cycle, needsPagination, totalCards]);

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
    const phone = isPhoneViewport();

    if (isFirstMount) isAnimating.current = true;

    const settleEase = phone ? "power2.out" : "elastic.out(1.05,.78)";
    const settleDuration = phone ? 0.4 : 1.2;
    const moveDuration = phone ? 0.28 : 0.5;

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
            duration: settleDuration,
            ease: settleEase,
            delay: phone ? 0.05 + slot * 0.03 : 0.2 + slot * 0.06,
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
          gsap.to(card, {
            ...target,
            duration: moveDuration,
            ease: "power2.out",
            onComplete: onCardDone,
          });
        } else {
          gsap.to(card, {
            ...target,
            duration: moveDuration,
            ease: "power2.out",
            onComplete: onCardDone,
          });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, {
          x: `${exitX}rem`,
          opacity: 0,
          scale: 0.5,
          rotation: direction === "right" ? -30 : 30,
          duration: phone ? 0.22 : 0.4,
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
      // Keep hover fan on desktop / iPad; phones skip it
      if (phone) return;

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
          duration: 0.5,
          delay,
          ease: "elastic.out(1,.75)",
          overwrite: "auto",
          force3D: true,
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = phone
      ? []
      : visibleEntries.map(({ el, slot }) => {
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
      if (phone || isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    if (!phone) {
      container.addEventListener("pointerleave", onMouseLeave);
    }

    // Sensitive touch swipe (phones) — low threshold + velocity
    let startX = 0;
    let startY = 0;
    let startT = 0;
    let tracking = false;
    let locked: "h" | "v" | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (!needsPagination || !phone || e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = performance.now();
      tracking = true;
      locked = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking || !phone || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (!locked) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          locked = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
        }
      }

      if (locked === "h") {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking || !phone) return;
      tracking = false;
      if (locked !== "h") {
        locked = null;
        return;
      }

      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dt = Math.max(16, performance.now() - startT);
      const velocity = Math.abs(dx) / dt; // px/ms

      // Very sensitive: short flick OR small distance
      const flicked = velocity > 0.35;
      const dragged = Math.abs(dx) > 18;

      if (flicked || dragged) {
        cycle(dx < 0 ? "right" : "left");
      }

      locked = null;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", () => {
      tracking = false;
      locked = null;
    });

    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("pointerenter", handler));
      container.removeEventListener("pointerleave", onMouseLeave);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, cycle]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
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

  return (
    <section className="relative z-20 flex w-full flex-col items-center px-4 py-4 md:px-8 lg:py-8">
      <div className="flex w-full max-w-[90rem] items-center justify-center">
        <div
          ref={containerRef}
          className="fan-layout relative flex w-full max-w-[80rem] items-center justify-center touch-pan-y"
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
                onClick={(e) => {
                  if (isPhoneViewport() && needsPagination) {
                    e.preventDefault();
                  }
                }}
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
            {chevron("left")}
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === centerIndex
                    ? "scale-[1.3] bg-black/70 dark:bg-white/80"
                    : "bg-black/15 dark:bg-white/15"
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
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}
