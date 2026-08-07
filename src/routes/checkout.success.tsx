import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Leavora African Market" },
      {
        name: "description",
        content: "Thank you for your order from Leavora African Market.",
      },
    ],
  }),
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">Thank you</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-foreground md:text-5xl">
        Payment received
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Square confirmed your checkout. We&apos;ll prepare your order and be in touch if we need
        anything else.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/products">
          <Button size="lg">Continue shopping</Button>
        </Link>
        <Link to="/">
          <Button size="lg" variant="outline">
            Back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
