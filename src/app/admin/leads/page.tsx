"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, Loader2, AlertCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
} from "@/components/admin/ui";
import type { Lead, LeadStatus } from "@/data/defaults";

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: "bg-primary-soft text-secondary",
  Contacted: "bg-secondary-soft text-secondary",
  Closed: "bg-success-soft text-success",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"All" | LeadStatus>("All");
  const [viewing, setViewing] = useState<Lead | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(data.data || []);
      } else {
        setError(data.message || "Failed to fetch leads");
      }
    } catch {
      setError("Network error fetching leads from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleSetStatus = async (id: string, status: LeadStatus) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status } : l))
        );
        if (viewing && viewing.id === id) {
          setViewing((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch {
      loadLeads();
    } finally {
      setConfirmId(null);
    }
  };

  const filteredLeads =
    filter === "All" ? leads : leads.filter((l) => l.status === filter);

  return (
    <AdminShell>
      <div className="space-y-6">
        <PageHeader
          title="Contact Leads"
          description="Customer enquiries submitted through the website contact form, stored live in MongoDB."
        />

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(["All", "New", "Contacted", "Closed"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === status
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "border border-border bg-background text-ink/70 hover:bg-muted"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <Card className="p-12 text-center text-muted-foreground">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm font-medium">Loading customer leads from database…</p>
          </Card>
        ) : filteredLeads.length === 0 ? (
          <EmptyState label="No leads in this view yet. Submissions from the website contact form appear here." />
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
                  {filteredLeads.map((lead) => (
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
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-secondary hover:bg-muted transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === lead.id}
                            onClick={() => handleSetStatus(lead.id, "Contacted")}
                            className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-ink hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            Mark Contacted
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === lead.id}
                            onClick={() => handleSetStatus(lead.id, "Closed")}
                            className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-ink hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            Mark Closed
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(lead.id)}
                            aria-label={`Delete lead from ${lead.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-destructive hover:bg-muted transition-colors"
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
                <span className="text-muted-foreground"><a href={`tel:${viewing.phone}`} className="text-secondary font-semibold hover:underline">{viewing.phone}</a></span>
              </p>
              <p>
                <span className="font-semibold text-ink">Email:</span>{" "}
                <span className="text-muted-foreground"><a href={`mailto:${viewing.email}`} className="text-secondary font-semibold hover:underline">{viewing.email}</a></span>
              </p>
              <p>
                <span className="font-semibold text-ink">Service Requested:</span>{" "}
                <span className="text-muted-foreground font-semibold">{viewing.service}</span>
              </p>
              <p>
                <span className="font-semibold text-ink">Submitted At:</span>{" "}
                <span className="text-muted-foreground">
                  {new Date(viewing.date).toLocaleString()}
                </span>
              </p>
              <div>
                <p className="font-semibold text-ink">Message</p>
                <p className="mt-1 rounded-lg bg-muted p-3 text-muted-foreground whitespace-pre-wrap">
                  {viewing.message || "No message provided."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border mt-4">
                {(["New", "Contacted", "Closed"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={viewing.status === status ? "secondary" : "ghost"}
                    onClick={() => handleSetStatus(viewing.id, status)}
                  >
                    Set as {status}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Modal>

        <ConfirmDialog
          open={confirmId !== null}
          title="Delete this lead?"
          description="The enquiry record will be permanently deleted from MongoDB."
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            if (confirmId) handleDelete(confirmId);
          }}
        />
      </div>
    </AdminShell>
  );
}
