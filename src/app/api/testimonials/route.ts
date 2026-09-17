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
    const items = await db.collection("testimonials").find(query).sort({ createdAt: -1 }).toArray();

    const formatted = items.map((item) => ({
      ...item,
      id: item._id?.toString() || item.id,
      rating: Number(item.rating) || 5,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = body.name;
    const text = body.message || body.comment || body.review || body.text;

    if (!name || !text) {
      return NextResponse.json({ success: false, message: "Customer name and message/comment are required" }, { status: 400 });
    }

    const db = await getDatabase();
    const id = body.id || `t-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newTestimonial = {
      _id: id as unknown as never,
      id,
      name: String(name).trim(),
      location: String(body.location || "").trim(),
      rating: Number(body.rating) || 5,
      message: String(text).trim(),
      comment: String(text).trim(),
      avatar: String(body.avatar || "").trim(),
      active: body.active !== undefined ? Boolean(body.active) : true,
      public_id: body.public_id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("testimonials").insertOne(newTestimonial);

    return NextResponse.json({
      success: true,
      message: "Testimonial created successfully",
      data: newTestimonial,
    });
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json({ success: false, message: "Failed to create testimonial" }, { status: 500 });
  }
}
