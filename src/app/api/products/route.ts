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
    const items = await db.collection("products").find(query).sort({ createdAt: -1 }).toArray();

    const formatted = items.map((item) => ({
      ...item,
      id: item._id?.toString() || item.id,
      features: Array.isArray(item.features)
        ? item.features
        : typeof item.features === "string"
        ? (item.features as string).split("\n").filter(Boolean)
        : [],
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, short, description, features, image, active, public_id } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: "Product name is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const id = body.id || `p-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newProduct = {
      _id: id as unknown as never,
      id,
      name: String(name).trim(),
      price: String(price || "").trim(),
      short: String(short || "").trim(),
      description: String(description || "").trim(),
      features: Array.isArray(features)
        ? features
        : typeof features === "string"
        ? features.split("\n").map((f: string) => f.trim()).filter(Boolean)
        : [],
      image: String(image || "").trim(),
      active: active !== undefined ? Boolean(active) : true,
      public_id: public_id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("products").insertOne(newProduct);

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, message: "Failed to create product" }, { status: 500 });
  }
}
