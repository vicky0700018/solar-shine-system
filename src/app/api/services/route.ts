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
    const items = await db.collection("services").find(query).sort({ createdAt: -1 }).toArray();

    const formatted = items.map((item) => ({
      ...item,
      id: item._id?.toString() || item.id,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, short, description, image, icon, active, public_id } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: "Service title is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const id = body.id || `s-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newService = {
      _id: id as unknown as never,
      id,
      title: String(title).trim(),
      short: String(short || "").trim(),
      description: String(description || "").trim(),
      image: String(image || "").trim(),
      icon: String(icon || "sun").trim(),
      active: active !== undefined ? Boolean(active) : true,
      public_id: public_id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("services").insertOne(newService);

    return NextResponse.json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ success: false, message: "Failed to create service" }, { status: 500 });
  }
}
