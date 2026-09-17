"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { CrudManager } from "@/components/admin/CrudManager";
import { ICON_OPTIONS } from "@/lib/icons";

export default function AdminServicesPage() {
  return (
    <AdminShell>
      <CrudManager
        title="Services"
        description="Add, edit and publish the services shown on the website."
        singular="Service"
        collection="services"
        titleKey="title"
        subtitleKey="short"
        badgeKey="icon"
        fields={[
          { name: "title", label: "Service Name", type: "text" },
          { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
          { name: "short", label: "Short Description", type: "textarea" },
          { name: "description", label: "Full Description", type: "textarea" },
          { name: "image", label: "Image URL", type: "image", full: true },
        ]}
      />
    </AdminShell>
  );
}
