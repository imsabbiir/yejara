import dbConnect from "@/lib/mongoose";
import Wishlists from "@/models/wishlists";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ count: 0 }), { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const count = await Wishlists.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return new Response(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    console.error("Wishlist count error:", error);
    return new Response(JSON.stringify({ count: 0 }), { status: 500 });
  }
}
