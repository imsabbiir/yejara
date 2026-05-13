import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Products from "@/models/products";

export async function GET(request) {
  try {
    await dbConnect();

    // GET SEARCH PARAM
    const { searchParams } = new URL(request.url);
    const searchValue = searchParams.get("searchValue")?.trim().toLowerCase();

    if (!searchValue) {
      return NextResponse.json([], { status: 200 });
    }

    // SEARCH QUERY
    const products = await Products.find({
      $or: [
        {
          productName: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          category: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          subCategory: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          tags: {
            $elemMatch: {
              $regex: searchValue,
              $options: "i",
            },
          },
        },
      ],
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error searching products" },
      { status: 500 }
    );
  }
}