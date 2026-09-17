"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Boxes,
  Building2,
  Images,
  Mail,
  Plus,
  Wrench,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, PageHeader } from "@/components/admin/ui";
import { useDemoData } from "@/lib/store";

export default function AdminDashboardPage() {
  const data = useDemoData();

  const cards = [
    { label: "Total Services", value: data.services.length, icon: Wrench, to: "/admin/services" },
    { label: "Total Products", value: data.products.length, icon: Boxes, to: "/admin/products" },
    { label: "Total Projects", value: data.projects.length, icon: Building2, to: "/admin/projects" },
    { label: "Gallery Images", value: data.gallery.length, icon: Images, to: "/admin/gallery" },
    {
      label: "Testimonials",
      value: data.testimonials.length,
      icon: BadgeCheck,
      to: "/admin/testimonials",
    },
    { label: "Contact Leads", value: data.leads.length, icon: Mail, to: "/admin/leads" },
  ] as const;

  const quickActions = [
    { label: "Manage Services", to: "/admin/services" },
    { label: "Manage Products", to: "/admin/products" },
    { label: "Manage Gallery", to: "/admin/gallery" },
    { label: "Business Settings", to: "/admin/settings" },
  ] as const;

  return (
    <AdminShell>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description={`Overview of the demo content for ${data.settings.businessName}.`}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.label} href={card.to} className="block">
              <Card className="flex items-center gap-4 p-5 transition-transform hover:-translate-y-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-secondary">
                  <card.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-2xl font-extrabold text-ink">
                    {card.value}
                  </span>
                  <span className="block text-sm text-muted-foreground">{card.label}</span>
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Recent Contact Leads</h2>
              <Link href="/admin/leads" className="text-sm font-bold text-secondary hover:text-primary">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {data.leads.length === 0 && (
                <p className="rounded-lg border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
                  No leads yet. Submissions from the website contact form appear here.
                </p>
              )}
              {data.leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.service} · {new Date(lead.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-md bg-primary-soft px-2.5 py-1 text-xs font-bold text-secondary">
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Recent Projects</h2>
              <Link
                href="/admin/projects"
                className="text-sm font-bold text-secondary hover:text-primary"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {data.projects.length === 0 && (
                <p className="rounded-lg border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
                  No projects yet.
                </p>
              )}
              {data.projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt=""
                      width={64}
                      height={48}
                      loading="lazy"
                      className="h-12 w-16 rounded-lg object-cover"
                    />
                  ) : null}
                  <div>
                    <p className="text-sm font-semibold text-ink">{project.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.location} · {project.completion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <h2 className="font-display text-lg font-bold text-ink">Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                href={action.to}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-bold text-secondary transition-colors hover:bg-muted"
              >
                <Plus className="h-4 w-4" aria-hidden="true" /> {action.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
