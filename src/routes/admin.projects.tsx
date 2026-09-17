import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({
    meta: [
      { title: "Projects | Sartaj Solar Water System Admin" },
      { name: "description", content: "Manage demo project records." },
      { property: "og:title", content: "Projects | Sartaj Solar Water System Admin" },
      { property: "og:description", content: "Manage demo project records." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminShell>
      <CrudManager
        title="Projects"
        description="Manage the project showcase on the website."
        singular="Project"
        collection="projects"
        titleKey="title"
        subtitleKey="location"
        badgeKey="category"
        fields={[
          { name: "title", label: "Project Name", type: "text" },
          { name: "location", label: "Location", type: "text" },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: ["Residential", "Housing Society", "Commercial", "Industrial"],
          },
          {
            name: "completion",
            label: "Completion Status",
            type: "select",
            options: ["Completed", "Ongoing", "Planned"],
          },
          { name: "description", label: "Description", type: "textarea" },
          { name: "image", label: "Image URL", type: "image", full: true },
        ]}
      />
    </AdminShell>
  ),
});
