import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Wishlists from "@/models/wishlists";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; 

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies(); // must await cookies()
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const wishItemsWithProducts = await Wishlists.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
    ]);

    return NextResponse.json(wishItemsWithProducts);
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { message: "Wishlist fetch failed" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productId, userId } = body;

    if (!productId || !userId) {
      return NextResponse.json(
        { message: "ProductId or UserId are not valid" },
        { status: 400 }
      );
    }

    const existingWishItem = await Wishlists.findOne({ productId, userId });

    if (existingWishItem) {
      // Already wished, so remove it (toggle off)
      await Wishlists.deleteOne({ _id: existingWishItem._id });
      return NextResponse.json({
        message: "Wishlist item removed",
        wished: false,
      });
    } else {
      // Not wished, so add it (toggle on)
      const newWishItem = await Wishlists.create({
        userId,
        productId,
        addedAt: new Date(),
      });

      return NextResponse.json(
        { message: "Wishlist item added", wished: true, item: newWishItem },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Wishlist toggle failed", error: error.message },
      { status: 500 }
    );
  }
}

// /api/wishlists/route.js
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  if (!userId || !productId) {
    return NextResponse.json({ message: "Invalid" }, { status: 400 });
  }

  await dbConnect();

  await Wishlists.deleteOne({ userId, productId });

  return NextResponse.json(
    { message: "Removed from wishlist" },
    { status: 200 }
  );
}
