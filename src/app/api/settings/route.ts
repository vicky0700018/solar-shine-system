export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/auth";
import { ensureSeedData } from "@/lib/seed";
import { defaultSettings } from "@/data/defaults";

export async function GET() {
  try {
    await ensureSeedData();
    const db = await getDatabase();
    const settings = await db.collection("settings").findOne({ _id: "site_settings" as unknown as never });

    if (!settings) {
      return NextResponse.json({ success: true, data: defaultSettings });
    }

    const { _id, ...cleanSettings } = settings;
    return NextResponse.json({ success: true, data: cleanSettings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const db = await getDatabase();

    const updateData = {
      businessName: body.businessName || defaultSettings.businessName,
      phone: body.phone || defaultSettings.phone,
      email: body.email || defaultSettings.email,
      address: body.address || defaultSettings.address,
      heroHeading: body.heroHeading || defaultSettings.heroHeading,
      heroTagline: body.heroTagline || defaultSettings.heroTagline,
      heroDescription: body.heroDescription || defaultSettings.heroDescription,
      aboutTitle: body.aboutTitle || defaultSettings.aboutTitle,
      aboutText: body.aboutText || defaultSettings.aboutText,
      footerText: body.footerText || defaultSettings.footerText,
      stats: Array.isArray(body.stats) ? body.stats : defaultSettings.stats,
      banners: Array.isArray(body.banners) ? body.banners : defaultSettings.banners,
      updatedAt: new Date(),
    };

    await db.collection("settings").updateOne(
      { _id: "site_settings" as unknown as never },
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: updateData,
    });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ success: false, message: "Failed to update settings" }, { status: 500 });
  }
}
