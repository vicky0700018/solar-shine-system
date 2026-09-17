export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/auth";
import { ensureSeedData } from "@/lib/seed";

export async function GET(request: NextRequest) {
  try {
    await ensureSeedData();
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const query = all ? {} : { active: { $ne: false } };
    const items = await db.collection("gallery").find(query).sort({ createdAt: -1 }).toArray();

    const formatted = items.map((item) => ({
      ...item,
      id: item._id?.toString() || item.id,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, description, image, active, public_id } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: "Gallery title is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const id = body.id || `g-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newGallery = {
      _id: id as unknown as never,
      id,
      title: String(title).trim(),
      category: String(category || "Solar Water Heater").trim(),
      description: String(description || "").trim(),
      image: String(image || "").trim(),
      active: active !== undefined ? Boolean(active) : true,
      public_id: public_id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("gallery").insertOne(newGallery);

    return NextResponse.json({
      success: true,
      message: "Gallery item created successfully",
      data: newGallery,
    });
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ success: false, message: "Failed to create gallery item" }, { status: 500 });
  }
}
