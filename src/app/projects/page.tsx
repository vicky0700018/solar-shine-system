"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { PageBanner } from "@/components/site/PageBanner";
import { Projects } from "@/components/site/Sections";
import { Footer } from "@/components/site/Footer";
import {
  defaultSettings,
  defaultServices,
  defaultProjects,
  type Settings,
  type Service,
  type Project,
} from "@/data/defaults";

export default function ProjectsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [services, setServices] = useState<Service[]>(defaultServices.filter((s) => s.active));
  const [projects, setProjects] = useState<Project[]>(defaultProjects.filter((p) => p.active));

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

    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setProjects(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <PageBanner
          title="Our Completed Projects"
          description="A showcase of our recent solar installations across residential complexes, hotels, hospitals, and institutions."
          breadcrumb="Projects"
        />
        <Projects projects={projects} />
      </main>
      <Footer settings={settings} services={services} />
    </div>
  );
}
