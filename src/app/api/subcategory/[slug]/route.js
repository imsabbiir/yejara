import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Products from "@/models/products";

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    await dbConnect();

    const products = await Products.find({ subCategorySlug: slug }).lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching category products:", error);

    return NextResponse.json(
      { message: "Failed to fetch category products" },
      { status: 500 }
    );
  }
}