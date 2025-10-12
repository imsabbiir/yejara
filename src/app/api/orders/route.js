import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Orders from "@/models/order";
export async function POST(req) {
  try {
    // 🔗 Connect to MongoDB
    await dbConnect();

    // 🧾 Parse request body
    const body = await req.json();
    const { userId, items, address, paymentMethod, totalAmount } = body;

    // ⚠️ Basic validation
    if (!userId || !items || items.length === 0 || !paymentMethod || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🧩 Validate payment method
    const validMethods = ["bkash", "nagad", "card", "cod"];
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // 🧠 Convert productId to ObjectId safely
    const formattedItems = items.map((item) => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
    }));

    // 🆕 Create new order
    const newOrder = await Orders.create({
      userId,
      items: formattedItems,
      address,
      paymentMethod,
      totalAmount,
    });

    // ✅ Success response
    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Order Creation Error:", error.message, error.stack);

    // 🧾 Send detailed error for debugging
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
