"use client";

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
import { useDemoData } from "@/lib/store";

export default function HomePage() {
  const data = useDemoData();
  const services = data.services.filter((s) => s.active);

  return (
    <div className="bg-background">
      <Header settings={data.settings} />
      <main>
        <Hero settings={data.settings} />
        <About settings={data.settings} image="/assets/service-maintenance.jpg" />
        <Services services={services} />
        <Products products={data.products.filter((p) => p.active)} />
        <Projects projects={data.projects.filter((p) => p.active)} />
        <Gallery items={data.gallery.filter((g) => g.active)} />
        <Testimonials testimonials={data.testimonials.filter((t) => t.active)} />
        <Contact settings={data.settings} services={services} />
      </main>
      <Footer settings={data.settings} services={services} />
    </div>
  );
}
