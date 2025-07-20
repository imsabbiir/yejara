import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Products from "@/models/products";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const total = await Products.countDocuments();
    const products = await Products.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)

    return NextResponse.json({
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { message: "Fetching Product Data failed" },
      { status: 500 }
    );
  }
}
