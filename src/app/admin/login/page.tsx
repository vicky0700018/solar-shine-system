"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Sun } from "lucide-react";
import { Button, inputClass } from "@/components/admin/ui";

const DEMO_EMAIL = "admin@sartajsolar.in";
const DEMO_PASSWORD = "admin123";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push("/admin");
        }
      })
      .catch(() => {});
  }, [router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.message || "Invalid email or password. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-foreground/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to website
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lift">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sun className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-base font-extrabold text-ink">
                Sartaj Solar Water System
              </span>
              <span className="block text-xs text-muted-foreground">Admin Control Panel</span>
            </span>
          </div>

          <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your administrator credentials to manage website content.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sartajsolar.in"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              <Lock className="h-4 w-4" /> {loading ? "Authenticating…" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted p-4 text-sm">
            <p className="font-semibold text-ink">Default Administrator Credentials</p>
            <p className="mt-1 text-muted-foreground">Email: <span className="font-mono text-xs">{DEMO_EMAIL}</span></p>
            <p className="text-muted-foreground">Password: <span className="font-mono text-xs">{DEMO_PASSWORD}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
