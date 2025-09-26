import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Products from "@/models/products";

export async function GET() {
  try {
    await dbConnect(); 

    const trendingProducts = await Products.find({
      createdAt: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    })
      .sort({ soldStock: -1 })
      .limit(5);
    return NextResponse.json(trendingProducts);
  } catch (error) {
    console.error("Category fetch error:", error);
    return NextResponse.json(
      { message: "fetching Category Data failed" },
      { status: 500 }
    );
  }
}
