"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Sun } from "lucide-react";
import { Button, inputClass } from "@/components/admin/ui";
import { DEMO_EMAIL, DEMO_PASSWORD, isLoggedIn, login, useDemoData } from "@/lib/store";

export default function AdminLoginPage() {
  const router = useRouter();
  const data = useDemoData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.push("/admin");
  }, [router]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      if (login(email, password)) {
        router.push("/admin");
      } else {
        setError("Invalid demo credentials. Please try again.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-foreground/70 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to website
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lift">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sun className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-base font-extrabold text-ink">
                {data.settings.businessName}
              </span>
              <span className="block text-xs text-muted-foreground">Demo Admin Panel</span>
            </span>
          </div>

          <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage the demo website content.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
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
              <Lock className="h-4 w-4" /> {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted p-4 text-sm">
            <p className="font-semibold text-ink">Demo credentials</p>
            <p className="mt-1 text-muted-foreground">Email: {DEMO_EMAIL}</p>
            <p className="text-muted-foreground">Password: {DEMO_PASSWORD}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
