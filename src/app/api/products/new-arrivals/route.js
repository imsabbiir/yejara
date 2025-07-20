import { NextResponse } from "next/server";
import Products from "@/models/products";
import dbConnect from "@/lib/mongoose";

export async function GET() {
  await dbConnect();

  const newArrivals = await Products.find().sort({ _id: -1 }).limit(5);

  return NextResponse.json(newArrivals);
}
