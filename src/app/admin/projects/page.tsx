"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { CrudManager } from "@/components/admin/CrudManager";

export default function AdminProjectsPage() {
  return (
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
  );
}
