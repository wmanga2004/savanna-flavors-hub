import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/components/cart-context";
import { CartDrawer } from "@/components/CartDrawer";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "Visit Us" },
];

export function Header() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container mx-auto flex h-[4.25rem] items-center justify-between px-4 md:h-[5rem] md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/images/logo-mark.png"
            alt="Leavora"
            className="h-12 w-auto object-contain md:h-14"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
              Leavora
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
              African Market
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "text-foreground font-semibold" }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/products"
            className="rounded-sm bg-primary px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-gold-deep hover:text-background"
          >
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <CartDrawer>
            <Button variant="ghost" size="icon" className="relative" aria-label="Open cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-espresso text-[10px] font-bold text-background">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Button>
          </CartDrawer>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background">
              <div className="flex flex-col gap-6 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-2xl font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
