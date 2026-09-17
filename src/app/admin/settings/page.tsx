"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { RotateCcw, Save, Upload, Loader2, AlertCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button, Card, PageHeader, inputClass } from "@/components/admin/ui";
import { defaultSettings, type Settings } from "@/data/defaults";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedBannerIndex, setSelectedBannerIndex] = useState<number>(0);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setForm(data.data);
        }
      } catch {
        setError("Failed to load settings from MongoDB");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const handleBannerUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      setError("");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "solar_shine_banners");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        update(
          "banners",
          form.banners.map((b, i) => (i === index ? { ...b, image: data.url } : b))
        );
      } else {
        setError(data.message || "Banner image upload failed");
      }
    } catch {
      setError("Network error uploading banner image");
    } finally {
      setUploadingIndex(null);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaved(true);
      } else {
        setError(data.message || "Failed to save settings");
      }
    } catch {
      setError("Network error saving settings to MongoDB");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset all website settings to default demo values?")) {
      setForm(defaultSettings);
      setSaved(false);
    }
  };

  return (
    <AdminShell>
      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm font-medium">Loading settings from database…</p>
        </Card>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <PageHeader
            title="Settings"
            description="Live business information and hero banners stored in MongoDB and reflected across the entire public website."
            action={
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleReset} disabled={saving}>
                  <RotateCcw className="h-4 w-4" /> Reset demo values
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : (
                    <>
                      <Save className="h-4 w-4" /> Save changes
                    </>
                  )}
                </Button>
              </div>
            }
          />

          {saved && (
            <p className="rounded-lg bg-success-soft px-4 py-3 text-sm font-semibold text-success border border-success/20">
              Settings saved in MongoDB — the public website now immediately displays the updated information.
            </p>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Hidden File Input for Banner Image Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleBannerUpload(selectedBannerIndex, file);
              }
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          />

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
              Hero Banners (Slider)
            </h3>
            <div className="space-y-4">
              {form.banners.map((banner, index) => (
                <div key={banner.id || index} className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
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
                  <div className="sm:col-span-2 space-y-2">
                    <span className="block text-sm font-semibold text-ink">Banner Image</span>
                    <div className="flex gap-2">
                      <input
                        className={inputClass}
                        value={banner.image}
                        placeholder="Image URL or upload file"
                        onChange={(e) =>
                          update(
                            "banners",
                            form.banners.map((b, i) =>
                              i === index ? { ...b, image: e.target.value } : b,
                            ),
                          )
                        }
                      />
                      <button
                        type="button"
                        disabled={uploadingIndex === index}
                        onClick={() => {
                          setSelectedBannerIndex(index);
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-muted px-3.5 py-2.5 text-xs font-bold text-ink hover:bg-accent transition-colors disabled:opacity-60"
                      >
                        {uploadingIndex === index ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <Upload className="h-4 w-4 text-primary" />
                        )}
                        {uploadingIndex === index ? "Uploading…" : "Upload to Cloudinary"}
                      </button>
                    </div>

                    {banner.image ? (
                      <div className="flex items-center gap-3 pt-1">
                        <img
                          src={banner.image}
                          alt="Banner Preview"
                          width={240}
                          height={120}
                          loading="lazy"
                          className="h-20 w-36 rounded-lg object-cover border border-border bg-muted"
                        />
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-sm">
                          {banner.image}
                        </span>
                      </div>
                    ) : null}
                  </div>
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
              Statistics Counters
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

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={saving || uploadingIndex !== null}>
              {saving ? "Saving to Database…" : (
                <>
                  <Save className="h-4 w-4" /> Save changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}
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
