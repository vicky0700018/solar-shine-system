"use client";

import { useState, type FormEvent } from "react";
import { RotateCcw, Save } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button, Card, PageHeader, inputClass } from "@/components/admin/ui";
import { resetDemoData, saveSettings, useDemoData } from "@/lib/store";
import type { Settings } from "@/data/defaults";

export default function AdminSettingsPage() {
  const data = useDemoData();
  const [form, setForm] = useState<Settings>(data.settings);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    saveSettings(form);
    setSaved(true);
  };

  return (
    <AdminShell>
      <form onSubmit={onSubmit} className="space-y-6">
        <PageHeader
          title="Settings"
          description="Business information used across the header, hero, about, contact and footer."
          action={
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  resetDemoData();
                  window.location.reload();
                }}
              >
                <RotateCcw className="h-4 w-4" /> Reset demo data
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4" /> Save changes
              </Button>
            </div>
          }
        />

        {saved && (
          <p className="rounded-lg bg-success-soft px-4 py-3 text-sm font-semibold text-success">
            Settings saved — the public website now shows the updated information.
          </p>
        )}

        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-ink">Business Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business Name">
              <input
                className={inputClass}
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>
            <Field label="Address">
              <input
                className={inputClass}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-ink">Hero Section</h2>
          <Field label="Hero Heading">
            <input
              className={inputClass}
              value={form.heroHeading}
              onChange={(e) => update("heroHeading", e.target.value)}
            />
          </Field>
          <Field label="Hero Tagline">
            <input
              className={inputClass}
              value={form.heroTagline}
              onChange={(e) => update("heroTagline", e.target.value)}
            />
          </Field>
          <Field label="Hero Description">
            <textarea
              rows={3}
              className={inputClass}
              value={form.heroDescription}
              onChange={(e) => update("heroDescription", e.target.value)}
            />
          </Field>

          <h3 className="pt-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Hero Banners
          </h3>
          <div className="space-y-4">
            {form.banners.map((banner, index) => (
              <div key={banner.id} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2">
                <Field label={`Banner ${index + 1} Title`}>
                  <input
                    className={inputClass}
                    value={banner.title}
                    onChange={(e) =>
                      update(
                        "banners",
                        form.banners.map((b, i) =>
                          i === index ? { ...b, title: e.target.value } : b,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Subtitle">
                  <input
                    className={inputClass}
                    value={banner.subtitle}
                    onChange={(e) =>
                      update(
                        "banners",
                        form.banners.map((b, i) =>
                          i === index ? { ...b, subtitle: e.target.value } : b,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Image URL">
                  <input
                    className={inputClass}
                    value={banner.image}
                    onChange={(e) =>
                      update(
                        "banners",
                        form.banners.map((b, i) =>
                          i === index ? { ...b, image: e.target.value } : b,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-ink">About Section</h2>
          <Field label="About Title">
            <input
              className={inputClass}
              value={form.aboutTitle}
              onChange={(e) => update("aboutTitle", e.target.value)}
            />
          </Field>
          <Field label="About Text">
            <textarea
              rows={5}
              className={inputClass}
              value={form.aboutText}
              onChange={(e) => update("aboutText", e.target.value)}
            />
          </Field>

          <h3 className="pt-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Statistics (demo values)
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {form.stats.map((stat, index) => (
              <div key={stat.label + index} className="grid grid-cols-2 gap-3">
                <Field label="Value">
                  <input
                    className={inputClass}
                    value={stat.value}
                    onChange={(e) =>
                      update(
                        "stats",
                        form.stats.map((s, i) =>
                          i === index ? { ...s, value: e.target.value } : s,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Label">
                  <input
                    className={inputClass}
                    value={stat.label}
                    onChange={(e) =>
                      update(
                        "stats",
                        form.stats.map((s, i) =>
                          i === index ? { ...s, label: e.target.value } : s,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-ink">Footer</h2>
          <Field label="Footer Information">
            <textarea
              rows={3}
              className={inputClass}
              value={form.footerText}
              onChange={(e) => update("footerText", e.target.value)}
            />
          </Field>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}
