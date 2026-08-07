import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/products";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader className="space-y-2.5">
          <SheetTitle className="font-display text-xl">Your Cart</SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? "Your cart is empty." : `${itemCount} item${itemCount === 1 ? "" : "s"} in your cart.`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-muted p-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Add some delicious African flavors to get started.</p>
            <SheetClose asChild>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="font-display font-semibold text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-border/50 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  className="w-full"
                  onClick={() => {
                    toast.success("Checkout coming soon!");
                  }}
                >
                  Checkout
                </Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Clear Cart
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
