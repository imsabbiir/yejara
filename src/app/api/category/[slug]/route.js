import dbConnect from "@/lib/mongoose";
import Product from "@/models/products";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { slug } = params;

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;

    const skip = (page - 1) * limit;

    const products = await Product.find({
      categorySlug: slug,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({
      categorySlug: slug,
    });

    return NextResponse.json({
      products,
      hasMore: skip + products.length < total,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}