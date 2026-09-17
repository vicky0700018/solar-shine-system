"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { PageBanner } from "@/components/site/PageBanner";
import { Products } from "@/components/site/Sections";
import { Footer } from "@/components/site/Footer";
import {
  defaultSettings,
  defaultServices,
  defaultProducts,
  type Settings,
  type Service,
  type Product,
} from "@/data/defaults";

export default function ProductsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [services, setServices] = useState<Service[]>(defaultServices.filter((s) => s.active));
  const [products, setProducts] = useState<Product[]>(defaultProducts.filter((p) => p.active));

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

    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setProducts(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <PageBanner
          title="Products & Systems"
          description="High-performance ETC & FPC solar water heaters sized perfectly for homes, apartments, and commercial establishments."
          breadcrumb="Products"
        />
        <Products products={products} />
      </main>
      <Footer settings={settings} services={services} />
    </div>
  );
}
