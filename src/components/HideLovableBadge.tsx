import { useEffect } from "react";

const BADGE_SELECTORS = [
  "#lovable-badge",
  '[id="lovable-badge"]',
  'a[aria-label="Edit with Lovable"]',
  'a[aria-label*="Edit with Lovable"]',
].join(", ");

/** Hide Lovable editor badge without scanning / mutating the whole DOM. */
export function HideLovableBadge() {
  useEffect(() => {
    const hide = (el: HTMLElement) => {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("pointer-events", "none", "important");
      el.setAttribute("aria-hidden", "true");
    };

    const scrub = () => {
      document.querySelectorAll<HTMLElement>(BADGE_SELECTORS).forEach(hide);
    };

    scrub();
    const timer = window.setInterval(scrub, 2000);
    return () => window.clearInterval(timer);
  }, []);

  return null;
}
