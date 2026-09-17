import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Sun } from "lucide-react";
import type { Service, Settings } from "@/data/defaults";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export function Footer({ settings, services }: { settings: Settings; services: Service[] }) {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="section-shell grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sun className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-display text-base font-extrabold">{settings.businessName}</span>
          </Link>
          <p className="mt-4 text-sm text-ink-foreground/70">{settings.footerText}</p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-foreground/10 text-ink-foreground/80"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-primary">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ink-foreground/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-primary">
            Services
          </h3>
          <ul className="mt-4 space-y-2">
            {services.slice(0, 6).map((service) => (
              <li key={service.id}>
                <Link
                  href="/services"
                  className="text-sm text-ink-foreground/70 transition-colors hover:text-primary"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-primary">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-foreground/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {settings.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`tel:${settings.phone}`} className="hover:text-primary">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`mailto:${settings.email}`} className="hover:text-primary">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="section-shell flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-foreground/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.businessName}. Demo website.
          </p>
          <Link
            href="/admin/login"
            className="rounded-md border border-ink-foreground/20 px-3 py-1.5 font-semibold text-ink-foreground/80 transition-colors hover:border-primary hover:text-primary"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
