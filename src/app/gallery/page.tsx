"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { PageBanner } from "@/components/site/PageBanner";
import { Gallery } from "@/components/site/Sections";
import { Footer } from "@/components/site/Footer";
import {
  defaultSettings,
  defaultServices,
  defaultGallery,
  type Settings,
  type Service,
  type GalleryItem,
} from "@/data/defaults";

export default function GalleryPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [services, setServices] = useState<Service[]>(defaultServices.filter((s) => s.active));
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery.filter((g) => g.active));

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

    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setGallery(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <PageBanner
          title="Installation Gallery"
          description="Browse through high-resolution photographs of our rooftop solar installations, engineering piping, and client sites."
          breadcrumb="Gallery"
        />
        <Gallery items={gallery} />
      </main>
      <Footer settings={settings} services={services} />
    </div>
  );
}
