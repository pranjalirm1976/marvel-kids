import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured on the server");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

export async function POST(request) {
  try {
    const body = await request.json();
    const amountRaw = Number(body?.amount);
    const currency = typeof body?.currency === "string" ? body.currency.toUpperCase() : "INR";

    if (!Number.isFinite(amountRaw) || amountRaw <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid amount is required" },
        { status: 400 }
      );
    }

    const amount = Math.round(amountRaw);
    const instance = getRazorpayInstance();

    const order = await instance.orders.create({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json(
      {
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create Razorpay order",
      },
      { status: 500 }
    );
  }
}
