"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { PageBanner } from "@/components/site/PageBanner";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import {
  defaultSettings,
  defaultServices,
  type Settings,
  type Service,
} from "@/data/defaults";

export default function ContactPage() {
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
          title="Contact Us"
          description="Get in touch with our solar hot water experts for quotes, site surveys, support, or general enquiries."
          breadcrumb="Contact"
        />
        <Contact settings={settings} services={services} />
      </main>
      <Footer settings={settings} services={services} />
    </div>
  );
}
