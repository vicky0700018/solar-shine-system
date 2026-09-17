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
    const items = await db.collection("projects").find(query).sort({ createdAt: -1 }).toArray();

    const formatted = items.map((item) => ({
      ...item,
      id: item._id?.toString() || item.id,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, location, category, completion, description, image, active, public_id } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: "Project title is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const id = body.id || `pr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newProject = {
      _id: id as unknown as never,
      id,
      title: String(title).trim(),
      location: String(location || "").trim(),
      category: String(category || "Residential").trim(),
      completion: String(completion || "Completed").trim(),
      description: String(description || "").trim(),
      image: String(image || "").trim(),
      active: active !== undefined ? Boolean(active) : true,
      public_id: public_id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("projects").insertOne(newProject);

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ success: false, message: "Failed to create project" }, { status: 500 });
  }
}
