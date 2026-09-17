"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import {
  About,
  Gallery,
  Products,
  Projects,
  Services,
  Testimonials,
} from "@/components/site/Sections";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import {
  defaultSettings,
  defaultServices,
  defaultProducts,
  defaultProjects,
  defaultGallery,
  defaultTestimonials,
  type Settings,
  type Service,
  type Product,
  type Project,
  type GalleryItem,
  type Testimonial,
} from "@/data/defaults";

export default function HomePage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [services, setServices] = useState<Service[]>(defaultServices.filter((s) => s.active));
  const [products, setProducts] = useState<Product[]>(defaultProducts.filter((p) => p.active));
  const [projects, setProjects] = useState<Project[]>(defaultProjects.filter((p) => p.active));
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery.filter((g) => g.active));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials.filter((t) => t.active));

  useEffect(() => {
    // 1. Fetch Settings
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(() => {});

    // 2. Fetch Services
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setServices(data.data);
        }
      })
      .catch(() => {});

    // 3. Fetch Products
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      })
      .catch(() => {});

    // 4. Fetch Projects
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      })
      .catch(() => {});

    // 5. Fetch Gallery
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGallery(data.data);
        }
      })
      .catch(() => {});

    // 6. Fetch Testimonials
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTestimonials(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-background">
      <Header settings={settings} />
      <main>
        <Hero settings={settings} />
        <About settings={settings} image="/assets/service-maintenance.jpg" />
        <Services services={services} />
        <Products products={products} />
        <Projects projects={projects} />
        <Gallery items={gallery} />
        <Testimonials testimonials={testimonials} />
        <Contact settings={settings} services={services} />
      </main>
      <Footer settings={settings} services={services} />
    </div>
  );
}
