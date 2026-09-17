import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products | Sartaj Solar Water System Admin" },
      { name: "description", content: "Manage demo products and solutions." },
      { property: "og:title", content: "Products | Sartaj Solar Water System Admin" },
      { property: "og:description", content: "Manage demo products and solutions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminShell>
      <CrudManager
        title="Products"
        description="Manage the products and solutions listed on the website."
        singular="Product"
        collection="products"
        titleKey="name"
        subtitleKey="short"
        badgeKey="price"
        fields={[
          { name: "name", label: "Product Name", type: "text" },
          { name: "price", label: "Price / Price Text", type: "text" },
          { name: "short", label: "Short Description", type: "textarea" },
          { name: "description", label: "Full Description", type: "textarea" },
          { name: "features", label: "Features (one per line)", type: "list" },
          { name: "image", label: "Image URL", type: "image", full: true },
        ]}
      />
    </AdminShell>
  ),
});
