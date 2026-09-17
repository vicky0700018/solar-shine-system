"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { CrudManager } from "@/components/admin/CrudManager";

export default function AdminTestimonialsPage() {
  return (
    <AdminShell>
      <CrudManager
        title="Testimonials"
        description="Manage the demo testimonials shown on the website."
        singular="Testimonial"
        collection="testimonials"
        titleKey="name"
        subtitleKey="message"
        imageKey="avatar"
        badgeKey="location"
        fields={[
          { name: "name", label: "Customer Name", type: "text" },
          { name: "location", label: "Location", type: "text" },
          { name: "rating", label: "Rating (1-5)", type: "number" },
          { name: "avatar", label: "Avatar URL (optional)", type: "image" },
          { name: "message", label: "Testimonial", type: "textarea" },
        ]}
      />
    </AdminShell>
  );
}
