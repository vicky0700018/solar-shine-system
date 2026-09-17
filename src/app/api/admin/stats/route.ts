export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/auth";
import { ensureSeedData } from "@/lib/seed";
import { defaultSettings } from "@/data/defaults";

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await ensureSeedData();
    const db = await getDatabase();

    const [
      totalServices,
      totalProducts,
      totalProjects,
      totalGallery,
      totalTestimonials,
      totalLeads,
      totalBanners,
      recentLeadsRaw,
      recentProjectsRaw,
      settingsDoc,
    ] = await Promise.all([
      db.collection("services").countDocuments(),
      db.collection("products").countDocuments(),
      db.collection("projects").countDocuments(),
      db.collection("gallery").countDocuments(),
      db.collection("testimonials").countDocuments(),
      db.collection("contactLeads").countDocuments(),
      db.collection("heroBanners").countDocuments(),
      db.collection("contactLeads").find({}).sort({ createdAt: -1 }).limit(5).toArray(),
      db.collection("projects").find({}).sort({ createdAt: -1 }).limit(5).toArray(),
      db.collection("settings").findOne({ _id: "site_settings" as unknown as never }),
    ]);

    const recentLeads = recentLeadsRaw.map((l) => ({
      ...l,
      id: l._id?.toString() || l.id,
    }));

    const recentProjects = recentProjectsRaw.map((p) => ({
      ...p,
      id: p._id?.toString() || p.id,
    }));

    const settings = settingsDoc ? { ...settingsDoc, _id: undefined } : defaultSettings;

    return NextResponse.json({
      success: true,
      counts: {
        services: totalServices,
        products: totalProducts,
        projects: totalProjects,
        gallery: totalGallery,
        testimonials: totalTestimonials,
        leads: totalLeads,
        banners: totalBanners,
      },
      recentLeads,
      recentProjects,
      settings,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch admin dashboard statistics" }, { status: 500 });
  }
}
