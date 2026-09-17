"use client";

import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
} from "@/components/admin/ui";
import { deleteLead, setLeadStatus, useDemoData } from "@/lib/store";
import type { Lead, LeadStatus } from "@/data/defaults";

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: "bg-primary-soft text-secondary",
  Contacted: "bg-secondary-soft text-secondary",
  Closed: "bg-success-soft text-success",
};

export default function AdminLeadsPage() {
  const data = useDemoData();
  const [filter, setFilter] = useState<"All" | LeadStatus>("All");
  const [viewing, setViewing] = useState<Lead | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const leads = filter === "All" ? data.leads : data.leads.filter((l) => l.status === filter);

  return (
    <AdminShell>
      <div className="space-y-6">
        <PageHeader
          title="Contact Leads"
          description="Enquiries submitted through the website contact form (stored in your browser)."
        />

        <div className="flex flex-wrap gap-2">
          {(["All", "New", "Contacted", "Closed"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === status
                  ? "bg-secondary text-secondary-foreground"
                  : "border border-border bg-background text-ink/70 hover:bg-muted"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {leads.length === 0 ? (
          <EmptyState label="No leads in this view yet. Submit the website contact form to create one." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[54rem] text-left text-sm">
                <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-bold">Name</th>
                    <th className="px-5 py-3 font-bold">Contact</th>
                    <th className="px-5 py-3 font-bold">Service</th>
                    <th className="px-5 py-3 font-bold">Date</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-5 py-4 font-semibold text-ink">{lead.name}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        <p>{lead.phone}</p>
                        <p className="text-xs">{lead.email}</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{lead.service}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(lead.date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-md px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[lead.status]}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setViewing(lead)}
                            aria-label={`View lead from ${lead.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-secondary hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setLeadStatus(lead.id, "Contacted")}
                            className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-ink hover:bg-muted"
                          >
                            Mark Contacted
                          </button>
                          <button
                            type="button"
                            onClick={() => setLeadStatus(lead.id, "Closed")}
                            className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-ink hover:bg-muted"
                          >
                            Mark Closed
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(lead.id)}
                            aria-label={`Delete lead from ${lead.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-destructive hover:bg-muted"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Modal open={viewing !== null} title="Lead Details" onClose={() => setViewing(null)}>
          {viewing && (
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold text-ink">Name:</span>{" "}
                <span className="text-muted-foreground">{viewing.name}</span>
              </p>
              <p>
                <span className="font-semibold text-ink">Phone:</span>{" "}
                <span className="text-muted-foreground">{viewing.phone}</span>
              </p>
              <p>
                <span className="font-semibold text-ink">Email:</span>{" "}
                <span className="text-muted-foreground">{viewing.email}</span>
              </p>
              <p>
                <span className="font-semibold text-ink">Service:</span>{" "}
                <span className="text-muted-foreground">{viewing.service}</span>
              </p>
              <p>
                <span className="font-semibold text-ink">Date:</span>{" "}
                <span className="text-muted-foreground">
                  {new Date(viewing.date).toLocaleString()}
                </span>
              </p>
              <div>
                <p className="font-semibold text-ink">Message</p>
                <p className="mt-1 rounded-lg bg-muted p-3 text-muted-foreground">
                  {viewing.message}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {(["New", "Contacted", "Closed"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={viewing.status === status ? "secondary" : "ghost"}
                    onClick={() => {
                      setLeadStatus(viewing.id, status);
                      setViewing({ ...viewing, status });
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Modal>

        <ConfirmDialog
          open={confirmId !== null}
          title="Delete this lead?"
          description="The enquiry will be removed from the demo data stored in your browser."
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            if (confirmId) deleteLead(confirmId);
            setConfirmId(null);
          }}
        />
      </div>
    </AdminShell>
  );
}
