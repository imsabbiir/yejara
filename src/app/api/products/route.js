import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Products from "@/models/products";

export async function GET(req) {
  try {
    await dbConnect();

    // Get query params (page number from request URL)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // default to page 1
    const limit = 20; // products per page
    const skip = (page - 1) * limit;

    // Fetch total count
    const totalProducts = await Products.countDocuments();

    // Fetch paginated products
    const products = await Products.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      products,
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        hasNextPage: page * limit < totalProducts,
        hasPrevPage: page > 1,
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
