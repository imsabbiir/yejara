import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Products from "@/models/products";

export async function GET() {
  try {
    await dbConnect();

    const trendingProducts = await Products.find()
      .sort({ soldStock: -1 })
      .limit(5);

    console.log("Trending Products:", trendingProducts);

    return NextResponse.json(trendingProducts);
  } catch (error) {
    console.error("Trending fetch error:", error);
    return NextResponse.json(
      { message: "Fetching trending products failed" },
      { status: 500 }
    );
  }
}

