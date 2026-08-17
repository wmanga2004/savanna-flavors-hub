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

type ShippingFields = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
};

type FieldErrors = Partial<Record<keyof ShippingFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const US_ZIP_RE = /^\d{5}(-\d{4})?$/;

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
] as const;

const US_STATE_CODES = new Set(US_STATES.map((s) => s.code));

function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

function isValidUsPhone(phone: string) {
  const digits = phoneDigits(phone);
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith("1")) return true;
  return false;
}

function formatPhoneDisplay(phone: string) {
  const digits = phoneDigits(phone);
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length !== 10) return phone.trim();
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

function validateShipping(shipping: ShippingFields): FieldErrors {
  const errors: FieldErrors = {};
  const name = shipping.name.trim();
  const email = shipping.email.trim();
  const phone = shipping.phone.trim();
  const line1 = shipping.line1.trim();
  const city = shipping.city.trim();
  const state = shipping.state.trim().toUpperCase();
  const postalCode = shipping.postalCode.trim();

  if (!name || name.length < 2) {
    errors.name = "Enter your full name.";
  }
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email (example: name@email.com).";
  }
  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!isValidUsPhone(phone)) {
    errors.phone = "Enter a valid 10-digit US phone (example: (405) 476-2965).";
  }
  if (!line1 || line1.length < 3) {
    errors.line1 = "Enter a street address.";
  }
  if (!city || city.length < 2) {
    errors.city = "Enter a city.";
  }
  if (!state) {
    errors.state = "Select a state.";
  } else if (!US_STATE_CODES.has(state)) {
    errors.state = "Select a valid US state.";
  }
  if (!postalCode) {
    errors.postalCode = "ZIP code is required.";
  } else if (!US_ZIP_RE.test(postalCode)) {
    errors.postalCode = "Enter a valid ZIP (example: 73170 or 73170-1234).";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function CheckoutPage() {
  const { items, subtotal, clearCart, itemCount } = useCart();
  const navigate = useNavigate();
  const cardRef = useRef<{
    destroy: () => Promise<void>;
    tokenize: (details?: {
      amount: string;
      currencyCode: string;
      intent: string;
      customerInitiated?: boolean;
      sellerKeyedIn?: boolean;
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [shipping, setShipping] = useState<ShippingFields>({
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

  const updateField = (key: keyof ShippingFields, value: string) => {
    setShipping((s) => ({ ...s, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

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

    const errors = validateShipping(shipping);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const first = Object.values(errors)[0];
      toast.error(first || "Please fix the highlighted fields.");
      return;
    }

    const name = shipping.name.trim();
    const email = shipping.email.trim();
    const phone = formatPhoneDisplay(shipping.phone);
    const line1 = shipping.line1.trim();
    const line2 = shipping.line2.trim();
    const city = shipping.city.trim();
    const state = shipping.state.trim().toUpperCase();
    const postalCode = shipping.postalCode.trim();

    setPaying(true);
    try {
      const tokenResult = await cardRef.current.tokenize({
        amount: subtotal.toFixed(2),
        currencyCode: "USD",
        intent: "CHARGE",
        customerInitiated: true,
        sellerKeyedIn: false,
        billingContact: {
          givenName: name.split(" ")[0] || name,
          familyName: name.split(" ").slice(1).join(" ") || undefined,
          email,
          phone,
          addressLines: [line1, line2].filter(Boolean),
          city,
          state,
          postalCode,
          countryCode: "US",
        },
      });

      if (tokenResult.status !== "OK" || !tokenResult.token) {
        throw new Error(
          tokenResult.errors?.[0]?.message || "Card details look incomplete. Check and try again.",
        );
      }

      const payment = await processCardPayment({
        sourceId: tokenResult.token,
        idempotencyKey: crypto.randomUUID(),
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
        })),
        shipping: {
          name,
          email,
          phone,
          line1,
          ...(line2 ? { line2 } : {}),
          city,
          state,
          postalCode,
        },
      });

      clearCart();
      toast.success("Payment successful — your card was charged.");

      const smsOk = payment.sellerNotify?.sms?.sent;
      try {
        sessionStorage.setItem(
          "leavora_seller_notify",
          JSON.stringify(payment.sellerNotify ?? null),
        );
      } catch {
        // ignore
      }
      if (!smsOk) {
        toast.message("Seller SMS did not send", {
          description: payment.sellerNotify?.sms?.reason || "not sent",
          duration: 12000,
        });
      }

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
          Enter shipping details and pay with your card right here. You never leave Leavora — the
          whole order stays on this website.
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
                    name="name"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(fieldErrors.name)}
                    value={shipping.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                  <FieldError message={fieldErrors.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="name@email.com"
                    required
                    aria-invalid={Boolean(fieldErrors.email)}
                    value={shipping.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                  <FieldError message={fieldErrors.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(405) 476-2965"
                    required
                    aria-invalid={Boolean(fieldErrors.phone)}
                    value={shipping.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    onBlur={() => {
                      if (isValidUsPhone(shipping.phone)) {
                        updateField("phone", formatPhoneDisplay(shipping.phone));
                      }
                    }}
                  />
                  <FieldError message={fieldErrors.phone} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="line1">Address</Label>
                  <Input
                    id="line1"
                    name="line1"
                    autoComplete="address-line1"
                    required
                    aria-invalid={Boolean(fieldErrors.line1)}
                    value={shipping.line1}
                    onChange={(e) => updateField("line1", e.target.value)}
                  />
                  <FieldError message={fieldErrors.line1} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
                  <Input
                    id="line2"
                    name="line2"
                    autoComplete="address-line2"
                    value={shipping.line2}
                    onChange={(e) => updateField("line2", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    required
                    aria-invalid={Boolean(fieldErrors.city)}
                    value={shipping.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                  <FieldError message={fieldErrors.city} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <select
                      id="state"
                      name="state"
                      autoComplete="address-level1"
                      required
                      aria-invalid={Boolean(fieldErrors.state)}
                      value={shipping.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.state} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="73170"
                      required
                      aria-invalid={Boolean(fieldErrors.postalCode)}
                      value={shipping.postalCode}
                      onChange={(e) =>
                        updateField(
                          "postalCode",
                          e.target.value.replace(/[^\d-]/g, "").slice(0, 10),
                        )
                      }
                    />
                    <FieldError message={fieldErrors.postalCode} />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-medium text-foreground">Payment</h2>
              {!square.configured ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  Card payments are not configured for this build yet.
                </p>
              ) : cardError ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {/https|secure context/i.test(cardError)
                    ? "Card payments need a secure page. Use http://localhost:5173 for local testing (not 127.0.0.1), or the published https:// site."
                    : cardError}
                </p>
              ) : (
                <div
                  id="square-card-container"
                  className="min-h-[100px] rounded-md border border-border bg-card p-3"
                />
              )}
              {square.environment === "sandbox" ? (
                <p className="text-xs text-muted-foreground">
                  Test mode card: <span className="font-mono">4111 1111 1111 1111</span>, any
                  future expiry, any CVV, any ZIP.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Card payments are processed securely on Leavora. Your card details never leave
                  this page.
                </p>
              )}
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
