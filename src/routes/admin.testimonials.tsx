import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials | Sartaj Solar Water System Admin" },
      { name: "description", content: "Manage demo customer testimonials." },
      { property: "og:title", content: "Testimonials | Sartaj Solar Water System Admin" },
      { property: "og:description", content: "Manage demo customer testimonials." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
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
  ),
});
