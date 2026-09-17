"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, MapPin, Phone, AlertCircle } from "lucide-react";
import type { Service, Settings } from "@/data/defaults";

type Errors = Partial<Record<"name" | "phone" | "email" | "service" | "message", string>>;

const EMPTY = { name: "", phone: "", email: "", service: "", message: "" };

export function Contact({ settings, services }: { settings: Settings; services: Service[] }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: keyof typeof EMPTY, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setServerError("");
  };

  const validate = () => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim()))
      next.phone = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!form.service) next.service = "Please choose a service.";
    if (form.message.trim().length < 5) next.message = "Please add a few more details.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSending(true);
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        setForm(EMPTY);
      } else {
        setServerError(data.message || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setServerError("Network connection issue. Please try again or call us directly.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40";

  return (
    <section id="contact" className="scroll-mt-24 bg-muted py-20 sm:py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_1fr]">
        <div>
          <span className="eyebrow">Contact</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Get a quote for your solar water heating system
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Share your requirement and our team will get back with a recommended system size.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-secondary">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">Address</span>
                <span className="block text-sm text-muted-foreground">{settings.address}</span>
              </span>
            </li>
            <li className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-secondary">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">Phone</span>
                <a
                  href={`tel:${settings.phone}`}
                  className="block text-sm text-muted-foreground hover:text-secondary font-semibold"
                >
                  {settings.phone}
                </a>
              </span>
            </li>
            <li className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-secondary">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">Email</span>
                <a
                  href={`mailto:${settings.email}`}
                  className="block text-sm text-muted-foreground hover:text-secondary font-semibold"
                >
                  {settings.email}
                </a>
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-lift sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-bold text-ink">
                Thank you — enquiry received!
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Your enquiry has been successfully saved to our database and our solar specialists have been notified. We will reach out shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              {serverError && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{serverError}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink">
                    Full Name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your name"
                    className={inputClass}
                  />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink">
                    Phone
                  </label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="Mobile number"
                    className={inputClass}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                  Email
                </label>
                <input
                  id="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="service" className="mb-1.5 block text-sm font-semibold text-ink">
                  Service
                </label>
                <select
                  id="service"
                  value={form.service}
                  onChange={(e) => update("service", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                  <option value="Solar Consultation">Solar Consultation</option>
                  <option value="General Enquiry">General Enquiry</option>
                </select>
                {errors.service && (
                  <p className="mt-1 text-xs text-destructive">{errors.service}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us about your hot water requirement"
                  className={inputClass}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-destructive">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-lg bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
              >
                {sending ? "Submitting to Database & Sending Alert…" : "Send Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
