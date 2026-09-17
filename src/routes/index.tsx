import { createFileRoute } from "@tanstack/react-router";
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
import aboutImage from "@/assets/service-maintenance.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sartaj Solar Water System | Solar Water Heaters in Pune" },
      {
        name: "description",
        content:
          "Solar water heater installation, maintenance and repair for homes, societies and businesses in Pune. Efficient, reliable and eco-friendly hot water systems.",
      },
      { property: "og:title", content: "Sartaj Solar Water System | Solar Water Heaters in Pune" },
      {
        property: "og:description",
        content:
          "Residential and commercial solar water heating solutions in Pune — installation, maintenance, repair and consultation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const data = useDemoData();
  const services = data.services.filter((s) => s.active);

  return (
    <div className="bg-background">
      <Header settings={data.settings} />
      <main>
        <Hero settings={data.settings} />
        <About settings={data.settings} image={aboutImage} />
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
