import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BadgeCheck,
  Boxes,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings as SettingsIcon,
  Sun,
  Wrench,
  X,
  Building2,
} from "lucide-react";
import { isLoggedIn, logout, useDemoData } from "@/lib/store";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/projects", label: "Projects", icon: Building2 },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/testimonials", label: "Testimonials", icon: BadgeCheck },
  { to: "/admin/leads", label: "Contact Leads", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const data = useDemoData();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate({ to: "/admin/login" });
      return;
    }
    setReady(true);
  }, [navigate]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <p className="text-sm text-muted-foreground">Checking admin session…</p>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-ink-foreground/10 px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sun className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-extrabold text-ink-foreground">
            {data.settings.businessName}
          </span>
          <span className="block text-xs text-ink-foreground/60">Demo Admin Panel</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/admin" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-foreground/70 transition-colors hover:bg-ink-foreground/10 hover:text-ink-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-2 border-t border-ink-foreground/10 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-foreground/70 hover:bg-ink-foreground/10"
        >
          <Sun className="h-4 w-4" aria-hidden="true" /> View Website
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate({ to: "/admin/login" });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-foreground/70 hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[16rem] bg-ink lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-[16rem] bg-ink">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-ink-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:ml-[16rem]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-ink lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-ink">Admin Panel</p>
          <span className="ml-auto rounded-md bg-primary-soft px-2.5 py-1 text-xs font-bold text-secondary">
            Demo Mode
          </span>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
