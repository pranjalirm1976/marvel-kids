import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      paymentMethod: paymentMethodRaw,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body || {};

    const paymentMethod =
      typeof paymentMethodRaw === "string"
        ? paymentMethodRaw.trim().toUpperCase()
        : "RAZORPAY";

    if (paymentMethod === "COD") {
      return NextResponse.json(
        {
          success: true,
          paymentMethod,
          verified: true,
          message: "COD selected. Payment verification not required.",
        },
        { status: 200 }
      );
    }

    if (paymentMethod !== "RAZORPAY") {
      return NextResponse.json(
        {
          success: false,
          message: `Unsupported payment method: ${paymentMethod}`,
        },
        { status: 400 }
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { success: false, message: "Razorpay secret is not configured" },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        paymentMethod,
        verified: true,
        message: "Payment verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to verify payment",
      },
      { status: 500 }
    );
  }
}
