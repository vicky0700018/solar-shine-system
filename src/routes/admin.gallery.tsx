import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | Sartaj Solar Water System Admin" },
      { name: "description", content: "Manage demo gallery images and categories." },
      { property: "og:title", content: "Gallery | Sartaj Solar Water System Admin" },
      { property: "og:description", content: "Manage demo gallery images." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminShell>
      <CrudManager
        title="Gallery"
        description="Manage the images shown in the website gallery."
        singular="Image"
        collection="gallery"
        titleKey="title"
        subtitleKey="description"
        badgeKey="category"
        fields={[
          { name: "title", label: "Title", type: "text" },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: [
              "Solar Water Heater",
              "Installation",
              "Residential",
              "Commercial",
              "Projects",
            ],
          },
          { name: "description", label: "Description", type: "textarea" },
          { name: "image", label: "Image URL", type: "image", full: true },
        ]}
      />
    </AdminShell>
  ),
});
