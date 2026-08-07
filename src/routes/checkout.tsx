import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/products";
import { processCardPayment } from "@/lib/checkout";
import { getSquareConfig, loadSquareSdk } from "@/lib/square";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Leavora African Market" },
      {
        name: "description",
        content: "Pay securely on Leavora African Market. Card details stay on our checkout page.",
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clearCart, itemCount } = useCart();
  const navigate = useNavigate();
  const cardRef = useRef<{
    destroy: () => Promise<void>;
    tokenize: (details?: {
      amount: string;
      currencyCode: string;
      intent: string;
      billingContact?: Record<string, unknown>;
    }) => Promise<{
      status: string;
      token?: string;
      errors?: Array<{ message?: string }>;
    }>;
  } | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const square = getSquareConfig();

  useEffect(() => {
    if (!items.length || !square.configured) return;

    let cancelled = false;

    (async () => {
      try {
        setCardError(null);
        const Square = await loadSquareSdk(square.environment);
        if (cancelled) return;
        const payments = Square.payments(square.applicationId, square.locationId);
        const card = await payments.card();
        await card.attach("#square-card-container");
        if (cancelled) {
          await card.destroy();
          return;
        }
        cardRef.current = card;
        setCardReady(true);
      } catch (error) {
        if (!cancelled) {
          setCardError(
            error instanceof Error
              ? error.message
              : "Could not load the card form. Refresh and try again.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      const card = cardRef.current;
      cardRef.current = null;
      setCardReady(false);
      void card?.destroy();
    };
  }, [items.length, square.applicationId, square.configured, square.environment, square.locationId]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!items.length || !cardRef.current || paying) return;

    setPaying(true);
    try {
      const tokenResult = await cardRef.current.tokenize({
        amount: subtotal.toFixed(2),
        currencyCode: "USD",
        intent: "CHARGE",
        billingContact: {
          givenName: shipping.name.split(" ")[0] || shipping.name,
          familyName: shipping.name.split(" ").slice(1).join(" ") || undefined,
          email: shipping.email,
          phone: shipping.phone || undefined,
          addressLines: [shipping.line1, shipping.line2].filter(Boolean),
          city: shipping.city,
          state: shipping.state,
          postalCode: shipping.postalCode,
          countryCode: "US",
        },
      });

      if (tokenResult.status !== "OK" || !tokenResult.token) {
        throw new Error(
          tokenResult.errors?.[0]?.message || "Card details look incomplete. Check and try again.",
        );
      }

      await processCardPayment({
        sourceId: tokenResult.token,
        idempotencyKey: crypto.randomUUID(),
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
        })),
        shipping: {
          name: shipping.name.trim(),
          email: shipping.email.trim(),
          phone: shipping.phone.trim() || undefined,
          line1: shipping.line1.trim(),
          line2: shipping.line2.trim() || undefined,
          city: shipping.city.trim(),
          state: shipping.state.trim(),
          postalCode: shipping.postalCode.trim(),
        },
      });

      clearCart();
      toast.success("Payment successful");
      navigate({ to: "/checkout/success" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setPaying(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container mx-auto flex min-h-[55vh] flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-medium text-foreground">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Add items from the shop, then come back here to pay on Leavora — no redirect away from
          the site.
        </p>
        <Link to="/products" className="mt-8">
          <Button size="lg">Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">Checkout</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground md:text-4xl">
          Pay on Leavora
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Enter shipping details and pay with your card right here. You stay on our site the whole
          time — Square only processes the payment securely in the background.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={onSubmit} className="space-y-8">
            <section className="space-y-4">
              <h2 className="font-display text-xl font-medium text-foreground">Shipping</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    required
                    value={shipping.name}
                    onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="line1">Address</Label>
                  <Input
                    id="line1"
                    required
                    value={shipping.line1}
                    onChange={(e) => setShipping((s) => ({ ...s, line1: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
                  <Input
                    id="line2"
                    value={shipping.line2}
                    onChange={(e) => setShipping((s) => ({ ...s, line2: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    required
                    value={shipping.city}
                    onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP</Label>
                    <Input
                      id="postalCode"
                      required
                      value={shipping.postalCode}
                      onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-medium text-foreground">Payment</h2>
              {!square.configured ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  Square Application ID is not configured for this build.
                </p>
              ) : cardError ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {cardError}
                </p>
              ) : (
                <div
                  id="square-card-container"
                  className="min-h-[100px] rounded-md border border-border bg-card p-3"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Sandbox test card: <span className="font-mono">4111 1111 1111 1111</span>, any
                future expiry, any CVV, any ZIP.
              </p>
            </section>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={paying || !cardReady || !square.configured}
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                `Pay ${formatPrice(subtotal)}`
              )}
            </Button>
          </form>

          <aside className="h-fit rounded-lg border border-border bg-card/60 p-5">
            <h2 className="font-display text-xl font-medium text-foreground">Order summary</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <img
                    src={item.image}
                    alt=""
                    className="h-14 w-14 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty {item.quantity} · {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <Link to="/products" className="mt-4 inline-block text-sm text-muted-foreground underline hover:text-foreground">
              Keep shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
