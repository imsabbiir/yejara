import dbConnect from "@/lib/mongoose";
import Orders from "@/models/order";
import Product from "@/models/products";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId } = params;

    // 1️⃣ Get all orders for this user
    let orders = await Orders.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: "No orders found" }, { status: 404 });
    }

    // 2️⃣ Attach product image for each item
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const newItems = await Promise.all(
          order.items.map(async (item) => {
            let productImage = "/placeholder.png"; // default fallback
            if (item.productId) {
              // Make sure productId is ObjectId
              const prodId =
                typeof item.productId === "string"
                  ? mongoose.Types.ObjectId(item.productId)
                  : item.productId;

              const product = await Product.findById(prodId).select("images");
              if (product && product.images?.length > 0) {
                productImage = product.images[0];
              }
            }

            return {
              ...item.toObject(),
              image: productImage, // add image field
            };
          })
        );

        return {
          ...order.toObject(),
          items: newItems,
        };
      })
    );

    return NextResponse.json({ orders: populatedOrders }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
