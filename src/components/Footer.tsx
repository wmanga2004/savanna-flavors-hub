import { Link } from "@tanstack/react-router";
import { Instagram, ShoppingBag } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .56.04.82.12v-3.57a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const iconLinkClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-background/20 text-background/75 transition-colors hover:border-primary hover:text-primary";

export function Footer() {
  return (
    <footer className="bg-espresso text-background">
      <div className="container mx-auto px-4 py-14 md:px-6 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Visit Us</p>
        <h2 className="mt-3 font-display text-3xl font-medium uppercase tracking-wide md:text-4xl">
          A meeting point, naturally
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Hours</h5>
            <p className="mt-3 text-sm leading-relaxed text-background/75">
              Mon – Sat: 9:00 AM – 8:00 PM
              <br />
              Sunday: 10:00 AM – 6:00 PM
            </p>
          </div>
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Phone</h5>
            <p className="mt-3 text-sm">
              <a href="tel:+14054762965" className="text-background/75 transition-colors hover:text-primary">
                (405) 476-2965
              </a>
            </p>
          </div>
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Address</h5>
            <p className="mt-3 text-sm leading-relaxed text-background/75">
              16405 Drywater Dr
              <br />
              Oklahoma City, OK 73170
            </p>
          </div>
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Email</h5>
            <p className="mt-3 text-sm">
              <a
                href="mailto:leavoraafricanmarket@gmail.com"
                className="text-background/75 transition-colors hover:text-primary"
              >
                leavoraafricanmarket@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-background/15 pt-8 text-sm text-background/60 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <Link to="/" className="font-display text-lg text-background hover:text-primary">
              Leavora African Market
            </Link>
            <p>&copy; {new Date().getFullYear()} Leavora African Market. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/products" aria-label="Shop" className={iconLinkClass}>
              <ShoppingBag className="h-5 w-5" />
            </Link>
            <a
              href="https://www.instagram.com/leovoraafricanmarket_okc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={iconLinkClass}
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.tiktok.com/@leavora.african.m"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className={iconLinkClass}
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
