import { FormEvent, useRef, useState } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ADMIN_CATEGORIES,
  uploadAdminProductImage,
  type AdminProduct,
  type AdminProductInput,
} from "@/lib/admin-api";

type ProductFormProps = {
  initial?: Partial<AdminProduct>;
  submitLabel: string;
  onSubmit: (values: AdminProductInput) => Promise<void>;
};

export function AdminProductForm({ initial, submitLabel, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [longDescription, setLongDescription] = useState(initial?.long_description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [unit, setUnit] = useState(initial?.unit ?? "each");
  const [image, setImage] = useState(initial?.image ?? "/images/shop-hero.jpg");
  const [category, setCategory] = useState(initial?.category ?? ADMIN_CATEGORIES[0]);
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [inStock, setInStock] = useState(initial?.in_stock ?? true);
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order ?? 100));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Drop an image file (JPG, PNG, WebP, or GIF).");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const url = await uploadAdminProductImage(file);
      setImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        long_description: longDescription.trim(),
        price: Number(price),
        unit: unit.trim(),
        image: image.trim(),
        category,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        in_stock: inStock,
        sort_order: Number(sortOrder) || 100,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5 rounded-lg border border-border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Product name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL slug (optional)</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-from-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {ADMIN_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="lb, pack, bottle…"
            required
          />
        </div>
        <div className="space-y-3 sm:col-span-2">
          <Label>Product image</Label>
          <div
            role="button"
            tabIndex={0}
            aria-label="Drop an image here or click to browse"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onClick={() => {
              if (!uploading) fileInputRef.current?.click();
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragDepth.current += 1;
              setDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragDepth.current = Math.max(0, dragDepth.current - 1);
              if (dragDepth.current === 0) setDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragDepth.current = 0;
              setDragging(false);
              const file = e.dataTransfer.files?.[0] ?? null;
              void handleUpload(file);
            }}
            className={cn(
              "relative flex min-h-[10rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors",
              dragging && "border-primary bg-primary/10",
              uploading && "pointer-events-none opacity-70",
            )}
          >
            {image ? (
              <img
                src={image}
                alt=""
                className="h-28 w-28 rounded-md border border-border object-cover"
              />
            ) : (
              <ImagePlus className="h-10 w-10 text-muted-foreground" />
            )}
            <div className="space-y-1">
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : dragging ? (
                  "Drop image to upload"
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Drag & drop an image here
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse · JPG, PNG, WebP, GIF · max 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                void handleUpload(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional override)</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/products/egusi.jpg or https://..."
              required
            />
          </div>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Short description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="long">Long description</Label>
          <Textarea
            id="long"
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort">Sort order</Label>
          <Input
            id="sort"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          In stock
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading || uploading}>
        {loading ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
