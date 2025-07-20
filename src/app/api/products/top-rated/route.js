import { NextResponse } from "next/server";
import Products from "@/models/products";
import dbConnect from "@/lib/mongoose";

export async function GET() {
  await dbConnect();

  const topRatedProducts = await Products.find()
    .sort({ rating: -1 }) 
    .limit(5);

  return NextResponse.json(topRatedProducts);
}
