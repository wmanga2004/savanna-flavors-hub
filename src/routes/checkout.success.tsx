import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

type NotifyState = {
  sms?: { sent?: boolean; reason?: string; to?: string };
} | null;

function CheckoutSuccessPage() {
  const [notify, setNotify] = useState<NotifyState>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("leavora_seller_notify");
      if (raw) {
        setNotify(JSON.parse(raw) as NotifyState);
        sessionStorage.removeItem("leavora_seller_notify");
      }
    } catch {
      // ignore
    }
  }, []);

  const smsFailed = notify && notify.sms?.sent === false;

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">Thank you</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-foreground md:text-5xl">
        Payment received
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Your payment went through on Leavora. We&apos;ll prepare your order and be in touch if we
        need anything else.
      </p>

      {smsFailed && (
        <div className="mt-6 max-w-lg rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-left text-sm text-foreground">
          <p className="font-medium">Store alert note (payment still succeeded)</p>
          <p className="mt-2 text-muted-foreground">
            SMS: {notify?.sms?.reason || "not sent"}
          </p>
        </div>
      )}

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
