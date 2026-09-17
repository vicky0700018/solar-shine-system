export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/auth";
import { ensureSeedData } from "@/lib/seed";
import { defaultSettings } from "@/data/defaults";

export async function GET(request: NextRequest) {
  try {
    await ensureSeedData();
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const query = all ? {} : { active: { $ne: false } };
    const banners = await db.collection("heroBanners").find(query).sort({ order: 1, createdAt: 1 }).toArray();

    if (banners.length === 0) {
      // If collection empty, fetch from settings
      const settings = await db.collection("settings").findOne({ _id: "site_settings" as unknown as never });
      const settingBanners = settings?.banners || defaultSettings.banners;
      return NextResponse.json({
        success: true,
        data: settingBanners.map((b: { id?: string; title: string; subtitle: string; image: string; active?: boolean }, idx: number) => ({
          ...b,
          id: b.id || `b-${idx + 1}`,
          order: idx + 1,
          active: b.active !== false,
        })),
      });
    }

    const formatted = banners.map((b) => ({
      ...b,
      id: b._id?.toString() || b.id,
      order: Number(b.order) || 0,
      active: b.active !== false,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/hero-banners error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch hero banners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, subtitle, image, order, active, public_id } = body;

    if (!title || !image) {
      return NextResponse.json({ success: false, message: "Banner title and image are required" }, { status: 400 });
    }

    const db = await getDatabase();
    const count = await db.collection("heroBanners").countDocuments();
    const id = body.id || `banner-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newBanner = {
      _id: id as unknown as never,
      id,
      title: String(title).trim(),
      subtitle: String(subtitle || "").trim(),
      image: String(image).trim(),
      order: order !== undefined ? Number(order) : count + 1,
      active: active !== undefined ? Boolean(active) : true,
      public_id: public_id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("heroBanners").insertOne(newBanner);

    // Synchronize to settings.banners as well
    const allBanners = await db.collection("heroBanners").find({}).sort({ order: 1, createdAt: 1 }).toArray();
    await db.collection("settings").updateOne(
      { _id: "site_settings" as unknown as never },
      {
        $set: {
          banners: allBanners.map((b) => ({
            id: b.id || b._id?.toString(),
            title: b.title,
            subtitle: b.subtitle,
            image: b.image,
            active: b.active !== false,
          })),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Hero banner created successfully",
      data: newBanner,
    });
  } catch (error) {
    console.error("POST /api/hero-banners error:", error);
    return NextResponse.json({ success: false, message: "Failed to create hero banner" }, { status: 500 });
  }
}
