import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Products from "@/models/products";

export async function GET(req, { params }) {
  const { categorySlug, subCategorySlug } = await params;
  console.log("params from api route sub:", params)

  if (!categorySlug || !subCategorySlug) {
    return NextResponse.json(
      { message: "Missing categorySlug or subCategorySlug" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const products = await Products.find({ categorySlug, subCategorySlug })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching category products:", error);
    return NextResponse.json(
      { message: "Failed to fetch category products" },
      { status: 500 }
    );
  }
}
