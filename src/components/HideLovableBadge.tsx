import { useEffect } from "react";

function isLovableBadge(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.id === "lovable-badge" || el.id.includes("lovable-badge")) return true;
  const aria = (el.getAttribute("aria-label") || "").toLowerCase();
  if (aria.includes("edit with lovable")) return true;
  const text = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (text.includes("edit with") && text.includes("lovable")) return true;
  const href = (el.getAttribute("href") || "").toLowerCase();
  if (href.includes("lovable.dev") && (aria.includes("edit") || text.includes("edit"))) return true;
  return false;
}

function scrubLovableBadge() {
  document.querySelectorAll<HTMLElement>("*").forEach((el) => {
    if (!isLovableBadge(el)) return;
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.remove();
  });
}

/** Strip Lovable "Edit with Lovable" badge injected on published hosts. */
export function HideLovableBadge() {
  useEffect(() => {
    scrubLovableBadge();
    const id = window.setInterval(scrubLovableBadge, 500);
    const observer = new MutationObserver(() => scrubLovableBadge());
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    return () => {
      window.clearInterval(id);
      observer.disconnect();
    };
  }, []);

  return null;
}
