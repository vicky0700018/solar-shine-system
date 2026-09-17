export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const banner = await db.collection("heroBanners").findOne({
      $or: [{ _id: id as unknown as never }, { id }],
    });

    if (!banner) {
      return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...banner,
        id: banner._id?.toString() || banner.id,
      },
    });
  } catch (error) {
    console.error("GET /api/hero-banners/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch banner" }, { status: 500 });
  }
}

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

    const existing = await db.collection("heroBanners").findOne({
      $or: [{ _id: id as unknown as never }, { id }],
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
    }

    // If image replaced and old public_id exists, delete old image from Cloudinary
    if (body.public_id && existing.public_id && body.public_id !== existing.public_id) {
      await deleteFromCloudinary(existing.public_id);
    }

    const updateDoc = {
      title: body.title !== undefined ? String(body.title).trim() : existing.title,
      subtitle: body.subtitle !== undefined ? String(body.subtitle).trim() : existing.subtitle,
      image: body.image !== undefined ? String(body.image).trim() : existing.image,
      order: body.order !== undefined ? Number(body.order) : (existing.order || 0),
      active: body.active !== undefined ? Boolean(body.active) : (existing.active !== false),
      public_id: body.public_id !== undefined ? body.public_id : (existing.public_id || ""),
      updatedAt: new Date(),
    };

    await db.collection("heroBanners").updateOne(
      { $or: [{ _id: id as unknown as never }, { id }] },
      { $set: updateDoc }
    );

    // Sync to settings
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
      message: "Hero banner updated successfully",
      data: { id, ...updateDoc },
    });
  } catch (error) {
    console.error("PUT /api/hero-banners/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update hero banner" }, { status: 500 });
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
    const existing = await db.collection("heroBanners").findOne({
      $or: [{ _id: id as unknown as never }, { id }],
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
    }

    const nextActive = existing.active === false ? true : false;
    await db.collection("heroBanners").updateOne(
      { $or: [{ _id: id as unknown as never }, { id }] },
      { $set: { active: nextActive, updatedAt: new Date() } }
    );

    // Sync to settings
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
      message: "Hero banner status toggled successfully",
      active: nextActive,
    });
  } catch (error) {
    console.error("PATCH /api/hero-banners/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to toggle hero banner status" }, { status: 500 });
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
    const existing = await db.collection("heroBanners").findOne({
      $or: [{ _id: id as unknown as never }, { id }],
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if public_id exists
    if (existing.public_id) {
      await deleteFromCloudinary(existing.public_id);
    }

    await db.collection("heroBanners").deleteOne({
      $or: [{ _id: id as unknown as never }, { id }],
    });

    // Sync to settings
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
      message: "Hero banner deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/hero-banners/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete hero banner" }, { status: 500 });
  }
}
