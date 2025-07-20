import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Categories from "@/models/categories";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Categories.find();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Category fetch error:", error);
    return NextResponse.json(
      { message: "fetching Category Data failed" },
      { status: 500 }
    );
  }
}
