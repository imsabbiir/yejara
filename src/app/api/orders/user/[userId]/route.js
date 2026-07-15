import dbConnect from "@/lib/mongoose";
import Orders from "@/models/order";
import Product from "@/models/products";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { userId } = params;

    // GET USER ORDERS
    const orders = await Orders.find({
      userId,
    }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No orders found",
        },
        { status: 404 },
      );
    }

    // ADD IMAGE TO ITEMS
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const newItems = await Promise.all(
          order.items.map(async (item) => {
            // DEFAULT IMAGE
            let productImage =
              item.image || item.productImage || "/placeholder.png";

            // FIND PRODUCT IMAGE FROM PRODUCT COLLECTION
            if (item.productId) {
              try {
                const prodId =
                  typeof item.productId === "string"
                    ? new mongoose.Types.ObjectId(item.productId)
                    : item.productId;

                const product = await Product.findById(prodId).select("images");

                // IF PRODUCT IMAGE EXISTS
                if (product && product.images && product.images.length > 0) {
                  productImage = product.images[0];
                }
              } catch (err) {
                console.log("Invalid productId:", item.productId);
              }
            }

            return {
              ...item.toObject(),

              // FINAL IMAGE
              image: productImage,

              // NORMALIZE FIELDS
              title: item.name,
              quantity: item.qty,
            };
          }),
        );

        return {
          ...order.toObject(),
          items: newItems,
        };
      }),
    );

    return NextResponse.json(
      {
        success: true,
        orders: populatedOrders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error fetching orders:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
