"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Star } from "lucide-react";
import { ServiceIcon } from "@/lib/icons";
import type {
  GalleryItem,
  Product,
  Project,
  Service,
  Settings,
  Testimonial,
} from "@/data/defaults";

function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base text-muted-foreground">{description}</p>}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted p-10 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function About({ settings, image }: { settings: Settings; image: string }) {
  return (
    <section id="about" className="scroll-mt-24 bg-background py-20 sm:py-24">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <img
            src={image}
            alt="Rooftop solar water heating installation"
            width={1200}
            height={800}
            loading="lazy"
            className="w-full rounded-2xl object-cover shadow-lift"
          />
          <div className="absolute -bottom-6 left-6 hidden rounded-xl bg-secondary px-6 py-4 text-secondary-foreground shadow-lift sm:block">
            <p className="font-display text-2xl font-extrabold">{settings.stats[0]?.value}</p>
            <p className="text-xs uppercase tracking-wide opacity-80">
              {settings.stats[0]?.label}
            </p>
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="About Us"
            title={settings.aboutTitle}
            center={false}
          />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {settings.aboutText}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Residential solutions",
              "Commercial solutions",
              "Installation & piping",
              "Maintenance & repair",
              "Energy-efficient systems",
              "Customer support",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium text-ink">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-soft text-success">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {settings.stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-muted p-4">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-xl font-extrabold text-secondary">
                  {stat.value}
                </dd>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Figures shown are demo values for this sample website.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="scroll-mt-24 bg-muted py-20 sm:py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Our Services"
          title="Solar water heating, end to end"
          description="From first site visit to long-term maintenance, handled by one team."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.length === 0 && <Empty label="No services are published yet." />}
          {services.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1"
            >
              <img
                src={service.image}
                alt={service.title}
                width={1200}
                height={800}
                loading="lazy"
                className="h-44 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-secondary">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{service.short}</p>
                <p className="mt-3 text-sm text-muted-foreground/90">{service.description}</p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary transition-colors hover:text-primary"
                >
                  Request this service
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Products({ products }: { products: Product[] }) {
  return (
    <section id="products" className="scroll-mt-24 bg-background py-20 sm:py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Products & Solutions"
          title="Systems sized for every hot water demand"
          description="Demo product range covering homes, societies, commercial and high-efficiency systems."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {products.length === 0 && <Empty label="No products are published yet." />}
          {products.map((product) => (
            <article
              key={product.id}
              className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-card sm:grid-cols-[minmax(0,40%)_1fr]"
            >
              <img
                src={product.image}
                alt={product.name}
                width={1200}
                height={800}
                loading="lazy"
                className="h-52 w-full object-cover sm:h-full"
              />
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-ink">{product.name}</h3>
                <p className="mt-1 text-sm font-medium text-secondary">{product.short}</p>
                <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-ink/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-lg bg-muted px-3 py-1.5 text-sm font-bold text-secondary">
                    {product.price}
                  </span>
                  <Link
                    href="/contact"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="scroll-mt-24 bg-muted py-20 sm:py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Projects"
          title="Recent demo installations"
          description="Sample project records showing the kind of work we take on."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projects.length === 0 && <Empty label="No projects are published yet." />}
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="h-44 w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-bold text-secondary">
                  {project.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-bold text-ink">{project.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {project.location}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{project.description}</p>
                <span
                  className={`mt-4 inline-block rounded-md px-2.5 py-1 text-xs font-bold ${
                    project.completion === "Completed"
                      ? "bg-success-soft text-success"
                      : "bg-primary-soft text-secondary"
                  }`}
                >
                  {project.completion}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <section id="gallery" className="scroll-mt-24 bg-background py-20 sm:py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Gallery"
          title="Installations and system details"
          description="Sample imagery of solar water heating systems and site work."
        />

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === category
                  ? "bg-secondary text-secondary-foreground"
                  : "border border-border bg-muted text-ink/70 hover:bg-primary-soft"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.length === 0 && <Empty label="No gallery images in this category." />}
          {filtered.map((item) => (
            <figure
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-border shadow-card"
            >
              <img
                src={item.image}
                alt={item.title}
                width={1200}
                height={800}
                loading="lazy"
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4">
                <p className="text-sm font-bold text-ink-foreground">{item.title}</p>
                <p className="text-xs text-ink-foreground/75">{item.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="scroll-mt-24 bg-secondary py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Testimonials</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-secondary-foreground sm:text-4xl">
            What demo customers say
          </h2>
          <p className="mt-3 text-base text-secondary-foreground/75">
            Sample feedback included with this demonstration website.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.length === 0 && (
            <div className="md:col-span-3">
              <Empty label="No testimonials are published yet." />
            </div>
          )}
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.id}
              className="flex flex-col rounded-2xl bg-card p-6 shadow-lift"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-primary text-primary"
                        : "text-border"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{testimonial.message}”
              </p>
              <footer className="mt-5 flex items-center gap-3">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft font-display text-sm font-bold text-secondary">
                    {testimonial.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span>
                  <span className="block text-sm font-bold text-ink">{testimonial.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {testimonial.location}
                  </span>
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
