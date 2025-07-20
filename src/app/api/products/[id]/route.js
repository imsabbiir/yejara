// app/api/products/[productId]/route.js
import dbConnect from "@/lib/mongoose";
import Products from "@/models/products";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();
    const product = await Products.findById(id).lean();

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
