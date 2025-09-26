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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cartItemsWithProducts = await CartItems.aggregate([
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

    return NextResponse.json(cartItemsWithProducts);
  } catch (error) {
    console.error("Fetch cart error:", error);
    return NextResponse.json(
      { message: "Cart item fetch failed" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productId, userId, quantity } = body;

    if (!productId || !userId) {
      return NextResponse.json(
        { message: "ProductId or UserId are not valid" },
        { status: 400 }
      );
    }

    // Check if the item already exists in the user's cart
    const existingCartItem = await CartItems.findOne({ userId, productId });

    if (existingCartItem) {
      // If exists → increase quantity
      existingCartItem.quantity += quantity || 1;
      await existingCartItem.save();
      return NextResponse.json(existingCartItem, { status: 200 });
    } else {
      // If not exists → add new item
      const newCartItem = await CartItems.create({
        userId,
        productId,
        quantity: quantity || 1,
        addedAt: new Date(),
      });
      return NextResponse.json(newCartItem, { status: 201 });
    }
  } catch (error) {
    console.error("Add cart error:", error);
    return NextResponse.json(
      { message: "Cart item add failed" },
      { status: 500 }
    );
  }
}


export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Cart item ID required" },
        { status: 400 }
      );
    }

    const deletedItem = await CartItems.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item removed" });
  } catch (error) {
    console.error("Remove item error:", error);
    return NextResponse.json(
      { message: "Failed to remove item" },
      { status: 500 }
    );
  }
}


export async function PATCH(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, quantity } = body;

    if (!id || !quantity || quantity < 1) {
      return NextResponse.json(
        { message: "Invalid id or quantity" },
        { status: 400 }
      );
    }

    const updatedItem = await CartItems.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return NextResponse.json(
      { message: "Failed to update quantity" },
      { status: 500 }
    );
  }
}