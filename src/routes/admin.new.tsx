import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminProductForm } from "@/components/AdminProductForm";
import { createAdminProduct } from "@/lib/admin-api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/new")({
  head: () => ({
    meta: [{ title: "Add Product — Leavora Admin" }],
  }),
  component: AdminNewProductPage,
});

function AdminNewProductPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl font-medium text-foreground">Add product</h2>
      <AdminProductForm
        submitLabel="Create product"
        onSubmit={async (values) => {
          const product = await createAdminProduct(values);
          toast.success("Product created");
          navigate({ to: "/admin/$id", params: { id: product.id } });
        }}
      />
    </div>
  );
}
