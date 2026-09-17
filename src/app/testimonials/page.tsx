"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { PageBanner } from "@/components/site/PageBanner";
import { Testimonials } from "@/components/site/Sections";
import { Footer } from "@/components/site/Footer";
import {
  defaultSettings,
  defaultServices,
  defaultTestimonials,
  type Settings,
  type Service,
  type Testimonial,
} from "@/data/defaults";

export default function TestimonialsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [services, setServices] = useState<Service[]>(defaultServices.filter((s) => s.active));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials.filter((t) => t.active));

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setSettings(data.data);
      })
      .catch(() => {});

    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setServices(data.data);
      })
      .catch(() => {});

    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setTestimonials(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <PageBanner
          title="Customer Testimonials"
          description="Read genuine feedback and experiences from our valued residential and commercial clients."
          breadcrumb="Testimonials"
        />
        <Testimonials testimonials={testimonials} />
      </main>
      <Footer settings={settings} services={services} />
    </div>
  );
}
