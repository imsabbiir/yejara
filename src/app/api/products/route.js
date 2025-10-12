import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Products from "@/models/products";

export async function GET(req) {
  try {
    await dbConnect();

    // Get query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const products = await Products.find()
      .limit(limit)
      .skip(skip)

    const total = await Products.countDocuments();

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { message: "Fetching Product Data failed" },
      { status: 500 }
    );
  }
}
