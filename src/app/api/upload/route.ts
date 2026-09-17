export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "solar_shine";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Validation: file type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif", "image/avif"];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid image format. Allowed: JPG, PNG, WEBP, SVG, GIF, AVIF" },
        { status: 400 }
      );
    }

    // Validation: file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadBufferToCloudinary(buffer, folder);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, message: "Image upload failed. Check Cloudinary settings." },
      { status: 500 }
    );
  }
}
