import Categories from "@/models/categories";
import dbConnect from "@/lib/mongoose";

export async function getCategories() {
  await dbConnect();
  return await Categories.find().lean();
}

