"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { CrudManager } from "@/components/admin/CrudManager";

export default function AdminProductsPage() {
  return (
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
  );
}
