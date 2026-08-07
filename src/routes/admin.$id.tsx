import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminProductForm } from "@/components/AdminProductForm";
import { getAdminProduct, updateAdminProduct, type AdminProduct } from "@/lib/admin-api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/$id")({
  head: () => ({
    meta: [{ title: "Edit Product — Leavora Admin" }],
  }),
  component: AdminEditProductPage,
});

function AdminEditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const row = await getAdminProduct(id);
        setProduct(row);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load product");
        navigate({ to: "/admin" });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) {
    return <p className="text-muted-foreground">Loading product…</p>;
  }

  if (!product) return null;

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl font-medium text-foreground">
        Edit {product.name}
      </h2>
      <AdminProductForm
        initial={product}
        submitLabel="Save changes"
        onSubmit={async (values) => {
          await updateAdminProduct(id, values);
          toast.success("Product updated — live on the main site");
          navigate({ to: "/admin" });
        }}
      />
    </div>
  );
}
