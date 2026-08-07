import { useEffect } from "react";

/** Strip Lovable editor badge injected on published hosts. */
export function HideLovableBadge() {
  useEffect(() => {
    const scrub = () => {
      const nodes = document.querySelectorAll<HTMLElement>(
        'a[href*="lovable.dev"], #lovable-badge, [data-lovable-badge]',
      );
      nodes.forEach((el) => {
        const text = (el.textContent || "").toLowerCase();
        const style = el.getAttribute("style") || "";
        const fixed =
          style.includes("position: fixed") ||
          style.includes("position:fixed") ||
          getComputedStyle(el).position === "fixed";
        if (fixed || text.includes("edit with lovable") || el.id === "lovable-badge") {
          el.remove();
        }
      });
    };

    scrub();
    const observer = new MutationObserver(scrub);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
