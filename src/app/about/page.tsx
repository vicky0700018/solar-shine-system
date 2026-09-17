"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { PageBanner } from "@/components/site/PageBanner";
import { About } from "@/components/site/Sections";
import { Footer } from "@/components/site/Footer";
import {
  defaultSettings,
  defaultServices,
  type Settings,
  type Service,
} from "@/data/defaults";

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [services, setServices] = useState<Service[]>(defaultServices.filter((s) => s.active));

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
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <PageBanner
          title="About Us"
          description="Leading solar water heating experts providing energy-efficient systems for residential and commercial spaces."
          breadcrumb="About Us"
        />
        <About settings={settings} image="/assets/service-maintenance.jpg" />
      </main>
      <Footer settings={settings} services={services} />
    </div>
  );
}
