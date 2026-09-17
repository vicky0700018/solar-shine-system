import { getDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import {
  defaultSettings,
  defaultServices,
  defaultProducts,
  defaultProjects,
  defaultGallery,
  defaultTestimonials,
} from "@/data/defaults";

let isSeeding = false;
let seeded = false;

export async function ensureSeedData() {
  if (seeded || isSeeding) return;
  isSeeding = true;

  try {
    const db = await getDatabase();

    // 1. Seed Admin User
    const users = db.collection("users");
    const adminUser = await users.findOne({ email: "admin@sartajsolar.in" });
    if (!adminUser) {
      const hashedPassword = await hashPassword("admin123");
      await users.insertOne({
        name: "Admin",
        email: "admin@sartajsolar.in",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Seeded default admin user: admin@sartajsolar.in");
    }

    // 2. Seed Settings
    const settings = db.collection("settings");
    const settingsCount = await settings.countDocuments();
    if (settingsCount === 0) {
      await settings.insertOne({
        ...defaultSettings,
        _id: "site_settings" as unknown as never,
        updatedAt: new Date(),
      });
      console.log("✅ Seeded default website settings");
    }

    // 3. Seed Services
    const services = db.collection("services");
    const servicesCount = await services.countDocuments();
    if (servicesCount === 0) {
      await services.insertMany(
        defaultServices.map((s) => ({
          ...s,
          _id: s.id as unknown as never,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
      console.log("✅ Seeded default services");
    }

    // 4. Seed Products
    const products = db.collection("products");
    const productsCount = await products.countDocuments();
    if (productsCount === 0) {
      await products.insertMany(
        defaultProducts.map((p) => ({
          ...p,
          _id: p.id as unknown as never,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
      console.log("✅ Seeded default products");
    }

    // 5. Seed Projects
    const projects = db.collection("projects");
    const projectsCount = await projects.countDocuments();
    if (projectsCount === 0) {
      await projects.insertMany(
        defaultProjects.map((pr) => ({
          ...pr,
          _id: pr.id as unknown as never,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
      console.log("✅ Seeded default projects");
    }

    // 6. Seed Gallery
    const gallery = db.collection("gallery");
    const galleryCount = await gallery.countDocuments();
    if (galleryCount === 0) {
      await gallery.insertMany(
        defaultGallery.map((g) => ({
          ...g,
          _id: g.id as unknown as never,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
      console.log("✅ Seeded default gallery items");
    }

    // 7. Seed Testimonials
    const testimonials = db.collection("testimonials");
    const testimonialsCount = await testimonials.countDocuments();
    if (testimonialsCount === 0) {
      await testimonials.insertMany(
        defaultTestimonials.map((t) => ({
          ...t,
          _id: t.id as unknown as never,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
      console.log("✅ Seeded default testimonials");
    }

    // 8. Seed Hero Banners
    const heroBanners = db.collection("heroBanners");
    const bannersCount = await heroBanners.countDocuments();
    if (bannersCount === 0) {
      await heroBanners.insertMany(
        defaultSettings.banners.map((b, idx) => ({
          ...b,
          _id: (b.id || `b-${idx + 1}`) as unknown as never,
          id: b.id || `b-${idx + 1}`,
          order: idx + 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
      console.log("✅ Seeded default hero banners");
    }

    seeded = true;
  } catch (error) {
    console.error("Database seeding warning (will retry on next request):", error);
  } finally {
    isSeeding = false;
  }
}
