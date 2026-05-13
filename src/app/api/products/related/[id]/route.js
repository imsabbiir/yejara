import dbConnect from "@/lib/mongoose";
import Products from "@/models/products";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    await dbConnect();

    // Current product
    const currentProduct = await Products.findById(id);

    if (!currentProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // Related products
    const relatedProducts = await Products.find({
      _id: { $ne: id },
      categorySlug: currentProduct.categorySlug,
      subCategorySlug: currentProduct.subCategorySlug,
    })
      .limit(4)
      .lean();

    return NextResponse.json(relatedProducts, {
      status: 200,
    });
  } catch (error) {
    console.error("Related products error:", error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
