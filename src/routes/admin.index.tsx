import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";
import {
  deleteAdminProduct,
  listAdminProducts,
  type AdminProduct,
} from "@/lib/admin-api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Products — Leavora Admin" }],
  }),
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await listAdminProducts();
      setProducts(rows);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onDelete = async (product: AdminProduct) => {
    if (!confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await deleteAdminProduct(product.id);
      toast.success("Product deleted");
      setProducts((current) => current.filter((p) => p.id !== product.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-medium text-foreground">Products</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes appear on the main shop right away.
          </p>
        </div>
        <Link to="/admin/new">
          <Button>Add product</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading products…</p>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">No products yet.</p>
          <Link to="/admin/new" className="mt-4 inline-block">
            <Button>Add your first product</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt=""
                          className="h-12 w-12 rounded object-cover bg-muted"
                        />
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
                    <td className="px-4 py-3">
                      {formatPrice(Number(product.price))}
                      <span className="text-muted-foreground"> / {product.unit}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.in_stock ? "text-emerald-700" : "text-destructive"
                        }
                      >
                        {product.in_stock ? "In stock" : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to="/admin/$id" params={{ id: product.id }}>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={() => void onDelete(product)}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
