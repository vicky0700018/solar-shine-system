export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();

    const updateDoc = {
      title: body.title,
      location: body.location,
      category: body.category,
      completion: body.completion,
      description: body.description,
      image: body.image,
      active: body.active !== undefined ? Boolean(body.active) : true,
      public_id: body.public_id || "",
      updatedAt: new Date(),
    };

    const result = await db.collection("projects").updateOne(
      { $or: [{ _id: id as unknown as never }, { id }] },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project updated successfully" });
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update project" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDatabase();
    const existing = await db.collection("projects").findOne({
      $or: [{ _id: id as unknown as never }, { id }],
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    const nextActive = existing.active === false ? true : false;
    await db.collection("projects").updateOne(
      { $or: [{ _id: id as unknown as never }, { id }] },
      { $set: { active: nextActive, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: "Project status toggled", active: nextActive });
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to toggle project status" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDatabase();
    const existing = await db.collection("projects").findOne({
      $or: [{ _id: id as unknown as never }, { id }],
    });

    if (existing?.public_id) {
      await deleteFromCloudinary(existing.public_id);
    }

    const result = await db.collection("projects").deleteOne({
      $or: [{ _id: id as unknown as never }, { id }],
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete project" }, { status: 500 });
  }
}
