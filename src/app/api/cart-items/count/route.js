import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import CartItems from "@/models/cartItem";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ count: 0 }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const count = await CartItems.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Cart count fetch error:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
