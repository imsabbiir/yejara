import { NextResponse } from "next/server";
import Products from "@/models/products";
import dbConnect from "@/lib/mongoose";

export async function GET() {
  await dbConnect();

  const bestSellers = await Products.find().sort({soldStock: -1}).limit(5);

  return NextResponse.json(bestSellers);
}
