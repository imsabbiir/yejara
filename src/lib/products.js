import Products from "@/models/products";
import dbConnect from "@/lib/mongoose";

export async function getTrendingProducts() {
  await dbConnect();
  return await Products.find().sort({ soldStock: -1 }).limit(4).lean();
}

export async function getTopRatedProducts() {
  await dbConnect();
  return await Products.find().sort({ rating: -1 }).limit(4);
}

export async function getNewArrivals() {
  await dbConnect();
  return await Products.find().sort({ _id: -1 }).limit(4);
}

export async function getBestSellers() {
  await dbConnect();
  return await Products.find().sort({ soldStock: -1 }).limit(4);
}

