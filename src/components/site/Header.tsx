import { useEffect, useState } from "react";
import { Menu, Phone, Sun, X } from "lucide-react";
import type { Settings } from "@/data/defaults";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Header({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-shadow ${
        scrolled ? "bg-background/95 shadow-card backdrop-blur" : "bg-background/80 backdrop-blur"
      }`}
    >
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sun className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-extrabold text-ink sm:text-lg">
              {settings.businessName}
            </span>
            <span className="block text-xs font-medium text-muted-foreground">
              Solar Water Heating Specialists
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink/75 transition-colors hover:bg-muted hover:text-secondary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-secondary-soft"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {settings.phone}
          </a>
          <a
            href="#contact"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
          >
            Get a Quote
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-ink xl:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background xl:hidden">
          <div className="section-shell flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-ink/80 hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`tel:${settings.phone}`}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-secondary"
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> {settings.phone}
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground"
            >
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
