export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { sendLeadNotificationEmail, sendCustomerConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, service, message } = body;

    // Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, message: "Please enter your full name" }, { status: 400 });
    }
    if (!phone || !/^[0-9+\-\s()]{7,20}$/.test(phone.trim())) {
      return NextResponse.json({ success: false, message: "Please enter a valid phone number" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address" }, { status: 400 });
    }
    if (!service) {
      return NextResponse.json({ success: false, message: "Please select a service" }, { status: 400 });
    }

    const db = await getDatabase();
    const leadId = `l-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();

    const leadDoc = {
      _id: leadId as unknown as never,
      id: leadId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      service: String(service).trim(),
      message: String(message || "").trim(),
      date: now.toISOString(),
      status: "New" as const,
      createdAt: now,
      updatedAt: now,
    };

    // 1. Save lead to MongoDB (Single source of truth)
    await db.collection("contactLeads").insertOne(leadDoc);

    // 2. Trigger emails in background (failure does NOT fail the lead submission)
    try {
      await Promise.allSettled([
        sendLeadNotificationEmail(leadDoc),
        sendCustomerConfirmationEmail(leadDoc),
      ]);
    } catch (emailErr) {
      console.warn("SMTP email notification warning:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been received successfully. Our team will contact you shortly.",
      leadId,
    });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit enquiry. Please try again." }, { status: 500 });
  }
}
