"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { PageBanner } from "@/components/site/PageBanner";
import { Services } from "@/components/site/Sections";
import { Footer } from "@/components/site/Footer";
import {
  defaultSettings,
  defaultServices,
  type Settings,
  type Service,
} from "@/data/defaults";

export default function ServicesPage() {
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
          title="Our Services"
          description="End-to-end solar water heating solutions including site inspection, custom installation, AMC, and rapid maintenance."
          breadcrumb="Services"
        />
        <Services services={services} />
      </main>
      <Footer settings={settings} services={services} />
    </div>
  );
}
