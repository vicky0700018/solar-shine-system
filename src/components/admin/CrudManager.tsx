import { useState } from "react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
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
import { deleteItem, makeId, saveItem, toggleItem, useDemoData } from "@/lib/store";

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

type Item = Record<string, unknown> & { id: string; active: boolean };

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
  const data = useDemoData();
  const items = data[collection] as unknown as Item[];

  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openForm = (item?: Item) => {
    const base: Record<string, string> = {};
    fields.forEach((field) => {
      const value = item?.[field.name];
      base[field.name] = Array.isArray(value)
        ? (value as string[]).join("\n")
        : value === undefined || value === null
          ? ""
          : String(value);
    });
    setForm(base);
    setEditing(item ?? ({ id: "", active: true } as Item));
  };

  const submit = () => {
    if (!editing) return;
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
    payload["id"] = editing.id || makeId();
    payload["active"] = editing.active ?? true;

    saveItem(collection, payload as { id: string } & Record<string, unknown>);
    setEditing(null);
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

      {items.length === 0 ? (
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
                            className="h-12 w-16 rounded-lg object-cover"
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
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-secondary hover:bg-muted"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleItem(collection, item.id)}
                          aria-label={`${item.active ? "Disable" : "Enable"} ${String(item[titleKey])}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink hover:bg-muted"
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(item.id)}
                          aria-label={`Delete ${String(item[titleKey])}`}
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

      <Modal
        open={editing !== null}
        title={editing?.id ? `Edit ${singular}` : `Add ${singular}`}
        onClose={() => setEditing(null)}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="space-y-4"
        >
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
                ) : (
                  <input
                    id={`field-${field.name}`}
                    type={field.type === "number" ? "number" : "text"}
                    value={form[field.name] ?? ""}
                    placeholder={field.placeholder ?? (field.type === "image" ? "Image URL" : "")}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    className={inputClass}
                  />
                )}
                {field.type === "image" && form[field.name] ? (
                  <img
                    src={form[field.name]}
                    alt=""
                    width={160}
                    height={96}
                    loading="lazy"
                    className="mt-2 h-20 w-32 rounded-lg object-cover"
                  />
                ) : null}
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
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

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit">Save {singular}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmId !== null}
        title={`Delete this ${singular.toLowerCase()}?`}
        description="This removes the item from the demo data stored in your browser and from the public website."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) deleteItem(collection, confirmId);
          setConfirmId(null);
        }}
      />
    </div>
  );
}
