"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, Plus, Power, Trash2, Upload, Loader2, AlertCircle } from "lucide-react";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  StatusBadge,
  inputClass,
} from "@/components/admin/ui";

export type FieldType = "text" | "textarea" | "image" | "select" | "number" | "list";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  full?: boolean;
};

type Collection = "services" | "products" | "projects" | "gallery" | "testimonials";

type Item = Record<string, unknown> & { id: string; active: boolean; public_id?: string };

export function CrudManager({
  title,
  description,
  singular,
  collection,
  fields,
  titleKey,
  subtitleKey,
  imageKey = "image",
  badgeKey,
}: {
  title: string;
  description: string;
  singular: string;
  collection: Collection;
  fields: Field[];
  titleKey: string;
  subtitleKey?: string;
  imageKey?: string;
  badgeKey?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentUploadFieldName, setCurrentUploadFieldName] = useState<string>("");

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/${collection}?all=true`);
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data || []);
      } else {
        setError(data.message || `Failed to load ${title}`);
      }
    } catch {
      setError(`Network error loading ${title}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [collection]);

  const openForm = (item?: Item) => {
    setError("");
    const base: Record<string, string> = {};
    fields.forEach((field) => {
      const value = item?.[field.name];
      base[field.name] = Array.isArray(value)
        ? (value as string[]).join("\n")
        : value === undefined || value === null
        ? ""
        : String(value);
    });
    if (item?.public_id) {
      base["public_id"] = String(item.public_id);
    }
    setForm(base);
    setEditing(item ?? ({ id: "", active: true } as Item));
  };

  const handleFileUpload = async (fieldName: string, file: File) => {
    try {
      setUploadingField(fieldName);
      setError("");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `solar_shine_${collection}`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setForm((prev) => ({
          ...prev,
          [fieldName]: data.url,
          public_id: data.public_id || prev["public_id"] || "",
        }));
      } else {
        setError(data.message || "Image upload failed");
      }
    } catch {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingField(null);
    }
  };

  const submit = async () => {
    if (!editing) return;
    setSaving(true);
    setError("");

    try {
      const payload: Record<string, unknown> = { ...editing };
      fields.forEach((field) => {
        const raw = form[field.name] ?? "";
        if (field.type === "list") {
          payload[field.name] = raw
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        } else if (field.type === "number") {
          payload[field.name] = Number(raw) || 0;
        } else {
          payload[field.name] = raw;
        }
      });
      payload["active"] = editing.active ?? true;
      if (form["public_id"]) {
        payload["public_id"] = form["public_id"];
      }

      const isUpdate = Boolean(editing.id);
      const url = isUpdate ? `/api/${collection}/${editing.id}` : `/api/${collection}`;
      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setEditing(null);
        await loadItems();
      } else {
        setError(result.message || `Failed to save ${singular}`);
      }
    } catch {
      setError(`Network error saving ${singular}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item: Item) => {
    try {
      const res = await fetch(`/api/${collection}/${item.id}`, { method: "PATCH" });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i))
        );
      }
    } catch {
      // reload fallback
      loadItems();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/${collection}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      loadItems();
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          <Button onClick={() => openForm()}>
            <Plus className="h-4 w-4" /> Add {singular}
          </Button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm font-medium">Loading {title.toLowerCase()} from database…</p>
        </Card>
      ) : items.length === 0 ? (
        <EmptyState
          label={`No ${title.toLowerCase()} yet. Add your first ${singular.toLowerCase()} to see it on the website.`}
          action={
            <Button onClick={() => openForm()}>
              <Plus className="h-4 w-4" /> Add {singular}
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-bold">{singular}</th>
                  {badgeKey && <th className="px-5 py-3 font-bold">Category</th>}
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="align-middle">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {typeof item[imageKey] === "string" && item[imageKey] ? (
                          <img
                            src={item[imageKey] as string}
                            alt=""
                            width={64}
                            height={48}
                            loading="lazy"
                            className="h-12 w-16 rounded-lg object-cover bg-muted"
                          />
                        ) : null}
                        <div>
                          <p className="font-semibold text-ink">{String(item[titleKey] ?? "")}</p>
                          {subtitleKey && (
                            <p className="line-clamp-1 max-w-sm text-xs text-muted-foreground">
                              {String(item[subtitleKey] ?? "")}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    {badgeKey && (
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-secondary-soft px-2.5 py-1 text-xs font-bold text-secondary">
                          {String(item[badgeKey] ?? "—")}
                        </span>
                      </td>
                    )}
                    <td className="px-5 py-4">
                      <StatusBadge active={item.active} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openForm(item)}
                          aria-label={`Edit ${String(item[titleKey])}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-secondary hover:bg-muted transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(item)}
                          aria-label={`${item.active ? "Disable" : "Enable"} ${String(item[titleKey])}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink hover:bg-muted transition-colors"
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(item.id)}
                          aria-label={`Delete ${String(item[titleKey])}`}
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

      {/* Hidden file input for Cloudinary upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && currentUploadFieldName) {
            handleFileUpload(currentUploadFieldName, file);
          }
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
      />

      <Modal
        open={editing !== null}
        title={editing?.id ? `Edit ${singular}` : `Add ${singular}`}
        onClose={() => {
          if (!saving) setEditing(null);
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="space-y-4"
        >
          {error && (
            <p className="rounded-lg bg-destructive/10 p-3 text-xs font-semibold text-destructive">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.full || field.type === "textarea" || field.type === "list" ? "sm:col-span-2" : ""}
              >
                <label
                  htmlFor={`field-${field.name}`}
                  className="mb-1.5 block text-sm font-semibold text-ink"
                >
                  {field.label}
                </label>
                {field.type === "textarea" || field.type === "list" ? (
                  <textarea
                    id={`field-${field.name}`}
                    rows={field.type === "list" ? 4 : 3}
                    value={form[field.name] ?? ""}
                    placeholder={
                      field.placeholder ?? (field.type === "list" ? "One item per line" : "")
                    }
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    className={inputClass}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={`field-${field.name}`}
                    value={form[field.name] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">Select…</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "image" ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        id={`field-${field.name}`}
                        type="text"
                        value={form[field.name] ?? ""}
                        placeholder="Image URL (or click Upload to choose file)"
                        onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        disabled={uploadingField === field.name}
                        onClick={() => {
                          setCurrentUploadFieldName(field.name);
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-muted px-3.5 py-2.5 text-xs font-bold text-ink hover:bg-accent transition-colors disabled:opacity-60"
                      >
                        {uploadingField === field.name ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <Upload className="h-4 w-4 text-primary" />
                        )}
                        {uploadingField === field.name ? "Uploading…" : "Upload to Cloudinary"}
                      </button>
                    </div>

                    {form[field.name] ? (
                      <div className="flex items-center gap-3 pt-1">
                        <img
                          src={form[field.name]}
                          alt="Preview"
                          width={160}
                          height={96}
                          loading="lazy"
                          className="h-20 w-32 rounded-lg object-cover border border-border bg-muted"
                        />
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                          {form[field.name]}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <input
                    id={`field-${field.name}`}
                    type={field.type === "number" ? "number" : "text"}
                    value={form[field.name] ?? ""}
                    placeholder={field.placeholder ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-ink cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={editing?.active ?? true}
              onChange={(e) =>
                setEditing((current) =>
                  current ? { ...current, active: e.target.checked } : current,
                )
              }
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Active (visible on the public website)
          </label>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || Boolean(uploadingField)}>
              {saving ? "Saving to Database…" : `Save ${singular}`}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmId !== null}
        title={`Delete this ${singular.toLowerCase()}?`}
        description="This removes the record from MongoDB and cleans up associated Cloudinary images."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) handleDelete(confirmId);
        }}
      />
    </div>
  );
}
